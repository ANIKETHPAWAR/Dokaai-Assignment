# Notification Preference Service

Backend reference implementation for managing organizations, users, notification groups/topics, and per-user preference data. It exposes an HTTP API (Express + TypeScript) plus a decision endpoint that determines whether a notification is allowed on a specific channel.

## Stack & Principles

- **Runtime:** Node.js + Express with TypeScript
- **Architecture:** Clean layering (controllers → services → repositories) with OOP services and in-memory repositories for easy DB swap-in
- **Validation:** Zod DTO schemas per module
- **Errors/Responses:** Centralized `AppError`, error middleware, and success helpers
- **Tooling:** ESLint (flat config), Prettier, ts-node-dev, strict `tsconfig`

## Project Structure

```
src/
  app.ts              # Express app wiring
  server.ts           # HTTP bootstrap + seeding
  container.ts        # Shared repository singletons
  controllers/        # Thin HTTP handlers
  dtos/               # Zod schemas & typed contracts
  errors/             # Custom error classes
  middleware/         # Error / 404 handlers, etc.
  models/             # Domain entities
  repositories/       # In-memory repos + abstractions
  routes/             # Express routers per module
  services/           # Business logic
  utils/              # Response helpers, ID/seed utilities
```

## Getting Started

```bash
npm install
npm run dev        # starts ts-node-dev with auto-reload
npm run lint       # ESLint with --max-warnings=0
npm run typecheck  # Standalone tsc validation
npm run build      # Emit JS to dist/
npm start          # Runs compiled code from dist/
```

### Seed Data

`seedDemoData()` populates shared in-memory repositories during server startup so you immediately get:

- Organizations: `org-acme`, `org-zen`
- Users: `user-alice`, `user-bob`, `user-carol`
- Groups & Topics (product updates, security alerts, IoT device health, …)
- Group/topic channel preferences for each user

Pass `{ force: true }` to `seedDemoData` if you want to refresh data manually (e.g., from a REPL or test harness).

## Key Modules & Endpoints

| Module                    | Routes                                                                                                                                                 | Notes                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| Organizations             | `POST /api/organizations`, `GET /api/organizations`, `GET/PUT/DELETE /api/organizations/:id`                                                           | Manages tenants                                       |
| Users                     | `POST /api/users`, `GET /api/users`, `GET/PUT/DELETE /api/users/:id`                                                                                   | Validates org membership and email uniqueness         |
| Notification Groups       | `POST /api/notification-groups`, `GET /api/notification-groups?organizationId=...`, `GET/PUT/DELETE /:id`                                              | Supports mandatory groups                             |
| Notification Topics       | `POST /api/notification-topics`, `GET /api/notification-topics?organizationId=&groupId=`, `GET/PUT/DELETE /:id`                                        | Enforces group/org relationships and default channels |
| Group Preferences         | `POST /api/group-preferences`, `GET /api/group-preferences/user/:userId`, `DELETE /api/group-preferences/user/:userId/group/:groupId`                  | Stores on/off state per user-group                    |
| Topic Channel Preferences | `POST /api/topic-preferences`, `GET /api/topic-preferences/user/:userId`, `DELETE /api/topic-preferences/user/:userId/topic/:topicId/channel/:channel` | Overrides default channels                            |
| Decision API              | `POST /api/decision/check`                                                                                                                             | Returns `{ allowed, reason, details }`                |
| Health                    | `GET /health`                                                                                                                                          | Simple liveness probe                                 |

All controllers only perform validation + response shaping; services hold the business rules; repositories hide storage details.

## Decision Flow (High Level)

1. Confirm organization, user, topic, group exist and belong together.
2. Block inactive users.
3. Mandatory groups allow delivery regardless of user overrides.
4. Respect group preference (opt-out disables all topics in that group).
5. Respect topic+channel preference overrides.
6. Fall back to topic default channels — if the requested channel isn’t listed, deny.
7. Return `{ allowed, reason, details }` so the caller knows why.

## Postman Collection

Import `postman_collection.json` into Postman (Collection v2.1). It contains ready-to-run requests for health checks, CRUD operations, preference toggles, and the decision endpoint. The collection uses a `baseUrl` variable defaulting to `http://localhost:3000/api`.

## Extending the Service

- Replace in-memory repositories with database-backed versions by implementing the same interfaces.
- Add authentication/authorization middleware before controllers.
- Expand the decision logic to consider rate limits, quiet hours, or channel-specific throttles.
- Add automated tests around services/repositories—scaffolding is intentionally clean to make that straightforward.

---

Questions or next steps? Import the Postman collection, start the dev server, and hit the `/decision/check` endpoint with the seeded IDs to see the decision engine in action.
