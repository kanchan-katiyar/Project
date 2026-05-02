# TaskFlow Pro - Project Management Web App

A full-stack web application for managing projects and assigning tasks, built with the React + Express + Prisma (SQLite) stack. Perfect for student projects, team collaboration, and task tracking.

## 🚀 Key Features
- **Authentication**: Secure Signup and Login using JWT.
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Create projects, assign tasks, and track overall progress.
  - **Member**: View assigned tasks and update task statuses.
- **Dashboard**: Centralized hub showing tasks, statuses, and project overviews.
- **REST APIs**: Full CRUD operations for projects and tasks.
- **Dynamic UI**: Custom CSS with glassmorphism, responsive grids, and clean typography.

## 🛠 Technology Stack
- **Frontend**: React.js (Vite), React Router, Axios, Custom CSS.
- **Backend**: Node.js, Express.js.
- **Database**: SQLite (via Prisma ORM).
- **Security**: JWT for auth, bcryptjs for password hashing.

## ⚙️ Local Development Setup

1. **Clone the repository** (if applicable) and navigate to the root directory.

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npx prisma db push
   npx prisma generate
   npm start
   ```
   *The backend will run on http://localhost:5000*

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The frontend will be available at http://localhost:5173*

## 🌐 Deployment Instructions

### Render (Recommended for Free Tier)
1. Push this code to a GitHub repository.
2. Go to [Render](https://render.com/) and create a new **Web Service** for the backend.
   - Root Directory: `backend`
   - Build Command: `npm install && npx prisma db push && npx prisma generate`
   - Start Command: `npm start`
   - Add Environment Variables: `JWT_SECRET=your_secret`, `PORT=5000`, `DATABASE_URL=file:./dev.db`
   - **Important**: Choose a free disk or upgrade to avoid SQLite database wipe on restart, or switch the Prisma provider to `postgresql` and use a free Render PostgreSQL database.
3. Create a new **Static Site** for the frontend.
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - *Ensure you update the API base URL in the frontend Axios calls from `localhost:5000` to your Render backend URL.*

### Railway (Alternative)
1. Connect your repo to [Railway](https://railway.app/).
2. Railway will automatically detect the `frontend` and `backend` folders if you set up mono-repo services.
3. For the backend, add a `DATABASE_URL` (SQLite or Railway's Postgres if you update Prisma) and `JWT_SECRET`.

## 🧑‍💻 How to Use
1. The **first user** who signs up will automatically become the **Admin**.
2. Any subsequent signups will become **Members**.
3. The Admin can create Projects from the Dashboard.
4. Click on a Project to view details and assign Tasks to Members.
5. Members log in to see their tasks and change statuses (Pending -> In Progress -> Completed).
