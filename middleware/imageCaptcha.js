const { generateCaptchaImage } = require('../utils/imageGenerator');

const imageCaptchaMiddleware = async (req, res, next) => {
  const articleId = req.params.slug;
  const captchaKey = `image_captcha_solved_${articleId}`;

  if (req.session[captchaKey]) {
    return next();
  }

  if (req.method === 'POST' && req.body.imageCaptchaAnswer) {
    const correctText = req.session[`captcha_text_${articleId}`];
    if (req.body.imageCaptchaAnswer === correctText) {
      req.session[captchaKey] = true;
      return next();
    } else {
      const newImage = await generateCaptchaImage(correctText);
      return res.render('imageCaptcha', {
        articleId,
        captchaImage: newImage,
        error: 'Incorrect. Please try again.'
      });
    }
  }

  const captchaText = Math.random().toString(36).substring(2, 7).toUpperCase();
  req.session[`captcha_text_${articleId}`] = captchaText;

  const captchaImage = await generateCaptchaImage(captchaText);

  res.render('imageCaptcha', {
    articleId,
    captchaImage,
    error: null
  });
};

module.exports = imageCaptchaMiddleware;
