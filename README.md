# Study Planner Web Application with Productivity Analytics

A MERN-stack study planning application with authentication, subject and task management, deadlines, priorities, reminders, responsive UI, and productivity analytics.

## Main Technologies

- React + Vite + Tailwind CSS
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication + bcryptjs
- Axios, React Router, Recharts, Lucide React
- Docker + Docker Compose
- Nginx for serving the production React build

## Run with Docker Compose

### Requirements

Install Docker Desktop (Windows/macOS) or Docker Engine + Docker Compose (Linux).

### Start the complete application

From the project root, run:

```bash
docker compose up --build
```

Docker Compose starts three services:

- `client` — React production build served by Nginx
- `server` — Express REST API
- `mongo` — MongoDB database with persistent storage

Open the application at:

```text
http://localhost:8080
```

Backend health endpoint:

```text
http://localhost:5000/api/health
```

### Stop the application

```bash
docker compose down
```

To also delete the local MongoDB Docker volume and all Docker test data:

```bash
docker compose down -v
```

## Optional Environment Configuration

The Docker Compose file contains local-development defaults. For a custom JWT secret, copy the example environment file:

```bash
cp .env.example .env
```

On Windows Command Prompt:

```cmd
copy .env.example .env
```

Then edit `.env` and set a long random `JWT_SECRET` (minimum 32 characters).

Example:

```env
JWT_SECRET=replace_with_a_random_secret_at_least_32_characters
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:8080
```

Never commit the real `.env` file to a public repository.

## Docker Architecture

```text
Browser
  |
  v
Nginx / React Client :8080
  |  /api
  v
Express API :5000
  |
  v
MongoDB :27017 (internal Docker network)
```

Nginx serves the React single-page application and proxies `/api` requests to the Express container. Express connects to MongoDB through the internal Docker network using `mongodb://mongo:27017/study_planner`.

## Manual Development Run (without Docker)

### Backend

```bash
cd server
npm install
npm run dev
```

Create `server/.env` using `server/.env.example`, but for a locally installed MongoDB use a URI such as:

```env
MONGO_URI=mongodb://127.0.0.1:27017/study_planner
CLIENT_URL=http://localhost:5173
```

### Frontend

In another terminal:

```bash
cd client
npm install
npm run dev
```

Create `client/.env` from `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

Then open `http://localhost:5173`.
