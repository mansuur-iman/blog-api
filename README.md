# Blog API

A RESTful backend API for a fullstack blogging platform. Built with Node.js, Express, Prisma, and PostgreSQL — powering two separate React frontends for readers and authors.

---

## Tech Stack

- **Runtime** — Node.js
- **Framework** — Express.js
- **ORM** — Prisma
- **Database** — PostgreSQL
- **Auth** — JWT + bcrypt
- **Other** — CORS, dotenv

---

## Frontends

| App | Role |
|-----|------|
| [Blog Reader](https://blog-reader-five.vercel.app/) | Public-facing app for browsing and reading posts |
| [Blog Author](https://blog-author-ten.vercel.app/login) | Dashboard for authors to manage content |

---

## API Reference

Base URL: `/api/v1`

### Users — `/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/users` | ✅ | Get all users |
| `POST` | `/users/register` | — | Register a new account |
| `POST` | `/users/login` | — | Login and receive a token |
| `GET` | `/users/me` | ✅ | Get the authenticated user |
| `GET` | `/users/:id` | ✅ | Get a user by ID |
| `PUT` | `/users/:id` | ✅ | Update a user |
| `DELETE` | `/users/:id` | ✅ | Delete a user |

### Posts — `/posts`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/posts` | ✅ | Get all posts |
| `POST` | `/posts` | ✅ Author | Create a post |
| `GET` | `/posts/search` | ✅ | Search posts |
| `GET` | `/posts/:id` | ✅ | Get a single post |
| `PUT` | `/posts/:id` | ✅ Author | Update a post |
| `DELETE` | `/posts/:id` | ✅ Author | Delete a post |

### Comments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/posts/:postId/comments` | ✅ | Get comments on a post |
| `POST` | `/posts/:postId/comments` | ✅ | Add a comment |
| `PUT` | `/comments/:id` | ✅ | Update a comment |
| `DELETE` | `/comments/:id` | ✅ | Delete a comment |

> **Auth:** ✅ = requires JWT &nbsp;|&nbsp; ✅ Author = JWT + `AUTHOR` role

---

## Middleware

**`verifyToken`** — Validates the JWT on every protected route. Pass the token as a Bearer token in the `Authorization` header.

**`isAuthor`** — Runs after `verifyToken`. Rejects requests from users without the `AUTHOR` role.

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm

### 1. Clone

```bash
git clone git@github.com:mansuur-iman/blog-api.git
cd blog-api
```

### 2. Install

```bash
npm install
```

### 3. Environment

Create a `.env` file in the root:

```env
DATABASE_URL=your_postgresql_connection_url
JWT_SECRET=your_jwt_secret
PORT=8080
```

### 4. Database

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Run

```bash
# Development
npm run dev

# Production
npm run build && npm start
```

---

## Project Structure

```
blog-api/
├── prisma/           # Schema and migrations
├── generated/        # Prisma client
├── controllers/      # Request handlers
├── routes/           # Express routers
├── middlewear/       # verifyToken, isAuthor
├── utils/            # Shared helpers
├── app.js            # Express setup
└── server.js         # Entry point
```

---

## Error Handling

All unhandled errors are caught by a global Express error handler and returned as JSON:

```json
{
  "msg": "Error message here",
  "error": {}
}
```

HTTP status defaults to `500` unless the error carries a `.status` field.

Built as a fullstack blogging platform using Node.js, Express, Prisma, PostgreSQL, React, and Vite.
