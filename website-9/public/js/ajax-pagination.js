let currentPage = 0;
const articlesPerPage = 3;

document.addEventListener('DOMContentLoaded', () => {
  const loadMoreBtn = document.getElementById('load-more');

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
      loadMoreArticles();
    });
  }
});

function loadMoreArticles() {
  currentPage++;
  const loadingMessage = document.getElementById('loading-message');
  const loadMoreBtn = document.getElementById('load-more');

  if (loadingMessage) {
    loadingMessage.style.display = 'block';
  }

  if (loadMoreBtn) {
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = 'Loading...';
  }

  fetch(`/api/press-releases?page=${currentPage}&limit=${articlesPerPage}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      if (loadingMessage) {
        loadingMessage.style.display = 'none';
      }

      if (data.html) {
        const container = document.getElementById('articles-container');
        if (container) {
          container.innerHTML += data.html;
        }
      }

      if (!data.hasMore) {
        if (loadMoreBtn) {
          loadMoreBtn.style.display = 'none';
        }
        const endMessage = document.getElementById('end-message');
        if (endMessage) {
          endMessage.style.display = 'block';
        }
      } else {
        if (loadMoreBtn) {
          loadMoreBtn.disabled = false;
          loadMoreBtn.textContent = 'Load More Articles';
        }
      }
    })
    .catch(err => {
      console.error('Error loading articles:', err);

      if (loadingMessage) {
        loadingMessage.textContent = 'Error loading articles. Please try again.';
        loadingMessage.style.color = '#d32f2f';
      }

      if (loadMoreBtn) {
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = 'Try Again';
      }

      currentPage--;
    });
}

// Optional: Load initial articles if button wasn't present on page load
function initializeArticles() {
  const container = document.getElementById('articles-container');
  if (container && container.children.length === 0) {
    currentPage = 0;
    loadMoreArticles();
  }
}
