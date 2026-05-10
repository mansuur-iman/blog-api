# Blog API

A RESTful backend API powering two frontend applications — a reader platform and an author dashboard. Built with Node.js and Express, with PostgreSQL as the database, Prisma as the ORM, and JWT for authentication.

---

## Live API

**Base URL:** `https://blog-api-7iix.onrender.com/api/v1`

> Hosted on Render. Cold starts may take 30–60 seconds on the free tier.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT (JSON Web Tokens) |
| Password Hashing | bcrypt |
| Validation | express-validator |
| Config | dotenv |

---

## Related Frontends

| App | Repo | Live |
|-----|------|------|
| Reader | [myblog-reader](https://github.com/mansuur-iman/myblog-reader) | [blog-reader-five.vercel.app](https://blog-reader-five.vercel.app) |
| Author Dashboard | [blog-author](https://github.com/mansuur-iman/blog-author) | [blog-author-ten.vercel.app](https://blog-author-ten.vercel.app) |

---

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
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
|--------|----------|-------------|------|
| `GET` | `/posts` | Get all published posts | ✓ |
| `GET` | `/posts/:id` | Get a single post by ID | ✓ |
| `POST` | `/posts` | Create a new post | ✓ AUTHOR |
| `PUT` | `/posts/:id` | Update a post | ✓ AUTHOR |
| `DELETE` | `/posts/:id` | Delete a post | ✓ AUTHOR |
| `PATCH` | `/posts/:id/publish` | Toggle publish status | ✓ AUTHOR |
| `GET` | `/posts/search` | Search posts by keyword | ✓ |

#### Search — `GET /posts/search`

Query params:
```
?term=javascript&page=1&limit=10&sort=desc
```

---

### Comments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
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

Tokens are issued on login and should be stored client-side (e.g. `localStorage`).

---

## Roles

| Role | Permissions |
|------|-------------|
| `READER` | View posts, add comments |
| `AUTHOR` | All reader permissions + create, edit, delete, publish posts, delete comments |

---

## Installation

```bash
git clone https://github.com/mansuur-iman/blog-api.git
cd blog-api
npm install
```

Set up your environment variables:

```bash
cp .env.example .env
```

`.env` variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/blogdb"
JWT_SECRET="your_jwt_secret"
PORT=3000
```

Set up the database with Prisma:

```bash
npx prisma migrate dev
npx prisma generate
```

Start the server:

```bash
npm run dev   # development
npm start     # production
```

The API runs at `http://localhost:3000` by default.

---

## Project Structure

```
src/
├── routes/         # Express route definitions
├── controllers/    # Request handlers
├── middleware/     # Auth, validation, error handling
├── prisma/
│   └── schema.prisma  # Database schema
└── app.js          # Express app entry point
```

---

## Error Responses

All errors follow this shape:

```json
{
  "msg": "Error message here"
}
```

Common status codes:

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Validation error |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — insufficient role |
| `404` | Resource not found |
| `500` | Internal server error |
