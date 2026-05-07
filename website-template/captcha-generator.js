// Revere/website-template/captcha-generator.js
exports.generateMathCaptchaHtml = (captcha) => {
  return `
    <div class="captcha-form">
      <p>${captcha.question} = ?</p>
      <input type="text" id="captcha-answer" placeholder="Your answer">
      <button type="button" onclick="submitCaptcha()">Submit</button>
      <p id="captcha-error" style="color:red;display:none;"></p>
    </div>
  `;
};

exports.generateImageCaptchaHtml = (captcha, imageUrls) => {
  const imageHtml = captcha.images.map((img, idx) =>
    `<label class="image-option">
      <input type="checkbox" name="image-${idx}" data-index="${idx}">
      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E
        %3Crect fill='%23${Math.random().toString(16).slice(2, 8)}' width='100' height='100'/%3E
      %3C/svg%3E" alt="Image ${idx}">
    </label>`
  ).join('');

  return `
    <div class="image-captcha">
      <p>${captcha.question}</p>
      <div class="image-grid">
        ${imageHtml}
      </div>
      <button type="button" onclick="submitImageCaptcha()">Verify</button>
      <p id="captcha-error" style="color:red;display:none;"></p>
    </div>
  `;
};
