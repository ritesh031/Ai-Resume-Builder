# 🚀 Deployment Guide — Railway (Backend) + Vercel (Frontend)

This guide gives you a live URL you can share in interviews and put on your resume.
Both Railway and Vercel are **free** — no credit card needed.

---

## PART 1 — Push Your Code to GitHub

You must push your code to GitHub first before deploying anywhere.

### Step 1 — Install Git
Check if Git is installed:
```bash
git --version
```
If not installed, download from: https://git-scm.com/downloads

---

### Step 2 — Create a GitHub account
Go to https://github.com and create a free account if you don't have one.

---

### Step 3 — Create a new GitHub repository

1. Click the **+** icon (top right) → **New repository**
2. Name it: `ai-resume-builder`
3. Keep it **Public** (so interviewers can see it)
4. Do NOT check "Add README" — we already have one
5. Click **Create repository**

GitHub will show you a page with commands. Keep it open.

---

### Step 4 — Initialise Git in your project

Open terminal in your `ai-resume-builder` folder (the root, not inside server or client):

```bash
git init
```

---

### Step 5 — Create a .gitignore at the root level

Create a file called `.gitignore` in the root `ai-resume-builder/` folder with this content:

```
node_modules/
.env
dist/
.DS_Store
```

> ⚠️ IMPORTANT: The `.env` file must NEVER be pushed to GitHub. It contains your secret keys.

---

### Step 6 — Add all files and make first commit

```bash
git add .
git commit -m "first commit: full stack MERN AI resume builder"
```

---

### Step 7 — Connect to GitHub and push

Copy the two commands from your GitHub page. They look like this
(replace YOUR_USERNAME with your actual GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-resume-builder.git
git branch -M main
git push -u origin main
```

Enter your GitHub username and password when asked.

> If it asks for a password, GitHub no longer accepts passwords — use a Personal Access Token instead.
> Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic) → Generate new token → tick "repo" → copy the token → paste it as your password.

✅ Refresh your GitHub page. You should see all your files there!

---

### Step 8 — Future updates (after making changes to code)

Every time you change something and want to update GitHub:

```bash
git add .
git commit -m "describe what you changed here"
git push
```

---

## PART 2 — Deploy Backend on Railway

Railway gives your Express server a public URL.

### Step 1 — Go to Railway
Visit https://railway.app → Click **Start a New Project** → Sign up with GitHub (recommended)

---

### Step 2 — Create a new project

1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Find and select your `ai-resume-builder` repository
4. Railway will ask which folder — click **Add service** → choose your repo

---

### Step 3 — Configure the server folder

After the project is created:
1. Click on the service card
2. Go to **Settings** tab
3. Under **Root Directory**, type: `server`
4. Under **Start Command**, type: `node index.js`

---

### Step 4 — Add environment variables on Railway

Click the **Variables** tab and add these one by one:

| Key | Value |
|-----|-------|
| `MONGO_URI` | your MongoDB Atlas connection string |
| `JWT_SECRET` | same long random string from your .env |
| `GROQ_API_KEY` | your Groq API key |
| `PORT` | 5000 |
| `CLIENT_URL` | https://your-app.vercel.app ← fill this AFTER deploying frontend |

---

### Step 5 — Deploy

1. Go to **Deployments** tab → click **Deploy**
2. Wait 1–2 minutes
3. Go to **Settings** → scroll to **Networking** → click **Generate Domain**
4. You'll get a URL like: `https://ai-resume-builder-production.up.railway.app`

✅ Test it by opening that URL in your browser. You should see:
```json
{"message":"AI Resume Builder API is running!"}
```

Copy this URL — you'll need it for the frontend.

---

## PART 3 — Deploy Frontend on Vercel

Vercel gives your React app a public URL.

### Step 1 — Go to Vercel
Visit https://vercel.com → Sign up with GitHub

---

### Step 2 — Import your project

1. Click **Add New Project**
2. Find your `ai-resume-builder` repo → click **Import**

---

### Step 3 — Configure build settings

On the configuration page:
- **Framework Preset**: Vite
- **Root Directory**: click **Edit** → type `client`
- **Build Command**: `npm run build` (already filled)
- **Output Directory**: `dist` (already filled)

---

### Step 4 — Add environment variable

Under **Environment Variables**, add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | https://your-railway-url.up.railway.app ← paste your Railway URL |

---

### Step 5 — Deploy

Click **Deploy**. Wait 1–2 minutes.

Vercel gives you a URL like: `https://ai-resume-builder.vercel.app`

✅ Open it in your browser — your full app is live!

---

## PART 4 — Connect Frontend ↔ Backend (Final Step)

Now go back to Railway and update the `CLIENT_URL` variable:

1. Railway → your project → **Variables**
2. Find `CLIENT_URL`
3. Change it to your Vercel URL: `https://ai-resume-builder.vercel.app`
4. Railway will auto-redeploy

✅ Your frontend can now talk to your backend without CORS errors.

---

## PART 5 — Future deployments (when you update code)

Whenever you push changes to GitHub:

```bash
git add .
git commit -m "what you changed"
git push
```

Both Railway and Vercel automatically detect the push and **redeploy within 1–2 minutes**. No manual action needed.

---

## ✅ Final Checklist

- [ ] Code pushed to GitHub (public repo)
- [ ] Backend live on Railway with all env vars set
- [ ] Frontend live on Vercel with `VITE_API_URL` pointing to Railway
- [ ] `CLIENT_URL` on Railway pointing to Vercel URL
- [ ] Tested register, login, resume save, AI tailor on live URL
- [ ] Live URL + GitHub link added to your resume

---

## 🧯 Common Problems & Fixes

**"Cannot connect to MongoDB"**
→ Make sure your MongoDB Atlas cluster allows access from anywhere (0.0.0.0/0) under Network Access.

**"CORS error" in browser console**
→ Make sure `CLIENT_URL` in Railway matches your exact Vercel URL (no trailing slash).

**"Module not found" on Railway**
→ Make sure Root Directory is set to `server` in Railway settings.

**Vercel build fails**
→ Make sure Root Directory is set to `client` and `VITE_API_URL` is set correctly.

**AI tailor gives 429 error**
→ You hit the rate limit (10 requests/hour). Wait an hour or create a new Groq API key.
