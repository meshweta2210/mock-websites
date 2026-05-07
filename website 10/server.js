require('dotenv').config();
const express = require('express');
const path = require('path');
const { getPressReleases, getPressReleaseById } = require('./press-release-data');
const { assignComplexityFeatures, getRandomNavigationDepth } = require('../lib/complexity-config');

const app = express();
const PORT = process.env.PORT || 3002;
const COMPANY_ID = process.env.COMPANY_ID || 'taurus';
const NAVIGATION_DEPTH = parseInt(process.env.NAVIGATION_DEPTH) || getRandomNavigationDepth();
const HAS_RATE_LIMITING = process.env.HAS_RATE_LIMITING === 'true';
const RATE_LIMIT_THRESHOLD = parseInt(process.env.RATE_LIMIT_THRESHOLD) || 20;
const RATE_LIMIT_PROB = parseFloat(process.env.RATE_LIMIT_PROB) || 0.2;

// Load complexity features using the assigned features function
const assignedFeatures = assignComplexityFeatures(COMPANY_ID);
const complexityConfig = {
  dynamicGeneration: assignedFeatures.hasFeature('dynamic_generation'),
  inconsistentHtml: assignedFeatures.hasFeature('inconsistent_html'),
  pagination: assignedFeatures.hasFeature('pagination'),
  rateLimiting: assignedFeatures.hasFeature('rate_limiting'),
  jsRendering: assignedFeatures.hasFeature('js_rendering'),
  redirectChains: assignedFeatures.hasFeature('redirect_chains')
};

// Rate limiting middleware - tracks requests per IP per hour
const requestCounts = new Map();

function getRateLimitKey(ip) {
  const now = new Date();
  const hour = now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate() + '-' + now.getHours();
  return `${ip}:${hour}`;
}

function rateLimitMiddleware(req, res, next) {
  if (!complexityConfig.rateLimiting) {
    return next();
  }

  const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
  const key = getRateLimitKey(ip);
  const currentCount = (requestCounts.get(key) || 0) + 1;
  requestCounts.set(key, currentCount);

  // Clean up old entries periodically
  if (Math.random() < 0.01) {
    const now = new Date();
    const currentHour = now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate() + '-' + now.getHours();
    for (const [k] of requestCounts) {
      const keyHour = k.split(':')[1];
      if (keyHour !== currentHour) {
        requestCounts.delete(k);
      }
    }
  }

  if (currentCount > RATE_LIMIT_THRESHOLD) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: `Rate limit exceeded: ${RATE_LIMIT_THRESHOLD} requests per hour`
    });
  }

  res.set('X-RateLimit-Limit', RATE_LIMIT_THRESHOLD);
  res.set('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT_THRESHOLD - currentCount));

  next();
}

// Middleware for random rate limiting on PR articles
function prArticleRandomRateLimitMiddleware(req, res, next) {
  if (!req.path.match(/^\/pr-\d+\.html$/)) {
    return next();
  }
  if (Math.random() < RATE_LIMIT_PROB) {
    res.set('Retry-After', '60');
    return res.status(429).send('<h1>429 Too Many Requests</h1><p>Retry after 60s.</p>');
  }
  next();
}

// Middleware
app.use(rateLimitMiddleware);
app.use(prArticleRandomRateLimitMiddleware);
app.use(express.static(__dirname));

// Helper function to render press release HTML
function renderPressReleaseHTML(release) {
  // Optionally render inconsistent HTML
  const useAlternateFormat = complexityConfig.inconsistentHtml && Math.random() > 0.5;

  if (useAlternateFormat) {
    return `<!DOCTYPE html>
<html>
<head>
  <title>${release.title}</title>
</head>
<body>
  <h2>${release.title}</h2>
  <p>Released: ${release.date}</p>
  <div>${release.body}</div>
  <hr/>
  <a href="/news">Back to News</a>
</body>
</html>`;
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${release.title}</title>
</head>
<body>
  <header>
    <h1>${release.title}</h1>
  </header>
  <main>
    <article>
      <p><strong>Date:</strong> ${release.date}</p>
      <p><strong>Company:</strong> ${release.company}</p>
      <section>
        <p>${release.body}</p>
      </section>
    </article>
  </main>
  <footer>
    <a href="/press-releases">Back to Press Releases</a>
  </footer>
</body>
</html>`;
}

// Helper function to render press releases list HTML
function renderPressReleasesListHTML(releases, page = 1) {
  const itemsPerPage = complexityConfig.pagination ? 5 : releases.length;
  const totalPages = Math.ceil(releases.length / itemsPerPage);
  const startIdx = (page - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const pageReleases = releases.slice(startIdx, endIdx);
  const companyName = releases.length > 0 ? releases[0].company : 'Company';

  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Press Releases - ${companyName}</title>
</head>
<body>
  <header>
    <h1>Press Releases</h1>
  </header>
  <main>
    <p>Total releases: ${releases.length}</p>
    <ul>`;

  pageReleases.forEach(release => {
    html += `
      <li>
        <a href="/pr-${release.id.split('-')[1]}.html">${release.title}</a>
        <br/>
        <small>Released: ${release.date}</small>
      </li>`;
  });

  html += `
    </ul>`;

  if (complexityConfig.pagination && totalPages > 1) {
    html += `
    <div class="pagination">
      <p>Page ${page} of ${totalPages}</p>`;
    if (page > 1) {
      html += `<a href="/press-releases?page=${page - 1}">Previous</a>`;
    }
    if (page < totalPages) {
      html += `<a href="/press-releases?page=${page + 1}">Next</a>`;
    }
    html += `
    </div>`;
  }

  html += `
  </main>
  <footer>
    <a href="/">Back to Home</a>
  </footer>
</body>
</html>`;

  return html;
}

// Routes based on NAVIGATION_DEPTH

// Root route (always available)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Level 1: News page (available if NAVIGATION_DEPTH >= 1)
if (NAVIGATION_DEPTH >= 1) {
  app.get('/news', (req, res) => {
    res.sendFile(path.join(__dirname, 'news.html'));
  });
}

// Level 2: Press releases list (available if NAVIGATION_DEPTH >= 2)
if (NAVIGATION_DEPTH >= 2) {
  app.get('/press-releases', (req, res) => {
    res.sendFile(path.join(__dirname, 'press-releases.html'));
  });
}

// Press release detail page - GET /pr-:id.html
app.get('/pr-:id.html', (req, res) => {
  const releaseId = `pr-${req.params.id}`;
  const release = getPressReleaseById(releaseId);

  if (!release) {
    return res.status(404).send(`<!DOCTYPE html>
<html>
<head><title>Not Found</title></head>
<body><h1>Press Release Not Found</h1><a href="/press-releases">Back to Press Releases</a></body>
</html>`);
  }

  const html = renderPressReleaseHTML(release);
  res.send(html);
});

// Redirect chain route - GET /pr-:id-view redirects to /pr-:id.html (always available)
app.get('/pr-:id-view', (req, res) => {
  res.redirect(`/pr-${req.params.id}.html`);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    company: COMPANY_ID,
    navigationDepth: NAVIGATION_DEPTH,
    rateLimitProb: RATE_LIMIT_PROB,
    features: complexityConfig,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).send(`<!DOCTYPE html>
<html>
<head><title>Page Not Found</title></head>
<body><h1>404 - Page Not Found</h1><a href="/">Back to Home</a></body>
</html>`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send(`<!DOCTYPE html>
<html>
<head><title>Error</title></head>
<body><h1>500 - Internal Server Error</h1><a href="/">Back to Home</a></body>
</html>`);
});

// Start server
app.listen(PORT, () => {
  const rateLimitPercentage = Math.round(RATE_LIMIT_PROB * 100);
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║         Taurus Company Mock Website Server Running         ║
║                                                            ║
║  URL: http://localhost:${PORT}                           ║
║  Company: ${COMPANY_ID}                                   ║
║  Navigation Depth: ${NAVIGATION_DEPTH}                                      ║
║                                                            ║
║  Routes:                                                   ║
║  - Homepage: /                                             ║
${NAVIGATION_DEPTH >= 1 ? '║  - News: /news\n' : ''}║  - Press Releases: /press-releases                      ║
║  - Press Release: /pr-NNN.html                             ║
║  - Health: /health                                         ║
║                                                            ║
║  Features:                                                 ║
║  - Rate Limiting: ${complexityConfig.rateLimiting ? 'enabled' : 'disabled'}                              ║
║  - PR Rate Limiting (random): ${rateLimitPercentage}%                            ║
║  - Dynamic Generation: ${complexityConfig.dynamicGeneration ? 'enabled' : 'disabled'}                    ║
║  - Inconsistent HTML: ${complexityConfig.inconsistentHtml ? 'enabled' : 'disabled'}                     ║
║  - Pagination: ${complexityConfig.pagination ? 'enabled' : 'disabled'}                                ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});
