# 9-Website Portfolio with Press Release Architecture - Design Document

**Date:** 2026-05-07  
**Project:** Create websites 2-10 with press releases, relationships, and web scraping complexity  
**Status:** Design Approved

---

## Executive Summary

Generate 9 complete websites (websites 2-10) with company-specific homepages, press release systems with cross-linking relationships, and medium-complexity web scraping anti-patterns. Each site deploys independently to Render.com using Node.js/Express architecture.

---

## Section 1: Company Names & Industry Diversity

Nine companies across different sectors for realistic web scraping scenarios:

| Website | Company Name | Industry | Focus |
|---------|--------------|----------|-------|
| Website 2 | TechVenture Solutions | SaaS/Cloud | Enterprise software |
| Website 3 | EcoFlow Industries | Manufacturing/Logistics | Supply chain |
| Website 4 | FinanceCore Analytics | Finance | Data analytics |
| Website 5 | BioGen Therapeutics | Life Sciences | Drug development |
| Website 6 | RetailMax Networks | Retail/E-commerce | Consumer goods |
| Website 7 | GreenEnergy Corp | Energy | Renewable energy |
| Website 8 | CloudScale Innovations | Cloud Infrastructure | Cloud services |
| Website 9 | SupplyChain Dynamics | Supply Chain | Logistics |
| Website 10 | MediaPulse Communications | Media/Publishing | Digital media |

Each company has:
- Unique value proposition aligned with industry
- Industry-specific language and branding
- Distinct color scheme and design theme
- Relevant service/product offerings

---

## Section 2: Homepage Architecture

Each website homepage includes:

### Components:
- **Hero Section**
  - Company tagline and brand message
  - Call-to-action buttons (Learn More, Explore Solutions, etc.)
  - Company-specific imagery/branding

- **Solutions/Services Section**
  - 4 cards with industry-specific offerings
  - Each card: title, description, link

- **Featured Press Releases**
  - Teaser cards (3-4 most recent press releases)
  - Title, date, excerpt
  - Links to full press release archive

- **Partners/Clients Section**
  - Logo section with fictional partner companies
  - Company-specific partners (not generic)

- **Footer**
  - Navigation links (About, Solutions, Press Releases, Contact, etc.)
  - Copyright and legal links

### Design:
- Responsive layout (mobile-first)
- Company-branded color schemes
- Professional, industry-appropriate styling
- Consistent with website 1 template approach but brand-customized

---

## Section 3: Press Release System with Multi-Level Navigation

### Navigation Depth: 2-3 Levels (Mixed)

**Tier 1 Sites (2-level navigation):** Websites 2, 4, 6, 8, 10
- Home → Press Releases Archive → Article

**Tier 2 Sites (3-level navigation):** Websites 3, 5, 7, 9
- Home → Press Releases Archive → Category Page → Article
- OR: Home → Press Releases Archive → Article → Sub-page

### Archive Page (`/company/press-releases.html` or `/news/index.html`)

**Features:**
- Displays 7-10 press release cards in paginated grid
- Each card shows:
  - Article title
  - Publication date
  - Brief excerpt
  - Relationship type badge (Supplier, Competitor, Joint Venture, etc.)
- Server-side pagination (max 3 articles per page)
- "Load More" button triggers AJAX to fetch next batch

**Web Scraping Complexity:**
- Server-side pagination handling
- JavaScript required to load additional articles
- Rate limiting: max 5 requests/minute/IP (returns HTTP 429)
- Requires session cookies for access

### Individual Article Pages (`/press-releases/pr-XXX.html`)

**Features:**
- Full article text and metadata
- Publication date and author (optional)
- Relationship type clearly displayed
- Shows name of related company
- **Cross-website linking:** If article mentions another company from the 9-site network, includes clickable link to that company's website
- Internal navigation to sub-pages (if applicable)

**Example Cross-Link:**
- Article: "TechVenture Partners with EcoFlow on Supply Chain Optimization"
- Relationship type: "Partnership"
- Related company link: "Learn more about EcoFlow Industries" → https://ecoflow-site.com

### Article Sub-Pages (3-level navigation sites only)

**Sub-page Types:**
- `/press-releases/pr-XXX/details.html` — Extended analysis and technical details
- `/press-releases/pr-XXX/related.html` — Related articles and coverage
- `/press-releases/pr-XXX/timeline.html` — Timeline of events or milestones

**Coverage:**
- Available on ~50% of articles (not all)
- Creates scraping complexity: discovering which articles have sub-pages requires inspection
- Links appear at bottom of main article

### Relationship Distribution

**Relationship Types:**
- Supplier
- Distribution & Logistics
- Marketing Partnership
- Manufacturing
- Competitor
- Joint Venture
- Research Collaboration

**Cross-linking:**
- ~30-40% of articles mention other companies from the 9-site network
- Each mention includes a clickable link to that company's site
- Realistic network of relationships across companies

**Article Count:**
- 7-10 press releases per website
- Total ~70-90 articles across all sites with cross-linking potential

---

## Section 4: Web Scraping Complexity Features

### 4.1 Rate Limiting

**Implementation:**
- Archive pages enforce rate limiting: max 5 requests per minute per IP
- Tracked via in-memory store on Express server
- Exceeding limit returns HTTP 429 (Too Many Requests)
- Response includes `Retry-After` header

**Purpose:**
- Simulates anti-bot protection
- Requires scraper to implement backoff/retry logic

### 4.2 JavaScript Rendering

**Implementation:**
- Archive pages initially load with only first 3 articles visible in HTML
- Remaining articles loaded via AJAX call when "Load More" button clicked
- Button triggers JavaScript that fetches `/api/press-releases?page=X`
- Response returns HTML chunk with next batch of articles

**Purpose:**
- Requires scraper to execute JavaScript or handle AJAX
- Common real-world anti-scraping pattern

### 4.3 Captcha (Mixed Types)

**Coverage:**
- ~20% of individual article pages require captcha before showing full content
- Captchas appear after article summary but before full text

**Math-based Captcha (~50% of captcha instances):**
- Simple arithmetic problem (e.g., "What is 7 + 3?")
- User enters answer in form field
- Incorrect submission shows error and new problem
- Correct submission:
  - Sets session cookie (`captcha_solved=true`)
  - Displays full article content
  - Cookie valid for 24 hours

**Image-based Captcha (~50% of captcha instances):**
- Shows 4 images with instruction (e.g., "Select all images with cars")
- User clicks correct image(s)
- Incorrect selection shows error with new set of images
- Correct selection:
  - Sets session cookie (`captcha_image_solved=true`)
  - Displays full article content
  - Cookie valid for 24 hours

**Image Captcha Technical Details:**
- Images generated dynamically (SVG graphics + simple placeholders)
- No persistent image files stored
- New set generated on each incorrect attempt

### 4.4 Popups & Modal Dialogs

**Newsletter Popup:**
- Appears on ~30% of article pages
- Modal dialog with email field and subscribe button
- Can be dismissed with X button (no email required to view article)
- Does not block content access

**Cookie Consent Banner:**
- Persistent footer banner on all pages
- Accepts/Rejects cookies
- Dismissal preference stored in browser
- Does not block content

**Related Articles Modal:**
- Appears on ~15% of article pages
- Shows "You may also like..." with 3 related article titles
- Can be closed with button or clicking outside modal
- Does not block content

### 4.5 Session Management

**Server-side Sessions:**
- Express session middleware with in-memory store
- Tracks per-session:
  - Captcha completion status
  - Rate limit counters
  - Article access history
- Session cookies set with 24-hour expiry

**Use Cases:**
- Preventing repeated captcha challenges
- Enforcing rate limits per session
- Cross-page article access control

---

## Section 5: File Structure & Deployment

### Directory Layout

```
website-X/
├── server.js                      # Express server with all routes and middleware
├── package.json                   # Node dependencies
├── .env                          # Environment variables (PORT, RATE_LIMIT_MAX, etc.)
├── .gitignore                    # Git ignore rules
├── index.html                    # Homepage (company branded)
├── company/
│   ├── overview.html            # Company overview/about page
│   └── press-releases.html       # Press releases archive with pagination
├── press-releases/
│   ├── pr-001.html             # Article 1 (may include captcha)
│   ├── pr-001/
│   │   ├── details.html        # Sub-page (tier 2 sites only)
│   │   └── related.html        # Related articles (tier 2 sites only)
│   ├── pr-002.html             # Article 2
│   ├── pr-002/details.html     # Optional sub-page
│   ├── pr-003.html
│   └── ... (7-10 articles per site)
├── public/
│   ├── css/
│   │   ├── style.css           # Main styling
│   │   ├── captcha.css         # Captcha-specific styling
│   │   └── responsive.css      # Mobile responsive styles
│   ├── js/
│   │   ├── main.js             # Navigation, menu, popups
│   │   ├── captcha.js          # Client-side captcha logic
│   │   ├── ajax-pagination.js  # Archive page pagination
│   │   └── utils.js            # Shared utility functions
│   └── images/
│       ├── logo.svg            # Company logo (generated)
│       ├── hero-banner.png     # Hero section image
│       └── (captcha SVGs generated server-side)
├── api/
│   └── routes.js               # API endpoints (/api/press-releases, /api/captcha, etc.)
├── middleware/
│   ├── rate-limiter.js         # Rate limiting middleware
│   ├── session-handler.js      # Session management
│   └── auth.js                 # Captcha/session validation
├── mock-website-config.json     # Site configuration (company info, press releases meta)
├── press-release-data.js        # Press release content and relationships
├── RENDER_DEPLOYMENT_GUIDE.md   # Step-by-step deployment to Render.com
├── RENDER_QUICK_START.md        # Quick start for Render
└── README.md                    # Local development setup
```

### Configuration Files

**mock-website-config.json:**
```json
{
  "site": {
    "name": "CompanyName",
    "company": "CompanyName - Industry Description",
    "theme": "professional|tech|energy|finance",
    "colors": {
      "primary": "#XXXXXX",
      "secondary": "#XXXXXX",
      "background": "#XXXXXX",
      "text": "#XXXXXX"
    }
  },
  "homepage": { ... },
  "navigation": { ... },
  "pressReleases": [
    {
      "id": "pr-001",
      "title": "...",
      "date": "...",
      "relationship": "joint_venture",
      "relatedCompany": "CompanyName"
    }
  ]
}
```

**press-release-data.js:**
Contains full text content for all press releases, indexed by ID.

### Deployment Configuration

**Render.com Setup:**
- Each website as separate service OR monorepo with shared build
- Environment variables configured in Render dashboard:
  - `PORT` (default 3000)
  - `RATE_LIMIT_MAX` (default 5)
  - `NODE_ENV` (production)
- Build command: `npm install`
- Start command: `npm start`

**Package.json Dependencies:**
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "express-session": "^1.17.0",
    "compression": "^1.7.0"
  },
  "devDependencies": { }
}
```

---

## Section 6: Web Scraping Complexity Summary

**Scraping Challenges Implemented:**

| Challenge | Implementation | Difficulty |
|-----------|-----------------|------------|
| Pagination | Server-side with AJAX | Medium |
| JavaScript Rendering | AJAX-loaded content | Medium |
| Rate Limiting | HTTP 429 responses | Easy-Medium |
| Math Captcha | Form validation | Medium |
| Image Captcha | Image selection logic | Hard |
| Session Cookies | Persistent across requests | Medium |
| Popups | Modal dismissal required | Easy |
| Multi-level Navigation | Hidden sub-pages | Hard |
| Cross-website Linking | External URLs | Medium |

**Overall Complexity:** Medium - requires JavaScript execution, session management, captcha solving, and multi-level navigation traversal.

---

## Section 7: Implementation Sequence

1. **Generate 9 company profiles** (names, colors, themes, offerings)
2. **Create homepage templates** (company-branded, responsive)
3. **Create press release data** (70-90 articles with relationships)
4. **Build Express servers** (server.js for each site with middleware)
5. **Create press release archive pages** (pagination, AJAX, rate limiting)
6. **Create individual article pages** (with optional captchas)
7. **Create article sub-pages** (tier 2 sites only)
8. **Implement captcha logic** (math and image-based)
9. **Implement cross-website linking** (relationship navigation)
10. **Create Render deployment guides** (per-site configuration)
11. **Test all sites locally** (verify functionality)
12. **Deploy to Render.com** (final deployment)

---

## Assumptions & Constraints

- Each website folder contains complete, self-contained code (no shared dependencies between sites)
- Render.com used as deployment platform (may adjust for other platforms)
- In-memory session store sufficient for testing (no persistent database needed)
- Rate limiting enforced per IP, not per session
- Captcha images generated dynamically (no persistent image storage)
- Cross-website links use placeholder URLs (not actual live URLs)

---

## Success Criteria

✅ All 9 websites deployed and accessible on Render.com  
✅ Homepages fully branded per company  
✅ Press release archives with pagination and rate limiting functional  
✅ Captchas (both types) working correctly  
✅ Cross-website linking working between related articles  
✅ Sub-pages accessible on tier 2 sites  
✅ All complexity features operational (popups, sessions, JavaScript rendering)  
✅ Documentation complete and deployment guides clear
