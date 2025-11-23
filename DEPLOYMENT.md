# MedSight AI Frontend Deployment Guide

## 🎯 The Pharmacy Demo Issue - SOLVED!

Your pharmacy demo routes (`/pharmacy-demo`, `/pharmacy`, `/pharmacy/:token`) are already in your code! The issue is that when deploying to platforms like Vercel/Netlify, you need to:

1. **Configure routing** so `/pharmacy-demo` doesn't return 404
2. **Set environment variables** to connect to your deployed backend
3. **Build the app** with production settings

## ✅ What I've Fixed for You

### Files Created:
- ✅ `vercel.json` - Vercel deployment config (handles SPA routing)
- ✅ `netlify.toml` - Netlify deployment config (handles SPA routing)
- ✅ `.env.production` - Production environment variables template
- ✅ Updated `.gitignore` - Keeps .env safe, commits .env.production

### How It Works:
Your app has these routes (already in `src/App.tsx`):
```typescript
<Route path="/pharmacy-demo" element={<PharmacyDemoPage />} />
<Route path="/pharmacy" element={<PharmacistView />} />
<Route path="/pharmacy/:token" element={<PharmacistView />} />
```

The deployment configs ensure that when someone visits:
- `https://your-app.vercel.app/pharmacy-demo`
- They get your React app, not a 404!

---

## 🚀 Deploy to Vercel (Recommended - 5 minutes)

### Step 1: Update Backend URL in .env.production

**IMPORTANT:** First deploy your backend to Render, then update this file:

```bash
# Edit .env.production
VITE_BACKEND_URL=https://YOUR-BACKEND-NAME.onrender.com
```

Replace `YOUR-BACKEND-NAME` with your actual Render service name.

### Step 2: Push to GitHub

```bash
cd med-sight-ai
git add .
git commit -m "feat: add deployment configs for pharmacy demo"
git push origin main
```

### Step 3: Deploy on Vercel

**Option A - Quick Deploy:**
1. Go to https://vercel.com/
2. Click "New Project"
3. Import your GitHub repository
4. Vercel auto-detects Vite config
5. Click "Deploy"

**Option B - Using Vercel CLI:**
```bash
npm install -g vercel
vercel login
vercel
```

### Step 4: Set Environment Variables in Vercel

In Vercel Dashboard → Your Project → Settings → Environment Variables:

```
VITE_BACKEND_URL = https://your-backend.onrender.com
VITE_DORRA_BASE_URL = https://hackathon-api.aheadafrica.org
VITE_DORRA_TOKEN = SZDEP55BKX:1b7U9tlS0HQT-bMiao9gJnLrQNEi3f-oAyjYIx2Hn9M
VITE_OLLAMA_API_KEY = eef075af88114bd6bb92f0902bea0632.RfhwfgCMoK8IaChuzPoM_wxL
```

**Set these for:** Production, Preview, and Development

### Step 5: Redeploy (if needed)

If you already deployed before setting environment variables:
- Go to Vercel Dashboard → Deployments
- Click "..." on latest deployment → Redeploy

### Step 6: Test Your Pharmacy Routes!

After deployment, visit:
- ✅ `https://your-app.vercel.app/pharmacy-demo`
- ✅ `https://your-app.vercel.app/pharmacy`
- ✅ `https://your-app.vercel.app/pharmacy/DEMO-001`

All routes should work! 🎉

---

## 🌐 Alternative: Deploy to Netlify

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy on Netlify

1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub and select your repository
4. Netlify auto-detects build settings from `netlify.toml`
5. Click "Deploy site"

### Step 3: Set Environment Variables

In Netlify Dashboard → Site settings → Environment variables:

```
VITE_BACKEND_URL = https://your-backend.onrender.com
VITE_DORRA_BASE_URL = https://hackathon-api.aheadafrica.org
VITE_DORRA_TOKEN = SZDEP55BKX:1b7U9tlS0HQT-bMiao9gJnLrQNEi3f-oAyjYIx2Hn9M
VITE_OLLAMA_API_KEY = eef075af88114bd6bb92f0902bea0632.RfhwfgCMoK8IaChuzPoM_wxL
```

### Step 4: Trigger Redeploy

- Deploys → Trigger deploy → Deploy site

---

## 📋 Build Settings Reference

### Vercel (auto-detected from vercel.json)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Framework:** Vite
- **Node Version:** 18+

### Netlify (auto-detected from netlify.toml)
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Node Version:** 18

---

## 🔧 Manual Build (for testing)

Test your production build locally:

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Then test pharmacy routes:
- http://localhost:4173/pharmacy-demo
- http://localhost:4173/pharmacy/DEMO-001

---

## 🐛 Troubleshooting

### Issue: Routes return 404

**Cause:** Deployment platform doesn't have SPA routing config

**Solution:**
- Vercel: Ensure `vercel.json` is committed
- Netlify: Ensure `netlify.toml` is committed

### Issue: "Cannot connect to backend"

**Cause:** Environment variable not set or wrong URL

**Solution:**
1. Check environment variables in deployment dashboard
2. Verify backend URL is correct: `https://YOUR-SERVICE.onrender.com`
3. Make sure backend is deployed and running
4. Test backend directly: `https://YOUR-SERVICE.onrender.com/health`

### Issue: Pharmacy demo shows empty list

**Cause:** Backend not seeding demo tokens

**Solution:**
1. Check backend logs in Render dashboard
2. Verify auto-seeding is running on startup
3. Test backend endpoint: `GET /api/pharmacy/demo-tokens`

### Issue: CORS errors

**Cause:** Backend not allowing frontend domain

**Solution:**
Your backend already has `cors()` enabled, but if issues persist:
1. Check backend logs for CORS errors
2. Verify backend CORS middleware is active
3. Make sure you're using HTTPS (not HTTP) for both

---

## 📊 Deployment Checklist

### Before Deploying:

- [ ] Backend deployed to Render
- [ ] Backend URL noted (e.g., https://medsight-backend.onrender.com)
- [ ] `.env.production` updated with backend URL
- [ ] `vercel.json` or `netlify.toml` committed
- [ ] `.gitignore` updated (doesn't ignore .env.production)
- [ ] Code pushed to GitHub

### After Deploying:

- [ ] Environment variables set in deployment platform
- [ ] Build completed successfully
- [ ] Homepage loads (`/`)
- [ ] Pharmacy demo route works (`/pharmacy-demo`)
- [ ] Pharmacy view works (`/pharmacy`)
- [ ] Token-based pharmacy works (`/pharmacy/DEMO-001`)
- [ ] Backend connection working
- [ ] No CORS errors

---

## 🎯 Your Deployment URLs

After deployment, fill in:

**Frontend (Vercel/Netlify):** `https://___________________.vercel.app`

**Backend (Render):** `https://___________________.onrender.com`

**Pharmacy Demo:** `https://___________________.vercel.app/pharmacy-demo`

**Pharmacy View:** `https://___________________.vercel.app/pharmacy/DEMO-001`

---

## 🔐 Environment Variables Summary

### Local Development (.env)
```
VITE_BACKEND_URL=http://localhost:4000
```

### Production (.env.production or deployment platform)
```
VITE_BACKEND_URL=https://your-backend.onrender.com
VITE_DORRA_BASE_URL=https://hackathon-api.aheadafrica.org
VITE_DORRA_TOKEN=SZDEP55BKX:1b7U9tlS0HQT-bMiao9gJnLrQNEi3f-oAyjYIx2Hn9M
VITE_OLLAMA_API_KEY=eef075af88114bd6bb92f0902bea0632.RfhwfgCMoK8IaChuzPoM_wxL
```

---

## 📚 How the Pharmacy Routes Work

1. **User visits** `your-app.com/pharmacy-demo`
2. **Vercel/Netlify** serves `index.html` (thanks to rewrite rules)
3. **React Router** loads `PharmacyDemoPage` component
4. **Component fetches** demo tokens from backend API
5. **User clicks** a prescription token
6. **Routes to** `/pharmacy/DEMO-001`
7. **PharmacistView** fetches prescription data from backend

All routes work because of the SPA routing config in `vercel.json`/`netlify.toml`!

---

## 🚀 Quick Deploy Commands

```bash
# Build and test locally
npm run build
npm run preview

# Deploy to Vercel
npm install -g vercel
vercel

# Check deployment
curl https://your-app.vercel.app/pharmacy-demo
```

---

**Your pharmacy demo will work perfectly once deployed!** 🎉
