# XNC Mock Website - Render Quick Start (5 Minutes)

## 🚀 Deploy in 5 Easy Steps

### Step 1: Create GitHub Repository

```bash
# Go to https://github.com/new
# Repository name: xnc-mock-website
# Visibility: Public
# Create repository
```

### Step 2: Initialize & Push Code

```bash
cd "C:\Users\sbaranwal\Claude\mock websites\Revere"
git init
git add .
git commit -m "XNC Mock Website for Render"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/xnc-mock-website.git
git push -u origin main
```

### Step 3: Deploy on Render

1. Go to https://render.com/
2. Click "New +" → "Web Service"
3. Select GitHub repository: `xnc-mock-website`
4. Configure:
   - **Name:** xnc-mock-website
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Click "Deploy"

### Step 4: Wait for Deployment

- Takes 2-3 minutes
- Status shows "Live" when ready
- You get a URL like: `https://xnc-mock-website.onrender.com`

### Step 5: Test Your Website

Visit:
- **Homepage:** https://xnc-mock-website.onrender.com/
- **Press Releases:** https://xnc-mock-website.onrender.com/company/press-releases.html
- **API:** https://xnc-mock-website.onrender.com/api/press-releases

---

## ✅ What's Deployed

- ✅ Homepage (responsive design)
- ✅ Company overview page (Level 1)
- ✅ Press releases archive with all 100 releases (Level 2)
- ✅ JSON API for press releases
- ✅ Health check endpoint
- ✅ Professional XNC branding

---

## 🔗 Navigation Test

1. Visit homepage
2. Click "Company" dropdown
3. Click "Press Releases"
4. Should see all 100 releases organized by tier

**Expected path:** Home → Company → Press Releases ✅

---

## 📊 What You Get

| Feature | Status |
|---------|--------|
| 100 Press Releases | ✅ Included |
| 2-Level Deep Navigation | ✅ Working |
| Tier 1, 2, 3 | ✅ All visible |
| JSON API | ✅ Available |
| HTTPS/SSL | ✅ Included |
| Auto-redeploy on git push | ✅ Enabled |
| Free Hosting | ✅ Yes |

---

## 🔑 Key Files

- `server.js` - Handles all requests
- `package.json` - Dependencies (Express, EJS)
- `Procfile` - Tells Render how to run
- `*.html` - Website pages
- `mock-website-config.json` - 100 press releases data

---

## 🎯 Live Website URL

After deployment, your website will be at:

```
https://xnc-mock-website.onrender.com/
```

Replace `YOUR_USERNAME` with your GitHub username if custom name.

---

## 📝 Next: Update GitHub Links

Update Render dashboard settings if needed:
- Auto-deploy: Already enabled (on git push)
- Custom domain: Optional (paid feature)
- Environment variables: None required

---

## ❌ If Something Goes Wrong

1. **Check Render logs:** Dashboard → Logs
2. **Verify files committed:** `git log`
3. **Check GitHub:** All files visible at https://github.com/YOUR_USERNAME/xnc-mock-website

For details, see `RENDER_DEPLOYMENT_GUIDE.md`

---

## 🎉 Done!

Your XNC Mock Website is now live on Render!

**Start URL:** https://xnc-mock-website.onrender.com/

Test press release scraping at the Press Releases page!
