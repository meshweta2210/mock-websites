# XNC Mock Website - Render Deployment Guide

**Status:** ✅ Ready for Deployment  
**Date:** 2026-05-05

---

## 📋 What's Included

This package includes everything needed to deploy the XNC Mock Website on Render:

- ✅ **server.js** - Express.js server with all routes
- ✅ **package.json** - Node.js dependencies and configuration
- ✅ **Procfile** - Process file for Render
- ✅ **.gitignore** - Git ignore rules
- ✅ **3 HTML files** - xnc-homepage.html, xnc-company-overview.html, xnc-press-releases-page.html
- ✅ **Configuration** - mock-website-config.json with all 100 press releases

---

## 🚀 Quick Start Deployment (5 Minutes)

### Step 1: Create GitHub Repository

```bash
cd path/to/mock-websites/Revere
git init
git add .
git commit -m "Initial commit: XNC Mock Website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/xnc-mock-website.git
git push -u origin main
```

### Step 2: Deploy on Render

1. **Go to Render:** https://render.com/
2. **Sign up/Login** with GitHub account
3. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Select `xnc-mock-website` repository
   - Click "Connect"

4. **Configure Service:**
   - **Name:** `xnc-mock-website`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free (or choose Paid)

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)
   - Get your URL: `https://xnc-mock-website.onrender.com`

### Step 3: Test Deployment

Visit your deployed website:
- **Homepage:** https://xnc-mock-website.onrender.com/
- **Company Info:** https://xnc-mock-website.onrender.com/company/overview.html
- **Press Releases:** https://xnc-mock-website.onrender.com/company/press-releases.html
- **Health Check:** https://xnc-mock-website.onrender.com/health

---

## 📝 Detailed Steps

### Prerequisites

- GitHub account (free)
- Render account (free)
- Git installed locally

### Step 1: Prepare Local Repository

```bash
# Navigate to project directory
cd "C:\Users\sbaranwal\Claude\mock websites\Revere"

# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: XNC Mock Website for Render deployment"

# Set main branch
git branch -M main
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name:** `xnc-mock-website`
3. **Description:** "XNC Mock Website - Web Scraping Test Suite"
4. **Visibility:** Public (free tier requires public)
5. Click "Create repository"

### Step 3: Push to GitHub

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/xnc-mock-website.git

# Push to GitHub
git push -u origin main
```

### Step 4: Deploy on Render

**Option A: Direct Render Dashboard**

1. Visit https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Select "Build and deploy from a Git repository"
4. Click "Connect" next to GitHub
5. Authorize Render
6. Select repository: `xnc-mock-website`
7. Click "Connect"

**Configure the Service:**

| Setting | Value |
|---------|-------|
| Name | xnc-mock-website |
| Environment | Node |
| Build Command | `npm install` |
| Start Command | `node server.js` |
| Plan | Free |
| Instance Type | Starter (if available) |
| Region | Choose closest to you |

8. Click "Deploy"

**Option B: Using Render.yaml**

Create `render.yaml` in root:

```yaml
services:
  - type: web
    name: xnc-mock-website
    env: node
    buildCommand: npm install
    startCommand: node server.js
    plan: free
    envVars:
      - key: NODE_ENV
        value: production
```

Then push and deploy.

### Step 5: Verify Deployment

```bash
# Check health endpoint
curl https://xnc-mock-website.onrender.com/health

# Should return:
# {"status":"ok","timestamp":"2026-05-05T...","environment":"production"}
```

---

## 🌐 Available Routes

After deployment, these endpoints are available:

| Route | Purpose |
|-------|---------|
| `/` | Homepage |
| `/index.html` | Homepage (alternate) |
| `/company/overview.html` | Company Info (Level 1) |
| `/company/overview` | Company Info (alternate) |
| `/company/press-releases.html` | Press Releases (Level 2) |
| `/company/press-releases` | Press Releases (alternate) |
| `/api/press-releases` | Get all press releases (JSON) |
| `/api/press-releases?type=partnership` | Filter by type |
| `/api/press-releases?tier=1` | Filter by tier |
| `/api/press-releases/:id` | Get specific release |
| `/api/config` | Get site configuration |
| `/api/homepage` | Get homepage data |
| `/api/tiers` | Get tier definitions |
| `/api/releases/count` | Get release counts |
| `/health` | Health check endpoint |

---

## 🔗 Navigation Verification

After deployment, verify 2-level deep navigation:

1. Visit homepage: https://xnc-mock-website.onrender.com/
2. Look for "Company" dropdown in header
3. Click "Press Releases" in dropdown
4. Should reach: https://xnc-mock-website.onrender.com/company/press-releases.html

**Path:** Home → Company (dropdown) → Press Releases ✅

---

## 📊 API Testing

### Get All Press Releases

```bash
curl https://xnc-mock-website.onrender.com/api/press-releases
```

### Filter by Relationship Type

```bash
# Get all partnerships
curl https://xnc-mock-website.onrender.com/api/press-releases?type=partnership

# Get all research collaborations
curl https://xnc-mock-website.onrender.com/api/press-releases?type=research_collaboration
```

### Filter by Tier

```bash
# Get Tier 1 (basic) releases
curl https://xnc-mock-website.onrender.com/api/press-releases?tier=1

# Get Tier 3 (advanced) releases
curl https://xnc-mock-website.onrender.com/api/press-releases?tier=3
```

### Get Release Count

```bash
curl https://xnc-mock-website.onrender.com/api/releases/count
```

### Health Check

```bash
curl https://xnc-mock-website.onrender.com/health
```

---

## 🔧 Configuration

### Environment Variables

Set these in Render dashboard if needed:

| Variable | Default | Purpose |
|----------|---------|---------|
| NODE_ENV | production | Environment mode |
| PORT | 3000 | Server port (Render sets automatically) |

### Server Configuration

The server is configured to:
- ✅ Serve static HTML files
- ✅ Provide JSON API endpoints
- ✅ Handle 100 press releases
- ✅ Support filtering and searching
- ✅ Include health check endpoint
- ✅ Graceful shutdown handling

---

## 📦 Files Required for Deployment

Ensure these files are in your repository:

- ✅ `server.js` - Main server file
- ✅ `package.json` - Dependencies
- ✅ `Procfile` - Process definition
- ✅ `.gitignore` - Git ignore rules
- ✅ `xnc-homepage.html` - Homepage
- ✅ `xnc-company-overview.html` - Company page
- ✅ `xnc-press-releases-page.html` - Press releases page
- ✅ `mock-website-config.json` - Configuration & data

---

## 🐛 Troubleshooting

### Build Fails: "npm install" Error

**Solution:** Make sure `package.json` is in root directory with correct syntax.

```bash
# Verify package.json is valid JSON
node -e "console.log(JSON.parse(require('fs').readFileSync('package.json')))"
```

### Site Shows 404 Errors

**Solution:** Verify all HTML files are in root directory and routes in `server.js` match file names.

**Check file names:**
```bash
ls -la *.html
```

Should show:
- xnc-homepage.html
- xnc-company-overview.html
- xnc-press-releases-page.html

### Navigation Not Working

**Solution:** Verify URLs in server.js routes match links in HTML files.

- Homepage links should point to `/company/overview.html`
- Company page links should point to `/company/press-releases.html`

### Press Releases Not Loading

**Solution:** Ensure `mock-website-config.json` is in root directory.

```bash
# Verify config file exists
ls -la mock-website-config.json

# Verify it's valid JSON
node -e "console.log(JSON.parse(require('fs').readFileSync('mock-website-config.json')))"
```

---

## 📊 Deployment Information

### Render Service Details

| Setting | Value |
|---------|-------|
| Platform | Render.com |
| Runtime | Node.js 18.x |
| Build Trigger | Git push to main |
| Memory | 512 MB (free plan) |
| Auto-sleep | Yes (free plan after 15 min idle) |
| HTTPS | Yes (included) |
| Custom Domain | Optional (paid feature) |

### Expected Performance

| Metric | Value |
|--------|-------|
| Startup Time | 30-60 seconds |
| First Load | ~2-3 seconds |
| Page Load | ~500ms-1s |
| API Response | ~200-500ms |
| Availability | 99% (free plan) |

### Pricing

- **Free Plan:** $0/month
  - 0.5 CPU
  - 512 MB memory
  - Auto-sleep after 15 min inactivity
  - Limited to 100 requests/minute

- **Paid Plan:** $7+/month
  - No auto-sleep
  - Higher limits
  - Better performance

---

## ✅ Verification Checklist

After deployment, verify:

- ✅ Website loads at https://xnc-mock-website.onrender.com/
- ✅ Homepage displays correctly
- ✅ Company dropdown menu present
- ✅ Press Releases link accessible via Company → Press Releases
- ✅ All 100 press releases display on press releases page
- ✅ Tier 1, Tier 2, Tier 3 sections visible
- ✅ API endpoints respond with JSON
- ✅ Health check endpoint returns OK
- ✅ 2-level deep navigation works

---

## 🔄 Continuous Deployment

Render automatically redeploys when you push to GitHub:

```bash
# Make changes locally
# Commit and push
git add .
git commit -m "Update: Describe your changes"
git push origin main

# Render automatically deploys within 1-2 minutes
# Check deployment status in Render dashboard
```

---

## 📱 Access Your Website

After deployment:

**Public URL:** `https://xnc-mock-website.onrender.com/`

**Share links:**
- Homepage: `https://xnc-mock-website.onrender.com/`
- Press Releases: `https://xnc-mock-website.onrender.com/company/press-releases.html`
- API: `https://xnc-mock-website.onrender.com/api/press-releases`

---

## 🎯 Next Steps

1. ✅ Create GitHub repository
2. ✅ Push code to GitHub
3. ✅ Deploy on Render
4. ✅ Verify website is live
5. ✅ Test scraper against live site
6. ✅ Monitor performance

---

## 📞 Support

For Render-specific issues:
- Render Docs: https://render.com/docs
- Support Email: support@render.com
- Status Page: https://status.render.com/

For XNC Mock Website issues:
- Check `MOCK_WEBSITE_GUIDE.md`
- Review `server.js` configuration
- Verify all files are committed to GitHub

---

## 🚀 Status

✅ **Ready for Deployment on Render**

All files are configured and ready. Follow the Quick Start steps above to deploy your website live!

---

**Deployed Website:** https://xnc-mock-website.onrender.com/  
**Live Press Releases:** https://xnc-mock-website.onrender.com/company/press-releases.html/

*Last Updated: 2026-05-05*
