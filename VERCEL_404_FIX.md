# FIX VERCEL 404 ERROR - Complete Solution

## 🔴 Problem: Getting 404 on /pharmacy-demo route

## ✅ SOLUTIONS - Try in Order

---

## SOLUTION 1: Updated vercel.json (DONE)

I've updated your `vercel.json` to the correct format:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

**Now do this:**

```bash
cd med-sight-ai
git add vercel.json public/_redirects
git commit -m "fix: update vercel routing config"
git push origin main
```

**In Vercel Dashboard:**
1. Go to your project
2. Click "Deployments"
3. Wait for auto-deploy OR click "..." → "Redeploy"

---

## SOLUTION 2: Manual Vercel Settings (If SOLUTION 1 doesn't work)

### Delete vercel.json and Configure in Dashboard

1. **Delete vercel.json** (if Solution 1 didn't work):
   ```bash
   rm vercel.json
   git add .
   git commit -m "remove vercel.json"
   git push
   ```

2. **Go to Vercel Dashboard** → Your Project → Settings

3. **Build & Development Settings:**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Rewrites in Vercel Dashboard:**
   - Go to Settings → Rewrites
   - Add rule:
     - Source: `/(.*)`
     - Destination: `/index.html`

5. **Redeploy**

---

## SOLUTION 3: Check Build Output

### Verify your build works locally:

```bash
cd med-sight-ai

# Build
npm run build

# Check dist folder
ls dist

# Should show:
# index.html
# assets/
# vite.svg
```

### Preview locally:
```bash
npm run preview
```

Visit: http://localhost:4173/pharmacy-demo

**Does it work locally?**
- ✅ YES → Vercel config issue (continue below)
- ❌ NO → Build issue (check console errors)

---

## SOLUTION 4: Vercel Environment Variables

### Make sure these are set in Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables

2. Add these for **Production, Preview, Development**:

```
VITE_BACKEND_URL = https://your-backend.onrender.com
VITE_DORRA_BASE_URL = https://hackathon-api.aheadafrica.org
VITE_DORRA_TOKEN = SZDEP55BKX:1b7U9tlS0HQT-bMiao9gJnLrQNEi3f-oAyjYIx2Hn9M
```

3. **After adding env vars, REDEPLOY:**
   - Deployments → Click "..." on latest → Redeploy

---

## SOLUTION 5: Check Vercel Deployment Logs

### Debug build errors:

1. Go to Vercel Dashboard → Deployments
2. Click on latest deployment
3. Click "Building"
4. Check for errors in logs

**Common errors:**

### Error: "Module not found"
**Fix:**
```bash
npm install
git add package-lock.json
git commit -m "update dependencies"
git push
```

### Error: "Build failed"
**Fix:** Check TypeScript errors:
```bash
npm run build
# Fix any errors shown
```

---

## SOLUTION 6: Force Vercel to Rebuild

### Clear cache and redeploy:

1. Go to Vercel Dashboard → Settings → General
2. Scroll to "Deployment Protection"
3. Click "Redeploy" with **"Use existing Build Cache" UNCHECKED**

---

## SOLUTION 7: Manual Routing File

If Vercel still doesn't respect `vercel.json`, add `routes` instead:

Create `vercel.json`:
```json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

```bash
git add vercel.json
git commit -m "fix: add routes config"
git push
```

---

## SOLUTION 8: Check React Router Setup

Verify your router is correct:

**File:** `src/main.tsx`

Should have:
```typescript
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
```

**File:** `src/App.tsx`

Should have:
```typescript
import { Routes, Route } from 'react-router-dom'

<Routes>
  <Route path="/pharmacy-demo" element={<PharmacyDemoPage />} />
  <Route path="/pharmacy" element={<PharmacistView />} />
  <Route path="/pharmacy/:token" element={<PharmacistView />} />
  {/* other routes */}
</Routes>
```

---

## SOLUTION 9: Test Specific 404 Issues

### Which URLs are 404ing?

| URL | Expected | What to Check |
|-----|----------|---------------|
| `/` | Homepage | ✅ Should work |
| `/pharmacy-demo` | Demo page | ❌ This is your issue |
| `/pharmacy/DEMO-001` | Prescription | Needs routing fix |
| `/assets/index.js` | JS file | Build issue |

### If ONLY `/pharmacy-demo` is 404:

**Problem:** Vercel routing not working

**Fix:** Use Solution 1 or Solution 7

### If ALL routes are 404:

**Problem:** Build failed or wrong output directory

**Fix:**
1. Check Vercel logs
2. Verify `dist` folder has `index.html`
3. Check Output Directory setting = `dist`

---

## SOLUTION 10: Nuclear Option - Recreate Deployment

### Start fresh:

1. **Delete project from Vercel**
   - Vercel Dashboard → Settings → Delete Project

2. **Push latest code to GitHub**
   ```bash
   git add .
   git commit -m "fix: vercel deployment config"
   git push
   ```

3. **Import again:**
   - Go to Vercel → New Project
   - Import from GitHub
   - **IMPORTANT:** Use these settings:
     - Framework: **Vite**
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Root Directory: `./` (default)

4. **Add environment variables** (Solution 4)

5. **Deploy**

---

## 🔍 DEBUGGING CHECKLIST

Run through this checklist:

**Local Build:**
- [ ] `npm run build` succeeds
- [ ] `npm run preview` works
- [ ] `/pharmacy-demo` works at http://localhost:4173/pharmacy-demo

**Files Committed:**
- [ ] `vercel.json` is in root of med-sight-ai folder
- [ ] `public/_redirects` exists
- [ ] `.gitignore` doesn't exclude `vercel.json`

**Vercel Settings:**
- [ ] Framework = Vite
- [ ] Output Directory = `dist`
- [ ] Environment variables set
- [ ] Latest commit is deployed

**Deployment:**
- [ ] Build succeeded (check logs)
- [ ] `index.html` exists in deployment
- [ ] No TypeScript errors

---

## 🎯 QUICK FIX - Do This Right Now

```bash
# 1. Update files
cd med-sight-ai

# 2. Commit changes
git add vercel.json public/_redirects
git commit -m "fix: vercel routing for SPA"
git push origin main

# 3. Go to Vercel Dashboard
# 4. Deployments → Wait for auto-deploy
# 5. Visit: https://your-app.vercel.app/pharmacy-demo
```

---

## 📊 What URLs Should Work

After fix:

| URL | Should Work? |
|-----|--------------|
| `https://your-app.vercel.app/` | ✅ YES |
| `https://your-app.vercel.app/pharmacy-demo` | ✅ YES |
| `https://your-app.vercel.app/pharmacy` | ✅ YES |
| `https://your-app.vercel.app/pharmacy/DEMO-001` | ✅ YES |

---

## 🆘 STILL NOT WORKING?

### Share these with me:

1. **Vercel deployment URL:** `https://_____.vercel.app`
2. **Which URL is 404?** (exact URL)
3. **Vercel build logs:** (copy/paste error)
4. **Does local preview work?** (`npm run preview`)

### Check Vercel Function Logs:

1. Vercel Dashboard → Your Project
2. Click "Functions" tab
3. Look for errors

---

## ✅ EXPECTED RESULT

After applying fixes:

```
Visit: https://your-app.vercel.app/pharmacy-demo

✅ Should see: "Pharmacy Demo Page" with demo tokens
❌ Should NOT see: 404 error
```

**The fix I made should work - just commit and push!**
