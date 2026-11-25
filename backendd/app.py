"""Flask API for the events and registrations Supabase database."""

from __future__ import annotations

import os
import uuid
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from flask import Flask, current_app, jsonify, request, send_from_directory
from postgrest import APIError
from supabase import Client, create_client


load_dotenv()
FRONTEND_DIR = Path(__file__).resolve().parent.parent / "public"


class DatabaseConfigurationError(RuntimeError):
    """Raised when the Supabase connection settings are missing."""


def create_app(supabase_client: Client | None = None) -> Flask:
    app = Flask(__name__)
    app.config["SUPABASE_CLIENT"] = supabase_client

    @app.get("/")
    def frontend():
        return send_from_directory(FRONTEND_DIR, "index.html")

    @app.get("/frontend/<path:filename>")
    def frontend_asset(filename: str):
        return send_from_directory(FRONTEND_DIR, filename)

    @app.get("/api")
    def api_index():
        return jsonify(
            {
                "name": "Events API",
                "endpoints": [
                    "GET /api/events",
                    "GET /api/events/<id>",
                    "POST /api/registrations",
                    "GET /api/me/registrations",
                    "GET /api/events/<id>/registrations",
                ],
            }
        )

    def db() -> Client:
        client = app.config.get("SUPABASE_CLIENT")
        if client is None:
            url = os.getenv("SUPABASE_URL")
            # Supabase publishable keys are preferred. ANON_KEY is supported for
            # projects that still use the legacy key name.
            key = os.getenv("SUPABASE_PUBLISHABLE_KEY") or os.getenv("SUPABASE_ANON_KEY")
            if not url or not key:
                raise DatabaseConfigurationError(
                    "Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in the environment."
                )
            client = create_client(url, key)
            app.config["SUPABASE_CLIENT"] = client
        return client

    def api_error(message: str, status: int):
        return jsonify({"error": {"message": message}}), status

    def valid_uuid(value: Any, field: str) -> str:
        if not isinstance(value, str) or not value.strip():
            raise ValueError(f"{field} is required and must be a UUID.")
        try:
            return str(uuid.UUID(value.strip()))
        except (ValueError, AttributeError):
            raise ValueError(f"{field} must be a valid UUID.") from None

    def request_user_id() -> str:
        """Read the caller-supplied identity used until authentication is added."""
        raw_id = request.headers.get("X-User-Id") or request.args.get("user_id")
        return valid_uuid(raw_id, "user_id")

    def get_one(table: str, columns: str, field: str, value: str):
        rows = (
            db().table(table)
            .select(columns)
            .eq(field, value)
            .limit(1)
            .execute()
            .data
        )
        return rows[0] if rows else None

    def get_user_registration_rows(user_id: str) -> list[dict[str, Any]]:
        return (
            db().table("registrations")
            .select("id,user_id,event_id,created_at")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
            .data
            or []
        )

    @app.get("/api/events")
    def list_events():
        try:
            page = int(request.args.get("page", "1"))
            per_page = int(request.args.get("per_page", "50"))
            if page < 1 or per_page < 1 or per_page > 100:
                raise ValueError
        except ValueError:
            return api_error("page must be positive; per_page must be between 1 and 100.", 400)

        start = (page - 1) * per_page
        events = (
            db().table("events")
            .select("id,organizer_id,title,capacity,status")
            .range(start, start + per_page - 1)
            .execute()
            .data
            or []
        )
        return jsonify({"data": events, "page": page, "per_page": per_page})

    @app.get("/api/events/<event_id>")
    def get_event(event_id: str):
        try:
            event_id = valid_uuid(event_id, "event_id")
        except ValueError as error:
            return api_error(str(error), 400)

        event = get_one("events", "id,organizer_id,title,capacity,status", "id", event_id)
        if event is None:
            return api_error("Event not found.", 404)
        return jsonify({"data": event})

    @app.post("/api/registrations")
    def create_registration():
        body = request.get_json(silent=True)
        if not isinstance(body, dict):
            return api_error("A JSON object with user_id and event_id is required.", 400)
        try:
            user_id = valid_uuid(body.get("user_id"), "user_id")
            event_id = valid_uuid(body.get("event_id"), "event_id")
        except ValueError as error:
            return api_error(str(error), 400)

        user = get_one("users", "id", "id", user_id)
        if user is None:
            return api_error("User not found.", 404)
        event = get_one("events", "id,capacity", "id", event_id)
        if event is None:
            return api_error("Event not found.", 404)

        duplicate = (
            db().table("registrations")
            .select("id")
            .eq("user_id", user_id)
            .eq("event_id", event_id)
            .limit(1)
            .execute()
            .data
        )
        if duplicate:
            return api_error("This user is already registered for the event.", 409)

        capacity = event.get("capacity")
        if capacity is not None:
            count_result = (
                db().table("registrations")
                .select("id", count="exact")
                .eq("event_id", event_id)
                .execute()
            )
            registration_count = count_result.count
            if registration_count is None:
                registration_count = len(count_result.data or [])
            if registration_count >= capacity:
                return api_error("This event has reached capacity.", 409)

        try:
            created = (
                db().table("registrations")
                .insert({"user_id": user_id, "event_id": event_id})
                .execute()
                .data
            )
        except APIError as error:
            # This also handles a concurrent duplicate when the database has a
            # unique constraint on (user_id, event_id).
            if getattr(error, "code", None) == "23505":
                return api_error("This user is already registered for the event.", 409)
            raise

        registration = created[0] if created else {"user_id": user_id, "event_id": event_id}
        return jsonify({"data": registration}), 201

    @app.get("/api/me/registrations")
    def list_my_registrations():
        try:
            user_id = request_user_id()
        except ValueError as error:
            return api_error(str(error), 400)

        user = get_one("users", "id", "id", user_id)
        if user is None:
            return api_error("User not found.", 404)

        registrations = get_user_registration_rows(user_id)
        event_ids = list({row["event_id"] for row in registrations if row.get("event_id")})
        events_by_id: dict[str, dict[str, Any]] = {}
        if event_ids:
            events = (
                db().table("events")
                .select("id,organizer_id,title,capacity,status")
                .in_("id", event_ids)
                .execute()
                .data
                or []
            )
            events_by_id = {event["id"]: event for event in events}

        result = [
            {**registration, "event": events_by_id.get(registration.get("event_id"))}
            for registration in registrations
        ]
        return jsonify({"data": result})

    @app.get("/api/events/<event_id>/registrations")
    def list_event_registrations(event_id: str):
        try:
            event_id = valid_uuid(event_id, "event_id")
            requester_id = request_user_id()
        except ValueError as error:
            return api_error(str(error), 400)

        event = get_one("events", "id,organizer_id", "id", event_id)
        if event is None:
            return api_error("Event not found.", 404)
        if event.get("organizer_id") != requester_id:
            return api_error("Only the event organizer can view its attendees.", 403)

        registrations = (
            db().table("registrations")
            .select("id,user_id,event_id,created_at")
            .eq("event_id", event_id)
            .order("created_at")
            .execute()
            .data
            or []
        )
        attendee_ids = list({row["user_id"] for row in registrations if row.get("user_id")})
        users_by_id: dict[str, dict[str, Any]] = {}
        if attendee_ids:
            users = (
                db().table("users")
                .select("id,email")
                .in_("id", attendee_ids)
                .execute()
                .data
                or []
            )
            users_by_id = {user["id"]: user for user in users}

        attendees = [
            {
                "registration_id": row["id"],
                "user_id": row["user_id"],
                "email": users_by_id.get(row["user_id"], {}).get("email"),
                "registered_at": row.get("created_at"),
            }
            for row in registrations
        ]
        return jsonify({"data": attendees})

    @app.errorhandler(APIError)
    def handle_database_error(error: APIError):
        current_app.logger.error("Supabase request failed: %s", error)
        return api_error("The database request failed.", 502)

    @app.errorhandler(DatabaseConfigurationError)
    def handle_configuration_error(error: DatabaseConfigurationError):
        current_app.logger.error("API configuration error: %s", error)
        return api_error("The database connection is not configured.", 503)

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host=os.getenv("HOST", "127.0.0.1"),
        port=int(os.getenv("PORT", "5000")),
        debug=os.getenv("FLASK_DEBUG", "false").lower() == "true",
    )
