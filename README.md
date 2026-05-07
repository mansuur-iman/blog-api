<div align="center">

# Blog API

A REST API powering a fullstack blogging platform with role-based access for readers and authors.

**Node.js · Express · Prisma · PostgreSQL · JWT**

[Reader App](https://blog-reader-five.vercel.app/) · [Author Dashboard](https://blog-author-ten.vercel.app/login)

</div>

---

## Overview

This API serves as the backend for two separate React frontends:

- **Reader** — lets users browse published posts, read articles, search content, and leave comments
- **Author** — gives authors a private dashboard to write, edit, publish, and delete their content

Both frontends authenticate through this API using JWTs, and access is gated by role (`READER` or `AUTHOR`).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database

### Installation

```bash
git clone git@github.com:mansuur-iman/blog-api.git
cd blog-api
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL=your_postgresql_connection_url
JWT_SECRET=your_jwt_secret
PORT=8080
```

### Database Setup

```bash
npx prisma migrate dev
npx prisma generate
```

### Running the Server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

---

## API Reference

All routes are prefixed with `/api/v1`.

Authentication uses Bearer tokens — include the JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

### Users

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/users/register` | Public | Create a new account |
| `POST` | `/users/login` | Public | Login and receive a JWT |
| `GET` | `/users/me` | 🔒 | Get your own profile |
| `GET` | `/users` | 🔒 | Get all users |
| `GET` | `/users/:id` | 🔒 | Get a user by ID |
| `PUT` | `/users/:id` | 🔒 | Update a user |
| `DELETE` | `/users/:id` | 🔒 | Delete a user |

---

### Posts

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/posts` | 🔒 | Get all posts |
| `GET` | `/posts/search` | 🔒 | Search posts by keyword |
| `GET` | `/posts/:id` | 🔒 | Get a single post |
| `POST` | `/posts` | 🔒 ✍️ | Create a post |
| `PUT` | `/posts/:id` | 🔒 ✍️ | Update a post |
| `DELETE` | `/posts/:id` | 🔒 ✍️ | Delete a post |

---

### Comments

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/posts/:postId/comments` | 🔒 | Get comments on a post |
| `POST` | `/posts/:postId/comments` | 🔒 | Add a comment |
| `PUT` | `/comments/:id` | 🔒 | Update a comment |
| `DELETE` | `/comments/:id` | 🔒 | Delete a comment |

> 🔒 Requires a valid JWT &nbsp;&nbsp; ✍️ Requires `AUTHOR` role

---

## Middleware

**`verifyToken`** — Decodes and validates the JWT on every protected route. Returns `401` if the token is missing or invalid.

**`isAuthor`** — Runs after `verifyToken`. Checks that the authenticated user has the `AUTHOR` role. Returns `403` if not.

---

## Error Handling

A global error handler catches all unhandled errors and responds with:

```json
{
  "msg": "Something went wrong.",
  "error": {}
}
```

Status defaults to `500` unless the thrown error includes a `.status` field.

---

## Project Structure

```
blog-api/
├── prisma/           # Schema and migrations
├── generated/        # Prisma generated client
├── controllers/      # Business logic per resource
├── routes/           # Express route definitions
├── middlewear/       # Auth middleware
├── utils/            # Shared utilities
├── app.js            # Express app + route wiring
└── server.js         # Server entry point
```

---

## Related Repositories

| Repo | Description |
|------|-------------|
| [blog-project](https://github.com/mansuur-iman/blog-project) | Reader frontend (React + Vite) |
| [blog-author](https://github.com/mansuur-iman/blog-author) | Author dashboard (React + Vite) |
Built as a fullstack blogging platform using Node.js, Express, Prisma, PostgreSQL, React, and Vite.
