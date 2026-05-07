// Revere/website-template/html-templates.js
exports.homepageTemplate = (config) => {
  const { site, homepage, navigation, design } = config;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${site.company}</title>
  <link rel="stylesheet" href="/public/css/style.css">
  <style>
    :root {
      --primary: ${design.colors.primary};
      --secondary: ${design.colors.secondary};
      --background: ${design.colors.background};
      --text: ${design.colors.text};
    }
  </style>
</head>
<body>
  <header>
    <nav class="navbar">
      <div class="logo">${site.name}</div>
      <div class="menu">
        <a href="/">Home</a>
        <a href="/company/overview.html">About</a>
        <a href="/company/press-releases.html">Press Releases</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  </header>

  <main>
    <section class="hero">
      <h1>${homepage.sections.hero.heading}</h1>
      <p>${homepage.sections.hero.subheading}</p>
      <div class="cta-buttons">
        ${homepage.sections.hero.cta_buttons.map(btn =>
          \`<a href="\${btn.url}" class="btn btn-\${btn.type}">\${btn.text}</a>\`
        ).join('')}
      </div>
    </section>

    <section class="solutions">
      <h2>${homepage.sections.solutions.title}</h2>
      <p>${homepage.sections.solutions.subtitle}</p>
      <div class="cards">
        ${homepage.sections.solutions.cards.map(card =>
          \`<div class="card">
            <h3>\${card.title}</h3>
            <p>\${card.description}</p>
          </div>\`
        ).join('')}
      </div>
    </section>

    <section class="news">
      <h2>${homepage.sections.news.title}</h2>
      <div class="news-grid">
        ${homepage.sections.news.featured_releases.map(release =>
          \`<div class="news-card">
            <h3><a href="/press-releases/\${release.id}.html">\${release.title}</a></h3>
            <p class="date">\${release.date}</p>
            <p>\${release.excerpt}</p>
          </div>\`
        ).join('')}
      </div>
      <a href="/company/press-releases.html" class="btn btn-secondary">View All Press Releases</a>
    </section>
  </main>

  <footer>
    <p>&copy; 2024 ${site.name}. All rights reserved.</p>
  </footer>
</body>
</html>`;
};

exports.articleTemplate = (config, article, captchaNeeded = false) => {
  const captchaHtml = captchaNeeded ? \`
    <div class="captcha-container" id="captcha">
      <h3>Verify you're human</h3>
      <div id="captcha-content"></div>
    </div>
  \` : '';

  return \`<!DOCTYPE html>
<html>
<head>
  <title>\${article.title}</title>
  <link rel="stylesheet" href="/public/css/style.css">
  <link rel="stylesheet" href="/public/css/captcha.css">
</head>
<body>
  <header>
    <nav class="navbar">
      <a href="/">← Back to \${config.site.name}</a>
    </nav>
  </header>

  <main>
    <article>
      <h1>\${article.title}</h1>
      <p class="meta">\${article.date} | Relationship: <strong>\${article.relationship}</strong></p>
      \${captchaHtml}
      <div class="article-content" \${captchaNeeded ? 'style="display:none"' : ''}>
        <p>\${article.content}</p>
        \${article.relatedCompany ? \`<p class="related">Related: <a href="\${article.relatedCompanyUrl}" target="_blank">\${article.relatedCompany}</a></p>\` : ''}
      </div>
    </article>
  </main>

  <script src="/public/js/captcha.js"></script>
</body>
</html>\`;
};

exports.archivePageTemplate = (config, articles) => {
  return \`<!DOCTYPE html>
<html>
<head>
  <title>Press Releases - \${config.site.company}</title>
  <link rel="stylesheet" href="/public/css/style.css">
</head>
<body>
  <header>
    <nav class="navbar">
      <a href="/">← Back to Home</a>
      <h1>Press Releases</h1>
    </nav>
  </header>

  <main>
    <div class="archive">
      <div id="articles-container">
        \${articles.slice(0, 3).map(article =>
          \`<div class="article-card" data-id="\${article.id}">
            <h3><a href="/press-releases/\${article.id}.html">\${article.title}</a></h3>
            <p class="date">\${article.date}</p>
            <span class="relationship-badge">\${article.relationship}</span>
            <p>\${article.excerpt}</p>
          </div>\`
        ).join('')}
      </div>
      \${articles.length > 3 ? '<button id="load-more" class="btn">Load More Articles</button>' : ''}
    </div>
  </main>

  <script src="/public/js/ajax-pagination.js"></script>
</body>
</html>\`;
};
