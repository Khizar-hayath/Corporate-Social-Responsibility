# Corporate Social Responsibility (CSR) Initiative Platform

A full-stack platform where **NGOs publish their projects** and **Corporates provide funding**, with volunteer management, news, certificates, and an admin dashboard.

---

## Overview

The **CSR Initiative Platform** connects non-governmental organizations (NGOs) with companies that want to invest in social impact. NGOs create and manage projects; corporates and individuals can fund them, volunteer, and stay updated through news and impact stories. The platform includes role-based access, payment integration (Razorpay), volunteer applications, comment systems, and certificate generation for contributors.

---

## Key Features

| Feature | Description |
|--------|-------------|
| **Project publishing** | NGOs create projects with title, description, category, location, impact, budget, dates, and images. Categories: Education, Environment, Health, Community. |
| **Corporate funding** | Companies (and individuals) can fund projects via **Razorpay** — one-time or monthly donations, with verification and donation history. |
| **User roles** | **Admin** (full access), **NGO** (project/news management), **Company** (browse, fund, volunteer). |
| **Volunteer system** | Public volunteer application form (name, email, skills, interests, availability). Admin can approve/reject and manage applications. |
| **News & updates** | Admin/NGO publish news (press, updates, stories). Public listing with categories and article detail pages. |
| **Comments** | Project-level comments with likes and nested replies. |
| **Certificates** | Volunteer certificates with unique codes; validate and claim via project and volunteer details. |
| **Contact** | Contact form with admin inbox (new/read/replied). |
| **Admin dashboard** | Stats (users, projects, news, volunteers), user management, project/news/volunteer/contact management, certificate manager, settings. |
| **Auth** | JWT-based login/register; protected routes and role-based API access. |

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|--------|
| **React 19** | UI components and hooks |
| **Vite 7** | Build tool and dev server |
| **React Router 7** | Client-side routing |
| **Tailwind CSS 4** | Styling and design system |
| **Framer Motion 12** | Page transitions and animations |
| **React Icons** | Feather-style icons |
| **Axios** | API client |
| **date-fns** | Date formatting |
| **jsPDF** | Certificate PDF generation |

### Backend

| Technology | Purpose |
|------------|--------|
| **Node.js** | Runtime |
| **Express 4** | REST API |
| **MongoDB** | Database |
| **Mongoose 7** | ODM and schemas |
| **JWT** | Authentication |
| **bcryptjs** | Password hashing |
| **Razorpay** | Payments (donations) |
| **jsPDF** | Server-side certificate generation |

---

## Project Structure

```
Corporate Social Responsibility/
├── backend/
│   ├── middleware/        # auth, adminAuth, checkRole
│   ├── models/           # User, Project, News, Volunteer, Comment, Contact, Certificate, Donation
│   ├── routes/           # auth, projects, publicProjects, news, volunteers, comments, contact, certificates, users, admin, payments
│   ├── scripts/          # seedComments, seedSampleData
│   ├── server.js
│   ├── seed.js
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/   # layout, auth, comments, certificates, forms, ui
    │   ├── context/     # AuthContext, ThemeContext
    │   ├── pages/       # Home, About, Projects, News, GetInvolved, Contact, Login, Register, admin/*
    │   ├── services/    # API layer
    │   └── ...
    ├── index.html
    └── package.json

```

---

## Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB** (local or Atlas)
- **Razorpay** account (optional; for donations)

### 1. Clone and install

```bash
# From repo root
cd "Corporate Social Responsibility"

# Backend
cd backend
npm install

# Frontend (from repo root)
cd frontend
npm install
```

### 2. Environment variables

**Backend** — copy `backend/.env.example` to `backend/.env` and set:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (e.g. `5000`) |
| `MONGODB_URI` | MongoDB connection string (e.g. `mongodb://localhost:27017/csr-web`) |
| `NODE_ENV` | `development` or `production` |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `RAZORPAY_KEY_ID` | Razorpay key (optional; for payments) |
| `RAZORPAY_KEY_SECRET` | Razorpay secret (optional) |
| `RAZORPAY_WEBHOOK_SECRET` | Optional; for payment webhooks |

**Frontend** — ensure `src/config.js` has the correct `API_BASE_URL` (e.g. `http://localhost:5000`). For Razorpay checkout, set `VITE_RAZORPAY_KEY_ID` in a `.env` file if needed.

### 3. Run the app

```bash
# Terminal 1 — backend
cd backend
npm run dev

# Terminal 2 — frontend
cd frontend
npm run dev
```

- Backend: usually `http://localhost:5000`
- Frontend: usually `http://localhost:5173`

### 4. Seed data (optional)

```bash
cd backend
npm run seed
```

---

## API Overview

- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`
- **Projects (public):** `GET /api/projects`, `GET /api/projects/:id` (with filters and pagination)
- **Projects (admin/NGO):** `POST/PUT/DELETE /admin/projects`, `/ngo/projects`
- **News:** `GET /api/news`, `GET /api/news/:id`; admin: `POST/PUT/DELETE /admin/news`
- **Volunteers:** `POST /api/volunteers`; admin: `GET /admin/volunteers`, `PUT /admin/volunteers/:id`
- **Comments:** `GET /api/comments/:projectId`, `POST /api/comments`, `PUT /api/comments/:id/like`
- **Contact:** `POST /api/contact`; admin: `GET/PUT /admin/contact`
- **Certificates:** `POST /api/certificates/validate`, `POST /api/certificates/claim`
- **Payments:** `POST /api/payments/create-order`, `POST /api/payments/verify`, `GET /api/payments/history`
- **Users (admin):** `GET /admin/users`, `PUT /admin/users/:id`

All protected routes use `Authorization: Bearer <token>` or `x-auth-token`. See **`docs/BACKEND.md`** for full request/response details and schemas.

---

## Documentation

| Document | Content |
|----------|---------|
| **`docs/BACKEND.md`** | API endpoints, database schemas, auth, middleware, security, seeding |
| **`docs/FRONTEND.md`** | Frontend architecture, design system, components, state, performance |
| **`docs/FRONTEND_COMPLETE_GUIDE.md`** | Customization index and quick start |
| **`docs/FRONTEND_DETAILED/`** | Step-by-step guides: design system, colors, typography, navigation, buttons, forms, cards, home, about, projects, news, admin, animations, responsive, dark mode, performance, accessibility, build |

Use the **`docs/`** folder for implementation details, customization, and troubleshooting.

---

## Build & Deploy

- **Frontend:** `npm run build` (output in `dist/`), then serve with any static host or reverse proxy.
- **Backend:** Set `NODE_ENV=production`, secure `JWT_SECRET` and MongoDB URI, configure CORS for your frontend origin. Optional: enable Razorpay webhooks and set `RAZORPAY_WEBHOOK_SECRET`.

---

## License

See repository or project license file.
