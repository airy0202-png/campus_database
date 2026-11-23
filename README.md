# Events API

Flask backend for the `events`, `users`, and `registrations` tables shown in the database diagram. It uses the Supabase publishable key and exposes the five routes from `api.png`.

## Run locally

1. Create a virtual environment and install dependencies:

   ```powershell
   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

2. Copy `.env.example` to `.env` and set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` from your Supabase project.

3. Start the server:

   ```powershell
   python app.py
   ```

The API listens at `http://127.0.0.1:5000` by default. `GET /` returns the route list.

## Routes

All responses are JSON. Successful reads return `{"data": ...}`. Errors return `{"error":{"message":"..."}}`.

| Method | Endpoint | Behavior |
| --- | --- | --- |
| GET | `/api/events?page=1&per_page=50` | Browse events; `per_page` is capped at 100. |
| GET | `/api/events/{id}` | Return one event or 404. |
| POST | `/api/registrations` | Create a registration; returns 201, or 409 for a duplicate or full event. |
| GET | `/api/me/registrations` | List registrations for the supplied user ID, including event details. |
| GET | `/api/events/{id}/registrations` | List attendee IDs and emails for the event organizer. |

### Create a registration

```http
POST /api/registrations
Content-Type: application/json
```

```json
{
  "user_id": "<users.id UUID>",
  "event_id": "<events.id UUID>"
}
```

### User-specific routes without authentication

Since authentication is disabled, the client supplies its identity with an `X-User-Id` header. For convenience, `?user_id=<UUID>` is also accepted by the current-user route.

```http
GET /api/me/registrations
X-User-Id: <users.id UUID>
```

The attendee route checks that `X-User-Id` matches the event's `organizer_id`. This is not secure authorization yet: anyone who knows or guesses an organizer UUID can claim it. Add authentication and derive this ID from a verified session before exposing attendee emails or relying on ownership checks.

```http
GET /api/events/<event-id>/registrations
X-User-Id: <organizer users.id UUID>
```

## Supabase access

The backend uses the publishable key, not a service-role key. Supabase grants and Row Level Security policies must allow the `anon` role to perform the operations this API needs. This project code does not alter the database schema or RLS policies. A unique database constraint on `(user_id, event_id)` is recommended so duplicate prevention remains correct under concurrent requests.
