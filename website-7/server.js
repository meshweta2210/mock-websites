const express = require('express');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = 3007;

// In-memory stores
const rateLimitStore = {};
const sessions = {};

// Rate limiter function (max 5 req/min, 60s window)
function rateLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const windowStart = now - 60000; // 60 second window

  if (!rateLimitStore[ip]) {
    rateLimitStore[ip] = [];
  }

  // Remove expired entries
  rateLimitStore[ip] = rateLimitStore[ip].filter(timestamp => timestamp > windowStart);

  // Check limit
  if (rateLimitStore[ip].length >= 5) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  rateLimitStore[ip].push(now);
  next();
}

// Session middleware function
function sessionMiddleware(req, res, next) {
  const sessionId = req.cookies.sessionId;

  if (sessionId && sessions[sessionId]) {
    req.session = sessions[sessionId];
  } else {
    const newSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessions[newSessionId] = {
      captchaSolved: false,
      createdAt: new Date()
    };
    res.cookie('sessionId', newSessionId, { httpOnly: true, maxAge: 3600000 });
    req.session = sessions[newSessionId];
  }

  next();
}

// Middleware setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(compression());
app.use(sessionMiddleware);

// Load press-release data
const pressReleaseData = require('./press-release-data.js');

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/company/overview.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'company', 'overview.html'));
});

app.get('/company/press-releases.html', rateLimiter, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'company', 'press-releases.html'));
});

app.get('/api/press-releases', rateLimiter, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const articles = pressReleaseData.articles || [];
  const paginatedArticles = articles.slice(startIndex, endIndex);
  const totalPages = Math.ceil(articles.length / pageSize);

  res.json({
    articles: paginatedArticles,
    page,
    pageSize,
    totalPages,
    total: articles.length
  });
});

app.get('/press-releases/:id.html', (req, res) => {
  const { id } = req.params;
  res.sendFile(path.join(__dirname, 'public', 'press-releases', id + '.html'));
});

app.post('/api/verify-captcha', (req, res) => {
  if (req.session) {
    req.session.captchaSolved = true;
  }
  res.json({ success: true, message: 'Captcha verified' });
});

app.get('/press-releases/:id/:page.html', (req, res) => {
  const { id, page } = req.params;
  res.sendFile(path.join(__dirname, 'public', 'press-releases', id, page + '.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server for GreenEnergy Corp running on http://localhost:${PORT}`);
});
