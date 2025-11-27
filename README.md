# 🚀 MERN Project Manager – Full Stack Application

A fully functional **project and task management application** built using the **MERN stack** (MongoDB, Express.js, React, Node.js).
Designed with **clean UI/UX**, **authentication**, **task board workflow**, and deployed like a real production system.

🔹 Built from scratch while learning MERN
🔹 Follows **professional development practices** (Git, modular code, API standards)
🔹 Responsive & modern design using **Tailwind CSS v4 + React**

---

## 🌍 Live Demo

🔗 **Frontend (Vercel):** [https://mern-project-manager-seven.vercel.app](https://mern-project-manager-seven.vercel.app)
🔗 **Backend (Render):** [https://mern-project-manager-api.onrender.com/api/health](https://mern-project-manager-api.onrender.com/api/health)

💡 *Use Register to create a new account and try the app.*

---

## 📸 Screenshots

| Login                                        | Projects Page                                      | Task Board                                       |
| -------------------------------------------- | -------------------------------------------------- | ------------------------------------------------ |
| ![Login Screenshot](./screenshots/login.png) | ![Projects Screenshot](./screenshots/projects.png) | ![Tasks Screenshot](./screenshots/taskboard.png) |

---

## 🧠 Features

✔ User authentication (JWT-based)
✔ Create & manage projects
✔ Task management with **drag-style statuses (todo/progress/completed)**
✔ Clean UI with **Tailwind CSS v4**
✔ Toast notifications & loading state feedback
✔ Protected routes (only logged-in users)
✔ Deployed on **Vercel + Render + MongoDB Atlas**

---

## 🛠️ Tech Stack

| Component      | Technology                          |
| -------------- | ----------------------------------- |
| Frontend       | React, Vite, Tailwind CSS v4        |
| Backend        | Node.js, Express.js                 |
| Database       | MongoDB Atlas                       |
| Authentication | JWT (JSON Web Token)                |
| Deployment     | Frontend → Vercel, Backend → Render |
| Tools          | Git, Postman, VS Code               |

---

## 🏗️ Project Architecture

```
Frontend (Vercel) → Axios → Backend API (Render) → MongoDB Atlas
                  ↖ JWT token stored in localStorage ↙
```

---

## 📦 Installation & Local Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Sanjay-Mudela/mern-project-manager.git
cd mern-project-manager
```

---

### 2️⃣ Setup Backend

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```env
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
CLIENT_ORIGIN=http://localhost:5173
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Setup Frontend

```bash
cd ../client
npm install
```

Create a `.env.local` file in `/client`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

Open: **[http://localhost:5173](http://localhost:5173)**

---

## 🚀 Deployment Guide

### Backend (Render)

1. Connect GitHub repo
2. Set root directory to `server`
3. Add env variables:

   ```
   MONGO_URI=...
   JWT_SECRET=...
   CLIENT_ORIGIN=https://your-vercel-domain.vercel.app
   ```
4. Set **Start Command:** `npm start`

---

### Frontend (Vercel)

1. Connect GitHub repo
2. Set root directory to `client`
3. Add:

   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
   ```
4. Deploy 🎉

---

## 📕 API Reference (Example)

### ✔ Register

```
POST /api/auth/register
```

### ✔ Login

```
POST /api/auth/login
```

### ✔ Get Projects

```
GET /api/projects
Authorization: Bearer <token>
```

…and more.

---

## 📈 What I Learned

* How frontend sends requests to backend and handles responses
* JWT authentication and secure API route protection
* Structuring a full MERN project from scratch
* Writing clean React components using hooks
* Error handling & backend validation
* Deployment using **Vercel & Render**
* Git best practices and commit conventions
* UI/UX improvements using Tailwind and animations

---

## 🎯 Future Improvements

* Drag & drop task management (Kanban board)
* Add admin/team collaboration
* Dark/light mode
* Export project reports
* Add task deadlines and reminders

---

## 📬 Contact

👤 **Sanjay Singh Mudela**
📧 [sanjaymudela@gmail.com](mailto:sanjaymudela@gmail.com)
🔗 GitHub: [https://github.com/Sanjay-Mudela](https://github.com/Sanjay-Mudela)
🔗 LinkedIn: [https://linkedin.com/in/sanjay-mudela](https://linkedin.com/in/sanjay-mudela)

---

## 🌟 If you like this project

```bash
⭐ Star the repo
```

Or reach out—I'd love feedback!


