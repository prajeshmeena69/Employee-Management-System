# 🏢 Employee Management System (EMS)

A full-stack, multi-tenant Employee Management System built with **Node.js**, **Express**, **MongoDB Atlas**, and a **Vanilla JS frontend** with a futuristic dark gold UI.

## 🌐 Live Links

| Service | URL |
|---|---|
| 🖥️ Frontend | https://ems-frontend-6z6e.onrender.com |
| ⚙️ Backend API | https://employee-management-system-p2iq.onrender.com |

> ⚠️ Note: Render free tier sleeps after 15 minutes of inactivity. First request may take 30-60 seconds to wake up. This is normal.

---

## 📸 Features

- 🔐 **Company Authentication** — Signup, Login, Logout with JWT tokens
- 🏢 **Multi-tenant Architecture** — Each company sees only their own employees
- 👤 **Employee CRUD** — Add, View, Edit, Delete employees
- 🔍 **Search** — Search employees by name or department
- 📊 **Live Dashboard** — Real-time stats, department breakdown, quick metrics
- 🎨 **Futuristic UI** — Dark theme with gold accents, animations, custom cursor
- ☁️ **Cloud Database** — MongoDB Atlas (free tier)

---

## 🗂️ Project Structure

```
Employee Management System/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── employeeController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── companyModel.js
│   │   └── employeeModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── employeeRoutes.js
│   ├── .env
│   ├── app.js
│   └── server.js
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   ├── home.html
│   ├── index.html
│   ├── login.html
│   └── signup.html
│
└── README.md
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| Frontend | HTML, CSS, Vanilla JavaScript |
| Fonts | Syne, DM Sans, JetBrains Mono |
| Icons | Font Awesome 6 |
| Architecture | MVC (Model-View-Controller) |
| Deployment | Render (Backend + Frontend) |

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js installed
- MongoDB Atlas account (free)
- VS Code

### 1. Clone the Repository

```bash
git clone https://github.com/prajeshmeena69/Employee-Management-System.git
cd Employee-Management-System
```

### 2. Setup Backend

```bash
cd backend
npm install
```

### 3. Create `.env` File

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 4. Start Backend Server

```bash
node server.js
```

You should see:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
Server running on port 5000
```

### 5. Open Frontend

- Open `frontend/home.html` with **Live Server** in VS Code
- Or open it directly in your browser

---

## 🔌 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new company |
| POST | `/api/auth/login` | Login and receive JWT token |

### Employee Routes (Protected — requires Bearer token)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/employees` | Get all employees |
| POST | `/api/employees` | Add new employee |
| GET | `/api/employees/:id` | Get single employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |
| GET | `/api/employees/search?name=xyz` | Search by name or department |

---

## 👤 Employee Fields

| Field | Type | Notes |
|---|---|---|
| employeeId | String | Auto-generated (EMP0001, EMP0002...) |
| fullName | String | Required |
| email | String | Unique per company |
| phoneNumber | String | Required |
| department | String | Required |
| designation | String | Required |
| salary | Number | Must be positive |
| dateOfJoining | Date | Required |
| employmentType | String | Full-time / Part-time / Contract |
| status | String | Active (default) / Inactive |
| companyId | ObjectId | Auto-linked to logged-in company |

---

## 🔐 How Authentication Works

1. Company registers via `/api/auth/signup`
2. Password is **hashed with bcrypt** before saving
3. On login, a **JWT token** is returned (valid 7 days)
4. Every employee API request requires the token in the header:
```
Authorization: Bearer <token>
```
5. Backend verifies the token and filters employees by `companyId`
6. No company can ever access another company's data

---

## 🌐 Deployment (Render)

### Backend
- Platform: [Render](https://render.com)
- Type: Web Service
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables: `PORT`, `MONGO_URI`, `JWT_SECRET`, `NODE_ENV`
- Live URL: https://employee-management-system-p2iq.onrender.com

### Frontend
- Platform: [Render](https://render.com)
- Type: Static Site
- Root Directory: `frontend`
- Publish Directory: `.`
- Live URL: https://ems-frontend-6z6e.onrender.com

---

## 📄 Pages

| Page | File | Description |
|---|---|---|
| Home | `home.html` | Landing page with features |
| Login | `login.html` | Company login |
| Signup | `signup.html` | Company registration |
| Dashboard | `index.html` | Main HR dashboard |

---

## 👨‍💻 Developed By

**Prajesh Singh Meena**
KIET Academic Projects — 4th Semester
AI Driven Full Stack Development

---

## 📝 License

This project is for academic purposes only.
