# Render Deployment Guide - 9-Website Portfolio

## Overview

This guide covers deploying all 9 websites (2-10) to Render.com. Each website is an independent Node.js/Express application with its own server, dependencies, and configuration.

**Companies:**
- Website 2: TechVenture Solutions
- Website 3: EcoFlow Industries
- Website 4: FinanceCore Analytics
- Website 5: BioGen Therapeutics
- Website 6: RetailMax Networks
- Website 7: GreenEnergy Corp
- Website 8: CloudScale Innovations
- Website 9: SupplyChain Dynamics
- Website 10: MediaPulse Communications

## Deployment Options

### Option A: Individual Services (Recommended for Testing)
Deploy each website as a separate Render service. Requires 9 service deployments.

### Option B: Monorepo with Multiple Services
Deploy all websites from a single GitHub repository with multiple services pointing to different start commands.

### Option C: Docker Container
Build Docker image with all 9 services, deploy once to Render.

## Prerequisites

- GitHub account with repository containing the 9 websites
- Render.com account (free tier available)
- Git installed locally

## Quick Start: Deploy One Website

### Step 1: Push to GitHub

```bash
cd c:\Users\sbaranwal\Claude\mock websites\Revere
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 2: Connect Render Service

1. Log in to Render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Fill in service settings:

**Service Settings:**
- **Name:** `techventure-solutions` (or appropriate company name)
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start` (or `cd website-2 && npm start`)
- **Plan:** Free or Paid tier
- **Region:** Choose nearest to your location

### Step 3: Configure Environment Variables

In Render dashboard, add environment variables:
- `PORT`: 3000 (Render assigns automatically, but you can override)
- `NODE_ENV`: production
- `RATE_LIMIT_MAX`: 5

### Step 4: Deploy

Click "Deploy" and wait for deployment to complete. Your site will be available at:
`https://techventure-solutions.onrender.com`

## Monorepo Deployment

If deploying all 9 sites from one repository:

1. Create GitHub repository with structure:
```
repo/
├── website-2/
│   ├── server.js
│   ├── package.json
│   └── ...
├── website-3/
│   ├── server.js
│   ├── package.json
│   └── ...
...
```

2. In Render dashboard, create 9 services:

**Service 1 (TechVenture):**
- Build Command: `npm --prefix website-2 install`
- Start Command: `npm --prefix website-2 start`

**Service 2 (EcoFlow):**
- Build Command: `npm --prefix website-3 install`
- Start Command: `npm --prefix website-3 start`

(And so on for 3-10)

## Individual Website Deployment URLs

Once deployed, your websites will be available at:

| Website | Company | Render URL |
|---------|---------|-----------|
| 2 | TechVenture Solutions | https://techventure-solutions.onrender.com |
| 3 | EcoFlow Industries | https://ecoflow-industries.onrender.com |
| 4 | FinanceCore Analytics | https://financecore-analytics.onrender.com |
| 5 | BioGen Therapeutics | https://biogen-therapeutics.onrender.com |
| 6 | RetailMax Networks | https://retailmax-networks.onrender.com |
| 7 | GreenEnergy Corp | https://greenenergy-corp.onrender.com |
| 8 | CloudScale Innovations | https://cloudscale-innovations.onrender.com |
| 9 | SupplyChain Dynamics | https://supplychainynamics.onrender.com |
| 10 | MediaPulse Communications | https://mediapulse-communications.onrender.com |

## Features Available After Deployment

### Homepage
- Company-specific branding with industry colors
- Solutions section with 4 offerings
- Featured press releases (first 3 teaser cards)
- Partner/client logos
- Responsive design

### Press Releases Archive
- Paginated view of all 10 press release articles
- "Load More" button fetches next batch via AJAX
- Rate limiting: 5 requests/minute (returns 429 if exceeded)
- Relationship type badges for each article
- Links to full articles

### Individual Articles
- Full article text with metadata
- Relationship type (supplier, joint venture, competitor, etc.)
- ~20% of articles protected by captcha:
  - Math captcha: Solve arithmetic problem
  - Image captcha: Select correct images
- Random popups on ~30% of articles:
  - Newsletter signup modal
  - Cookie consent banner
  - Related articles modal
- Sub-pages on tier 2 sites (websites 3, 5, 7, 9):
  - /press-releases/{id}/details.html
  - /press-releases/{id}/related.html
  - /press-releases/{id}/timeline.html

### Cross-Website Linking
- Articles mention related companies
- Links to other company websites (e.g., techventure.onrender.com/...)
- Network of relationships across all 9 sites

## Rate Limiting

Each site enforces rate limiting on press releases:
- **Max requests:** 5 per minute per IP
- **Response:** HTTP 429 (Too Many Requests)
- **Retry-After header:** Included in response

Example:
```bash
# First 5 requests succeed (200)
curl https://techventure-solutions.onrender.com/api/press-releases
curl https://techventure-solutions.onrender.com/api/press-releases
# ... (3 more times)

# 6th request fails (429)
curl https://techventure-solutions.onrender.com/api/press-releases
# Returns: {"error": "Too many requests. Please try again later."}
```

## Session Management

- Session cookies set for 24 hours
- Tracks captcha completion per session
- Prevents repeated captcha on same session
- In-memory storage (resets on server restart)

## Technical Details

### Middleware Stack
- **express-session:** Session management with 24-hour expiry
- **compression:** gzip compression for response bodies
- **cookie-parser:** Parse Cookie header
- **express.static:** Serve public assets (CSS, JS, images)

### API Endpoints
- `GET /api/press-releases?page=0` - Fetch paginated press releases
  - Query: `page` (0-based index)
  - Rate limit: 5 requests/minute
  - Response: 429 if rate limit exceeded
- `POST /api/verify-captcha` - Verify captcha solution
  - Body: `{ "solution": number, "articleId": string }`
  - Response: `{ "verified": boolean }`

### Error Handling
- **404:** HTML file not found (served from public/)
- **429:** Rate limit exceeded (includes Retry-After header)
- **500:** Server error (logged to console)

### Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security` (HTTPS only)

## Troubleshooting

### Build Fails
- Ensure all dependencies are in package.json
- Check Node.js version (use 16+ for best compatibility)
- Verify no syntax errors in server.js

### Service Won't Start
- Check logs in Render dashboard (Logs tab)
- Verify PORT environment variable
- Ensure start command matches your setup

### 404 Errors
- Verify HTML files exist in website folder
- Check relative paths in links
- Ensure public/ folder has CSS/JS files

### Rate Limiting Too Strict
- Change RATE_LIMIT_MAX in Render environment variables
- Default is 5; increase to 10-20 for more lenient limits

### Cross-Website Links Not Working
- Ensure all 9 services are deployed and running
- Update links in article HTML to use correct deployed URLs
- Check that link format matches service name: `https://service-name.onrender.com/...`

## Monitoring

Once deployed, monitor your sites in Render dashboard:
- Response times
- CPU/Memory usage
- Error logs
- Request volume

## Custom Domain

To use custom domain (e.g., techventure.com):

1. In Render dashboard: Settings → Custom Domain
2. Add your domain
3. Update DNS records at your domain registrar
4. Point to Render nameservers

## Environment-Specific Configuration

### Development
- `NODE_ENV=development`
- `RATE_LIMIT_MAX=100` (permissive)
- Debug logging enabled

### Production (Render)
- `NODE_ENV=production`
- `RATE_LIMIT_MAX=5` (strict)
- Compression enabled
- Security headers enabled

## Next Steps

1. Deploy your first website to Render
2. Test all functionality (homepage, press releases, articles, captchas)
3. Deploy remaining 8 websites
4. Set up custom domains if needed
5. Configure monitoring and alerts
6. Review logs and optimize performance
