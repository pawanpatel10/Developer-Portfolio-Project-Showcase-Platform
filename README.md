# DevLink — Developer Portfolio & Project Showcase Platform

DevLink is a full-stack MERN application where developers can create a public profile, publish projects, collect likes and comments, and surface trending work on the homepage.

## Features

### Day 1
- JWT authentication with protected routes
- Developer profiles with bio, skills, social links, and avatar
- Project publishing with title, description, tech stack, GitHub link, live demo link, and tags

### Day 2
- Project likes and comments
- Search by keyword and tech stack
- Filter by tags
- Personal dashboard with total projects, likes, and comments

### Day 3
- Trending projects algorithm
- Score formula: $score = likes \times 2 + comments$

## Tech Stack

- Frontend: React, React Router, Axios, Vite, CSS
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT, bcryptjs

## Project Structure

```text
.
├── client
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   └── services
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── .gitignore
├── package.json
└── README.md
```

## Database Models

### User
- `name`
- `email`
- `password`
- `bio`
- `skills[]`
- `socialLinks`
- `avatar`

### Project
- `title`
- `description`
- `techStack[]`
- `tags[]`
- `githubLink`
- `demoLink`
- `userId`
- `likes[]`

### Comment
- `userId`
- `projectId`
- `text`

## Setup

### 1. Install dependencies

Run installs in the root, client, and server folders.

### 2. Configure environment variables

Create these files from the examples:

- `server/.env`
- `client/.env`

Use the following values as a starting point:

#### server/.env
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/devlink
JWT_SECRET=replace-with-a-secure-secret
CLIENT_URL=http://localhost:5173
```

#### client/.env
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start development servers

- Root dev script starts both client and server
- Client runs on `http://localhost:5173`
- Server runs on `http://localhost:5000`

## Main API Routes

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Users
- `PUT /api/users/profile`
- `GET /api/users/:userId`

### Projects
- `GET /api/projects`
- `GET /api/projects/trending`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/projects/:id/like`
- `POST /api/projects/:id/comments`

### Dashboard
- `GET /api/dashboard/summary`

## Notes

- Trending projects are sorted by the computed score and recency.
- Likes are stored per user so toggling is supported.
- Comments are stored in a dedicated collection for clean aggregation queries.