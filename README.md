# Mini Fintech Dashboard (FinTrack)

A full-stack personal finance dashboard for tracking income, expenses, and spending insights. Users can register, log in, add transactions, filter history, and view charts on a responsive dashboard.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS 4, Recharts, React Router, Axios, React Hot Toast |
| Backend | Node.js, Express 5, JWT (HTTP-only cookies), bcryptjs |
| Database | MongoDB with Mongoose |
| DevOps | Docker (multi-stage build), Docker Compose, Nginx |

## Features

- User registration and login with secure cookie-based JWT auth
- Dashboard with total income, expenses, net balance, and category chart
- Add transactions with client and server-side validation
- Filter transactions by category and date range
- Delete transactions with live dashboard updates
- Spending insights based on your transaction history

## Project Structure

```
Mini Fintech Dashboard/
├── client/          # React frontend (Vite) + Dockerfile + nginx.conf
├── server/          # Express API + Dockerfile
├── docker-compose.yml
└── README.md
```

## Prerequisites

Choose one setup path:

**Local development**
- Node.js 20+


**Docker**
- Docker Desktop (or Docker Engine + Docker Compose)

---

## Local Development Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Expense Tracker"
```

### 2. Configure environment variables

**Server** — copy and edit the example env file:

```bash
cp server/.env.example server/.env
```

Update `server/.env` if needed:

```env
PORT=5000
MONGO_URI=
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:5173
```

**Client** (optional) — defaults to `http://localhost:5000/api`:

```bash
cp client/.env.example client/.env
```

### 3. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 4. Start MongoDB

Make sure MongoDB is running on your machine. The app uses the `finance` database automatically.

### 5. Run the app

In one terminal (API):

```bash
cd server
npm run dev
```

In another terminal (frontend):

```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Docker Setup

Build and start all services (MongoDB, API, and web frontend):

```bash
docker compose up --build
```

| Service | URL |
| --- | --- |
| Web app | [http://localhost:8080](http://localhost:8080) |
| API (direct) | [http://localhost:5000](http://localhost:5000) |
| MongoDB | `localhost:27017` |

Set a strong JWT secret before production:

```bash
JWT_SECRET=your-production-secret docker compose up --build
```

Stop services:

```bash
docker compose down
```

Remove volumes (clears database data):

```bash
docker compose down -v
```

### Docker architecture

Each service has its own multi-stage Dockerfile:

- **`client/Dockerfile`** — builds the React app, then serves it with Nginx (proxies `/api` to the backend)
- **`server/Dockerfile`** — installs production dependencies and runs the Express API

`docker-compose.yml` orchestrates MongoDB, the API, and the web frontend together.

---

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user |
| GET | `/api/dashboard/summary` | Dashboard stats and chart data |
| GET | `/api/dashboard/recent` | Recent transactions |
| GET | `/api/transactions` | List/filter transactions |
| POST | `/api/transactions` | Add transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| GET | `/api/health` | Health check |

All finance routes require authentication.

---

## Transaction Validation

Both client and server validate:

- **Amount** — required, positive number
- **Category** — one of: Food, Travel, Shopping, Bills, Entertainment, Health, Salary, Other
- **Type** — `income` or `expense`
- **Date** — required, cannot be in the future
- **Note** — optional, max 200 characters

---

## Scripts

### Server

| Command | Description |
| --- | --- |
| `npm run dev` | Start with nodemon |
| `npm start` | Start production server |

### Client

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

---

## Troubleshooting

| Issue | Fix |
| --- | --- |
| `MongoDB connection failed` | Ensure MongoDB is running and `MONGO_URI` is correct |
| CORS errors | Set `CLIENT_URL` in server `.env` to match your frontend URL |
| Login not persisting | Confirm cookies are enabled; API and client origins must match CORS config |
| Docker API can't reach Mongo | Wait for the mongo healthcheck; use `docker compose up --build` |

---

## License

ISC
