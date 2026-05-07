const express = require('express');
const router = express.Router();
const articlesData = require('../data/articles.json');
const { articleContents } = require('../utils/contentGenerator');
const rateLimiter = require('../middleware/rateLimiter');
const { captchaMiddleware } = require('../middleware/captcha');
const imageCaptchaMiddleware = require('../middleware/imageCaptcha');
const jsContentMiddleware = require('../middleware/jsContent');

const getArticleBySlug = (slug) => {
  return articlesData.articles.find(a => a.slug === slug);
};

const applyMiddleware = (challenges) => {
  return (req, res, next) => {
    let middlewareStack = [];

    if (challenges.includes('rateLimiting')) {
      middlewareStack.push(rateLimiter(800));
    }

    if (challenges.includes('captcha')) {
      middlewareStack.push(captchaMiddleware);
    }

    if (challenges.includes('imageCaptcha')) {
      middlewareStack.push(imageCaptchaMiddleware);
    }

    if (challenges.includes('jsRendering')) {
      middlewareStack.push(jsContentMiddleware);
    }

    const executeMiddleware = (index) => {
      if (index >= middlewareStack.length) {
        return next();
      }
      middlewareStack[index](req, res, () => executeMiddleware(index + 1));
    };

    executeMiddleware(0);
  };
};

router.get('/:slug', (req, res, next) => {
  const article = getArticleBySlug(req.params.slug);

  if (!article) {
    return res.status(404).render('404', { title: 'Article Not Found' });
  }

  applyMiddleware(article.challenges)(req, res, () => {
    const contentData = articleContents[article.id];

    const relatedArticles = article.relatedArticles.map(id =>
      articlesData.articles.find(a => a.id === id)
    ).filter(Boolean);

    res.render('article', {
      article: {
        ...article,
        content: contentData ? contentData.content : '<p>Article content loading...</p>'
      },
      relatedArticles,
      jsRendered: req.query.jsRender === 'true' || article.challenges.includes('jsRendering')
    });
  });
});

router.get('/:id/content', (req, res) => {
  const article = articlesData.articles.find(a => a.id === parseInt(req.params.id));

  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }

  const contentData = articleContents[article.id];

  res.json({
    content: contentData ? contentData.content : '<p>No content available</p>'
  });
});

module.exports = router;
