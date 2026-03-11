# 🎵 Spotify Clone (MERN Stack)

[![Frontend - Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=flat-square&logo=vercel)](https://spotify-frontend-ashy-delta.vercel.app/)
[![Backend - Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render)](https://spotify-backend-77s2.onrender.com/)

A full-stack, responsive music streaming platform built with the MERN stack. Features a sleek "Frosted Glass" (Glassmorphism) UI, JWT-based authentication with manual token injection, and cloud-based audio storage via ImageKit.

## 🏗️ System Architecture



The application follows a decoupled architecture:
- **Frontend**: React (Vite) deployed on Vercel.
- **Backend**: Node.js/Express deployed on Render.
- **Database**: MongoDB Atlas.
- **Storage**: ImageKit.io for media assets.

---

## 🛠️ Features & Implementation Details

### 🔐 Security & Auth
- **JWT Authentication**: Implemented via `Authorization: Bearer` headers to bypass cross-site cookie restrictions in modern browsers.
- **Role-Based Access (RBAC)**: Distinct permissions for `Artist` (upload/manage) and `User` (listen/browse) roles.
- **Password Protection**: Industry-standard hashing using `Bcryptjs`.

### 🎨 UI/UX
- **Glassmorphism Design**: Custom CSS utilizing `backdrop-filter` for a high-end visual aesthetic.
- **Mobile First**: Adaptive media queries transforming the desktop sidebar into a mobile bottom-nav.
- **Persistence**: Token-based session management using `LocalStorage`.

### ☁️ Media Cloud
- Streamlined audio upload pipeline: `Frontend -> Backend -> ImageKit`.
- Optimized metadata storage in MongoDB for fast track fetching.

---

## 🚀 Deployment Instructions

### Backend (Render)
1. Set the **Build Command**: `npm install`
2. Set the **Start Command**: `node src/server.js`
3. Add Environment Variables:
   - `JWT_SECRET`, `MONGO_URI`, `IMAGEKIT_PRIVATE_KEY`, `NODE_ENV=production`

### Frontend (Vercel)
1. Connect your GitHub repository.
2. Override the **Build Command** if necessary (e.g., `npm run build`).
3. Set the Environment Variable for your Backend URL.

---

## 📂 Directory Structure

```text
├── frontend/             # React (Vite) Application
│   ├── src/api/          # Axios interceptors & instance
│   ├── src/components/   # Reusable UI elements
│   └── src/styles/       # Global CSS & Responsive queries
├── backend/              # Express Server
│   ├── src/controllers/  # Business logic
│   ├── src/middlewares/  # Auth & Role verification
│   └── src/models/       # Mongoose Schemas
└── README.md             # This file
