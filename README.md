# 📝 Blog API

A RESTful API powering a fullstack blogging platform — handling authentication, post management, comments, and role-based access control.

Built with **Node.js**, **Express**, **Prisma**, and **PostgreSQL**.

---

## 🌐 Live Demos

| App | URL |
|-----|-----|
| Reader Frontend | [blog-reader-five.vercel.app](https://blog-reader-five.vercel.app/) |
| Author Dashboard | [blog-author-ten.vercel.app/login](https://blog-author-ten.vercel.app/login) |

---

## 📦 Project Overview

This API powers two separate React frontends:

**Blog Project** — public reader application where users can browse, read, comment on, and search posts.

**Blog Author** — author/admin dashboard where authors can create, edit, publish, and delete content.

---

## ⚙️ Tech Stack

### Backend
- Node.js + Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt

### Frontend (both apps)
- React + Vite
- React Router
- CSS Modules

---

## ✨ Features

**Authentication & Authorization**
- User registration and login
- JWT-protected routes
- Role-based access control (`READER` / `AUTHOR`)

**Posts**
- Create, read, update, delete posts
- Publish / unpublish toggle
- Search posts

**Comments**
- Create, read, update, delete comments
- Comments scoped to individual posts

---

## 🗄️ Database Schema

```prisma
enum Role {
  READER
  AUTHOR
}

model User {
  id         String    @id @default(uuid())
  first_name String
  last_name  String
  username   String    @unique
  email      String    @unique
  password   String
  role       Role      @default(READER)
  posts      Post[]
  comments   Comment[]
  createdAt  DateTime  @default(now())
}

model Post {
  id          String    @id @default(uuid())
  title       String
  text        String
  description String?
  imageUrl    String?
  author      User      @relation(fields: [authorId], references: [id])
  authorId    String
  published   Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  comments    Comment[]

  @@index([authorId])
}

model Comment {
  id        String   @id @default(uuid())
  text      String
  createdAt DateTime @default(now())
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  post      Post     @relation(fields: [postId], references: [id])
  postId    String

  @@index([authorId, postId])
}
```

---

## 🛣️ API Routes

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` | Get all users |
| `POST` | `/users/register` | Register a new user |
| `POST` | `/users/login` | Login |
| `GET` | `/users/me` | Get current user |
| `GET` | `/users/:id` | Get user by ID |
| `PUT` | `/users/:id` | Update user |
| `DELETE` | `/users/:id` | Delete user |

### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/posts` | Get all posts |
| `POST` | `/posts` | Create a post *(Author only)* |
| `GET` | `/posts/search` | Search posts |
| `GET` | `/posts/:id` | Get single post |
| `PUT` | `/posts/:id` | Update post *(Author only)* |
| `DELETE` | `/posts/:id` | Delete post *(Author only)* |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/posts/:postId/comments` | Get comments for a post |
| `POST` | `/posts/:postId/comments` | Add a comment |
| `PUT` | `/comments/:id` | Update a comment |
| `DELETE` | `/comments/:id` | Delete a comment |

> Routes marked *Author only* require a valid JWT and `AUTHOR` role.

---

## 🔐 Middleware

- **`verifyToken`** — validates the JWT on protected routes
- **`isAuthor`** — restricts access to author-only operations

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:mansuur-iman/blog-api.git
cd blog-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your_jwt_secret
PORT=8080
```

### 4. Set up the database

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Start the development server

```bash
npm run dev
```

---

## 🏗️ Build & Production

```bash
# Build
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
blog-api/
├── prisma/           # Prisma schema and migrations
├── generated/        # Prisma client output
├── controllers/      # Route handler logic
├── routes/           # Express route definitions
├── middlewear/       # Auth and role middleware
├── utils/            # Helper functions
├── app.js            # Express app setup
├── server.js         # Server entry point
└── package.json
```

---

## 🖥️ Frontend Repositories

### Blog Project (Reader)
```bash
git clone git@github.com:mansuur-iman/blog-project.git
cd blog-project
npm install
npm run dev
```

### Blog Author (Dashboard)
```bash
git clone git@github.com:mansuur-iman/blog-author.git
cd blog-author
npm install
npm run dev
```

Built as a fullstack blogging platform using Node.js, Express, Prisma, PostgreSQL, React, and Vite.
