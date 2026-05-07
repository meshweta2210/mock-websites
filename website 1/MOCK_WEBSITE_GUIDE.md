# XNC Mock Website - Web Scraping Test Suite

## Overview

This mock website is designed to test a web scraper's ability to extract company relationships (investor relations, research collaboration, partnerships, joint ventures, distribution & logistics, marketing & manufacturing) from press releases on the XNC website. The website is organized in three progressive tiers of complexity, starting with clean HTML and escalating to realistic challenges including bot detection, authentication, and data quality issues.

XNC is an advanced life sciences company specializing in contract development and manufacturing organization (CDMO) services. The website features a professional design inspired by OXB.com with press releases accessible 2 levels deep from the homepage.

**Total Press Releases:** 100
- **Tier 1 (Basic):** 60 releases - Clean, consistent, no challenges
- **Tier 2 (Intermediate):** 25 releases - Mixed formats, inconsistencies, pagination
- **Tier 3 (Advanced):** 15 releases - Bot detection, auth, errors, malformed data

---

## Tier 1: Basic (60 releases)

**Purpose:** Validate that scraper can handle straightforward press release extraction with consistent structure.

### Characteristics
- Clean HTML markup with standard semantic tags
- Consistent date format (ISO 8601: `YYYY-MM-DD`)
- Clear company relationship mentions with unambiguous phrasing
- No authentication required
- No errors or broken links
- No rate limiting
- Pagination: 10 releases per page (6 pages total)
- Simple "Next/Prev" navigation buttons

### Data Structure
```
- Title (HTML: <h1>)
- Publication Date (HTML: <span class="date">, format: YYYY-MM-DD)
- Body Text (HTML: <p> tags)
- Company Relationships:
  - 2-3 per release
  - Clear phrasing: "announced partnership with X", "collaborating with Y", "joint venture with Z"
  - Type field: partnership, research_collaboration, joint_venture, investor_relations, distribution_logistics, marketing, manufacturing
```

### Expected Scraper Behavior
✓ Extract title, date, body text
✓ Parse relationship mentions
✓ Identify company names and relationship types
✓ Handle pagination
✓ Complete extraction in minimal requests

### Challenges
- None - this is the validation baseline

---

## Tier 2: Intermediate (25 releases)

**Purpose:** Test scraper resilience to real-world formatting inconsistencies and mixed content types.

### Characteristics
- **Mixed Formats:** 30% of releases available as PDFs requiring download/text extraction
- **Inconsistent Dates:** Multiple date formats present:
  - `2024-01-20` (ISO)
  - `Jan 5, 2024` (US format)
  - `January 5th, 2024` (verbose)
  - `02/05/2024` (MM/DD/YYYY)
  - `2024/01/05` (alternate ISO)
  - `2024.01.05` (dot-separated)
  - `1/5/2024` (short US)
  - `January 5th` (no year)
- **Broken Links:** 1-3 internal broken links per page (404s on related content)
- **Inconsistent Phrasing:** Company relationships expressed differently:
  - "announced partnership with X"
  - "formed strategic alliance with X"
  - "co-developed with X"
  - "joint effort with X"
  - "co-branded initiative with X"
- **Pagination with Filters:** Optional query parameters (by relationship type, by year)
- **State Tracking:** Filter selections carry through pagination
- **No Authentication**
- **No Rate Limiting**

### Data Structure (Sample Variations)
```json
{
  "id": "pr-061",
  "title": "TechCorp Partners with CloudScale - PDF Available",
  "date": "Jan 15, 2024",
  "format": "pdf",
  "pdfUrl": "/press/pr-061.pdf",
  "relationships": [
    {"type": "partnership", "company": "CloudScale", "description": "strategic partnership with CloudScale"}
  ]
}
```

### PDF Content
- PDFs are actual documents containing the same relationship information as HTML
- Text extraction from PDFs may be challenging (OCR-like scenarios)
- Some PDFs contain embedded images with logos/text
- File sizes vary (50KB - 500KB)

### Expected Scraper Behavior
✓ Detect and download PDF URLs
✓ Extract text from PDFs
✓ Normalize dates to standard format
✓ Handle multiple phrasings for relationships
✓ Follow pagination with filters
✓ Handle broken internal links gracefully (skip without crashing)
✓ Deduplicate similar content

### Challenges
- Format detection (HTML vs PDF)
- Date parsing (7+ formats)
- Inconsistent relationship phrasing
- Broken links (404 handling)
- Pagination with optional filters
- PDF text extraction quality
- Link extraction from mixed content

---

## Tier 3: Advanced (15 releases)

**Purpose:** Test scraper's ability to handle real-world adversarial and error scenarios.

### Characteristics

#### Authentication (40% of Tier 3 releases)
- Requires login with username/password
- Session management required
- Cookie-based authentication
- Some releases only accessible to authenticated users
- **Login Credentials:** (provided separately or configurable)

#### Rate Limiting
- Threshold: >5 requests/minute triggers 429 status
- Response header: `Retry-After: 60` (retry after 60 seconds)
- Affects all requests, including document fetches
- Requires exponential backoff and request throttling

#### Timeouts
- ~5% of requests timeout after 10 seconds
- No response body, connection hangs
- Requires timeout handling and retry logic

#### Bot Detection
- **Honeypot Links:** Invisible `<a href="/trap">` links that real scrapers should not follow
  - Pages with honeypots track if accessed; flagged as potential bot
  - Multiple honeypot hits may result in IP blocking
- **User-Agent Validation:** Some endpoints reject common bot user agents
- **Behavioral Analysis:** Rapid successive requests trigger blocking

#### Malformed HTML
- Unclosed tags: `<p>Content without closing tag`
- Nested incorrectly: `<div><p>...</div></p>`
- Missing closing quotes: `<div class="unclosed>`
- Mixed encoding issues
- **Pages affected:** ~2-3 releases

#### Duplicates
- 2-3 release pairs with 95%+ identical content
- Slight variations to evade simple deduplication:
  - Punctuation changes
  - Word order changes
  - Minor phrasing updates
- Same company relationships, same dates, nearly identical text

#### CAPTCHA Protection
- 3 releases protected with simple math CAPTCHA
- Format: `2 + 3 = ?` (simple arithmetic)
- Requires solving CAPTCHA before content accessible
- Same CAPTCHA for all users (not randomized for testing)

#### Dead Links / 404s
- Some press release URLs return 404 Not Found
- Should be handled gracefully
- Example: `/press/pr-099` returns 404

#### PDF Challenges
- 1-2 PDFs with malformed/corrupted content
- Text extraction may fail or produce garbage
- Requires fallback handling

### Data Structure (Examples)
```json
{
  "id": "pr-087",
  "title": "TechCorp Premium Partnership - AUTHENTICATED",
  "authenticated": true,
  "requiresLogin": true
}
```

```json
{
  "id": "pr-089",
  "title": "Corrupted Press Release - Malformed HTML",
  "malformedHTML": true,
  "body": "<p>TechCorp partnership announcement<p> missing closing tag"
}
```

```json
{
  "id": "pr-091",
  "title": "Duplicate Content Test - Version A",
  "isDuplicate": true,
  "duplicateOf": "pr-092"
}
```

```json
{
  "id": "pr-093",
  "title": "CAPTCHA Protected Release",
  "hasCAPTCHA": true,
  "captchaType": "math"
}
```

```json
{
  "id": "pr-100",
  "title": "Everything Complex - All Features",
  "authenticated": true,
  "requiresLogin": true,
  "rateLimited": true,
  "timeoutProne": true,
  "hasCAPTCHA": true,
  "malformedContent": true,
  "brokenLinks": 4
}
```

### Expected Scraper Behavior
✓ Authenticate with credentials
✓ Maintain session across requests
✓ Respect rate limiting (429 status, Retry-After header)
✓ Implement exponential backoff
✓ Timeout handling with retries
✓ Avoid honeypot links
✓ Rotate user agents if needed
✓ Parse malformed HTML gracefully (use lenient HTML parser)
✓ Identify and skip duplicate content
✓ Optionally solve simple CAPTCHAs (or acknowledge and skip)
✓ Handle 404s gracefully
✓ Gracefully degrade on PDF extraction failure

### Challenges
- Session-based authentication
- Rate limiting compliance
- Timeout recovery
- Bot detection evasion (honeypots, user agents)
- Malformed HTML parsing
- Content deduplication
- CAPTCHA solving (optional)
- Dead link handling
- PDF corruption handling
- Combined complexity (pr-100 includes all)

---

## Relationship Types (6 Categories)

The scraper should identify and categorize these company relationship types:

### 1. **Investor Relations**
- Phrasing: "announced investment from X", "received funding from X", "Series [X] funding from Y"
- Example: "TechCorp received Series B funding from VentureFund Capital"

### 2. **Research Collaboration**
- Phrasing: "research collaboration with X", "research partnership with X", "collaborated on X research"
- Example: "TechCorp and DataStream Labs have partnered on research collaboration"

### 3. **Partnership / Strategic Alliance**
- Phrasing: "announced partnership with X", "formed strategic alliance with X", "co-developed with X"
- Example: "TechCorp announced a strategic partnership with CloudSys Inc."

### 4. **Joint Venture**
- Phrasing: "entered joint venture with X", "formed joint venture with X", "JV with X"
- Example: "TechCorp and ManufactureCo entered joint venture"

### 5. **Distribution & Logistics**
- Phrasing: "distribution agreement with X", "signed distribution deal with X", "supply chain partnership with X"
- Example: "TechCorp and LogisticsPro signed distribution and logistics agreement"

### 6. **Marketing & Manufacturing**
- Marketing: "marketing partnership with X", "marketing initiative with X", "co-branded campaign with X"
- Manufacturing: "manufacturing agreement with X", "manufacturing partnership with X", "co-produced with X"
- Example: "TechCorp and ManufacturePro signed manufacturing agreement"

---

## Scraper Test Roadmap

### Phase 1: Tier 1 Validation
- Extract all 60 Tier 1 releases
- Verify relationship extraction accuracy
- Validate date parsing (single ISO format)
- Confirm pagination handling
- **Expected:** 100% success rate, clean extraction

### Phase 2: Tier 2 Resilience
- Handle mixed HTML/PDF formats
- Parse 7+ date formats
- Navigate filters and pagination
- Skip broken internal links
- Deduplicate similar content
- **Expected:** 95%+ successful extractions, graceful link handling

### Phase 3: Tier 3 Adversarial
- Handle authentication flows
- Respect rate limiting (implement backoff)
- Recover from timeouts
- Avoid honeypot traps
- Parse malformed HTML
- Solve/skip CAPTCHAs
- Handle 404s
- Graceful degradation on errors
- **Expected:** 80%+ successful extractions (some advanced features optional)

---

## Navigation Paths

### Home Page → Press Releases (2 Levels Deep)
- **Path A:** Home → Company (dropdown) → Press Releases (2 clicks)
- **Path B:** Home → News section → "View All" link (direct link)
- **Alternative:** Breadcrumb navigation from individual release pages

### Press Release Archive
- **URL:** `/company/press-releases.html`
- **Layout:** Single page with all 100 releases organized by tier
- **Pagination:** Client-side filtering, no pagination required
- **Filters (Tier 2+):** 
  - By relationship type dropdown
  - Options: Partnership, Research Collaboration, Joint Venture, Investor Relations, Distribution & Logistics, Marketing, Manufacturing
- **Tier 3:** Some releases marked with authentication badges

### Individual Release Pages
- **URL Pattern:** Individual releases displayed on `/company/press-releases.html`
- **Tier 1-2:** Public, direct access
- **Tier 3:** Some flagged as requiring login
- **Formats:** HTML or PDF (indicated with badges)

---

## Metrics & Success Criteria

### Extraction Accuracy
- **Tier 1:** ≥99% accuracy (baseline)
- **Tier 2:** ≥95% accuracy (some format/phasing variance)
- **Tier 3:** ≥80% accuracy (adversarial scenarios optional)

### Relationship Extraction
- Correctly identify company name
- Correctly identify relationship type
- Handle phrasing variations
- Deduplicate duplicates
- Avoid honeypot links

### Request Efficiency
- Minimize request count (don't re-fetch pages)
- Respect rate limiting (no 429 errors)
- Implement reasonable timeouts
- Handle failures gracefully

### Data Quality
- Normalize dates to ISO 8601
- Extract clean company names (no extra whitespace/punctuation)
- Capture full relationship context
- Flag errors/warnings for manual review

---

## Configuration & Customization

The scraper can be tested against different scenarios:

### Scenario 1: Tier 1 Only
- Clean, consistent data
- Validates baseline extraction logic
- No special handling needed

### Scenario 2: Tier 1 + 2
- Add format detection and date parsing
- Test pagination with filters
- Validate resilience to broken links

### Scenario 3: All Tiers (Full Challenge)
- Complete adversarial testing
- Requires authentication, rate limiting, etc.
- Tests production-readiness

---

## Typical Scraper Issues & Resolutions

| Issue | Root Cause | Resolution |
|-------|-----------|-----------|
| Date parsing fails | Multiple formats | Implement multi-format date parser (dateutil, moment, etc.) |
| Missing 30% of releases | PDF detection missing | Check for `pdfUrl` field or `application/pdf` content-type |
| Relationship extraction incomplete | Inconsistent phrasing | Expand keyword matching to include all variants |
| Gets blocked after 100 requests | Ignoring rate limiting | Check 429 status code and Retry-After header, implement backoff |
| Some content not accessible | Auth required | Implement login/session management for authenticated requests |
| Timeouts on some pages | No timeout handling | Add request timeout (10-30s), retry with exponential backoff |
| Following "/trap" link | No honeypot detection | Never follow invisible/hidden links, validate user interaction patterns |
| Duplicate entries in results | No deduplication | Hash release content, compare with prior entries, skip duplicates |
| Cannot extract from malformed HTML | Strict HTML parser | Use lenient parser (BeautifulSoup with lxml, html5lib) |
| CAPTCHAs blocking extraction | No CAPTCHA handling | Implement solving for simple math (regex capture + eval), skip for complex |
| 404 errors crash scraper | No error handling | Catch HTTP errors, log and skip, continue to next release |

---

## Example Relationship Extractions

### Tier 1 (Clean)
```
Release: "TechCorp Announces Strategic Partnership with CloudSys Inc."
Date: 2024-01-15
Relationships:
  1. Type: partnership
     Company: CloudSys Inc.
     Context: "announced strategic partnership with CloudSys Inc. to integrate cloud infrastructure"
```

### Tier 2 (Messy)
```
Release: "TechCorp Partners with CloudScale - PDF Available"
Date: Jan 15, 2024 → 2024-01-15 (normalized)
Format: PDF (requires download from /press/pr-061.pdf)
Relationships:
  1. Type: partnership
     Company: CloudScale
     Context: extracted from PDF text
```

### Tier 3 (Complex)
```
Release: "Everything Complex - All Features"
Date: 2024-03-10
Status: Requires login + CAPTCHA + Rate limiting
Format: PDF (malformed)
Relationships:
  1. Type: partnership → Company: ComplexTest
  2. Type: research_collaboration → Company: AdvancedTest
  3. Type: joint_venture → Company: FinalTest
```

---

## Server Behavior Simulation

When implementing this mock website as an actual server, implement these behaviors:

### Tier 1
- Serve clean HTML with consistent structure
- Use ISO 8601 dates
- Return 200 OK for all requests
- No delays

### Tier 2
- Serve PDF files alongside HTML
- Vary date formats randomly
- Randomly return 404s for 10% of links within pages
- Add minor delays (100-500ms)

### Tier 3
- Check `Authorization` header; return 401 if missing for authenticated releases
- Track request count per IP; return 429 after 5 requests/minute
- Randomly timeout 5% of requests (don't respond)
- Include hidden honeypot links in HTML
- Serve malformed HTML (unclosed tags, nesting errors)
- Return duplicate content for specific release pairs
- Serve CAPTCHA form requiring solution before content
- Return 404 for dead releases
- Intentionally corrupt PDF files for test releases

---

---

## Deployment & Website Implementation

### Website Structure
The XNC website consists of three main pages:

**Homepage:** `/` or `/xnc-homepage.html`
- Professional landing page with company overview
- Navigation menu with Solutions and Company dropdowns
- Hero section with call-to-action buttons
- Services grid, partner logos, latest news preview
- Links to company information and press releases

**Company Overview:** `/company/overview.html` (Level 1 Deep)
- Company mission, history, and values
- Key statistics and leadership team
- Call-to-action button to view all press releases

**Press Releases Archive:** `/company/press-releases.html` (Level 2 Deep)
- Complete archive of all 100 press releases
- Organized by Tier (Basic, Intermediate, Advanced)
- Relationship type filtering
- Badges indicating special challenges (auth, rate limiting, etc.)
- Breadcrumb navigation

### Navigation Structure to Press Releases (2 Levels Deep)
```
Home Page (/)
├── Header Navigation
│   ├── Home
│   ├── Solutions (dropdown)
│   ├── Company (dropdown) ─────────┐
│   │   ├── About XNC               │ LEVEL 1
│   │   ├── Leadership              │
│   │   ├── Our Story               │
│   │   └── Press Releases ──────────┼─ LEVEL 2 (FINAL DESTINATION)
│   │
│   ├── Resources
│   └── Contact
│
├── CTA Buttons
│   ├── "Learn About XNC" → /company/overview.html (Level 1)
│   └── "Explore Solutions" → /#solutions
│
└── Latest News Section
    └── "View All" → /company/press-releases.html (Level 2)
```

### Homepage (Deployable HTML)

Save as `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechCorp - Innovation Through Partnership</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        header {
            background-color: #1a1a1a;
            color: white;
            padding: 1rem 0;
            position: sticky;
            top: 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #00d4ff;
        }
        
        .nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        .nav-item {
            position: relative;
        }
        
        .nav-link {
            color: white;
            text-decoration: none;
            padding: 0.5rem 1rem;
            transition: color 0.3s ease;
        }
        
        .nav-link:hover {
            color: #00d4ff;
        }
        
        .dropdown {
            position: relative;
            display: inline-block;
        }
        
        .dropdown-content {
            display: none;
            position: absolute;
            background-color: #2a2a2a;
            min-width: 160px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
            padding: 12px 16px;
            z-index: 1;
            top: 100%;
            left: 0;
        }
        
        .dropdown:hover .dropdown-content {
            display: block;
        }
        
        .dropdown-content a {
            color: white;
            padding: 12px 0;
            text-decoration: none;
            display: block;
            transition: color 0.3s ease;
        }
        
        .dropdown-content a:hover {
            color: #00d4ff;
        }
        
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 80px 20px;
            text-align: center;
        }
        
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .hero p {
            font-size: 1.3rem;
            margin-bottom: 2rem;
            opacity: 0.95;
        }
        
        .cta-button {
            display: inline-block;
            background-color: #00d4ff;
            color: #1a1a1a;
            padding: 12px 30px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
            font-size: 1rem;
            transition: all 0.3s ease;
            border: 2px solid #00d4ff;
        }
        
        .cta-button:hover {
            background-color: transparent;
            color: #00d4ff;
        }
        
        .features {
            padding: 60px 20px;
            background-color: #f8f9fa;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .feature-card {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
        }
        
        .feature-card h3 {
            color: #667eea;
            margin-bottom: 1rem;
        }
        
        .feature-card p {
            color: #666;
        }
        
        .press-section {
            padding: 60px 20px;
            background-color: white;
        }
        
        .press-section h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 2rem;
            color: #1a1a1a;
        }
        
        .press-intro {
            text-align: center;
            max-width: 600px;
            margin: 0 auto 2rem;
            color: #666;
            font-size: 1.1rem;
        }
        
        .press-link-container {
            text-align: center;
        }
        
        .press-link-button {
            display: inline-block;
            background-color: #667eea;
            color: white;
            padding: 15px 40px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
            font-size: 1.1rem;
            transition: all 0.3s ease;
        }
        
        .press-link-button:hover {
            background-color: #764ba2;
            transform: scale(1.05);
        }
        
        footer {
            background-color: #1a1a1a;
            color: white;
            text-align: center;
            padding: 2rem;
        }
        
        footer p {
            margin: 0.5rem 0;
        }
        
        @media (max-width: 768px) {
            .nav-menu {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .hero h1 {
                font-size: 2rem;
            }
            
            .features-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header>
        <nav class="container">
            <div class="logo">TechCorp</div>
            <ul class="nav-menu">
                <li class="nav-item">
                    <a href="/" class="nav-link">Home</a>
                </li>
                <li class="nav-item dropdown">
                    <a href="#" class="nav-link">About</a>
                    <div class="dropdown-content">
                        <a href="#about">About Us</a>
                        <a href="/press/archive">Press Releases</a>
                    </div>
                </li>
                <li class="nav-item dropdown">
                    <a href="#" class="nav-link">News & Media</a>
                    <div class="dropdown-content">
                        <a href="/press/archive">Press Releases</a>
                        <a href="#media">Media Kit</a>
                    </div>
                </li>
            </ul>
        </nav>
    </header>

    <section class="hero">
        <div class="container">
            <h1>Innovation Through Partnership</h1>
            <p>Discover TechCorp's latest collaborations, investments, and strategic initiatives</p>
            <a href="/press/archive" class="cta-button">View Press Releases</a>
        </div>
    </section>

    <section class="features">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 3rem; color: #1a1a1a;">What We Do</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <h3>Strategic Partnerships</h3>
                    <p>We collaborate with industry leaders to bring cutting-edge solutions to market and expand our capabilities.</p>
                </div>
                <div class="feature-card">
                    <h3>Research & Innovation</h3>
                    <p>Our research collaborations with top institutions advance the state of technology and drive industry breakthroughs.</p>
                </div>
                <div class="feature-card">
                    <h3>Global Distribution</h3>
                    <p>Through strategic distribution and logistics partnerships, we reach customers worldwide with speed and reliability.</p>
                </div>
                <div class="feature-card">
                    <h3>Joint Ventures</h3>
                    <p>We create joint ventures with select partners to enter new markets and develop innovative solutions together.</p>
                </div>
                <div class="feature-card">
                    <h3>Investor Relations</h3>
                    <p>We maintain strong relationships with our investors and keep them informed of company growth and opportunities.</p>
                </div>
                <div class="feature-card">
                    <h3>Marketing Excellence</h3>
                    <p>Our marketing partnerships amplify our message and connect us with audiences across all channels.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="press-section">
        <div class="container">
            <h2>Latest Press Releases</h2>
            <div class="press-intro">
                <p>Stay informed about TechCorp's latest partnerships, collaborations, and business developments. Explore our comprehensive press release archive featuring investor relations updates, research initiatives, distribution agreements, and more.</p>
            </div>
            <div class="press-link-container">
                <a href="/press/archive" class="press-link-button">Browse All Press Releases →</a>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2024 TechCorp. All rights reserved.</p>
            <p>Web Scraping Test Suite - Mock Website for Testing Press Release Extraction</p>
        </div>
    </footer>
</body>
</html>
```

---

### Press Releases Archive (Deployable with Node.js/Express)

Save as `server.js` (requires Node.js):

```javascript
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Load config
const config = JSON.parse(fs.readFileSync('./mock-website-config.json', 'utf-8'));

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Serve homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Press releases archive (paginated)
app.get('/press/archive', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const type = req.query.type || null;
    const year = req.query.year || null;
    
    let releases = [...config.releases];
    
    // Filter by relationship type if provided
    if (type) {
        releases = releases.filter(r => 
            r.relationships.some(rel => rel.type === type)
        );
    }
    
    // Filter by year if provided
    if (year) {
        releases = releases.filter(r => r.date.startsWith(year));
    }
    
    const itemsPerPage = 10;
    const totalPages = Math.ceil(releases.length / itemsPerPage);
    const startIdx = (page - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const paginatedReleases = releases.slice(startIdx, endIdx);
    
    res.render('archive', {
        releases: paginatedReleases,
        currentPage: page,
        totalPages: totalPages,
        totalReleases: releases.length,
        selectedType: type,
        selectedYear: year
    });
});

// Individual press release
app.get('/press/:id', (req, res) => {
    const release = config.releases.find(r => r.id === req.params.id);
    
    if (!release) {
        return res.status(404).render('404');
    }
    
    if (release.status === 'dead' && release.httpStatus === 404) {
        return res.status(404).render('404');
    }
    
    res.render('release', { release });
});

// PDF serving
app.get('/press/:id.pdf', (req, res) => {
    const release = config.releases.find(r => r.id === req.params.id);
    
    if (!release || !release.pdfUrl) {
        return res.status(404).send('PDF not found');
    }
    
    // In real implementation, serve actual PDF file
    res.contentType('application/pdf');
    res.send('PDF content for ' + release.title);
});

app.listen(3000, () => {
    console.log('Mock website running on http://localhost:3000');
});
```

Save as `views/archive.ejs`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Press Releases Archive - TechCorp</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }
        
        header {
            background-color: #1a1a1a;
            color: white;
            padding: 1rem 0;
        }
        
        .container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
        
        .breadcrumb {
            padding: 1rem 0;
            color: #666;
        }
        
        .breadcrumb a {
            color: #667eea;
            text-decoration: none;
        }
        
        h1 { margin: 2rem 0 1rem; color: #1a1a1a; }
        
        .filters {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            margin: 2rem 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .filter-group {
            display: inline-block;
            margin-right: 2rem;
        }
        
        .filter-group label {
            font-weight: bold;
            margin-right: 0.5rem;
        }
        
        .release-item {
            background: white;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border-left: 4px solid #667eea;
        }
        
        .release-title {
            font-size: 1.3rem;
            margin-bottom: 0.5rem;
        }
        
        .release-title a {
            color: #667eea;
            text-decoration: none;
        }
        
        .release-title a:hover {
            text-decoration: underline;
        }
        
        .release-date {
            color: #999;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }
        
        .release-body {
            color: #666;
            margin-bottom: 1rem;
        }
        
        .relationships {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .relationship-tag {
            background-color: #e8f0fe;
            color: #1a1a1a;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.85rem;
        }
        
        .pagination {
            text-align: center;
            margin: 2rem 0;
        }
        
        .pagination a, .pagination span {
            display: inline-block;
            padding: 0.5rem 1rem;
            margin: 0.25rem;
            background: white;
            text-decoration: none;
            color: #667eea;
            border-radius: 4px;
            border: 1px solid #ddd;
        }
        
        .pagination a:hover {
            background-color: #667eea;
            color: white;
        }
        
        .pagination .current {
            background-color: #667eea;
            color: white;
            border-color: #667eea;
        }
        
        footer {
            background-color: #1a1a1a;
            color: white;
            text-align: center;
            padding: 2rem;
            margin-top: 3rem;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 24px; font-weight: bold; color: #00d4ff;">TechCorp</div>
                <a href="/" style="color: white; text-decoration: none;">← Back to Home</a>
            </div>
        </div>
    </header>

    <div class="container">
        <div class="breadcrumb">
            <a href="/">Home</a> / <a href="/press/archive">Press Releases</a>
        </div>

        <h1>Press Releases Archive</h1>
        <p style="color: #666; margin-bottom: 2rem;">Showing <%= totalReleases %> press releases</p>

        <div class="filters">
            <form method="get" style="display: flex; gap: 2rem; flex-wrap: wrap;">
                <div class="filter-group">
                    <label>Relationship Type:</label>
                    <select name="type">
                        <option value="">All Types</option>
                        <option value="partnership" <%= selectedType === 'partnership' ? 'selected' : '' %>>Partnership</option>
                        <option value="research_collaboration" <%= selectedType === 'research_collaboration' ? 'selected' : '' %>>Research</option>
                        <option value="joint_venture" <%= selectedType === 'joint_venture' ? 'selected' : '' %>>Joint Venture</option>
                        <option value="investor_relations" <%= selectedType === 'investor_relations' ? 'selected' : '' %>>Investor Relations</option>
                        <option value="distribution_logistics" <%= selectedType === 'distribution_logistics' ? 'selected' : '' %>>Distribution</option>
                        <option value="marketing" <%= selectedType === 'marketing' ? 'selected' : '' %>>Marketing</option>
                        <option value="manufacturing" <%= selectedType === 'manufacturing' ? 'selected' : '' %>>Manufacturing</option>
                    </select>
                </div>
                <button type="submit" style="background-color: #667eea; color: white; padding: 0.5rem 1.5rem; border: none; border-radius: 4px; cursor: pointer;">Filter</button>
            </form>
        </div>

        <div class="releases">
            <% releases.forEach(release => { %>
                <div class="release-item">
                    <div class="release-title">
                        <a href="/press/<%= release.id %>"><%= release.title %></a>
                        <% if (release.format === 'pdf') { %>
                            <span style="background-color: #ffc107; color: black; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; margin-left: 0.5rem;">PDF</span>
                        <% } %>
                    </div>
                    <div class="release-date"><%= release.date %></div>
                    <div class="release-body"><%= release.body.substring(0, 150) %>...</div>
                    <div class="relationships">
                        <% release.relationships.forEach(rel => { %>
                            <span class="relationship-tag"><%= rel.company %> - <%= rel.type.replace(/_/g, ' ') %></span>
                        <% }); %>
                    </div>
                </div>
            <% }); %>
        </div>

        <div class="pagination">
            <% if (currentPage > 1) { %>
                <a href="?page=1<%= selectedType ? '&type=' + selectedType : '' %><%= selectedYear ? '&year=' + selectedYear : '' %>">« First</a>
                <a href="?page=<%= currentPage - 1 %><%= selectedType ? '&type=' + selectedType : '' %><%= selectedYear ? '&year=' + selectedYear : '' %>">‹ Prev</a>
            <% } %>

            <span>Page <%= currentPage %> of <%= totalPages %></span>

            <% if (currentPage < totalPages) { %>
                <a href="?page=<%= currentPage + 1 %><%= selectedType ? '&type=' + selectedType : '' %><%= selectedYear ? '&year=' + selectedYear : '' %>">Next ›</a>
                <a href="?page=<%= totalPages %><%= selectedType ? '&type=' + selectedType : '' %><%= selectedYear ? '&year=' + selectedYear : '' %>">Last »</a>
            <% } %>
        </div>
    </div>

    <footer>
        <p>&copy; 2024 TechCorp. Web Scraping Test Suite</p>
    </footer>
</body>
</html>
```

---

### Quick Start (Local Deployment)

**Option 1: Static HTML (Simplest)**
1. Save `index.html` to your web root
2. Create `/press/archive.html` with press releases (static list)
3. Serve with any static web server

**Option 2: Node.js + Express**
1. Install Node.js
2. Create project folder: `mkdir techcorp-mock && cd techcorp-mock`
3. Install dependencies: `npm install express ejs`
4. Copy `mock-website-config.json`, `server.js`, `index.html`
5. Create `views/` folder with `archive.ejs` and `release.ejs`
6. Run: `node server.js`
7. Visit: `http://localhost:3000`

**Option 3: Docker**
```dockerfile
FROM node:18
WORKDIR /app
COPY mock-website-config.json server.js index.html ./
COPY views ./views
RUN npm install express ejs
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## Files Provided

1. **mock-website-config.json** — Complete press release dataset with metadata
2. **MOCK_WEBSITE_GUIDE.md** — This documentation file with deployable code
3. **index.html** — Homepage (included in guide, or copy from above)
4. **server.js** — Node.js/Express server (included in guide, or copy from above)
5. **views/archive.ejs** — Press releases archive template (included in guide)

You can use this to:
- Deploy a fully functional mock website locally or to a server
- Test web scraping solutions against realistic press release extraction
- Validate scraper handling of different content types and complexities
- Track which features the scraper handles well vs. where it fails
