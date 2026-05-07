# XNC Mock Website - Deployment Guide

## Overview

This is a complete, production-ready mock website for **XNC** (Advanced Life Sciences Solutions), styled after the OXB.com professional biotech company design. The website is designed to test web scraping solutions' ability to extract company relationships from press releases.

**Navigation Structure:**
```
Home (/)
  ├── Solutions (dropdown)
  ├── Company (dropdown)
  │   ├── About XNC → /company/overview.html (Level 1)
  │   ├── Leadership
  │   ├── Our Story
  │   └── Press Releases → /company/press-releases.html (Level 2 - Final destination)
  ├── Resources
  └── Contact
```

**Press Releases:** All 100 releases (Tiers 1-3) available on press releases page at 2 levels deep from homepage.

---

## File Structure

```
mock-websites/Revere/
├── xnc-homepage.html              (Main homepage)
├── xnc-company-overview.html      (Company info page - Level 1)
├── xnc-press-releases-page.html   (Press releases page - Level 2)
├── mock-website-config.json       (Original config with all press release data)
├── MOCK_WEBSITE_GUIDE.md          (Original comprehensive guide)
└── XNC_DEPLOYMENT_GUIDE.md        (This file)
```

---

## Quick Start (3 Options)

### Option 1: Static HTML (Simplest - Recommended for Testing)

**Setup:**
1. Copy all three HTML files to your web root/folder
2. Serve with any static web server (Python, Node, etc.)
3. Navigate to `http://localhost:PORT/xnc-homepage.html`

**Python (Simple HTTP Server):**
```bash
cd path/to/mock-websites/Revere
python -m http.server 8000
# Visit: http://localhost:8000/xnc-homepage.html
```

**Node.js (http-server):**
```bash
npm install -g http-server
cd path/to/mock-websites/Revere
http-server -p 8000
# Visit: http://localhost:8000/xnc-homepage.html
```

**Update file paths in HTML if needed:**
- If serving from root: paths work as-is (`/company/overview.html`)
- If serving from subdirectory: update navigation links accordingly

---

### Option 2: Node.js + Express (Dynamic - Recommended for Production)

**Setup:**
1. Create a new directory: `mkdir xnc-website && cd xnc-website`
2. Initialize Node project: `npm init -y`
3. Install dependencies: `npm install express ejs`
4. Copy the three HTML files and create server.js

**server.js:**
```javascript
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Load config
const config = JSON.parse(fs.readFileSync('./mock-website-config.json', 'utf-8'));

// Homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'xnc-homepage.html'));
});

// Company overview (Level 1)
app.get('/company/overview.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'xnc-company-overview.html'));
});

// Press releases (Level 2)
app.get('/company/press-releases.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'xnc-press-releases-page.html'));
});

// Individual release (if needed)
app.get('/press/:id', (req, res) => {
    const release = config.releases.find(r => r.id === req.params.id);
    if (!release) {
        return res.status(404).send('Press release not found');
    }
    res.json(release);
});

// PDF serving
app.get('/press/:id.pdf', (req, res) => {
    res.contentType('application/pdf');
    res.send('PDF content placeholder');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`XNC Website running on http://localhost:${PORT}`);
});
```

**Run:**
```bash
node server.js
# Visit: http://localhost:3000
```

---

### Option 3: Docker Deployment (Production Ready)

**Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY xnc-*.html ./
COPY mock-website-config.json ./
COPY package*.json ./
RUN npm install
COPY server.js ./
EXPOSE 3000
CMD ["node", "server.js"]
```

**Build & Run:**
```bash
docker build -t xnc-website .
docker run -p 3000:3000 xnc-website
# Visit: http://localhost:3000
```

---

## Design Features (Inspired by OXB.com)

### Color Scheme
- **Primary:** Navy Blue (`#003d82`)
- **Secondary:** Lighter Blue (`#005ba8`)
- **Background:** White/Light Gray (`#f8fafb`)
- **Text:** Dark Gray (`#2c3e50`)
- **Accents:** Professional shadows and gradients

### Typography
- **Font Family:** Segoe UI, Roboto, Helvetica Neue, Arial
- **Headings:** Bold, Navy Blue
- **Body:** Clean, readable 0.95-1.1rem

### Components
- Sticky header with dropdown navigation
- Hero section with gradient background
- Service/feature cards with hover effects
- Partner logos section
- News/press release cards with badges
- Multi-level footer with links
- Professional shadows and spacing

---

## Website Structure

### Homepage (`xnc-homepage.html`)
- **URL:** `/` or `/xnc-homepage.html`
- **Sections:**
  - Header with navigation menu (dropdown: Company → Press Releases)
  - Hero section with CTA buttons
  - Solutions/Services grid (4 cards)
  - Trusted Partners section (6 logos)
  - Latest News section (3 featured press releases)
  - Footer with company/resources/legal links

### Company Overview (`xnc-company-overview.html`) - Level 1
- **URL:** `/company/overview.html`
- **Breadcrumb:** Home → Company → About XNC
- **Sections:**
  - Company mission and values
  - Key statistics (500+ team, 50+ partners, 15+ years, 100+ programs)
  - Company story and history
  - Leadership team (3 executives with bios)
  - Core values (Scientific Excellence, Partnership, Reliability, Innovation)
  - CTA to view all press releases

### Press Releases (`xnc-press-releases-page.html`) - Level 2
- **URL:** `/company/press-releases.html`
- **Breadcrumb:** Home → Company → Press Releases
- **Features:**
  - Filter by relationship type (dropdown)
  - **100 Press Releases organized in 3 tiers:**
    - **Tier 1:** 60 clean, consistent releases (green badge)
    - **Tier 2:** 25 mixed formats, inconsistencies (orange badge)
    - **Tier 3:** 15 advanced challenges (red badge)
  - **Badges for Tier 3 features:**
    - 🔒 Auth Required (blue)
    - ⏱ Rate Limited (orange)
    - ⚠️ Timeout Prone (purple)
    - 📄 Malformed HTML (pink)
    - 🔐 CAPTCHA (dark purple)
    - PDF (yellow)
  - Relationship tags showing company + relationship type
  - Responsive grid layout

---

## Release Data Structure

Each press release contains:

```json
{
  "id": "pr-001",
  "tier": 1,
  "title": "Release Title",
  "date": "2024-01-15",
  "format": "html",  // or "pdf"
  "authenticated": false,
  "requiresLogin": false,
  "rateLimited": false,
  "timeoutProne": false,
  "hasCAPTCHA": false,
  "malformedHTML": false,
  "isDuplicate": false,
  "brokenLinks": 0,
  "relationships": [
    {
      "type": "partnership",  // or research_collaboration, joint_venture, investor_relations, distribution_logistics, marketing, manufacturing
      "company": "Company Name",
      "description": "Relationship description"
    }
  ],
  "body": "Full press release text..."
}
```

---

## Scraper Testing Scenarios

### Phase 1: Tier 1 Validation
- **URL:** `/company/press-releases.html`
- **Releases:** 60 clean, consistent releases
- **Expected:** 100% extraction success
- **Challenges:** None - baseline validation

### Phase 2: Tier 2 Resilience
- **Releases:** 25 mixed format releases (HTML + PDF)
- **Date Formats:** 7+ different formats
- **Broken Links:** 1-3 per page
- **Expected:** 95%+ success rate
- **Challenges:**
  - Format detection (HTML vs PDF)
  - Date parsing
  - Broken link handling
  - Inconsistent phrasing

### Phase 3: Tier 3 Adversarial
- **Releases:** 15 advanced challenge releases
- **Expected:** 80%+ success rate (some features optional)
- **Challenges:**
  - Authentication (40% of releases)
  - Rate limiting (>5 requests/min = 429)
  - Timeouts (5% of requests)
  - Honeypots (invisible links)
  - Malformed HTML
  - Duplicates (need deduplication)
  - CAPTCHAs
  - Dead links (404s)

---

## Relationship Types Extracted

The 100 press releases contain mentions of 6 company relationship types:

1. **Investor Relations** - Investment, funding, venture capital
2. **Research Collaboration** - Joint research, partnerships with labs
3. **Partnership** - Strategic alliances, co-development
4. **Joint Venture** - New entities formed together
5. **Distribution & Logistics** - Supply chain, distribution agreements
6. **Marketing & Manufacturing** - Marketing campaigns, manufacturing partnerships

---

## Navigation Paths to Press Releases

**Path 1: Direct Navigation**
```
Homepage → Company Menu → Press Releases
(2 clicks to reach press releases page)
```

**Path 2: Via Links**
```
Homepage → "View All Press Releases" link
(1 click direct to press releases)
```

**Path 3: Via Company Page**
```
Homepage → Company Menu → About XNC → "View All Press Releases" link
(3 clicks but through company info first)
```

---

## Browser Compatibility

- **Desktop:** Chrome, Firefox, Safari, Edge (all modern versions)
- **Mobile:** Responsive design adapts to all screen sizes
- **Tablets:** Full functionality on iPad, Android tablets

---

## Performance Considerations

- **Static HTML:** Instant load, no server processing
- **Large release list:** All 100 releases loaded in single page (client-side filtering)
- **File sizes:**
  - Homepage: ~15KB
  - Company page: ~12KB
  - Press releases page: ~180KB (includes all 100 releases as inline data)
- **Optimization:** Use gzip compression in production

---

## Customization

### Adding More Press Releases
1. Add to RELEASES_DATA array in `xnc-press-releases-page.html`
2. Update count badges in tier section headers
3. No server restart needed (static HTML)

### Changing Colors
Edit the `<style>` section in any HTML file:
- Primary color: `#003d82` (Navy Blue)
- Secondary: `#005ba8` (Light Blue)
- Success: `#e8f5e9` (Tier 1 - Green)
- Warning: `#fff3e0` (Tier 2 - Orange)
- Error: `#ffebee` (Tier 3 - Red)

### Changing Company Name
Replace all instances of:
- "XNC" → Your company name
- "Advanced Life Sciences Solutions" → Your tagline
- Update footer and header branding

---

## Troubleshooting

### URLs Not Working
- **Issue:** Links like `/company/overview.html` return 404
- **Solution:** Server must be run from the root directory. Check your working directory.

### Styles Not Loading
- **Issue:** Page appears unstyled
- **Solution:** CSS is inline in HTML files. If broken, check browser console for errors.

### Press Releases Not Displaying
- **Issue:** Filter returns no results
- **Solution:** Check browser console for JavaScript errors. Ensure RELEASES_DATA is loaded correctly.

### MIME Type Warnings
- **Issue:** Browser warnings about HTML files being served as text
- **Solution:** Configure server to serve `.html` as `text/html` content type

---

## Deployment Checklist

- [ ] Choose deployment option (Static HTML, Node.js, or Docker)
- [ ] Copy all HTML files to server
- [ ] Copy `mock-website-config.json` if using Node.js
- [ ] Test all navigation paths work
- [ ] Verify press releases load on `/company/press-releases.html`
- [ ] Test filtering by relationship type
- [ ] Confirm Tier 1, 2, 3 sections display correctly
- [ ] Test on mobile/tablet (responsive design)
- [ ] Configure SSL/HTTPS for production
- [ ] Set up monitoring/logging if needed

---

## Testing Your Scraper Against XNC

### Test Scenario 1: Basic Extraction
1. Navigate to `/company/press-releases.html`
2. Scrape Tier 1 releases (60 clean releases)
3. Verify: Title, date, company names, relationship types extracted correctly
4. Expected success rate: 100%

### Test Scenario 2: Format & Consistency
1. Filter to show Tier 2 releases
2. Parse multiple date formats
3. Detect PDF links and handle them
4. Expected success rate: 95%

### Test Scenario 3: Full Adversarial
1. Attempt to scrape all 100 releases
2. Handle authentication for Tier 3
3. Manage rate limiting gracefully
4. Skip honeypots and broken links
5. Expected success rate: 80%+

---

## Files Included

| File | Purpose | Size |
|------|---------|------|
| xnc-homepage.html | Main landing page | ~15KB |
| xnc-company-overview.html | Company info (Level 1) | ~12KB |
| xnc-press-releases-page.html | Press releases (Level 2) with all 100 releases | ~180KB |
| mock-website-config.json | Complete release data config | ~56KB |
| MOCK_WEBSITE_GUIDE.md | Original comprehensive guide | ~30KB |
| XNC_DEPLOYMENT_GUIDE.md | This deployment guide | ~10KB |

---

## Support & Customization

To customize the XNC website:

1. **Change company branding:** Edit company name, logo, colors in CSS
2. **Add more releases:** Add items to RELEASES_DATA in press-releases page
3. **Modify layout:** Edit HTML structure and CSS classes
4. **Add authentication:** Implement login form in `/company/overview.html` before showing `press-releases.html`
5. **Enable rate limiting:** Configure server middleware (Express: `express-rate-limit` package)

---

## Next Steps

1. **Deploy:** Choose Option 1, 2, or 3 above
2. **Test:** Navigate to homepage, then to press releases (2 levels deep)
3. **Scrape:** Run your web scraper against `http://localhost:PORT/company/press-releases.html`
4. **Verify:** Check that all 100 releases are extracted with correct relationship data
5. **Iterate:** Test against different Tiers and improve scraper robustness

---

**Ready to deploy?** Start with Option 1 (Static HTML) for quick testing, then move to Option 2 (Node.js) or Option 3 (Docker) for production use.
