const jsContentMiddleware = (req, res, next) => {
  res.locals.jsRendered = true;
  res.locals.articleId = req.params.slug;
  next();
};

module.exports = jsContentMiddleware;
