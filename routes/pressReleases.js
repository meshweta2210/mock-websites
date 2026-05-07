const express = require('express');
const router = express.Router();
const articlesData = require('../data/articles.json');

router.get('/', (req, res) => {
  const articles = articlesData.articles.map(article => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    date: article.date,
    excerpt: article.excerpt
  }));

  res.render('pressReleases', { articles });
});

module.exports = router;
