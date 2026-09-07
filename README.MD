# Student API (Fastify + Microsoft SQL Server)

The API automatically creates `dbo.Admins`, `dbo.Students`, and `dbo.Categories` when it starts. Passwords are hashed with bcrypt and authentication uses JWT bearer tokens.

## Setup

1. Create an empty SQL Server database.
2. Copy `.env.example` to `.env` and enter the database, JWT, and initial admin values.
3. Run `npm install`, `npm run db:init`, then `npm start`.

Browser requests are enabled through CORS. `CORS_ORIGIN` defaults to `*`; in
production, set it to your frontend origin (or a comma-separated list), such as
`https://app.example.com`.

The initial admin is inserted once, when no admin with `ADMIN_EMAIL` exists. There is intentionally no public admin-registration endpoint.

## Endpoints

### Admin login

`POST /api/auth/admin/login`

```json
{
  "email": "admin@example.com",
  "password": "your-admin-password"
}
```

### Create student (admin only)

`POST /api/students` with `Authorization: Bearer <admin-token>`

```json
{
  "role": "student",
  "name": "Ayesha Khan",
  "email": "ayesha@example.com",
  "password": "strong-password",
  "department": "Computer Science"
}
```

### List students (admin only)

`GET /api/students` with `Authorization: Bearer <admin-token>`

Returns all students without their password hashes.

### Delete student (admin only)

`DELETE /api/students/:id` with `Authorization: Bearer <admin-token>`

For example, `DELETE /api/students/1`.

### Student login

`POST /api/auth/student/login`

```json
{
  "email": "ayesha@example.com",
  "password": "strong-password"
}
```

Both login endpoints return a signed JWT in `token`. Student passwords are never returned by the API.

Category CRUD endpoints are admin-only and are documented in
[`category-endpoints.json`](./category-endpoints.json).
