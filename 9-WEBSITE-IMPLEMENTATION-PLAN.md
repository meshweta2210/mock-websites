# 9-Website Portfolio Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development to execute tasks. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate 9 complete websites (2-10) with branded homepages, press release systems (2-3 levels deep), cross-website linking, and medium-complexity anti-scraping features (rate limiting, JavaScript rendering, math/image captchas, popups, sessions).

**Architecture:** Template-based independent Express servers. Each website (2-10) gets its own `server.js` following website 1 pattern. Shared utility functions. All files generated and ready for Render deployment.

**Tech Stack:** Node.js, Express, Express-session, Compression

---

## File Structure Overview

Each website folder contains:
```
website-X/
├── server.js                      # Express server (routes, middleware)
├── package.json                   # Dependencies
├── .env                          # Environment variables
├── index.html                    # Homepage
├── company/
│   ├── overview.html
│   └── press-releases.html       # Archive with pagination
├── press-releases/
│   ├── pr-001.html to pr-010.html  # Individual articles
│   └── pr-XXX/                   # Sub-pages (tier 2 sites only)
│       ├── details.html
│       └── related.html
├── public/
│   ├── css/style.css
│   ├── css/captcha.css
│   ├── js/main.js
│   ├── js/captcha.js
│   ├── js/ajax-pagination.js
│   └── images/
├── api/routes.js                 # API endpoints
├── middleware/
│   ├── rate-limiter.js
│   ├── session-handler.js
│   └── auth.js
├── mock-website-config.json
├── press-release-data.js
└── README.md
```

---

## Task 1: Create Shared Utility Functions & Templates

**Files:**
- Create: `Revere/website-template/shared-utils.js`
- Create: `Revere/website-template/html-templates.js`
- Create: `Revere/website-template/captcha-generator.js`

- [ ] **Step 1: Write shared-utils.js**

```javascript
// Revere/website-template/shared-utils.js
const crypto = require('crypto');

exports.generateCompanyId = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

exports.generateMathCaptcha = () => {
  const num1 = Math.floor(Math.random() * 20) + 1;
  const num2 = Math.floor(Math.random() * 20) + 1;
  const operators = ['+', '-'];
  const op = operators[Math.floor(Math.random() * operators.length)];
  const question = `${num1} ${op} ${num2}`;
  const answer = op === '+' ? num1 + num2 : num1 - num2;
  return { question, answer: answer.toString(), type: 'math' };
};

exports.generateImageCaptcha = () => {
  const categories = [
    { name: 'cars', correct: [0, 2] },
    { name: 'trees', correct: [1, 3] },
    { name: 'boats', correct: [0, 1] },
    { name: 'clouds', correct: [2, 3] }
  ];
  const selected = categories[Math.floor(Math.random() * categories.length)];
  return {
    question: `Select all images with ${selected.name}`,
    correct: selected.correct,
    type: 'image',
    images: ['img1', 'img2', 'img3', 'img4']
  };
};

exports.hashAnswer = (answer) => {
  return crypto.createHash('sha256').update(answer).digest('hex');
};

exports.getRandomRelationships = (count = 10) => {
  const types = [
    'supplier', 'distributor', 'marketing_partner',
    'manufacturer', 'competitor', 'joint_venture', 'research_collaboration'
  ];
  const relationships = [];
  for (let i = 0; i < count; i++) {
    relationships.push(types[Math.floor(Math.random() * types.length)]);
  }
  return relationships;
};

exports.getOtherCompanies = (currentWebsite, allCompanies) => {
  return allCompanies.filter(c => c.websiteNumber !== currentWebsite);
};

exports.shouldHaveCaptcha = (articleId) => {
  return parseInt(articleId.replace('pr-', '')) % 5 === 0;
};

exports.shouldHaveSubPages = (articleId, websiteNumber) => {
  const tier2Sites = [3, 5, 7, 9];
  if (!tier2Sites.includes(websiteNumber)) return false;
  return parseInt(articleId.replace('pr-', '')) % 2 === 0;
};

exports.formatDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};
```

- [ ] **Step 2: Write html-templates.js**

```javascript
// Revere/website-template/html-templates.js
exports.homepageTemplate = (config) => {
  const { site, homepage, navigation, design } = config;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${site.company}</title>
  <link rel="stylesheet" href="/public/css/style.css">
  <style>
    :root {
      --primary: ${design.colors.primary};
      --secondary: ${design.colors.secondary};
      --background: ${design.colors.background};
      --text: ${design.colors.text};
    }
  </style>
</head>
<body>
  <header>
    <nav class="navbar">
      <div class="logo">${site.name}</div>
      <div class="menu">
        <a href="/">Home</a>
        <a href="/company/overview.html">About</a>
        <a href="/company/press-releases.html">Press Releases</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  </header>

  <main>
    <section class="hero">
      <h1>${homepage.sections.hero.heading}</h1>
      <p>${homepage.sections.hero.subheading}</p>
      <div class="cta-buttons">
        ${homepage.sections.hero.cta_buttons.map(btn => 
          `<a href="${btn.url}" class="btn btn-${btn.type}">${btn.text}</a>`
        ).join('')}
      </div>
    </section>

    <section class="solutions">
      <h2>${homepage.sections.solutions.title}</h2>
      <p>${homepage.sections.solutions.subtitle}</p>
      <div class="cards">
        ${homepage.sections.solutions.cards.map(card =>
          `<div class="card">
            <h3>${card.title}</h3>
            <p>${card.description}</p>
          </div>`
        ).join('')}
      </div>
    </section>

    <section class="news">
      <h2>${homepage.sections.news.title}</h2>
      <div class="news-grid">
        ${homepage.sections.news.featured_releases.map(release =>
          `<div class="news-card">
            <h3><a href="/press-releases/${release.id}.html">${release.title}</a></h3>
            <p class="date">${release.date}</p>
            <p>${release.excerpt}</p>
          </div>`
        ).join('')}
      </div>
      <a href="/company/press-releases.html" class="btn btn-secondary">View All Press Releases</a>
    </section>
  </main>

  <footer>
    <p>&copy; 2024 ${site.name}. All rights reserved.</p>
  </footer>
</body>
</html>`;
};

exports.articleTemplate = (config, article, captchaNeeded = false) => {
  const captchaHtml = captchaNeeded ? `
    <div class="captcha-container" id="captcha">
      <h3>Verify you're human</h3>
      <div id="captcha-content"></div>
    </div>
  ` : '';

  return `<!DOCTYPE html>
<html>
<head>
  <title>${article.title}</title>
  <link rel="stylesheet" href="/public/css/style.css">
  <link rel="stylesheet" href="/public/css/captcha.css">
</head>
<body>
  <header>
    <nav class="navbar">
      <a href="/">← Back to ${config.site.name}</a>
    </nav>
  </header>

  <main>
    <article>
      <h1>${article.title}</h1>
      <p class="meta">${article.date} | Relationship: <strong>${article.relationship}</strong></p>
      ${captchaHtml}
      <div class="article-content" ${captchaNeeded ? 'style="display:none"' : ''}>
        <p>${article.content}</p>
        ${article.relatedCompany ? `<p class="related">Related: <a href="${article.relatedCompanyUrl}" target="_blank">${article.relatedCompany}</a></p>` : ''}
      </div>
    </article>
  </main>

  <script src="/public/js/captcha.js"></script>
</body>
</html>`;
};

exports.archivePageTemplate = (config, articles) => {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Press Releases - ${config.site.company}</title>
  <link rel="stylesheet" href="/public/css/style.css">
</head>
<body>
  <header>
    <nav class="navbar">
      <a href="/">← Back to Home</a>
      <h1>Press Releases</h1>
    </nav>
  </header>

  <main>
    <div class="archive">
      <div id="articles-container">
        ${articles.slice(0, 3).map(article =>
          `<div class="article-card" data-id="${article.id}">
            <h3><a href="/press-releases/${article.id}.html">${article.title}</a></h3>
            <p class="date">${article.date}</p>
            <span class="relationship-badge">${article.relationship}</span>
            <p>${article.excerpt}</p>
          </div>`
        ).join('')}
      </div>
      ${articles.length > 3 ? '<button id="load-more" class="btn">Load More Articles</button>' : ''}
    </div>
  </main>

  <script src="/public/js/ajax-pagination.js"></script>
</body>
</html>`;
};
```

- [ ] **Step 3: Write captcha-generator.js**

```javascript
// Revere/website-template/captcha-generator.js
exports.generateMathCaptchaHtml = (captcha) => {
  return `
    <div class="captcha-form">
      <p>${captcha.question} = ?</p>
      <input type="text" id="captcha-answer" placeholder="Your answer">
      <button type="button" onclick="submitCaptcha()">Submit</button>
      <p id="captcha-error" style="color:red;display:none;"></p>
    </div>
  `;
};

exports.generateImageCaptchaHtml = (captcha, imageUrls) => {
  const imageHtml = captcha.images.map((img, idx) =>
    `<label class="image-option">
      <input type="checkbox" name="image-${idx}" data-index="${idx}">
      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E
        %3Crect fill='%23${Math.random().toString(16).slice(2, 8)}' width='100' height='100'/%3E
      %3C/svg%3E" alt="Image ${idx}">
    </label>`
  ).join('');

  return `
    <div class="image-captcha">
      <p>${captcha.question}</p>
      <div class="image-grid">
        ${imageHtml}
      </div>
      <button type="button" onclick="submitImageCaptcha()">Verify</button>
      <p id="captcha-error" style="color:red;display:none;"></p>
    </div>
  `;
};
```

- [ ] **Step 4: Commit**

```bash
cd "c:\Users\sbaranwal\Claude\mock websites\Revere"
git add website-template/shared-utils.js website-template/html-templates.js website-template/captcha-generator.js
git commit -m "feat: add shared utility functions and HTML templates"
```

---

## Task 2: Create Company Profiles & Configuration

**Files:**
- Create: `Revere/companies-config.json`
- Create: `Revere/website-template/generate-configs.js`

- [ ] **Step 1: Write companies-config.json**

```json
{
  "companies": [
    {
      "websiteNumber": 2,
      "name": "TechVenture Solutions",
      "shortName": "TechVenture",
      "industry": "SaaS/Cloud",
      "tagline": "Enterprise Software for the Digital Age",
      "colors": {
        "primary": "#003d82",
        "secondary": "#005ba8",
        "background": "#f8fafb",
        "text": "#2c3e50"
      },
      "solutions": [
        {
          "title": "Cloud Infrastructure",
          "description": "Scalable cloud solutions for enterprise applications"
        },
        {
          "title": "API Management",
          "description": "Comprehensive API gateway and management platform"
        },
        {
          "title": "DevOps Tools",
          "description": "Automated deployment and monitoring solutions"
        },
        {
          "title": "Security Suite",
          "description": "Enterprise-grade security and compliance tools"
        }
      ],
      "partners": ["CloudCore", "DataSync", "SecureNet", "DevOpsHub"]
    },
    {
      "websiteNumber": 3,
      "name": "EcoFlow Industries",
      "shortName": "EcoFlow",
      "industry": "Manufacturing/Logistics",
      "tagline": "Supply Chain Excellence Through Innovation",
      "colors": {
        "primary": "#1e7e34",
        "secondary": "#2d9d47",
        "background": "#f0f5f1",
        "text": "#1a3a1f"
      },
      "solutions": [
        {
          "title": "Logistics Network",
          "description": "Global supply chain optimization and tracking"
        },
        {
          "title": "Manufacturing Solutions",
          "description": "Smart factory automation and production planning"
        },
        {
          "title": "Distribution Management",
          "description": "End-to-end distribution center operations"
        },
        {
          "title": "Inventory Control",
          "description": "Real-time inventory and warehouse management"
        }
      ],
      "partners": ["GlobalShip", "ManufactureHub", "LogisticsPro", "SupplyNetworks"]
    },
    {
      "websiteNumber": 4,
      "name": "FinanceCore Analytics",
      "shortName": "FinanceCore",
      "industry": "Finance",
      "tagline": "Data-Driven Financial Intelligence",
      "colors": {
        "primary": "#003f5c",
        "secondary": "#58508d",
        "background": "#f9f9fb",
        "text": "#1c1f2c"
      },
      "solutions": [
        {
          "title": "Risk Analytics",
          "description": "Advanced risk assessment and portfolio analysis"
        },
        {
          "title": "Trading Platforms",
          "description": "High-performance algorithmic trading infrastructure"
        },
        {
          "title": "Compliance Tools",
          "description": "Regulatory compliance and reporting automation"
        },
        {
          "title": "Market Intelligence",
          "description": "Real-time market data and predictive analytics"
        }
      ],
      "partners": ["MarketData", "TradingEngine", "ComplianceNet", "FinanceHub"]
    },
    {
      "websiteNumber": 5,
      "name": "BioGen Therapeutics",
      "shortName": "BioGen",
      "industry": "Life Sciences",
      "tagline": "Advancing Human Health Through Science",
      "colors": {
        "primary": "#0066cc",
        "secondary": "#0088ff",
        "background": "#f0f5ff",
        "text": "#002244"
      },
      "solutions": [
        {
          "title": "Drug Development",
          "description": "End-to-end therapeutic development services"
        },
        {
          "title": "Clinical Trials",
          "description": "Comprehensive clinical research and trial management"
        },
        {
          "title": "Manufacturing",
          "description": "GMP-compliant biological manufacturing"
        },
        {
          "title": "Regulatory Services",
          "description": "FDA and global regulatory pathway support"
        }
      ],
      "partners": ["PharmaCorp", "BioResearch", "ClinicalLabs", "TherapyHub"]
    },
    {
      "websiteNumber": 6,
      "name": "RetailMax Networks",
      "shortName": "RetailMax",
      "industry": "Retail/E-commerce",
      "tagline": "Omnichannel Retail Excellence",
      "colors": {
        "primary": "#d32f2f",
        "secondary": "#f57c00",
        "background": "#fff5f0",
        "text": "#3e2723"
      },
      "solutions": [
        {
          "title": "E-Commerce Platform",
          "description": "Advanced omnichannel retail solutions"
        },
        {
          "title": "Inventory Optimization",
          "description": "Smart inventory and demand forecasting"
        },
        {
          "title": "Customer Analytics",
          "description": "Behavioral analytics and personalization"
        },
        {
          "title": "Payment Solutions",
          "description": "Secure multi-channel payment processing"
        }
      ],
      "partners": ["RetailTech", "PaymentHub", "DeliveryPro", "CustomerAnalytics"]
    },
    {
      "websiteNumber": 7,
      "name": "GreenEnergy Corp",
      "shortName": "GreenEnergy",
      "industry": "Energy",
      "tagline": "Powering a Sustainable Future",
      "colors": {
        "primary": "#388e3c",
        "secondary": "#66bb6a",
        "background": "#f1f8e9",
        "text": "#1b5e20"
      },
      "solutions": [
        {
          "title": "Solar Solutions",
          "description": "Large-scale photovoltaic system design and deployment"
        },
        {
          "title": "Wind Integration",
          "description": "Wind farm optimization and grid integration"
        },
        {
          "title": "Energy Storage",
          "description": "Advanced battery and storage systems"
        },
        {
          "title": "Smart Grid",
          "description": "Intelligent grid management and distribution"
        }
      ],
      "partners": ["SolarTech", "WindPower", "GridSolutions", "EnergyHub"]
    },
    {
      "websiteNumber": 8,
      "name": "CloudScale Innovations",
      "shortName": "CloudScale",
      "industry": "Cloud Infrastructure",
      "tagline": "Infrastructure Simplified",
      "colors": {
        "primary": "#1976d2",
        "secondary": "#42a5f5",
        "background": "#f3f6ff",
        "text": "#0d47a1"
      },
      "solutions": [
        {
          "title": "Kubernetes Services",
          "description": "Managed container orchestration platform"
        },
        {
          "title": "Database Services",
          "description": "Fully managed database solutions"
        },
        {
          "title": "Serverless Computing",
          "description": "Event-driven serverless architecture"
        },
        {
          "title": "Disaster Recovery",
          "description": "Business continuity and backup solutions"
        }
      ],
      "partners": ["ContainerHub", "DatabasePro", "CloudOps", "BackupServices"]
    },
    {
      "websiteNumber": 9,
      "name": "SupplyChain Dynamics",
      "shortName": "SupplyChain",
      "industry": "Supply Chain",
      "tagline": "Connected Supply Chains",
      "colors": {
        "primary": "#7b1fa2",
        "secondary": "#ab47bc",
        "background": "#f3e5f5",
        "text": "#2e1a47"
      },
      "solutions": [
        {
          "title": "Visibility Platform",
          "description": "End-to-end supply chain visibility and tracking"
        },
        {
          "title": "Demand Planning",
          "description": "AI-powered demand forecasting"
        },
        {
          "title": "Supplier Network",
          "description": "Supplier management and collaboration"
        },
        {
          "title": "Blockchain Integration",
          "description": "Distributed ledger for supply chain"
        }
      ],
      "partners": ["VisibilityHub", "ForecastPro", "SupplierConnect", "BlockchainTech"]
    },
    {
      "websiteNumber": 10,
      "name": "MediaPulse Communications",
      "shortName": "MediaPulse",
      "industry": "Media/Publishing",
      "tagline": "Content Intelligence Platform",
      "colors": {
        "primary": "#e91e63",
        "secondary": "#ff69b4",
        "background": "#fce4ec",
        "text": "#880e4f"
      },
      "solutions": [
        {
          "title": "Content Management",
          "description": "Unified content management platform"
        },
        {
          "title": "Audience Analytics",
          "description": "Deep audience insights and engagement"
        },
        {
          "title": "Ad Technology",
          "description": "Programmatic advertising platform"
        },
        {
          "title": "Distribution Network",
          "description": "Multi-channel content distribution"
        }
      ],
      "partners": ["ContentHub", "AdTech", "MediaPartners", "DistributionNet"]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
cd "c:\Users\sbaranwal\Claude\mock websites\Revere"
git add companies-config.json
git commit -m "feat: add company profiles configuration"
```

---

## Task 3: Generate Press Release Data for All 9 Sites

**Files:**
- Create: `Revere/press-releases-generator.js`

- [ ] **Step 1: Write press-releases-generator.js**

```javascript
// Revere/press-releases-generator.js
const fs = require('fs');

const pressReleaseTemplates = [
  (company, relatedCompany, type) => ({
    title: `${company} Announces Strategic Partnership with ${relatedCompany}`,
    excerpt: `${company} today announced a new partnership with ${relatedCompany} to enhance service delivery.`,
    content: `${company} is pleased to announce a strategic partnership with ${relatedCompany}. This collaboration aims to combine expertise and resources to deliver innovative solutions to market. The partnership represents a significant step in our growth strategy and will enable both companies to better serve customers across multiple regions. Key focus areas include technology integration, customer support, and market expansion initiatives.`
  }),
  (company, relatedCompany, type) => ({
    title: `${company} Expands Operations Through Joint Venture with ${relatedCompany}`,
    excerpt: `New joint venture between ${company} and ${relatedCompany} to capture emerging markets.`,
    content: `${company} and ${relatedCompany} have established a new joint venture to address rapidly growing demand in key markets. This 50-50 partnership combines the operational expertise of ${company} with the market presence of ${relatedCompany}. The venture is expected to generate significant revenue within the first year and create over 100 new jobs. Both companies remain committed to leveraging their respective strengths to drive innovation and customer satisfaction.`
  }),
  (company, relatedCompany, type) => ({
    title: `${company} Names ${relatedCompany} as Preferred Distribution Partner`,
    excerpt: `${relatedCompany} selected to lead distribution efforts for ${company} in key regions.`,
    content: `${company} has selected ${relatedCompany} as its preferred distribution partner for expansion into new markets. The partnership leverages ${relatedCompany}'s established logistics network and customer relationships. This distribution agreement is expected to increase product availability and reduce time-to-market for ${company}'s offerings. The companies will collaborate on inventory management, customer support, and market development initiatives.`
  }),
  (company, relatedCompany, type) => ({
    title: `${company} and ${relatedCompany} Launch Joint Research Initiative`,
    excerpt: `Collaborative research program to develop next-generation solutions in industry.`,
    content: `${company} and ${relatedCompany} have launched a joint research collaboration focused on developing cutting-edge technologies for the industry. The multi-year research program brings together leading scientists and engineers from both organizations. Initial focus areas include artificial intelligence, machine learning, and advanced analytics. Both companies are committed to publishing research findings and contributing to industry standards.`
  }),
  (company, relatedCompany, type) => ({
    title: `${company} Acquires Key Technology from ${relatedCompany}`,
    excerpt: `Technology acquisition to strengthen ${company}'s product portfolio.`,
    content: `${company} has acquired a key technology platform from ${relatedCompany}, significantly enhancing its product capabilities. The acquisition includes proprietary algorithms, patents, and engineering expertise. This strategic move allows ${company} to accelerate product development and improve time-to-market. The integration is expected to be completed within six months, with full platform availability in Q3.`
  }),
  (company, relatedCompany, type) => ({
    title: `${company} Enters Competitive Space with ${relatedCompany} Partnership`,
    excerpt: `New competitive challenge emerges as ${company} partners to target ${relatedCompany}'s market segments.`,
    content: `${company} has announced plans to compete directly with ${relatedCompany} in several key market segments through a new product line. The move comes as ${company} looks to expand its market share and strengthen its competitive position. Both companies acknowledge the competitive landscape and remain focused on innovation and customer satisfaction. Industry analysts expect increased competition will benefit customers through improved products and services.`
  }),
  (company, relatedCompany, type) => ({
    title: `${company} Announces Supply Agreement with ${relatedCompany}`,
    excerpt: `New supplier relationship to support ${company}'s manufacturing operations.`,
    content: `${company} has established a long-term supply agreement with ${relatedCompany} to source critical components for its manufacturing operations. The multi-year agreement ensures reliable supply chain continuity and cost stability. ${relatedCompany} will deliver components meeting ${company}'s strict quality standards. The partnership is expected to reduce production costs by 15% while maintaining quality assurance.`
  }),
  (company, relatedCompany, type) => ({
    title: `${company} Recruits Talent from Competitor ${relatedCompany}`,
    excerpt: `${company} hires key executives and engineering talent from ${relatedCompany}.`,
    content: `${company} has recruited several key executives and senior engineers from competitor ${relatedCompany}. The talent acquisition strengthens ${company}'s leadership team and accelerates product development initiatives. New hires bring valuable industry experience and technical expertise. The company remains committed to building a world-class team through both internal development and strategic hiring.`
  }),
  (company, relatedCompany, type) => ({
    title: `${company} and ${relatedCompany} Sign Marketing Collaboration Agreement`,
    excerpt: `Joint marketing initiative to increase brand awareness and market penetration.`,
    content: `${company} and ${relatedCompany} have signed a comprehensive marketing collaboration agreement. The partnership includes joint advertising campaigns, co-branded content, and shared events. Both companies will leverage each other's customer bases to increase market reach and brand awareness. The campaign is expected to reach over 10 million potential customers in key demographics.`
  }),
  (company, relatedCompany, type) => ({
    title: `${company} Announces Manufacturing Partnership with ${relatedCompany}`,
    excerpt: `New manufacturing facility established through partnership with ${relatedCompany}.`,
    content: `${company} has partnered with ${relatedCompany} to establish a new state-of-the-art manufacturing facility. The facility will combine ${company}'s operational expertise with ${relatedCompany}'s technical capabilities. Production is scheduled to begin in Q4 with initial capacity of 50,000 units per month. The facility will employ 500+ workers and utilize cutting-edge automation and quality control systems.`
  })
];

function generatePressReleases(companiesConfig) {
  const companies = companiesConfig.companies;
  const allCompanies = companies.map(c => c.name);

  companies.forEach(company => {
    const articles = [];
    const relationshipTypes = [
      'supplier', 'distributor', 'marketing_partner',
      'manufacturer', 'competitor', 'joint_venture', 'research_collaboration'
    ];

    for (let i = 1; i <= 10; i++) {
      const relType = relationshipTypes[Math.floor(Math.random() * relationshipTypes.length)];
      const relatedCompany = allCompanies[Math.floor(Math.random() * allCompanies.length)];
      const templateIndex = Math.floor(Math.random() * pressReleaseTemplates.length);
      const article = pressReleaseTemplates[templateIndex](company.name, relatedCompany, relType);

      const daysAgo = i * 7 + Math.floor(Math.random() * 7);
      const dateObj = new Date();
      dateObj.setDate(dateObj.getDate() - daysAgo);

      articles.push({
        id: `pr-${String(i).padStart(3, '0')}`,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        date: dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        relationship: relType,
        relatedCompany: relatedCompany,
        hasCaptcha: i % 5 === 0,
        hasSubPages: company.websiteNumber % 2 === 1 && i % 2 === 0
      });
    }

    const jsContent = `// Auto-generated press release data for ${company.name}\nwindow.pressReleases = ${JSON.stringify(articles, null, 2)};`;
    fs.writeFileSync(`website-${company.websiteNumber}/press-release-data.js`, jsContent);
  });
}

module.exports = { generatePressReleases };
```

- [ ] **Step 2: Run generator**

```bash
cd "c:\Users\sbaranwal\Claude\mock websites\Revere"
node -e "const gen = require('./press-releases-generator.js'); const config = require('./companies-config.json'); gen.generatePressReleases(config);"
```

- [ ] **Step 3: Verify output**

```bash
ls website-2/press-release-data.js website-3/press-release-data.js website-10/press-release-data.js
```

Expected: All 9 `press-release-data.js` files exist.

- [ ] **Step 4: Commit**

```bash
cd "c:\Users\sbaranwal\Claude\mock websites\Revere"
git add website-*/press-release-data.js
git commit -m "feat: generate press release data for all 9 websites"
```

---

---

## Task 4: Create Express Server Template with Middleware

**Files:**
- Create: `Revere/website-template/server-template.js`
- Create: `Revere/website-template/middleware/rate-limiter.js`
- Create: `Revere/website-template/middleware/session-handler.js`

- [ ] **Step 1: Write rate-limiter.js**

```javascript
// website-template/middleware/rate-limiter.js
const rateLimitStore = {};

exports.rateLimiter = (maxRequests = 5, windowMs = 60000) => {
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();

    if (!rateLimitStore[ip]) {
      rateLimitStore[ip] = [];
    }

    rateLimitStore[ip] = rateLimitStore[ip].filter(time => now - time < windowMs);

    if (rateLimitStore[ip].length >= maxRequests) {
      res.status(429).set('Retry-After', Math.ceil((rateLimitStore[ip][0] + windowMs - now) / 1000));
      return res.json({ error: 'Too many requests. Please try again later.' });
    }

    rateLimitStore[ip].push(now);
    next();
  };
};
```

- [ ] **Step 2: Write session-handler.js**

```javascript
// website-template/middleware/session-handler.js
const sessions = {};

exports.sessionMiddleware = (req, res, next) => {
  let sessionId = req.cookies?.sessionId;

  if (!sessionId) {
    sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    res.cookie('sessionId', sessionId, { maxAge: 86400000 });
  }

  if (!sessions[sessionId]) {
    sessions[sessionId] = {
      captchaSolved: false,
      articleAccess: [],
      createdAt: Date.now()
    };
  }

  req.session = sessions[sessionId];
  req.sessionId = sessionId;
  next();
};

exports.getCaptchaStatus = (sessionId) => {
  return sessions[sessionId]?.captchaSolved || false;
};

exports.setCaptchaStatus = (sessionId, solved) => {
  if (sessions[sessionId]) {
    sessions[sessionId].captchaSolved = solved;
  }
};
```

- [ ] **Step 3: Write server-template.js**

```javascript
// website-template/server-template.js
const express = require('express');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const fs = require('fs');
const path = require('path');
const rateLimiter = require('./middleware/rate-limiter');
const sessionHandler = require('./middleware/session-handler');

function createServer(config, pressReleases, websiteNumber) {
  const app = express();
  const port = process.env.PORT || 3000;

  // Middleware
  app.use(compression());
  app.use(cookieParser());
  app.use(sessionHandler.sessionMiddleware);
  app.use(express.static('public'));

  // Routes
  app.get('/', (req, res) => {
    const homepagePath = path.join(__dirname, 'index.html');
    res.sendFile(homepagePath);
  });

  app.get('/company/overview.html', (req, res) => {
    const overviewPath = path.join(__dirname, 'company', 'overview.html');
    res.sendFile(overviewPath);
  });

  // Archive with rate limiting
  app.get('/company/press-releases.html', rateLimiter.rateLimiter(5, 60000), (req, res) => {
    const archivePath = path.join(__dirname, 'company', 'press-releases.html');
    res.sendFile(archivePath);
  });

  // AJAX API for pagination
  app.get('/api/press-releases', rateLimiter.rateLimiter(5, 60000), (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = 3;
    const start = page * perPage;
    const end = start + perPage;

    const articles = pressReleases.slice(start, end).map(article => `
      <div class="article-card" data-id="${article.id}">
        <h3><a href="/press-releases/${article.id}.html">${article.title}</a></h3>
        <p class="date">${article.date}</p>
        <span class="relationship-badge">${article.relationship}</span>
        <p>${article.excerpt}</p>
      </div>
    `).join('');

    res.json({ html: articles, hasMore: end < pressReleases.length });
  });

  // Individual articles
  app.get('/press-releases/:id.html', (req, res) => {
    const { id } = req.params;
    const article = pressReleases.find(a => a.id === id);

    if (!article) {
      return res.status(404).send('Article not found');
    }

    // Check if article needs captcha
    if (article.hasCaptcha && !req.session.captchaSolved) {
      return res.sendFile(path.join(__dirname, 'press-releases', `${id}-captcha.html`));
    }

    res.sendFile(path.join(__dirname, 'press-releases', `${id}.html`));
  });

  // Captcha verification endpoint
  app.post('/api/verify-captcha', express.json(), (req, res) => {
    const { answer, type } = req.body;
    
    // For math captcha
    if (type === 'math') {
      // Verify logic handled client-side
      sessionHandler.setCaptchaStatus(req.sessionId, true);
      return res.json({ success: true });
    }

    // For image captcha
    if (type === 'image') {
      sessionHandler.setCaptchaStatus(req.sessionId, true);
      return res.json({ success: true });
    }

    res.json({ success: false });
  });

  // Sub-pages (if available)
  app.get('/press-releases/:id/:page.html', (req, res) => {
    const { id, page } = req.params;
    const filePath = path.join(__dirname, 'press-releases', id, `${page}.html`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('Page not found');
    }

    res.sendFile(filePath);
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = { createServer };
```

- [ ] **Step 4: Commit**

```bash
cd "c:\Users\sbaranwal\Claude\mock websites\Revere"
git add website-template/server-template.js website-template/middleware/
git commit -m "feat: create Express server template with rate limiting and session middleware"
```

---

## Task 5: Generate Server.js for All 9 Websites

**Files:**
- Create: `Revere/generate-servers.js`

- [ ] **Step 1: Write generate-servers.js**

```javascript
// Revere/generate-servers.js
const fs = require('fs');
const path = require('path');

function generateServerJs(websiteNumber, companyName) {
  const serverContent = `const express = require('express');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const fs = require('fs');
const path = require('path');

const sessions = {};
const rateLimitStore = {};

// Rate limiter
function rateLimiter(maxRequests = 5, windowMs = 60000) {
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    if (!rateLimitStore[ip]) rateLimitStore[ip] = [];
    rateLimitStore[ip] = rateLimitStore[ip].filter(time => now - time < windowMs);
    if (rateLimitStore[ip].length >= maxRequests) {
      res.status(429).set('Retry-After', Math.ceil((rateLimitStore[ip][0] + windowMs - now) / 1000));
      return res.json({ error: 'Too many requests' });
    }
    rateLimitStore[ip].push(now);
    next();
  };
}

// Session middleware
function sessionMiddleware(req, res, next) {
  let sessionId = req.cookies?.sessionId;
  if (!sessionId) {
    sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    res.cookie('sessionId', sessionId, { maxAge: 86400000 });
  }
  if (!sessions[sessionId]) {
    sessions[sessionId] = { captchaSolved: false, createdAt: Date.now() };
  }
  req.session = sessions[sessionId];
  req.sessionId = sessionId;
  next();
}

const app = express();
const port = process.env.PORT || 3000;

app.use(compression());
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(express.static('public'));
app.use(express.json());

// Load press releases
const pressReleases = require('./press-release-data.js').pressReleases || [];

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/company/overview.html', (req, res) => res.sendFile(path.join(__dirname, 'company', 'overview.html')));

app.get('/company/press-releases.html', rateLimiter(5, 60000), (req, res) => {
  res.sendFile(path.join(__dirname, 'company', 'press-releases.html'));
});

app.get('/api/press-releases', rateLimiter(5, 60000), (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 3;
  const start = page * perPage;
  const end = start + perPage;
  const articles = pressReleases.slice(start, end).map(article => \`
    <div class="article-card">
      <h3><a href="/press-releases/\${article.id}.html">\${article.title}</a></h3>
      <p class="date">\${article.date}</p>
      <span class="badge">\${article.relationship}</span>
      <p>\${article.excerpt}</p>
    </div>
  \`).join('');
  res.json({ html: articles, hasMore: end < pressReleases.length });
});

app.get('/press-releases/:id.html', (req, res) => {
  const article = pressReleases.find(a => a.id === req.params.id);
  if (!article) return res.status(404).send('Not found');
  const filePath = path.join(__dirname, 'press-releases', \`\${req.params.id}.html\`);
  res.sendFile(filePath);
});

app.post('/api/verify-captcha', (req, res) => {
  req.session.captchaSolved = true;
  res.json({ success: true });
});

app.get('/press-releases/:id/:page.html', (req, res) => {
  const filePath = path.join(__dirname, 'press-releases', req.params.id, \`\${req.params.page}.html\`);
  if (!fs.existsSync(filePath)) return res.status(404).send('Not found');
  res.sendFile(filePath);
});

app.listen(port, () => console.log(\`${companyName} site running on port \${port}\`));
`;

  const serverPath = path.join(__dirname, `website-${websiteNumber}`, 'server.js');
  fs.writeFileSync(serverPath, serverContent);
}

function generatePackageJson(websiteNumber, companyName) {
  const packageContent = {
    name: `website-${websiteNumber}`,
    version: '1.0.0',
    description: `${companyName} Website`,
    main: 'server.js',
    scripts: {
      start: 'node server.js',
      dev: 'node server.js'
    },
    dependencies: {
      express: '^4.18.0',
      'cookie-parser': '^1.4.6',
      compression: '^1.7.4'
    }
  };

  const packagePath = path.join(__dirname, `website-${websiteNumber}`, 'package.json');
  fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2));
}

function generateEnv(websiteNumber) {
  const envContent = `PORT=300${websiteNumber}
NODE_ENV=production
RATE_LIMIT_MAX=5
`;

  const envPath = path.join(__dirname, `website-${websiteNumber}`, '.env');
  fs.writeFileSync(envPath, envContent);
}

// Generate for all 9 websites
const companies = require('./companies-config.json').companies;
companies.forEach(company => {
  generateServerJs(company.websiteNumber, company.name);
  generatePackageJson(company.websiteNumber, company.name);
  generateEnv(company.websiteNumber);
  console.log(`Generated server files for website-${company.websiteNumber} (${company.name})`);
});
`;

  fs.writeFileSync('generate-servers.js', serverContent);
}

module.exports = { generateServerJs, generatePackageJson, generateEnv };
```

- [ ] **Step 2: Run generator**

```bash
cd "c:\Users\sbaranwal\Claude\mock websites\Revere"
node -e "const companies = require('./companies-config.json').companies; const fs = require('fs'); const path = require('path'); companies.forEach(c => { const serverJs = \`...[server code template]...\`; fs.writeFileSync(path.join(\`website-\${c.websiteNumber}\`, 'server.js'), serverJs); const pkg = { name: \`website-\${c.websiteNumber}\`, version: '1.0.0', main: 'server.js', scripts: { start: 'node server.js' }, dependencies: { express: '^4.18.0', 'cookie-parser': '^1.4.6', compression: '^1.7.4' } }; fs.writeFileSync(path.join(\`website-\${c.websiteNumber}\`, 'package.json'), JSON.stringify(pkg, null, 2)); const env = \`PORT=300\${c.websiteNumber}\nNODE_ENV=production\n\`; fs.writeFileSync(path.join(\`website-\${c.websiteNumber}\`, '.env'), env); });"
```

- [ ] **Step 3: Verify**

```bash
ls website-2/server.js website-3/server.js website-10/server.js
ls website-2/package.json website-5/package.json website-10/package.json
```

- [ ] **Step 4: Commit**

```bash
cd "c:\Users\sbaranwal\Claude\mock websites\Revere"
git add website-*/server.js website-*/package.json website-*/.env
git commit -m "feat: generate Express servers for all 9 websites"
```

---

## Plan Status

✅ Task 1: Shared utilities & templates  
✅ Task 2: Company profiles  
✅ Task 3: Press release data  
✅ Task 4: Express server template  
✅ Task 5: Generate servers for all sites  

⏳ **Remaining (will execute in next phase):**
- Task 6-12: HTML generation, CSS/JS, deployment guides

**Plan is ready for execution. Run tasks 1-5 to get started, then continue with remaining tasks.**
