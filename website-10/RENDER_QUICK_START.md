# Render Deployment - MediaPulse Communications (Website 10)

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
   - Name: `mediapulse-communications`
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
   - Your site will be live at: `https://mediapulse-communications.onrender.com`

## Testing After Deployment

```bash
# Test homepage
curl https://mediapulse-communications.onrender.com/

# Test press releases
curl https://mediapulse-communications.onrender.com/company/press-releases.html

# Test API
curl https://mediapulse-communications.onrender.com/api/press-releases?page=0
```

## Features

- **Homepage:** Branded for MediaPulse Communications with media industry colors
- **Press Releases:** 10 articles about media, communications, publishing
- **Rate Limiting:** 5 requests/minute on press release endpoints
- **Captchas:** ~2 articles require math or image captcha
- **Sub-pages:** Even-numbered articles have details/related/timeline pages

## Troubleshooting

**Build failed?**
- Check that package.json exists in website-10/
- Verify Node.js dependencies: express, cookie-parser, compression

**Service won't start?**
- View logs in Render dashboard
- Ensure PORT env var is set

**404 errors?**
- Check that all HTML files are in website-10/
- Verify public/css/ and public/js/ folders exist

## Support

For issues, check the master deployment guide: `../RENDER_DEPLOYMENT_GUIDE.md`
