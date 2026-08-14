# Library Management System Backend

Express + Sequelize + SQLite backend following the same structure/style as the provided Week 6 to-do backend.

## Features

- JWT authentication and protected library routes
- bcrypt password hashing
- Books, authors, and genres CRUD
- Book title search and genre filtering
- Low-stock data is available through `stock < 5`
- Real multipart image uploads using Multer
- Validation with express-validator
- Prevents deleting authors/genres that are still used by books
- SQLite database with seed data

## Setup

```bash
cd backend
npm install
npm run db:sync
npm run dev
```

On macOS/Linux, use `cp .env.example .env` instead of `copy`.

Default seeded login:

- Username: `admin`
- Password: `admin123`

Change the JWT secret in `.env` before deployment.

## API

All routes except `/api/auth/login` and `/api/auth/register` require:

`Authorization: Bearer <JWT>`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Books

- `GET /api/books`
- `GET /api/books/:id`
- `POST /api/books` — multipart/form-data, file field: `cover`
- `PUT /api/books/:id` — multipart/form-data, file field: `cover`
- `DELETE /api/books/:id`

Optional book filters:

- `GET /api/books?title=dune`
- `GET /api/books?genreId=2`

### Authors

- `GET /api/authors`
- `GET /api/authors/:id`
- `POST /api/authors`
- `PUT /api/authors/:id`
- `DELETE /api/authors/:id`

### Genres

- `GET /api/genres`
- `GET /api/genres/:id`
- `POST /api/genres`
- `PUT /api/genres/:id`
- `DELETE /api/genres/:id`

Uploaded images are served from `/uploads/<filename>`.
