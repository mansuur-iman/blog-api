# Blog API

A REST API for a fullstack blogging platform built with Node.js, Express, Prisma, and PostgreSQL.

The API powers two separate React frontends:

* **Blog Project** — public reader application
* **Blog Author** — author/admin dashboard

It handles authentication, authorization, blog management, comments, and database operations.

---

# Frontend Applications

## Blog Project (Reader Frontend)

### LIVE DEMO
https://blog-reader-five.vercel.app/

The public-facing frontend where users can:

* Create accounts
* Login
* Choose a role during signup (`READER` or `AUTHOR`)
* Browse published blog posts
* Read full articles
* Comment on posts
* Search for posts

### Tech Stack

* React
* Vite
* React Router
* CSS Modules

### Repository

```bash
git clone git@github.com:mansuur-iman/blog-project.git
```

Run locally:

```bash
cd blog-project
npm install
npm run dev
```

---

## Blog Author (Author Dashboard)

The dashboard frontend for authors to manage blog content.

### LIVE DEMO
https://blog-author-ten.vercel.app/login

Authors can:

* Login
* Create posts
* Edit posts
* Delete posts
* Publish or unpublish posts
* View comments
* Delete comments
* Manage authored content

### Tech Stack

* React
* Vite
* React Router
* CSS Modules

### Repository

```bash
git clone git@github.com:mansuur-iman/blog-author.git
```

Run locally:

```bash
cd blog-author
npm install
npm run dev
```

---

# Tech Stack

## Backend

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL
* JWT Authentication
* bcrypt

---

# Features

## Authentication

* User registration
* User login
* JWT authentication
* Protected routes
* Role-based authorization

---

## Posts

* Create posts
* Edit posts
* Delete posts
* Fetch all posts
* Fetch single posts
* Search posts
* Publish/unpublish posts

---

## Comments

* Create comments
* Fetch comments
* Update comments
* Delete comments

---

# Database Schema

## User

```prisma
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
```

## Role

```prisma
enum Role {
  READER
  AUTHOR
}
```

## Post

```prisma
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
```

## Comment

```prisma
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

# API Routes

## User Routes

```txt
GET    /users
POST   /users/register
POST   /users/login
GET    /users/me
GET    /users/:id
PUT    /users/:id
DELETE /users/:id
```

---

## Post Routes

```txt
GET    /posts
POST   /posts
GET    /posts/search
GET    /posts/:id
PUT    /posts/:id
DELETE /posts/:id
```

### Protected Author Routes

The following routes require author access:

* POST `/posts`
* PUT `/posts/:id`
* DELETE `/posts/:id`

---

## Comment Routes

```txt
GET    /posts/:postId/comments
POST   /posts/:postId/comments
PUT    /comments/:id
DELETE /comments/:id
```

---

# Authentication Middleware

## verifyToken

Protects authenticated routes using JWT.

## isAuthor

Restricts access to author-only routes.

---

# Installation

Clone the repository:

```bash
git clone git@github.com:mansuur-iman/blog-api.git
```

Navigate into the project:

```bash
cd blog-api
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your_jwt_secret
PORT=8080
```

---

# Prisma Setup

Run migrations:

```bash
npx prisma migrate dev
```

Generate Prisma client:

```bash
npx prisma generate
```

---

# Start Development Server

```bash
npm run dev
```

---

# Production

Build the application:

```bash
npm run build
```

Start production server:

```bash
npm start
```

---

# Project Structure

```txt
blog-api/
├── prisma/
├── generated/
├── controllers/
├── routes/
├── middlewear/
├── utils/
├── app.js
├── server.js
└── package.json
```

---

# Author

Built as a fullstack blogging platform using Node.js, Express, Prisma, PostgreSQL, React, and Vite.
