const fs = require('fs');
const path = require('path');

const companies = {
  3: { name: 'Pisces Company', id: 'pisces', color: '#0891b2', port: 3003, depth: Math.random() > 0.5 ? 1 : 2 },
  4: { name: 'Libra Company', id: 'libra', color: '#db2777', port: 3004, depth: Math.random() > 0.5 ? 1 : 2 },
  5: { name: 'Scorpio Company', id: 'scorpio', color: '#991b1b', port: 3005, depth: Math.random() > 0.5 ? 1 : 2 },
  6: { name: 'Leo Company', id: 'leo', color: '#b45309', port: 3006, depth: Math.random() > 0.5 ? 1 : 2 },
  7: { name: 'Virgo Company', id: 'virgo', color: '#166534', port: 3007, depth: Math.random() > 0.5 ? 1 : 2 },
  8: { name: 'Gemini Company', id: 'gemini', color: '#4f46e5', port: 3008, depth: Math.random() > 0.5 ? 1 : 2 },
  9: { name: 'Aries Company', id: 'aries', color: '#c2410c', port: 3009, depth: Math.random() > 0.5 ? 1 : 2 },
  10: { name: 'Aquarius Company', id: 'aquarius', color: '#334155', port: 3010, depth: Math.random() > 0.5 ? 1 : 2 }
};

const descriptions = {
  pisces: 'Pisces Company specializes in adaptive technology solutions designed to flow seamlessly with your business needs. We believe in creative innovation and intuitive design.',
  libra: 'Libra Company brings balance and harmony to enterprise operations through thoughtful integration and fair-value solutions. We weigh every decision carefully.',
  scorpio: 'Scorpio Company delivers powerful, transformative solutions with unmatched intensity and focus. We dig deep to uncover the insights that drive real change.',
  leo: 'Leo Company leads the industry with bold, visionary solutions. Our creative approach and confident execution set new standards for enterprise excellence.',
  virgo: 'Virgo Company provides precise, reliable, and detail-oriented solutions for businesses that demand accuracy. Excellence through meticulous planning and execution.',
  gemini: 'Gemini Company excels at seamless communication and multi-channel integration. We connect your systems, teams, and data with agility and versatility.',
  aries: 'Aries Company drives pioneering solutions that charge forward with courage and speed. We tackle challenges head-on and lead market transformation.',
  aquarius: 'Aquarius Company pioneers innovative, forward-thinking solutions that revolutionize how enterprises operate. We imagine the future and build it today.'
};

function createHomePage(company) {
  const homePage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${company.name} - Home</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #2c3e50; background-color: #f8fafb; }
        header { background-color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 100; }
        nav { max-width: 1400px; margin: 0 auto; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 28px; font-weight: 700; color: ${company.color}; text-decoration: none; letter-spacing: -0.5px; }
        .nav-menu { display: flex; list-style: none; gap: 0; }
        .nav-item { position: relative; }
        .nav-link { color: #2c3e50; text-decoration: none; padding: 0.75rem 1.25rem; display: block; font-size: 0.95rem; font-weight: 500; transition: color 0.3s ease; }
        .nav-link:hover { color: ${company.color}; }
        .hero { background: linear-gradient(135deg, ${company.color} 0%, ${adjustColorBrightness(company.color, -30)} 100%); color: white; padding: 6rem 2rem; text-align: center; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; font-weight: 700; }
        .hero p { font-size: 1.3rem; opacity: 0.95; margin-bottom: 2rem; }
        .hero .cta-button { display: inline-block; padding: 0.75rem 2rem; background-color: white; color: ${company.color}; text-decoration: none; border-radius: 4px; font-weight: 600; transition: all 0.3s ease; }
        .hero .cta-button:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .content-container { max-width: 1000px; margin: 3rem auto; padding: 0 2rem; }
        .section { margin-bottom: 3rem; }
        .section h2 { font-size: 2rem; color: ${company.color}; margin-bottom: 1rem; }
        .section p { font-size: 1.05rem; line-height: 1.8; margin-bottom: 1rem; color: #444; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin: 2rem 0; }
        .feature-card { background: white; padding: 2rem; border-radius: 8px; border-top: 4px solid ${company.color}; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }
        .feature-card h3 { color: ${company.color}; margin-bottom: 1rem; }
        .feature-card p { font-size: 0.95rem; color: #666; }
        footer { background-color: #1a2332; color: white; padding: 60px 2rem 20px; margin-top: 4rem; }
        .footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 2rem; max-width: 1200px; margin-left: auto; margin-right: auto; }
        .footer-column h4 { margin-bottom: 1rem; font-size: 1rem; }
        .footer-column a { display: block; color: #aaa; text-decoration: none; font-size: 0.9rem; margin-bottom: 0.75rem; transition: color 0.3s ease; }
        .footer-column a:hover { color: white; }
        .footer-bottom { border-top: 1px solid #333; padding-top: 2rem; text-align: center; color: #aaa; font-size: 0.9rem; max-width: 1200px; margin: 0 auto; }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">${company.name.split(' ')[0].toUpperCase()}</a>
            <ul class="nav-menu">
                <li class="nav-item"><a href="/" class="nav-link">Home</a></li>
                ${company.depth === 2 ? '<li class="nav-item"><a href="/news" class="nav-link">News</a></li>' : ''}
                <li class="nav-item"><a href="${company.depth === 2 ? '/press-releases' : '/press-releases'}" class="nav-link">Press Releases</a></li>
            </ul>
        </nav>
    </header>

    <div class="hero">
        <h1>Welcome to ${company.name}</h1>
        <p>Enterprise Solutions for Modern Business Challenges</p>
        <a href="${company.depth === 2 ? '/news' : '/press-releases'}" class="cta-button">Discover Our Updates</a>
    </div>

    <div class="content-container">
        <div class="section">
            <h2>About ${company.name}</h2>
            <p>${descriptions[company.id]}</p>
            <p>With cutting-edge technology and industry expertise, we deliver innovative solutions to organizations worldwide. Our commitment to excellence and customer success has made us a trusted partner for enterprises seeking reliable, scalable technology partners.</p>
        </div>

        <div class="section">
            <h2>Our Solutions</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <h3>Enterprise Platform</h3>
                    <p>Comprehensive business solutions designed for large-scale operations, providing integration, scalability, and reliability.</p>
                </div>
                <div class="feature-card">
                    <h3>Cloud Infrastructure</h3>
                    <p>Next-generation cloud computing solutions that optimize performance, reduce costs, and enable business agility.</p>
                </div>
                <div class="feature-card">
                    <h3>Analytics & Insights</h3>
                    <p>Powerful data analytics and business intelligence tools to drive informed decision-making and competitive advantage.</p>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Latest Updates</h2>
            <p>Stay informed about our latest partnerships, innovations, and company milestones. <a href="${company.depth === 2 ? '/news' : '/press-releases'}" style="color: ${company.color}; font-weight: 600; text-decoration: none;">Visit our ${company.depth === 2 ? 'News' : 'Press Releases'} section →</a></p>
        </div>
    </div>

    <footer>
        <div class="footer-grid">
            <div class="footer-column">
                <h4>Company</h4>
                <a href="/">About Us</a>
                <a href="/">Leadership</a>
                <a href="/press-releases">Press Releases</a>
            </div>
            <div class="footer-column">
                <h4>Solutions</h4>
                <a href="/">Enterprise</a>
                <a href="/">Cloud</a>
                <a href="/">Analytics</a>
            </div>
            <div class="footer-column">
                <h4>Resources</h4>
                <a href="#">Case Studies</a>
                <a href="#">Contact</a>
                <a href="#">Careers</a>
            </div>
            <div class="footer-column">
                <h4>Legal</h4>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 ${company.name}. All rights reserved. | Web Scraping Test Suite</p>
        </div>
    </footer>
</body>
</html>`;

  return homePage;
}

function createNewsPage(company) {
  const newsPage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>News - ${company.name}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #2c3e50; background-color: #f8fafb; }
        header { background-color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 100; }
        nav { max-width: 1400px; margin: 0 auto; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 28px; font-weight: 700; color: ${company.color}; text-decoration: none; letter-spacing: -0.5px; }
        .nav-menu { display: flex; list-style: none; gap: 0; }
        .nav-item { position: relative; }
        .nav-link { color: #2c3e50; text-decoration: none; padding: 0.75rem 1.25rem; display: block; font-size: 0.95rem; font-weight: 500; transition: color 0.3s ease; }
        .nav-link:hover { color: ${company.color}; }
        .breadcrumb { padding: 1.5rem 2rem; color: #666; font-size: 0.95rem; background-color: white; border-bottom: 1px solid #e0e8f0; }
        .breadcrumb a { color: ${company.color}; text-decoration: none; }
        .breadcrumb a:hover { text-decoration: underline; }
        .page-header { background: linear-gradient(135deg, ${company.color} 0%, ${adjustColorBrightness(company.color, -30)} 100%); color: white; padding: 3rem 2rem; text-align: center; }
        .page-header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .page-header p { font-size: 1.1rem; opacity: 0.95; }
        .content-container { max-width: 1000px; margin: 2rem auto; padding: 0 2rem; }
        .news-intro { background: white; padding: 2rem; border-radius: 8px; margin-bottom: 2rem; box-shadow: 0 2px 6px rgba(0,0,0,0.05); border-left: 4px solid ${company.color}; }
        .news-intro p { font-size: 1.05rem; line-height: 1.8; color: #444; }
        .cta-section { background: rgba(${hexToRgb(company.color)}, 0.1); padding: 2rem; border-radius: 8px; text-align: center; margin: 2rem 0; }
        .cta-section h2 { color: ${company.color}; margin-bottom: 1rem; }
        .cta-button { display: inline-block; padding: 0.75rem 2rem; background-color: ${company.color}; color: white; text-decoration: none; border-radius: 4px; font-weight: 600; transition: all 0.3s ease; }
        .cta-button:hover { background-color: ${adjustColorBrightness(company.color, -20)}; transform: scale(1.05); }
        footer { background-color: #1a2332; color: white; padding: 60px 2rem 20px; margin-top: 4rem; }
        .footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 2rem; max-width: 1200px; margin-left: auto; margin-right: auto; }
        .footer-column h4 { margin-bottom: 1rem; font-size: 1rem; }
        .footer-column a { display: block; color: #aaa; text-decoration: none; font-size: 0.9rem; margin-bottom: 0.75rem; transition: color 0.3s ease; }
        .footer-column a:hover { color: white; }
        .footer-bottom { border-top: 1px solid #333; padding-top: 2rem; text-align: center; color: #aaa; font-size: 0.9rem; max-width: 1200px; margin: 0 auto; }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">${company.name.split(' ')[0].toUpperCase()}</a>
            <ul class="nav-menu">
                <li class="nav-item"><a href="/" class="nav-link">Home</a></li>
                <li class="nav-item"><a href="/news" class="nav-link">News</a></li>
                <li class="nav-item"><a href="/press-releases" class="nav-link">Press Releases</a></li>
            </ul>
        </nav>
    </header>

    <div class="breadcrumb">
        <a href="/">Home</a> / News
    </div>

    <div class="page-header">
        <h1>Company News</h1>
        <p>Latest Updates and Announcements from ${company.name}</p>
    </div>

    <div class="content-container">
        <div class="news-intro">
            <p>Welcome to the ${company.name} News section. Here you'll find the latest updates about our company, including partnership announcements, strategic initiatives, investment news, and other important milestones. Stay informed about our growth and innovations shaping the future of enterprise technology.</p>
        </div>

        <div class="cta-section">
            <h2>Read Our Press Releases</h2>
            <p style="margin-bottom: 1.5rem; color: #444;">Explore our official press releases covering partnerships, investments, and business initiatives.</p>
            <a href="/press-releases" class="cta-button">View Press Releases →</a>
        </div>
    </div>

    <footer>
        <div class="footer-grid">
            <div class="footer-column">
                <h4>Company</h4>
                <a href="/">About Us</a>
                <a href="/">Leadership</a>
                <a href="/press-releases">Press Releases</a>
            </div>
            <div class="footer-column">
                <h4>Solutions</h4>
                <a href="/">Enterprise</a>
                <a href="/">Cloud</a>
                <a href="/">Analytics</a>
            </div>
            <div class="footer-column">
                <h4>Resources</h4>
                <a href="#">Case Studies</a>
                <a href="#">Contact</a>
                <a href="#">Careers</a>
            </div>
            <div class="footer-column">
                <h4>Legal</h4>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 ${company.name}. All rights reserved. | Web Scraping Test Suite</p>
        </div>
    </footer>
</body>
</html>`;

  return newsPage;
}

function createPressReleasesPage(company) {
  const pressPage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Press Releases - ${company.name}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #2c3e50; background-color: #f8fafb; }
        header { background-color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 100; }
        nav { max-width: 1400px; margin: 0 auto; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 28px; font-weight: 700; color: ${company.color}; text-decoration: none; letter-spacing: -0.5px; }
        .nav-menu { display: flex; list-style: none; gap: 0; }
        .nav-item { position: relative; }
        .nav-link { color: #2c3e50; text-decoration: none; padding: 0.75rem 1.25rem; display: block; font-size: 0.95rem; font-weight: 500; transition: color 0.3s ease; }
        .nav-link:hover { color: ${company.color}; }
        .breadcrumb { padding: 1.5rem 2rem; color: #666; font-size: 0.95rem; background-color: white; border-bottom: 1px solid #e0e8f0; }
        .breadcrumb a { color: ${company.color}; text-decoration: none; }
        .breadcrumb a:hover { text-decoration: underline; }
        .page-header { background: linear-gradient(135deg, ${company.color} 0%, ${adjustColorBrightness(company.color, -30)} 100%); color: white; padding: 3rem 2rem; text-align: center; }
        .page-header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .page-header p { font-size: 1.1rem; opacity: 0.95; }
        .releases-container { max-width: 1000px; margin: 2rem auto; padding: 0 2rem; }
        .releases-list { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        .release-link { background: white; padding: 1.5rem; border-radius: 8px; text-decoration: none; color: inherit; border-left: 4px solid ${company.color}; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .release-link:hover { box-shadow: 0 4px 12px rgba(${hexToRgb(company.color)}, 0.2); transform: translateX(4px); }
        .release-link-title { display: block; font-size: 1.2rem; font-weight: 600; color: ${company.color}; margin-bottom: 0.5rem; }
        .release-link-date { display: block; font-size: 0.9rem; color: #999; }
        footer { background-color: #1a2332; color: white; padding: 60px 2rem 20px; margin-top: 4rem; }
        .footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 2rem; max-width: 1200px; margin-left: auto; margin-right: auto; }
        .footer-column h4 { margin-bottom: 1rem; font-size: 1rem; }
        .footer-column a { display: block; color: #aaa; text-decoration: none; font-size: 0.9rem; margin-bottom: 0.75rem; transition: color 0.3s ease; }
        .footer-column a:hover { color: white; }
        .footer-bottom { border-top: 1px solid #333; padding-top: 2rem; text-align: center; color: #aaa; font-size: 0.9rem; max-width: 1200px; margin: 0 auto; }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/" class="logo">${company.name.split(' ')[0].toUpperCase()}</a>
            <ul class="nav-menu">
                <li class="nav-item"><a href="/" class="nav-link">Home</a></li>
                ${company.depth === 2 ? '<li class="nav-item"><a href="/news" class="nav-link">News</a></li>' : ''}
                <li class="nav-item"><a href="/press-releases" class="nav-link">Press Releases</a></li>
            </ul>
        </nav>
    </header>

    <div class="breadcrumb">
        <a href="/">Home</a> ${company.depth === 2 ? '/ <a href="/news">News</a>' : ''} / Press Releases
    </div>

    <div class="page-header">
        <h1>Press Releases</h1>
        <p>News and Announcements from ${company.name}</p>
    </div>

    <div class="releases-container">
        <div class="releases-list">
            <a href="/pr-001.html" class="release-link">
                <span class="release-link-title">Strategic Partnership Announcement</span>
                <span class="release-link-date">Released: January 15, 2025</span>
            </a>
            <a href="/pr-002.html" class="release-link">
                <span class="release-link-title">New Product Launch</span>
                <span class="release-link-date">Released: February 3, 2025</span>
            </a>
            <a href="/pr-003.html" class="release-link">
                <span class="release-link-title">Market Expansion Initiative</span>
                <span class="release-link-date">Released: February 28, 2025</span>
            </a>
            <a href="/pr-004.html" class="release-link">
                <span class="release-link-title">Distribution Agreement</span>
                <span class="release-link-date">Released: March 20, 2025</span>
            </a>
            <a href="/pr-005.html" class="release-link">
                <span class="release-link-title">Investment Milestone</span>
                <span class="release-link-date">Released: April 10, 2025</span>
            </a>
            <a href="/pr-006.html" class="release-link">
                <span class="release-link-title">Innovation Initiative Launch</span>
                <span class="release-link-date">Released: April 25, 2025</span>
            </a>
            <a href="/pr-007.html" class="release-link">
                <span class="release-link-title">Technology Partnership</span>
                <span class="release-link-date">Released: May 5, 2025</span>
            </a>
        </div>
    </div>

    <footer>
        <div class="footer-grid">
            <div class="footer-column">
                <h4>Company</h4>
                <a href="/">About Us</a>
                <a href="/">Leadership</a>
                <a href="/press-releases">Press Releases</a>
            </div>
            <div class="footer-column">
                <h4>Solutions</h4>
                <a href="/">Enterprise</a>
                <a href="/">Cloud</a>
                <a href="/">Analytics</a>
            </div>
            <div class="footer-column">
                <h4>Resources</h4>
                <a href="#">Case Studies</a>
                <a href="#">Contact</a>
                <a href="#">Careers</a>
            </div>
            <div class="footer-column">
                <h4>Legal</h4>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 ${company.name}. All rights reserved. | Web Scraping Test Suite</p>
        </div>
    </footer>
</body>
</html>`;

  return pressPage;
}

function adjustColorBrightness(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
}

// Generate files for websites 3-10
Object.keys(companies).forEach(site => {
  const num = parseInt(site);
  const company = companies[site];
  const websiteDir = path.join(__dirname, `website ${num}`);

  try {
    // Create index.html
    fs.writeFileSync(path.join(websiteDir, 'index.html'), createHomePage(company), 'utf8');
    console.log(`✓ Created index.html for Website ${num} (${company.name})`);

    // Create news.html only if depth is 2
    if (company.depth === 2) {
      fs.writeFileSync(path.join(websiteDir, 'news.html'), createNewsPage(company), 'utf8');
      console.log(`✓ Created news.html for Website ${num} (${company.name}) - DEPTH 2`);
    } else {
      console.log(`  Skipped news.html for Website ${num} (${company.name}) - DEPTH 1`);
    }

    // Create press-releases.html
    fs.writeFileSync(path.join(websiteDir, 'press-releases.html'), createPressReleasesPage(company), 'utf8');
    console.log(`✓ Created press-releases.html for Website ${num} (${company.name})`);

    // Update .env
    const envPath = path.join(websiteDir, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace(/NAVIGATION_DEPTH=\d+/, `NAVIGATION_DEPTH=${company.depth}`);
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log(`✓ Updated .env for Website ${num} - NAVIGATION_DEPTH=${company.depth}`);

  } catch (err) {
    console.error(`✗ Error processing Website ${num}:`, err.message);
  }
});

console.log('\n✅ Homepage generation complete!');
console.log('\nNavigation Depths Assigned:');
Object.keys(companies).forEach(site => {
  console.log(`  Website ${site} (${companies[site].name}): ${companies[site].depth} level${companies[site].depth > 1 ? 's' : ''}`);
});
