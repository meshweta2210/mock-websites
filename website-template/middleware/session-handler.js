const crypto = require('crypto');

const sessions = {};

function generateSessionId() {
  return crypto.randomBytes(16).toString('hex');
}

function sessionMiddleware(req, res, next) {
  let sessionId = req.cookies.sessionId;

  if (!sessionId) {
    sessionId = generateSessionId();
    res.cookie('sessionId', sessionId, { maxAge: 24 * 60 * 60 * 1000 });
  } else {
    // Reset cookie to extend expiration
    res.cookie('sessionId', sessionId, { maxAge: 24 * 60 * 60 * 1000 });
  }

  if (!sessions[sessionId]) {
    sessions[sessionId] = {
      captchaSolved: false,
      articleAccess: [],
      createdAt: Date.now()
    };
  }

  req.session = sessions[sessionId];
  req.sessionId = sessionId;

  next();
}

function getCaptchaStatus(sessionId) {
  if (!sessions[sessionId]) {
    return false;
  }
  return sessions[sessionId].captchaSolved;
}

function setCaptchaStatus(sessionId, solved) {
  if (!sessions[sessionId]) {
    sessions[sessionId] = {
      captchaSolved: false,
      articleAccess: [],
      createdAt: Date.now()
    };
  }
  sessions[sessionId].captchaSolved = solved;
}

module.exports = {
  sessionMiddleware,
  getCaptchaStatus,
  setCaptchaStatus
};
