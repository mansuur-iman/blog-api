# Blog API

A RESTful backend API powering two independently deployed frontends — a [reader platform](https://blog-reader-five.vercel.app) and an [author dashboard](https://blog-author-ten.vercel.app) — from a single codebase. Built with Node.js and Express, PostgreSQL as the database, Prisma as the ORM, and JWT for authentication.

**Base URL:** `https://blog-api-7iix.onrender.com/api/v1` *(hosted on Render free tier — cold starts may take ~30s)*

| Frontend | Repo | Live |
|---|---|---|
| Reader | [myblog-reader](https://github.com/mansuur-iman/myblog-reader) | [blog-reader-five.vercel.app](https://blog-reader-five.vercel.app) |
| Author Dashboard | [blog-author](https://github.com/mansuur-iman/blog-author) | [blog-author-ten.vercel.app](https://blog-author-ten.vercel.app) |

---

## How the Backend Works

The core design decision was serving two separate frontends from a single API. Rather than duplicating logic across two backends, all access control is handled through a role-based middleware layer that runs on every protected route.

### Role-Based Access Control

Users are assigned a role on registration — `READER` or `AUTHOR` — which is embedded in their JWT payload. Middleware extracts and verifies the role on each request:

- **READER** tokens pass through to read and comment endpoints
- **AUTHOR** tokens additionally unlock create, edit, publish, and delete operations
- Readers attempting to hit author-only routes receive a `403 Forbidden` — they are authenticated but not authorised

Adding a new role or permission requires updating middleware, not rewriting routes.

### Draft / Publish Workflow

Posts have a `published` boolean field controlled via a dedicated `PATCH /posts/:id/publish` endpoint, restricted to `AUTHOR` only. This means:

- Authors can write and save drafts without them being visible to readers
- The `GET /posts` endpoint only returns published posts to the reader frontend
- Authors can toggle publish status at any time — unpublishing a live post removes it from the reader view immediately

### Pagination and Search

All collection endpoints are paginated by default so the frontend never fetches unbounded data:

```
GET /posts?page=1&limit=10&sort=desc
GET /posts/search?term=javascript&page=1&limit=10&sort=desc
```

This keeps response times predictable as content grows, and puts control of data volume in the client's hands.

### Request Validation

Every incoming request is validated with `express-validator` before reaching the controller. Invalid data is rejected at the middleware layer with a structured error response — nothing malformed reaches the database.

---

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/users/register` | Register a new user | ✗ |
| `POST` | `/users/login` | Login and receive JWT | ✗ |
| `GET` | `/users/me` | Get current user profile | ✓ |

#### Register — `POST /users/register`
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "confirm_password": "password123",
  "role": "READER"
}
```
> `role` accepts `"READER"` or `"AUTHOR"`

#### Login — `POST /users/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
Response:
```json
{
  "token": "<jwt>",
  "user": {
    "id": "...",
    "username": "johndoe",
    "role": "READER"
  }
}
```

---

### Posts

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/posts` | Get all published posts | ✓ |
| `GET` | `/posts/:id` | Get a single post by ID | ✓ |
| `POST` | `/posts` | Create a new post | ✓ AUTHOR |
| `PUT` | `/posts/:id` | Update a post | ✓ AUTHOR |
| `DELETE` | `/posts/:id` | Delete a post | ✓ AUTHOR |
| `PATCH` | `/posts/:id/publish` | Toggle publish status | ✓ AUTHOR |
| `GET` | `/posts/search` | Search posts by keyword | ✓ |

---

### Comments

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/posts/:id/comments` | Get comments for a post | ✓ |
| `POST` | `/posts/:id/comments` | Add a comment to a post | ✓ |
| `DELETE` | `/comments/:id` | Delete a comment | ✓ AUTHOR |

#### Add Comment — `POST /posts/:id/comments`
```json
{
  "text": "Great article!"
}
```

---

## Authentication

All protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are issued on login and signed with a `JWT_SECRET`. Passwords are hashed with bcrypt before storage — plain-text passwords are never saved.

---

## Error Responses

All errors follow this shape:

```json
{
  "msg": "Error message here"
}
```

| Code | Meaning |
|---|---|
| `400` | Validation error — malformed request body |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — authenticated but insufficient role |
| `404` | Resource not found |
| `500` | Internal server error |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT |
| Password Hashing | bcrypt |
| Validation | express-validator |

---

## Project Structure

```
blog-api/
├── controllers/        # Request handlers, one file per resource
├── routes/             # Express route definitions
├── middlewear/         # Auth verification, role checks, error handling
├── lib/                # Shared utilities
├── prisma/
│   └── schema.prisma   # Database schema
└── server.js           # Entry point
```

---

## Running Locally

```bash
git clone https://github.com/mansuur-iman/blog-api.git
cd blog-api
npm install
```

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/blogdb"
JWT_SECRET="your_jwt_secret"
PORT=3000
```

Set up the database:

```bash
npx prisma migrate dev
npx prisma generate
```

Start the server:

```bash
npm run dev   # development
npm start     # production
```

API runs at `http://localhost:8080/api/v1` by default.


