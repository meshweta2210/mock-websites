module.exports = function createRateLimiter(maxRequests = 5, windowMs = 60000) {
  const store = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();

    // Initialize or get timestamps for this IP
    if (!store.has(ip)) {
      store.set(ip, []);
    }

    const timestamps = store.get(ip);

    // Filter out timestamps outside the window
    const filteredTimestamps = timestamps.filter(ts => now - ts < windowMs);
    store.set(ip, filteredTimestamps);

    // Check if limit exceeded
    if (filteredTimestamps.length >= maxRequests) {
      res.set('Retry-After', Math.ceil(windowMs / 1000));
      return res.status(429).json({ error: 'Too Many Requests' });
    }

    // Add current request timestamp
    filteredTimestamps.push(now);

    next();
  };
};
