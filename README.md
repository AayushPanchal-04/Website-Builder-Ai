# Genweb.ai — AI Website Builder

An AI-powered website builder. Describe the site you want in plain English, and the app generates a complete, production-ready, responsive HTML website using an LLM. You can then refine it through chat, edit the code, and deploy it to a public URL.

Built with a **React (Vite)** frontend and an **Express + MongoDB** backend.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Backend setup](#2-backend-setup)
  - [3. Frontend setup](#3-frontend-setup)
  - [4. Run the app](#4-run-the-app)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [How It Works](#how-it-works)
- [Plans and Credits](#plans-and-credits)
- [Available Scripts](#available-scripts)
- [Troubleshooting](#troubleshooting)

---

## Features

- **AI website generation** — Turns a text prompt into a single, self-contained, mobile-first responsive HTML file (inline CSS + JS, SPA-style navigation).
- **Iterative chat editing** — Refine an existing site with follow-up prompts; the AI returns the full updated HTML.
- **Live code editor** — Inspect and edit the generated HTML directly in an in-browser Monaco editor.
- **Live preview** — Render the generated site in a sandboxed iframe before deploying.
- **One-click deploy** — Publishes the site to a public slug-based URL (`/site/:slug`).
- **Google authentication** — Sign in with Google via Firebase; sessions are tracked with a JWT stored in an httpOnly cookie.
- **Credit system** — Every user starts with 100 free credits; generation and edits consume credits.
- **Paid plans** — Upgrade to Pro or Enterprise via Stripe Checkout (INR), which tops up credits.
- **Dashboard** — Lists all of a user's generated websites.

---

## Tech Stack

### Frontend (`/client`)

| Technology | Purpose |
| --- | --- |
| React 19 | UI library |
| Vite 7 | Build tool and dev server |
| React Router 7 | Client-side routing |
| Redux Toolkit + React Redux | Global state (user session) |
| Tailwind CSS 4 | Styling (via `@tailwindcss/vite`) |
| Firebase 12 | Google authentication |
| Monaco Editor (`@monaco-editor/react`) | In-browser code editing |
| Axios | HTTP client |
| lucide-react | Icons |
| motion | Animations |

### Backend (`/server`)

| Technology | Purpose |
| --- | --- |
| Node.js + Express 5 | HTTP server and REST API |
| MongoDB + Mongoose 9 | Database and ODM |
| JSON Web Token (`jsonwebtoken`) | Auth tokens |
| cookie-parser | Reads the auth cookie |
| CORS | Cross-origin requests from the client |
| Stripe | Billing and Checkout |
| OpenRouter API | LLM provider (`deepseek/deepseek-chat`) |
| dotenv | Environment configuration |
| nodemon | Dev auto-restart |

---

## Project Structure

```
2.websiteBuilder/
├── client/                      # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── LoginModal.jsx   # Google sign-in modal
│   │   ├── hooks/
│   │   │   └── useGetCurrentUser.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Dashboard.jsx    # List of user's websites
│   │   │   ├── Generate.jsx     # Prompt -> generate a website
│   │   │   ├── Editor.jsx       # Monaco editor + chat refinement
│   │   │   ├── LiveSite.jsx     # Public deployed site view
│   │   │   └── Pricing.jsx      # Plans and Stripe checkout
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   └── userSlice.js
│   │   ├── App.jsx              # Routes + serverUrl
│   │   ├── firebase.js          # Firebase init + GoogleAuthProvider
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── vite.config.js
│   └── package.json
│
└── server/                      # Express + MongoDB backend
    ├── config/
    │   ├── db.js                # Mongoose connection
    │   ├── openRouter.js        # LLM call helper
    │   ├── plan.js              # Plan definitions (price + credits)
    │   └── stripe.js            # Stripe client
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── billing.controller.js
    │   ├── stripeWebhook.controller.js
    │   ├── user.controllers.js
    │   └── website.controllers.js
    ├── middlewares/
    │   └── isAuth.js            # JWT cookie verification
    ├── models/
    │   ├── user.model.js
    │   └── website.model.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── billing.routes.js
    │   ├── user.routes.js
    │   └── website.routes.js
    ├── utils/
    │   └── extractJson.js       # Safely parses JSON from LLM output
    ├── .env
    ├── index.js                 # App entry point
    └── package.json
```

---

## Prerequisites

- **Node.js** 18 or newer (Node 20+ recommended)
- **npm**
- A **MongoDB** database — either:
  - a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster, or
  - a local MongoDB instance (`mongodb://127.0.0.1:27017`)
- A **Firebase** project with **Google sign-in** enabled (for the client)
- An **OpenRouter** API key (for AI generation)
- *(Optional)* A **Stripe** account — only needed for the paid plans

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AayushPanchal-04/Website-Builder-Ai.git
cd Website-Builder-Ai
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `server/.env` file (see [Environment Variables](#environment-variables)):

```env
PORT=8000
MONGODB_URL=mongodb://127.0.0.1:27017/genweb
JWT_SECRET=your_jwt_secret_here
OPENROUTER_API_KEY=your_openrouter_api_key
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 3. Frontend setup

```bash
cd client
npm install
```

Create a `client/.env`:

```env
VITE_FIREBASE_API_KEY=your_firebase_web_api_key
```

The remaining Firebase settings (`authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`) live in [`client/src/firebase.js`](client/src/firebase.js) — update them to match your own Firebase project.

### 4. Run the app

Run the backend and frontend in **two separate terminals**:

```bash
# Terminal 1 - backend (http://localhost:8000)
cd server
npm run dev
```

```bash
# Terminal 2 - frontend (http://localhost:5173)
cd client
npm run dev
```

Then open **http://localhost:5173**.

> The backend CORS policy only allows `http://localhost:5173`, so keep the Vite dev server on that port.

---

## Environment Variables

### `server/.env`

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | Port the Express server listens on. Defaults to `5000` if unset; the client expects `8000`. |
| `MONGODB_URL` | Yes | MongoDB connection string (Atlas `mongodb+srv://...` or local `mongodb://127.0.0.1:27017/genweb`). |
| `JWT_SECRET` | Yes | Secret used to sign/verify auth tokens. Use a long random string in production. |
| `OPENROUTER_API_KEY` | Yes | API key for OpenRouter, used for all AI generation/editing. |
| `FRONTEND_URL` | Yes | Base URL of the frontend. Used for Stripe redirects and generated deploy links. |
| `STRIPE_SECRET_KEY` | No | Stripe secret key. Required only for billing/checkout. |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook signing secret. Required only for the webhook endpoint. |

### `client/.env`

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_FIREBASE_API_KEY` | Yes | Firebase Web API key used to initialize Firebase Auth. |

---

## API Reference

Base URL: `http://localhost:8000`

| Method | Endpoint | Auth | Body / Params | Description |
| --- | --- | --- | --- | --- |
| `POST` | `/api/auth/google` | No | `{ name, email, avatar }` | Finds or creates a user, sets the `token` httpOnly cookie, returns the user. |
| `GET` | `/api/auth/logout` | No | — | Clears the auth cookie. |
| `GET` | `/api/user/me` | Yes | — | Returns the currently authenticated user. |
| `POST` | `/api/website/generate` | Yes | `{ prompt }` | Generates a new website. Costs **50 credits**. Returns `{ websiteId, remainingCredits }`. |
| `POST` | `/api/website/update/:id` | Yes | `{ prompt }` | Refines an existing website with AI. Costs **25 credits**. Returns `{ message, code, remainingCredits }`. |
| `GET` | `/api/website/get-by-id/:id` | Yes | — | Returns one website owned by the user. |
| `GET` | `/api/website/get-all` | Yes | — | Returns all websites owned by the user. |
| `GET` | `/api/website/deploy/:id` | Yes | — | Marks the website deployed and returns `{ url }`. |
| `GET` | `/api/website/get-by-slug/:slug` | No | — | Public: returns a deployed website by its slug. |
| `POST` | `/api/billing` | Yes | `{ planType }` | Creates a Stripe Checkout session for `pro` or `enterprise`. Returns `{ sessionUrl }`. |
| `POST` | `/api/stripe/webhook` | No | Stripe event | Raw-body webhook that credits the user's account after payment. |

**Authentication** uses a JWT stored in an httpOnly cookie named `token` (7-day expiry). Protected routes run through [`isAuth`](server/middlewares/isAuth.js).

---

## How It Works

### AI generation flow

1. The user submits a prompt from the Generate page.
2. `POST /api/website/generate` checks the user has at least **50 credits**.
3. The prompt is injected into a detailed "master prompt" that instructs the model to return a **single responsive HTML file** (one `<style>` tag, one `<script>` tag, no frameworks, SPA-style navigation, Unsplash images).
4. The request is sent to OpenRouter (`deepseek/deepseek-chat`, temperature `0.2`) via [`openRouter.js`](server/config/openRouter.js).
5. The response is parsed with [`extractJson.js`](server/utils/extractJson.js) — if parsing fails, it retries once with a stricter instruction.
6. A `Website` document is created (with the code and the conversation history) and **50 credits** are deducted.

### Editing flow

`POST /api/website/update/:id` sends the current HTML plus the new request to the model, replaces `latestCode` with the updated HTML, appends both messages to the conversation, and deducts **25 credits**.

### Data models

**User** — `name`, `email` (unique), `avatar`, `credits` (default `100`, min `0`), `plan` (`free` | `pro` | `enterprise`).

**Website** — `user` (ref), `title`, `latestCode`, `conversation[]` (`role: ai | user`, `content`), `deployed`, `deployUrl`, `slug` (unique).

### Deployment

`GET /api/website/deploy/:id` generates a slug from the title plus the last 5 characters of the document ID, sets `deployed = true`, and stores `deployUrl` as `${FRONTEND_URL}/site/${slug}`. The public page is served by the client route `/site/:id` via `get-by-slug`.

### Authentication

The client signs in with Google through Firebase, then posts the profile to `/api/auth/google`. The server issues a JWT in an httpOnly cookie. On load, the client calls `/api/user/me` to restore the session.

---

## Plans and Credits

Defined in [`server/config/plan.js`](server/config/plan.js):

| Plan | Price (INR) | Credits |
| --- | --- | --- |
| Free | 0 | 100 |
| Pro | 499 | 500 |
| Enterprise | 1499 | 1000 |

**Credit costs:** generating a new website = **50**, editing an existing website = **25**.

---

## Available Scripts

### Client (`/client`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server (http://localhost:5173) |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

### Server (`/server`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with nodemon (auto-restart on changes) |

---

## Troubleshooting

**`db error: bad auth : Authentication failed.`**
The `MONGODB_URL` credentials are wrong. The username in the connection string must be a real database user (created under Atlas → *Database Access*). `<db_username>` is a placeholder and will always fail.

**`querySrv EREFUSED`**
A DNS problem resolving the Atlas `mongodb+srv` record. [`config/db.js`](server/config/db.js) already forces public DNS servers (`8.8.8.8`, `1.1.1.1`). If it persists, run `ipconfig /flushdns`.

**Server logs `db error` but the app still loads**
The UI renders without a database, but login, generation, and the dashboard will fail. Fix `MONGODB_URL` first.

**The server didn't pick up a `.env` change**
nodemon watches `.js`/`.json` only. Restart the server after editing `.env`.

**CORS errors in the browser**
The API allows only `http://localhost:5173` as the origin. Make sure the Vite dev server is running on that exact port (see [`server/index.js`](server/index.js)).

**`ai returned invalid response`**
The model returned output that could not be parsed as JSON. Usually transient — retry the prompt.

---

## License

ISC
