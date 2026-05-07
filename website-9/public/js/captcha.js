// Math captcha verification
function submitCaptcha() {
  const answer = document.getElementById('captcha-answer');
  if (!answer) return;

  const userAnswer = answer.value.trim();
  const storedAnswer = localStorage.getItem('captcha-answer');
  const errorElement = document.getElementById('captcha-error');
  const successElement = document.getElementById('captcha-success');

  if (!userAnswer) {
    if (errorElement) {
      errorElement.textContent = 'Please enter an answer.';
      errorElement.style.display = 'block';
    }
    return;
  }

  if (userAnswer === storedAnswer) {
    // Correct answer
    localStorage.setItem('captcha-verified', 'true');

    const captchaSection = document.getElementById('captcha-section');
    const articleContent = document.getElementById('article-content');

    if (captchaSection) captchaSection.style.display = 'none';
    if (articleContent) articleContent.style.display = 'block';

    if (successElement) {
      successElement.textContent = 'Captcha verified successfully!';
      successElement.style.display = 'block';
    }
    if (errorElement) errorElement.style.display = 'none';

    // Notify server
    fetch('/api/verify-captcha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'math', answer: userAnswer })
    }).catch(err => console.error('Error verifying captcha:', err));
  } else {
    // Wrong answer
    if (errorElement) {
      errorElement.textContent = 'Incorrect answer. Please try again.';
      errorElement.style.display = 'block';
    }
    if (successElement) successElement.style.display = 'none';
    answer.value = '';
  }
}

// Image captcha verification
function submitImageCaptcha() {
  const checked = Array.from(document.querySelectorAll('input[name^="image-"]:checked'))
    .map(el => parseInt(el.dataset.index || el.value));

  const correct = JSON.parse(localStorage.getItem('captcha-correct') || '[]');
  const errorElement = document.getElementById('captcha-error');
  const successElement = document.getElementById('captcha-success');

  if (checked.length === 0) {
    if (errorElement) {
      errorElement.textContent = 'Please select at least one image.';
      errorElement.style.display = 'block';
    }
    return;
  }

  if (JSON.stringify(checked.sort((a, b) => a - b)) === JSON.stringify(correct.sort((a, b) => a - b))) {
    // Correct selection
    localStorage.setItem('captcha-verified', 'true');

    const captchaSection = document.getElementById('captcha-section');
    const articleContent = document.getElementById('article-content');

    if (captchaSection) captchaSection.style.display = 'none';
    if (articleContent) articleContent.style.display = 'block';

    if (successElement) {
      successElement.textContent = 'Captcha verified successfully!';
      successElement.style.display = 'block';
    }
    if (errorElement) errorElement.style.display = 'none';

    // Notify server
    fetch('/api/verify-captcha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'image', answer: checked })
    }).catch(err => console.error('Error verifying captcha:', err));
  } else {
    // Wrong selection
    if (errorElement) {
      errorElement.textContent = 'Incorrect selection. Please try again.';
      errorElement.style.display = 'block';
    }
    if (successElement) successElement.style.display = 'none';

    // Uncheck all boxes
    document.querySelectorAll('input[name^="image-"]').forEach(el => {
      el.checked = false;
    });
  }
}

// Initialize captcha on page load
document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.querySelector('[data-action="submit-captcha"]');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const type = submitBtn.dataset.captchaType || 'math';
      if (type === 'image') {
        submitImageCaptcha();
      } else {
        submitCaptcha();
      }
    });
  }

  // Allow Enter key to submit math captcha
  const captchaAnswer = document.getElementById('captcha-answer');
  if (captchaAnswer) {
    captchaAnswer.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        submitCaptcha();
      }
    });
  }
});
