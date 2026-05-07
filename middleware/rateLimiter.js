const rateLimiter = (delayMs = 1000) => {
  return (req, res, next) => {
    const randomDelay = delayMs + Math.random() * delayMs;
    setTimeout(() => {
      next();
    }, randomDelay);
  };
};

module.exports = rateLimiter;
