const express = require('express');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Routes
app.use('/', require('./routes/index'));
app.use('/press-releases', require('./routes/pressReleases'));
app.use('/articles', require('./routes/articles'));

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).render('500', { title: 'Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`PNC InfraTech Mock Website running on http://localhost:${PORT}`);
});
