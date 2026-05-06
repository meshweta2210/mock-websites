# Nine Mock Websites Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create 9 new mock websites (website 2-10) with dynamic press release generation, random navigation depths, random complexity features, and zodiac company branding.

**Architecture:** Each website is an independent Express.js application with a press release generator that creates 7-12 unique releases on each page load. Complexity features (dynamic generation, inconsistent HTML, pagination, rate limiting, JS rendering, redirect chains) are randomly assigned per website. Navigation depth (1, 2, or 3 levels to press releases) is also randomized per website.

**Tech Stack:** Node.js, Express.js, Vanilla JavaScript (for JS rendering sites), HTML5/CSS3

---

## File Structure

### New Files to Create

**Shared Utilities:**
- `lib/press-release-generator.js` - Core press release generator (shared across all sites)
- `lib/zodiac-companies.js` - Company names and properties
- `lib/complexity-config.js` - Complexity feature assignments (random per website)

**Per Website (website 2-10):**
- `website N/server.js` - Express server with complexity middlewares
- `website N/press-release-data.js` - Website-specific press release fetcher
- `website N/homepage.html` - Homepage (1, 2, or 3-level navigation)
- `website N/press-releases.html` - Press releases list page (dynamic/paginated)
- `website N/pr-template.html` - Template for individual press release pages
- `website N/.env` - Configuration (port, complexity features, rate limits)
- `website N/.gitignore` - Git ignore rules
- `website N/package.json` - Dependencies (inherits from root, adds site-specific)

**Modified Files:**
- Root `start.js` - Updated to launch websites 2-10
- Root `package.json` - Updated with workspace or shared dependencies

---

## Implementation Tasks

### Task 1: Create Shared Press Release Generator

**Files:**
- Create: `lib/press-release-generator.js`
- Create: `lib/zodiac-companies.js`
- Create: `lib/complexity-config.js`

- [ ] **Step 1: Create zodiac companies configuration**

Create `lib/zodiac-companies.js`:

```javascript
const zodiacCompanies = [
  { id: 'taurus', name: 'Taurus', displayName: 'Taurus Company' },
  { id: 'pisces', name: 'Pisces', displayName: 'Pisces Company' },
  { id: 'libra', name: 'Libra', displayName: 'Libra Company' },
  { id: 'scorpio', name: 'Scorpio', displayName: 'Scorpio Company' },
  { id: 'leo', name: 'Leo', displayName: 'Leo Company' },
  { id: 'virgo', name: 'Virgo', displayName: 'Virgo Company' },
  { id: 'gemini', name: 'Gemini', displayName: 'Gemini Company' },
  { id: 'aries', name: 'Aries', displayName: 'Aries Company' },
  { id: 'aquarius', name: 'Aquarius', displayName: 'Aquarius Company' }
];

const relationshipTypes = [
  'partnership',
  'research_collaboration',
  'joint_venture',
  'investor_relations',
  'distribution_logistics',
  'marketing_initiative',
  'manufacturing_agreement'
];

const pressReleaseTemplates = [
  '{company} Announces Strategic Partnership with {partner}',
  '{company} and {partner} Launch Joint Research Initiative',
  '{company} Receives Investment from {partner}',
  '{company} Expands Distribution with {partner} Agreement',
  '{company} Collaborates with {partner} on {relationship} Project',
  '{company} Forms Manufacturing Alliance with {partner}',
  '{company} Partners with {partner} for Market Expansion'
];

const bodyTemplates = [
  '{company} today announced a strategic partnership with {partner}. The collaboration aims to {objective}.',
  '{company} and {partner} have joined forces to {objective}. The partnership combines expertise in {domain}.',
  '{company} is pleased to announce a new agreement with {partner}. This {relationship} strengthens {company}\'s position in the market.',
  'In a landmark deal, {company} and {partner} have agreed to {objective}. The partnership focuses on {domain}.'
];

module.exports = {
  zodiacCompanies,
  relationshipTypes,
  pressReleaseTemplates,
  bodyTemplates
};
```

- [ ] **Step 2: Create complexity configuration**

Create `lib/complexity-config.js`:

```javascript
const complexityFeatures = [
  'dynamic_generation',
  'inconsistent_html',
  'pagination',
  'rate_limiting',
  'js_rendering',
  'redirect_chains'
];

function assignComplexityFeatures(websiteId) {
  // Each website gets 2-4 random features
  const numFeatures = Math.floor(Math.random() * 3) + 2; // 2-4
  const shuffled = complexityFeatures.sort(() => Math.random() - 0.5);
  const assigned = shuffled.slice(0, numFeatures);
  
  return {
    websiteId,
    features: assigned,
    hasFeature: (feature) => assigned.includes(feature)
  };
}

function getRandomNavigationDepth() {
  // 1, 2, or 3 levels
  return Math.floor(Math.random() * 3) + 1;
}

module.exports = {
  complexityFeatures,
  assignComplexityFeatures,
  getRandomNavigationDepth
};
```

- [ ] **Step 3: Create press release generator**

Create `lib/press-release-generator.js`:

```javascript
const { zodiacCompanies, relationshipTypes, pressReleaseTemplates, bodyTemplates } = require('./zodiac-companies');

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomItems(array, count) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(getRandomItem(array));
  }
  return result;
}

function formatDate(type) {
  const date = new Date();
  const formats = {
    iso: date.toISOString().split('T')[0], // 2026-05-06
    long: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), // May 6, 2026
    slash: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}` // 5/6/2026
  };
  return formats[type] || formats.iso;
}

function generatePressReleases(companyId, count = null) {
  const numReleases = count || (Math.floor(Math.random() * 6) + 7); // 7-12
  const company = zodiacCompanies.find(c => c.id === companyId);
  const otherCompanies = zodiacCompanies.filter(c => c.id !== companyId);
  
  const releases = [];
  
  for (let i = 0; i < numReleases; i++) {
    const partner = getRandomItem(otherCompanies);
    const relationType = getRandomItem(relationshipTypes);
    const titleTemplate = getRandomItem(pressReleaseTemplates);
    const bodyTemplate = getRandomItem(bodyTemplates);
    const dateFormat = getRandomItem(['iso', 'long', 'slash']);
    
    const objectives = [
      'accelerate digital transformation',
      'expand market presence',
      'drive innovation',
      'enhance product offerings',
      'improve customer experience',
      'streamline operations',
      'leverage combined expertise'
    ];
    
    const domains = [
      'artificial intelligence',
      'cloud infrastructure',
      'supply chain management',
      'data analytics',
      'enterprise solutions',
      'digital marketing'
    ];
    
    const title = titleTemplate
      .replace('{company}', company.displayName)
      .replace('{partner}', partner.displayName);
    
    const body = bodyTemplate
      .replace('{company}', company.displayName)
      .replace('{partner}', partner.displayName)
      .replace('{objective}', getRandomItem(objectives))
      .replace('{domain}', getRandomItem(domains))
      .replace('{relationship}', relationType.replace(/_/g, ' '));
    
    releases.push({
      id: `pr-${String(i + 1).padStart(3, '0')}`,
      title,
      date: formatDate(dateFormat),
      dateObj: new Date(),
      body,
      company: company.displayName,
      partner: partner.displayName,
      relationships: [
        {
          type: relationType,
          company: partner.displayName,
          description: `${relationType.replace(/_/g, ' ')} with ${partner.displayName}`
        }
      ],
      format: Math.random() > 0.8 ? 'pdf' : 'html',
      url: `/pr-${String(i + 1).padStart(3, '0')}.html`
    });
  }
  
  return releases;
}

module.exports = {
  generatePressReleases,
  getRandomItem,
  getRandomItems,
  formatDate
};
```

- [ ] **Step 4: Commit shared utilities**

```bash
git add lib/press-release-generator.js lib/zodiac-companies.js lib/complexity-config.js
git commit -m "feat: add shared utilities for press release generation and complexity config"
```

---

### Task 2: Create Website 2 (Taurus) Template

**Files:**
- Create: `website 2/server.js`
- Create: `website 2/package.json`
- Create: `website 2/.env`
- Create: `website 2/.gitignore`
- Create: `website 2/press-release-data.js`
- Create: `website 2/homepage.html`
- Create: `website 2/press-releases.html`

- [ ] **Step 1: Create website 2 folder structure**

```bash
mkdir -p "website 2"
```

- [ ] **Step 2: Create website 2 package.json**

Create `website 2/package.json`:

```json
{
  "name": "taurus-mock-website",
  "version": "1.0.0",
  "description": "Taurus Company Mock Website for Web Scraping",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

- [ ] **Step 3: Create website 2 .env**

Create `website 2/.env`:

```
PORT=3002
COMPANY_ID=taurus
NAVIGATION_DEPTH=2
HAS_DYNAMIC_GENERATION=true
HAS_INCONSISTENT_HTML=true
HAS_PAGINATION=false
HAS_RATE_LIMITING=true
HAS_JS_RENDERING=false
HAS_REDIRECT_CHAINS=false
RATE_LIMIT_THRESHOLD=20
```

- [ ] **Step 4: Create website 2 .gitignore**

Create `website 2/.gitignore`:

```
node_modules/
npm-debug.log
.DS_Store
*.env
*.env.local
.vscode/
.idea/
dist/
build/
```

- [ ] **Step 5: Create website 2 press-release-data.js**

Create `website 2/press-release-data.js`:

```javascript
const { generatePressReleases } = require('../lib/press-release-generator');

function getPressReleases(count = null) {
  const companyId = process.env.COMPANY_ID || 'taurus';
  return generatePressReleases(companyId, count);
}

function getPressReleaseById(id) {
  const releases = getPressReleases();
  return releases.find(r => r.id === id);
}

module.exports = {
  getPressReleases,
  getPressReleaseById
};
```

- [ ] **Step 6: Create website 2 server.js**

Create `website 2/server.js`:

```javascript
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

const { getPressReleases, getPressReleaseById } = require('./press-release-data');
const { getRandomItem } = require('../lib/press-release-generator');
const { assignComplexityFeatures, getRandomNavigationDepth } = require('../lib/complexity-config');

// Configuration
const companyId = process.env.COMPANY_ID || 'taurus';
const navigationDepth = parseInt(process.env.NAVIGATION_DEPTH) || getRandomNavigationDepth();
const complexityConfig = assignComplexityFeatures(companyId);

// Rate limiting middleware
const requestCounts = {};
app.use((req, res, next) => {
  if (complexityConfig.hasFeature('rate_limiting')) {
    const clientIp = req.ip;
    const hour = new Date().getHours();
    const key = `${clientIp}-${hour}`;
    
    requestCounts[key] = (requestCounts[key] || 0) + 1;
    
    if (requestCounts[key] > parseInt(process.env.RATE_LIMIT_THRESHOLD || 20)) {
      return res.status(429).json({ error: 'Too Many Requests' }).set('Retry-After', '3600');
    }
  }
  next();
});

// Routes based on navigation depth
if (navigationDepth === 1) {
  // 1-level: Home -> Press Releases directly
  app.get('/', (req, res) => {
    const releases = getPressReleases();
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Taurus Company</title></head>
      <body>
        <h1>Taurus Company</h1>
        <a href="/press-releases">View Press Releases</a>
      </body>
      </html>
    `);
  });
  
  app.get('/press-releases', (req, res) => {
    const releases = getPressReleases();
    let html = `
      <!DOCTYPE html>
      <html>
      <head><title>Press Releases - Taurus</title></head>
      <body>
        <h1>Press Releases</h1>
        <ul>
    `;
    
    releases.forEach(release => {
      html += `<li><a href="/pr-${release.id.split('-')[1]}.html">${release.title}</a></li>`;
    });
    
    html += `</ul></body></html>`;
    res.send(html);
  });
} else if (navigationDepth === 2) {
  // 2-level: Home -> Category -> Press Releases
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Taurus Company</title></head>
      <body>
        <h1>Taurus Company</h1>
        <a href="/news">News & Updates</a>
      </body>
      </html>
    `);
  });
  
  app.get('/news', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>News - Taurus</title></head>
      <body>
        <h1>News & Updates</h1>
        <a href="/press-releases">Press Releases</a>
      </body>
      </html>
    `);
  });
  
  app.get('/press-releases', (req, res) => {
    const releases = getPressReleases();
    let html = `
      <!DOCTYPE html>
      <html>
      <head><title>Press Releases - Taurus</title></head>
      <body>
        <h1>Press Releases</h1>
        <ul>
    `;
    
    releases.forEach(release => {
      html += `<li><a href="/pr-${release.id.split('-')[1]}.html">${release.title}</a></li>`;
    });
    
    html += `</ul></body></html>`;
    res.send(html);
  });
} else {
  // 3-level: Home -> Category -> Subcategory -> Press Releases
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Taurus Company</title></head>
      <body>
        <h1>Taurus Company</h1>
        <a href="/company">Company</a>
      </body>
      </html>
    `);
  });
  
  app.get('/company', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Company - Taurus</title></head>
      <body>
        <h1>Company</h1>
        <a href="/company/news">News & Media</a>
      </body>
      </html>
    `);
  });
  
  app.get('/company/news', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>News - Taurus</title></head>
      <body>
        <h1>News & Media</h1>
        <a href="/press-releases">Press Releases</a>
      </body>
      </html>
    `);
  });
  
  app.get('/press-releases', (req, res) => {
    const releases = getPressReleases();
    let html = `
      <!DOCTYPE html>
      <html>
      <head><title>Press Releases - Taurus</title></head>
      <body>
        <h1>Press Releases</h1>
        <ul>
    `;
    
    releases.forEach(release => {
      html += `<li><a href="/pr-${release.id.split('-')[1]}.html">${release.title}</a></li>`;
    });
    
    html += `</ul></body></html>`;
    res.send(html);
  });
}

// Individual press release pages
app.get('/pr-:id.html', (req, res) => {
  const releases = getPressReleases();
  const releaseId = `pr-${req.params.id}`;
  const release = releases.find(r => r.id === releaseId);
  
  if (!release) {
    return res.status(404).send('Press release not found');
  }
  
  if (complexityConfig.hasFeature('redirect_chains') && Math.random() > 0.7) {
    return res.redirect(`/pr-${req.params.id}-view`);
  }
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head><title>${release.title}</title></head>
    <body>
      <h1>${release.title}</h1>
      <p><small>${release.date}</small></p>
      <p>${release.body}</p>
      <a href="/press-releases">Back to Press Releases</a>
    </body>
    </html>
  `;
  
  if (complexityConfig.hasFeature('js_rendering')) {
    html = `
      <!DOCTYPE html>
      <html>
      <head><title>${release.title}</title></head>
      <body>
        <div id="content"></div>
        <script>
          document.getElementById('content').innerHTML = '<h1>${release.title}</h1><p><small>${release.date}</small></p><p>${release.body}</p><a href="/press-releases">Back</a>';
        </script>
      </body>
      </html>
    `;
  }
  
  res.send(html);
});

// Redirect chain handling
app.get('/pr-:id-view', (req, res) => {
  res.redirect(`/pr-${req.params.id}.html`);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', company: 'Taurus', navigationDepth, features: complexityConfig.features });
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  Taurus Company Mock Website                              ║
║  URL: http://localhost:${PORT}                            ║
║  Navigation Depth: ${navigationDepth}                                        ║
║  Complexity Features: ${complexityConfig.features.join(', ')}            ║
╚════════════════════════════════════════════════════════════╝
  `);
});
```

- [ ] **Step 7: Commit website 2**

```bash
git add "website 2/"
git commit -m "feat: create website 2 (Taurus Company) template with dynamic content"
```

---

### Task 3: Create Websites 3-10 (Remaining Zodiac Companies)

**Files:**
- Create: `website 3/` through `website 10/` (with all supporting files)

- [ ] **Step 1: Create all website folders 3-10**

```bash
for i in {3..10}; do
  mkdir -p "website $i"
done
```

- [ ] **Step 2: Create each website with configuration**

For each website, create: package.json, .env, .gitignore, press-release-data.js, and server.js

**Website 3 (Pisces):** PORT=3003, COMPANY_ID=pisces, NAVIGATION_DEPTH=1, Features: dynamic_generation, pagination, js_rendering
**Website 4 (Libra):** PORT=3004, COMPANY_ID=libra, NAVIGATION_DEPTH=3, Features: dynamic_generation, inconsistent_html, js_rendering
**Website 5 (Scorpio):** PORT=3005, COMPANY_ID=scorpio, NAVIGATION_DEPTH=2, Features: pagination, rate_limiting, redirect_chains
**Website 6 (Leo):** PORT=3006, COMPANY_ID=leo, NAVIGATION_DEPTH=1, Features: dynamic_generation, rate_limiting
**Website 7 (Virgo):** PORT=3007, COMPANY_ID=virgo, NAVIGATION_DEPTH=3, Features: inconsistent_html, pagination, redirect_chains
**Website 8 (Gemini):** PORT=3008, COMPANY_ID=gemini, NAVIGATION_DEPTH=2, Features: js_rendering, rate_limiting
**Website 9 (Aries):** PORT=3009, COMPANY_ID=aries, NAVIGATION_DEPTH=1, Features: dynamic_generation, inconsistent_html, pagination
**Website 10 (Aquarius):** PORT=3010, COMPANY_ID=aquarius, NAVIGATION_DEPTH=2, Features: all six features

- [ ] **Step 3: Commit all websites 3-10**

```bash
git add "website 3/" "website 4/" "website 5/" "website 6/" "website 7/" "website 8/" "website 9/" "website 10/"
git commit -m "feat: create websites 3-10 with zodiac branding and random complexity"
```

---

### Task 4: Update Root Configuration & Launcher

**Files:**
- Create: `launcher.js`
- Modify: `package.json`

- [ ] **Step 1: Create launcher.js**

Create `launcher.js`:

```javascript
const { spawn } = require('child_process');
const path = require('path');

const websites = [
  { folder: 'website 1', port: 3001 },
  { folder: 'website 2', port: 3002 },
  { folder: 'website 3', port: 3003 },
  { folder: 'website 4', port: 3004 },
  { folder: 'website 5', port: 3005 },
  { folder: 'website 6', port: 3006 },
  { folder: 'website 7', port: 3007 },
  { folder: 'website 8', port: 3008 },
  { folder: 'website 9', port: 3009 },
  { folder: 'website 10', port: 3010 }
];

const processes = [];

websites.forEach(site => {
  const cwd = path.join(__dirname, site.folder);
  const child = spawn('node', ['server.js'], {
    cwd,
    env: { ...process.env, PORT: site.port },
    stdio: 'inherit'
  });
  
  processes.push(child);
  console.log(`Started ${site.folder} on port ${site.port}`);
});

process.on('SIGINT', () => {
  console.log('Shutting down all servers...');
  processes.forEach(p => p.kill());
  process.exit(0);
});
```

- [ ] **Step 2: Update root package.json**

- [ ] **Step 3: Commit launcher configuration**

```bash
git add launcher.js package.json
git commit -m "feat: add launcher script for all 10 websites"
```

---

### Task 5: Install Dependencies

- [ ] **Step 1: Install dependencies for all websites**

```bash
for i in {2..10}; do
  cd "website $i"
  npm install
  cd ..
done
```

- [ ] **Step 2: Commit package-lock files**

```bash
git add "website 2/package-lock.json" "website 3/package-lock.json" "website 4/package-lock.json" "website 5/package-lock.json" "website 6/package-lock.json" "website 7/package-lock.json" "website 8/package-lock.json" "website 9/package-lock.json" "website 10/package-lock.json"
git commit -m "chore: add npm dependencies for websites 2-10"
```

---

### Task 6: Test All Websites Locally

- [ ] **Step 1: Start all websites**

```bash
npm run start:all
```

- [ ] **Step 2: Test individual websites and health checks**

```bash
curl http://localhost:3002/health
curl http://localhost:3003/press-releases
```

- [ ] **Step 3: Verify dynamic content generation**

Make multiple requests and confirm press release counts vary.

---

### Task 7: Final Commit and Deployment

- [ ] **Step 1: Final commit**

```bash
git add -A
git commit -m "feat: complete 9 new mock websites with dynamic generation and complexity"
```

- [ ] **Step 2: Push to GitHub**

```bash
git push origin main
```

---

## Summary

✅ 9 new website folders (website 2-10)  
✅ Dynamic press release generation  
✅ Random navigation depths (1-3 levels)  
✅ Random complexity features (2-4 per site)  
✅ Zodiac company branding  
✅ Launcher for all websites  
✅ Local testing validation  
