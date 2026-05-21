<div align="center">

<h1>🤖 AI Resume Builder & Job Tracker</h1>

<p>A full-stack MERN application that uses AI to tailor your resume for specific job descriptions, gives you an ATS score, and tracks all your job applications in a Kanban board.</p>

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Groq](https://img.shields.io/badge/Groq_AI-F55036?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev)

</div>

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register & login
- 📝 **Resume Builder** — Personal info, experience, education, skills, projects
- 🤖 **AI Resume Tailor** — Paste any JD, get an ATS-optimised resume instantly (powered by Groq / Llama 3.3 70B)
- 📊 **ATS Score Meter** — Visual score from 0–100 for every tailored version
- 💾 **Version History** — Every AI-tailored version is saved and viewable
- 💼 **Kanban Job Tracker** — Track applications across Wishlist → Applied → Interview → Offer → Rejected
- ⚡ **Rate Limiting** — AI endpoint protected (10 requests/hour per user)
- 📱 **Responsive** — Works on mobile and desktop

---

## 🖥️ Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)
> Overview of your job search stats, recent applications, and quick actions.

### Resume Builder
![Resume Builder](./screenshots/resume-builder.png)
> Fill in your details across tabs — Personal Info, Experience, Education, Skills, and Projects.

### AI Tailor
![AI Tailor](./screenshots/ai-tailor.png)
> Paste a job description, click one button, and get a tailored resume with an ATS score and list of improvements.

### Job Tracker (Kanban)
![Job Tracker](./screenshots/job-tracker.png)
> Track every application. Move cards between columns as your status changes.

### AI Versions
![AI Versions](./screenshots/ai-versions.png)
> All your tailored resumes saved in one place with ATS scores.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| AI | Groq API (Llama 3.3 70B) |
| Auth | JWT + bcryptjs |
| HTTP Client | Axios |
| UI Icons | Lucide React |
| Notifications | React Hot Toast |

---

## 📁 Project Structure

```
ai-resume-builder/
├── server/                        ← Node.js + Express backend
│   ├── index.js                   ← App entry point
│   ├── controllers/
│   │   ├── authController.js      ← Register, login, getMe
│   │   ├── resumeController.js    ← Resume CRUD
│   │   ├── jobController.js       ← Job CRUD
│   │   └── aiController.js        ← Groq AI resume tailoring
│   ├── models/
│   │   ├── User.js                ← User schema
│   │   ├── Resume.js              ← Resume + tailored versions schema
│   │   └── Job.js                 ← Job application schema
│   ├── routes/
│   │   ├── auth.js
│   │   ├── resume.js
│   │   ├── jobs.js
│   │   └── ai.js
│   └── middleware/
│       ├── authMiddleware.js      ← JWT verification
│       └── rateLimiter.js         ← AI endpoint rate limiter
│
└── client/                        ← React frontend (Vite)
    └── src/
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── ResumeBuilder.jsx
        │   ├── JobTracker.jsx
        │   ├── TailoredVersions.jsx
        │   ├── Login.jsx
        │   └── Register.jsx
        ├── components/
        │   ├── shared/Navbar.jsx
        │   └── resume/AiTailorPanel.jsx
        ├── context/AuthContext.jsx ← Login state management
        └── utils/api.js            ← Axios instance with JWT
```

---

## 🚀 Local Setup — Step by Step

### Prerequisites
- Node.js v18+ — download from [nodejs.org](https://nodejs.org)
- A free MongoDB Atlas account — [cloud.mongodb.com](https://cloud.mongodb.com)
- A free Groq API key — [console.groq.com](https://console.groq.com)

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-resume-builder.git
cd ai-resume-builder
```

---

### Step 2 — Set up MongoDB Atlas

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → create free account
2. New Project → Build a Cluster → choose **M0 Free**
3. Create a **username** and **password** (save these)
4. Network Access → **Add IP Address** → Allow from Anywhere (`0.0.0.0/0`)
5. Clusters → **Connect** → Drivers → copy the connection string

It looks like:
```
mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/
```

---

### Step 3 — Set up the Backend

```bash
cd server
```

Copy the example env file:
```bash
# Windows
copy .env.example .env

# Mac / Linux
cp .env.example .env
```

Open `server/.env` and fill in your values:
```env
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/ai-resume-builder
JWT_SECRET=any_long_random_string_like_this_abc123xyz456
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
PORT=5000
CLIENT_URL=http://localhost:5173
```

Install dependencies and start:
```bash
npm install
npm run dev
```

✅ You should see:
```
✅ MongoDB connected
🚀 Server running on http://localhost:5000
```

---

### Step 4 — Set up the Frontend

Open a **new terminal window** (keep server running):

```bash
cd client
```

Copy the example env file:
```bash
# Windows
copy .env.example .env

# Mac / Linux
cp .env.example .env
```

The `client/.env` only needs this (already correct for local):
```env
VITE_API_URL=http://localhost:5000
```

Install and start:
```bash
npm install
npm run dev
```

Open **http://localhost:5173** in your browser. The app is running! 🎉

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create account | ❌ |
| POST | `/api/auth/login` | Login, returns JWT | ❌ |
| GET | `/api/auth/me` | Get logged-in user | ✅ |
| GET | `/api/resume` | Get user's resume | ✅ |
| PUT | `/api/resume` | Save / update resume | ✅ |
| GET | `/api/resume/tailored` | Get all AI versions | ✅ |
| DELETE | `/api/resume/tailored/:id` | Delete an AI version | ✅ |
| GET | `/api/jobs` | Get all job applications | ✅ |
| POST | `/api/jobs` | Add a new job | ✅ |
| PUT | `/api/jobs/:id` | Update a job | ✅ |
| DELETE | `/api/jobs/:id` | Delete a job | ✅ |
| POST | `/api/ai/tailor` | Tailor resume with AI (rate-limited: 10/hr) | ✅ |

---

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full step-by-step deployment guide (Railway + Vercel).

---

## 📄 License

MIT — free to use, modify, and share.

---

<div align="center">
Built by <a href="https://github.com/ritesh031">Ritesh Kumar</a> — CSE Graduate | MERN + AI Developer
</div>
