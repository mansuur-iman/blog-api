# blog-api

> REST API backend for a fullstack blogging platform. Powers two separate React clients — a public reader app and a private author dashboard — with JWT authentication and role-based access control.

---

## Table of Contents

- [Stack](#stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Posts](#posts)
  - [Comments](#comments)
- [Authorization](#authorization)
- [Error Handling](#error-handling)
- [Frontend Clients](#frontend-clients)

---

## Stack

| Concern | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| ORM | Prisma |
| Database | PostgreSQL |
| Authentication | JSON Web Tokens (JWT) |
| Password hashing | bcrypt |

---

## Project Structure

```
blog-api/
├── prisma/
│   └── schema.prisma        # Data models and relations
├── controllers/
│   ├── userController.js
│   ├── postController.js
│   └── commentController.js
├── routes/
│   ├── userRouter.js
│   ├── postRouter.js
│   └── commentRouter.js
├── middlewear/
│   └── auth.js              # verifyToken, isAuthor
├── utils/
├── app.js                   # Express app, middleware, route mounting
├── server.js                # HTTP server entry point
└── .env
```

---

## Getting Started

**1. Clone the repository**

```bash
git clone git@github.com:mansuur-iman/blog-api.git
cd blog-api
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

See [Environment Variables](#environment-variables) below.

**4. Run database migrations**

```bash
npx prisma migrate dev
npx prisma generate
```

**5. Start the development server**

```bash
npm run dev
```

**Production**

```bash
npm run build
npm start
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your-secret-key
PORT=8080
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `PORT` | Port the server listens on |

---

## API Reference

**Base URL**

```
/api/v1
```

**Authentication**

All protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are issued by `POST /api/v1/users/login`.

---

### Users

| Method | Endpoint | Protected | Description |
|---|---|---|---|
| `POST` | `/users/register` | No | Register a new user account |
| `POST` | `/users/login` | No | Authenticate and receive a JWT |
| `GET` | `/users/me` | Yes | Get the currently authenticated user |
| `GET` | `/users` | Yes | Get all users |
| `GET` | `/users/:id` | Yes | Get a user by ID |
| `PUT` | `/users/:id` | Yes | Update a user by ID |
| `DELETE` | `/users/:id` | Yes | Delete a user by ID |

---

### Posts

| Method | Endpoint | Protected | Role | Description |
|---|---|---|---|---|
| `GET` | `/posts` | Yes | Any | Get all posts |
| `GET` | `/posts/search` | Yes | Any | Search posts by keyword |
| `GET` | `/posts/:id` | Yes | Any | Get a single post by ID |
| `POST` | `/posts` | Yes | `AUTHOR` | Create a new post |
| `PUT` | `/posts/:id` | Yes | `AUTHOR` | Update an existing post |
| `DELETE` | `/posts/:id` | Yes | `AUTHOR` | Delete a post |

---

### Comments

| Method | Endpoint | Protected | Description |
|---|---|---|---|
| `GET` | `/posts/:postId/comments` | Yes | Get all comments on a post |
| `POST` | `/posts/:postId/comments` | Yes | Add a comment to a post |
| `PUT` | `/comments/:id` | Yes | Update a comment |
| `DELETE` | `/comments/:id` | Yes | Delete a comment |

---

## Authorization

The API uses two middleware functions defined in `middlewear/auth.js`:

**`verifyToken`**
Validates the JWT from the `Authorization` header. Attaches the decoded user payload to `req.user`. Returns `401 Unauthorized` if the token is absent or invalid.

**`isAuthor`**
Must be used after `verifyToken`. Checks that `req.user.role === 'AUTHOR'`. Returns `403 Forbidden` if the user does not have the required role.

Applied to post mutation routes:

```js
postRouter.post('/', verifyToken, isAuthor, postControllers.createPost);
postRouter.put('/:id', verifyToken, isAuthor, postControllers.updatePost);
postRouter.delete('/:id', verifyToken, isAuthor, postControllers.deletePost);
```

---

## Error Handling

All errors are caught by a global Express error handler mounted in `app.js`. Every error response follows this shape:

```json
{
  "msg": "A human-readable error message.",
  "error": {}
}
```

HTTP status is taken from `err.status` when available, otherwise defaults to `500`.

---

## Frontend Clients

| Client | Live | Repository |
|---|---|---|
| Reader (public) | [blog-reader-five.vercel.app](https://blog-reader-five.vercel.app/) | [blog-project](https://github.com/mansuur-iman/blog-project) |
| Author (dashboard) | [blog-author-ten.vercel.app](https://blog-author-ten.vercel.app/login) | [blog-author](https://github.com/mansuur-iman/blog-author) |
| [blog-author](https://github.com/mansuur-iman/blog-author) | Author dashboard (React + Vite) |
Built as a fullstack blogging platform using Node.js, Express, Prisma, PostgreSQL, React, and Vite.
