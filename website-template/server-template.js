const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const { sessionMiddleware, getCaptchaStatus, setCaptchaStatus } = require('./middleware/session-handler');
const createRateLimiter = require('./middleware/rate-limiter');

function createServer(config, pressReleases, websiteNumber) {
  const app = express();
  const port = process.env.PORT || 3000;
  const rateLimiter = createRateLimiter(5, 60000);

  // Middleware stack
  app.use(compression());
  app.use(cookieParser());
  app.use(sessionMiddleware);
  app.use(express.static('public'));

  // GET /
  app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(indexPath);
  });

  // GET /company/overview.html
  app.get('/company/overview.html', (req, res) => {
    const overviewPath = path.join(__dirname, 'public', 'company', 'overview.html');
    res.sendFile(overviewPath);
  });

  // GET /company/press-releases.html (with rate limiter)
  app.get('/company/press-releases.html', rateLimiter, (req, res) => {
    const pressReleasesPath = path.join(__dirname, 'public', 'company', 'press-releases.html');
    res.sendFile(pressReleasesPath);
  });

  // GET /api/press-releases (with rate limiter)
  app.get('/api/press-releases', rateLimiter, (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const pageSize = 3;
    const start = page * pageSize;
    const end = start + pageSize;

    const paginated = pressReleases.slice(start, end);
    const hasMore = end < pressReleases.length;

    res.json({
      articles: paginated,
      hasMore,
      page,
      total: pressReleases.length
    });
  });

  // GET /press-releases/:id.html
  app.get('/press-releases/:id.html', (req, res) => {
    const { id } = req.params;
    const article = pressReleases.find(a => a.id === id);

    if (!article) {
      return res.status(404).send('Article not found');
    }

    if (article.hasCaptcha && !req.session.captchaSolved) {
      const captchaPagePath = path.join(__dirname, 'public', 'press-releases', `${id}-captcha.html`);
      if (fs.existsSync(captchaPagePath)) {
        return res.sendFile(captchaPagePath);
      }
    }

    const articlePath = path.join(__dirname, 'public', 'press-releases', `${id}.html`);
    if (fs.existsSync(articlePath)) {
      return res.sendFile(articlePath);
    }

    res.status(404).send('Article file not found');
  });

  // POST /api/verify-captcha
  app.post('/api/verify-captcha', express.json(), (req, res) => {
    req.session.captchaSolved = true;
    res.json({ success: true });
  });

  // GET /press-releases/:id/:page.html
  app.get('/press-releases/:id/:page.html', (req, res) => {
    const { id, page } = req.params;
    const subPagePath = path.join(__dirname, 'public', 'press-releases', id, `${page}.html`);

    if (fs.existsSync(subPagePath)) {
      return res.sendFile(subPagePath);
    }

    res.status(404).send('Page not found');
  });

  // Start listening
  const server = app.listen(port, () => {
    console.log(`${config.companyName} server (website ${websiteNumber}) listening on port ${port}`);
  });

  return server;
}

module.exports = { createServer };
