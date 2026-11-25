# Events API

Flask backend and CampusConnect frontend for the `events`, `users`, and `registrations` tables shown in the database diagram. The frontend follows the design in `frontant/stitch_campusconnect_event_portal` and uses the Supabase publishable key through the Flask API.

## Run locally

1. From the project root, create a virtual environment and install dependencies:

   ```powershell
   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r backendd/requirements.txt
   ```

2. Copy `backendd/.env.example` to `backendd/.env` and set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` from your Supabase project.

3. Start the connected frontend and API:

   ```powershell
   python backendd/app.py
   ```

The app listens at `http://127.0.0.1:5000` by default. Open that address for the frontend. `GET /api` returns the route list.

The site has three pages: events at `/`, registrations at `/my-registrations.html`, and organizer tools at `/organizer.html`. The same pages are served as static files from `public/` on Vercel.

## Deploy to Vercel

The repository includes a Vercel Python entry point, Python 3.12 selection, and a root dependency file. The frontend is under `public/` so Vercel can serve it as static content; Flask handles the API routes.

1. Import this repository into Vercel and keep the **Root Directory** set to the project root.
2. In the Vercel project settings, add `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` for the Preview and Production environments. Do not upload `backendd/.env`.
3. Deploy. Vercel will use `backendd.app:app` as the Flask entry point.

The frontend and API share the deployment origin, so its `/api/...` requests need no CORS setup. The Python runtime on Vercel runs Flask as a Function; Vercel serves `public/` assets from its CDN. See [Vercel's Flask guide](https://vercel.com/docs/frameworks/backend/flask) and [Python runtime guide](https://vercel.com/docs/functions/runtimes/python).

## Routes

All responses are JSON. Successful reads return `{"data": ...}`. Errors return `{"error":{"message":"..."}}`.

The frontend loads events and registrations from the endpoints below. To register or view your registrations, open **Add your campus ID** in the page and enter a UUID from `users.id`. Events with a matching `organizer_id` appear in the **Organizer** section, where the attendee list is loaded from the organizer-only route. Until authentication is added, use a test account; the current API accepts the caller-supplied UUID.

| Method | Endpoint | Behavior |
| --- | --- | --- |
| GET | `/` | Serve the CampusConnect frontend. |
| GET | `/my-registrations.html` | Show the current user's registrations. |
| GET | `/organizer.html` | Show events owned by the current user and their attendee lists. |
| GET | `/api` | Return the API route list. |
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
