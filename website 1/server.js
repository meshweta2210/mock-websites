const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Load configuration
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'mock-website-config.json'), 'utf-8'));

// Middleware
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes

// Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'xnc-homepage.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'xnc-homepage.html'));
});

// Company Overview (Level 1)
app.get('/company/overview.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'xnc-company-overview.html'));
});

app.get('/company/overview', (req, res) => {
  res.sendFile(path.join(__dirname, 'xnc-company-overview.html'));
});

// Press Releases Archive (Level 2) - Main press releases page
app.get('/company/press-releases.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'xnc-press-releases-page.html'));
});

app.get('/company/press-releases', (req, res) => {
  res.sendFile(path.join(__dirname, 'xnc-press-releases-page.html'));
});

// API endpoint for press releases data
app.get('/api/press-releases', (req, res) => {
  const type = req.query.type || null;
  const tier = req.query.tier || null;

  let releases = [...config.releases];

  if (type) {
    releases = releases.filter(r =>
      r.relationships.some(rel => rel.type === type)
    );
  }

  if (tier) {
    releases = releases.filter(r => r.tier === parseInt(tier));
  }

  res.json({
    total: releases.length,
    releases: releases
  });
});

// API endpoint for individual release
app.get('/api/press-releases/:id', (req, res) => {
  const release = config.releases.find(r => r.id === req.params.id);

  if (!release) {
    return res.status(404).json({ error: 'Press release not found' });
  }

  res.json(release);
});

// API endpoint for configuration
app.get('/api/config', (req, res) => {
  res.json({
    site: config.site,
    homepage: config.homepage,
    tiers: config.tiers
  });
});

// API endpoint for homepage data
app.get('/api/homepage', (req, res) => {
  res.json(config.homepage);
});

// API endpoint for tiers
app.get('/api/tiers', (req, res) => {
  res.json(config.tiers);
});

// API endpoint for all releases count
app.get('/api/releases/count', (req, res) => {
  res.json({
    total: config.releases.length,
    tier1: config.releases.filter(r => r.tier === 1).length,
    tier2: config.releases.filter(r => r.tier === 2).length,
    tier3: config.releases.filter(r => r.tier === 3).length
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Press release article pages
app.get('/:prId.html', (req, res) => {
  const prId = req.params.prId;
  const prFile = path.join(__dirname, `${prId}.html`);

  fs.exists(prFile, (exists) => {
    if (exists) {
      res.sendFile(prFile);
    } else {
      res.sendFile(path.join(__dirname, 'xnc-homepage.html'));
    }
  });
});

// Catch-all for undefined routes - serve homepage
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'xnc-homepage.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║           XNC Mock Website Server Running                 ║
║                                                            ║
║  URL: http://localhost:${PORT}                           ║
║  Environment: ${process.env.NODE_ENV || 'production'}                              ║
║                                                            ║
║  Routes:                                                   ║
║  - Homepage: /                                             ║
║  - Company Info: /company/overview.html (Level 1)         ║
║  - Press Releases: /company/press-releases.html (Level 2) ║
║  - API: /api/press-releases                               ║
║  - Health: /health                                         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});
