document.addEventListener('DOMContentLoaded', function() {
  const articleBody = document.getElementById('article-body');

  if (articleBody && articleBody.textContent.includes('Loading')) {
    setTimeout(() => {
      const slug = window.location.pathname.split('/').pop();
      const articleId = document.querySelector('script[data-article-id]')?.getAttribute('data-article-id');

      fetch(`/articles/${articleId}/content`)
        .then(response => response.json())
        .then(data => {
          articleBody.innerHTML = data.content;
        })
        .catch(error => {
          console.error('Error loading content:', error);
          articleBody.innerHTML = '<p>Error loading article content. Please refresh the page.</p>';
        });
    }, 1000);
  }
});
