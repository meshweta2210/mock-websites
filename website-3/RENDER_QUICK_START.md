# Render Deployment - EcoFlow Industries (Website 3)

## Quick Start (< 5 minutes)

### Prerequisites
- GitHub repository with this website folder pushed
- Render.com account

### Steps

1. **Log in to Render** → Click "New +" → "Web Service"

2. **Connect Repository**
   - Select your GitHub repository
   - Branch: `main`

3. **Configure Service**
   - Name: `ecoflow-industries`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Environment Variables** (Optional)
   ```
   PORT=3000
   NODE_ENV=production
   RATE_LIMIT_MAX=5
   ```

5. **Deploy**
   - Click "Deploy" button
   - Wait ~2-3 minutes for build and deployment
   - Your site will be live at: `https://ecoflow-industries.onrender.com`

## Testing After Deployment

```bash
# Test homepage
curl https://ecoflow-industries.onrender.com/

# Test press releases
curl https://ecoflow-industries.onrender.com/company/press-releases.html

# Test API
curl https://ecoflow-industries.onrender.com/api/press-releases?page=0
```

## Features

- **Homepage:** Branded for EcoFlow Industries with environmental green color scheme
- **Press Releases:** 10 articles about sustainability, environmental initiatives, partnerships
- **Rate Limiting:** 5 requests/minute on press release endpoints
- **Captchas:** ~2 articles require math or image captcha
- **Sub-pages:** Even-numbered articles have details/related/timeline pages

## Troubleshooting

**Build failed?**
- Check that package.json exists in website-3/
- Verify Node.js dependencies: express, cookie-parser, compression

**Service won't start?**
- View logs in Render dashboard
- Ensure PORT env var is set

**404 errors?**
- Check that all HTML files are in website-3/
- Verify public/css/ and public/js/ folders exist

## Support

For issues, check the master deployment guide: `../RENDER_DEPLOYMENT_GUIDE.md`
