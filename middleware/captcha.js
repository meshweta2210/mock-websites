const captchaMiddleware = (req, res, next) => {
  const articleId = req.params.slug;
  const captchaKey = `captcha_solved_${articleId}`;

  if (req.session[captchaKey]) {
    return next();
  }

  if (req.method === 'POST' && req.body.captchaAnswer) {
    const correctAnswers = {
      'article-1': 'infrastructure',
      'article-2': 'pnc',
      'article-3': 'technology',
      'article-4': 'security',
      'article-5': 'innovation',
      'article-6': 'research',
      'article-7': 'green',
      'article-8': 'growth'
    };

    if (req.body.captchaAnswer.toLowerCase() === correctAnswers[articleId]?.toLowerCase()) {
      req.session[captchaKey] = true;
      return next();
    } else {
      return res.render('captcha', {
        articleId,
        error: 'Incorrect answer. Try again.',
        question: getCaptchaQuestion(articleId)
      });
    }
  }

  res.render('captcha', {
    articleId,
    error: null,
    question: getCaptchaQuestion(articleId)
  });
};

const getCaptchaQuestion = (articleId) => {
  const questions = {
    'article-1': 'What is the first word in our company name? (Hint: PNC)',
    'article-2': 'What does PNC stand for? (Answer: initials only)',
    'article-3': 'What industry does PNC focus on?',
    'article-4': 'What is a key focus for modern infrastructure?',
    'article-5': 'What word describes creative advancement?',
    'article-6': 'What type of activity involves investigating?',
    'article-7': 'What color is often associated with renewable energy?',
    'article-8': 'What word describes positive expansion?'
  };
  return questions[articleId] || 'What is 2+2?';
};

module.exports = { captchaMiddleware, getCaptchaQuestion };
