# Create homepages for websites 4-10
$websites = @{
    4 = @{ name = "Libra"; color = "#db2777"; bg = "#be123c"; depth = 2; desc = "Libra Company brings balance and harmony to enterprise operations through thoughtful integration and fair-value solutions. We weigh every decision carefully." }
    5 = @{ name = "Scorpio"; color = "#991b1b"; bg = "#7f1d1d"; depth = 1; desc = "Scorpio Company delivers powerful, transformative solutions with unmatched intensity and focus. We dig deep to uncover the insights that drive real change." }
    6 = @{ name = "Leo"; color = "#b45309"; bg = "#92400e"; depth = 2; desc = "Leo Company leads the industry with bold, visionary solutions. Our creative approach and confident execution set new standards for enterprise excellence." }
    7 = @{ name = "Virgo"; color = "#166534"; bg = "#15803d"; depth = 1; desc = "Virgo Company provides precise, reliable, and detail-oriented solutions for businesses that demand accuracy. Excellence through meticulous planning and execution." }
    8 = @{ name = "Gemini"; color = "#4f46e5"; bg = "#4338ca"; depth = 2; desc = "Gemini Company excels at seamless communication and multi-channel integration. We connect your systems, teams, and data with agility and versatility." }
    9 = @{ name = "Aries"; color = "#c2410c"; bg = "#9a3412"; depth = 1; desc = "Aries Company drives pioneering solutions that charge forward with courage and speed. We tackle challenges head-on and lead market transformation." }
    10 = @{ name = "Aquarius"; color = "#334155"; bg = "#1e293b"; depth = 2; desc = "Aquarius Company pioneers innovative, forward-thinking solutions that revolutionize how enterprises operate. We imagine the future and build it today." }
}

function Create-HomePage {
    param($number, $config)

    $logoName = $config.name.ToUpper()
    $navNews = if ($config.depth -eq 2) { '<li class="nav-item"><a href="/news" class="nav-link">News</a></li>' } else { '' }

    $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$($config.name) Company - Home</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #2c3e50; background-color: #f8fafb; }
        header { background-color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 100; }
        nav { max-width: 1400px; margin: 0 auto; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 28px; font-weight: 700; color: $($config.color); text-decoration: none; letter-spacing: -0.5px; }
        .nav-menu { display: flex; list-style: none; gap: 0; }
        .nav-item { position: relative; }
        .nav-link { color: #2c3e50; text-decoration: none; padding: 0.75rem 1.25rem; display: block; font-size: 0.95rem; font-weight: 500; transition: color 0.3s ease; }
        .nav-link:hover { color: $($config.color); }
        .hero { background: linear-gradient(135deg, $($config.color) 0%, $($config.bg) 100%); color: white; padding: 6rem 2rem; text-align: center; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; font-weight: 700; }
        .hero p { font-size: 1.3rem; opacity: 0.95; margin-bottom: 2rem; }
        .hero .cta-button { display: inline-block; padding: 0.75rem 2rem; background-color: white; color: $($config.color); text-decoration: none; border-radius: 4px; font-weight: 600; transition: all 0.3s ease; }
        .hero .cta-button:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .content-container { max-width: 1000px; margin: 3rem auto; padding: 0 2rem; }
        .section { margin-bottom: 3rem; }
        .section h2 { font-size: 2rem; color: $($config.color); margin-bottom: 1rem; }
        .section p { font-size: 1.05rem; line-height: 1.8; margin-bottom: 1rem; color: #444; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin: 2rem 0; }
        .feature-card { background: white; padding: 2rem; border-radius: 8px; border-top: 4px solid $($config.color); box-shadow: 0 2px 6px rgba(0,0,0,0.05); }
        .feature-card h3 { color: $($config.color); margin-bottom: 1rem; }
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
            <a href="/" class="logo">$logoName</a>
            <ul class="nav-menu">
                <li class="nav-item"><a href="/" class="nav-link">Home</a></li>
                $navNews
                <li class="nav-item"><a href="/press-releases" class="nav-link">Press Releases</a></li>
            </ul>
        </nav>
    </header>

    <div class="hero">
        <h1>Welcome to $($config.name) Company</h1>
        <p>Enterprise Solutions for Modern Business Challenges</p>
        <a href="$(if ($config.depth -eq 2) { '/news' } else { '/press-releases' })" class="cta-button">Discover Our Updates</a>
    </div>

    <div class="content-container">
        <div class="section">
            <h2>About $($config.name) Company</h2>
            <p>$($config.desc)</p>
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
            <p>Stay informed about our latest partnerships, innovations, and company milestones. <a href="$(if ($config.depth -eq 2) { '/news' } else { '/press-releases' })" style="color: $($config.color); font-weight: 600; text-decoration: none;">Visit our $(if ($config.depth -eq 2) { 'News' } else { 'Press Releases' }) section →</a></p>
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
            <p>&copy; 2025 $($config.name) Company. All rights reserved. | Web Scraping Test Suite</p>
        </div>
    </footer>
</body>
</html>
"@
    return $html
}

function Create-NewsPage {
    param($number, $config)

    $logoName = $config.name.ToUpper()

    $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>News - $($config.name) Company</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #2c3e50; background-color: #f8fafb; }
        header { background-color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 100; }
        nav { max-width: 1400px; margin: 0 auto; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 28px; font-weight: 700; color: $($config.color); text-decoration: none; letter-spacing: -0.5px; }
        .nav-menu { display: flex; list-style: none; gap: 0; }
        .nav-item { position: relative; }
        .nav-link { color: #2c3e50; text-decoration: none; padding: 0.75rem 1.25rem; display: block; font-size: 0.95rem; font-weight: 500; transition: color 0.3s ease; }
        .nav-link:hover { color: $($config.color); }
        .breadcrumb { padding: 1.5rem 2rem; color: #666; font-size: 0.95rem; background-color: white; border-bottom: 1px solid #e0e8f0; }
        .breadcrumb a { color: $($config.color); text-decoration: none; }
        .breadcrumb a:hover { text-decoration: underline; }
        .page-header { background: linear-gradient(135deg, $($config.color) 0%, $($config.bg) 100%); color: white; padding: 3rem 2rem; text-align: center; }
        .page-header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .page-header p { font-size: 1.1rem; opacity: 0.95; }
        .content-container { max-width: 1000px; margin: 2rem auto; padding: 0 2rem; }
        .news-intro { background: white; padding: 2rem; border-radius: 8px; margin-bottom: 2rem; box-shadow: 0 2px 6px rgba(0,0,0,0.05); border-left: 4px solid $($config.color); }
        .news-intro p { font-size: 1.05rem; line-height: 1.8; color: #444; }
        .cta-section { background: rgba(100, 100, 100, 0.05); padding: 2rem; border-radius: 8px; text-align: center; margin: 2rem 0; }
        .cta-section h2 { color: $($config.color); margin-bottom: 1rem; }
        .cta-button { display: inline-block; padding: 0.75rem 2rem; background-color: $($config.color); color: white; text-decoration: none; border-radius: 4px; font-weight: 600; transition: all 0.3s ease; }
        .cta-button:hover { transform: scale(1.05); }
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
            <a href="/" class="logo">$logoName</a>
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
        <p>Latest Updates and Announcements from $($config.name) Company</p>
    </div>

    <div class="content-container">
        <div class="news-intro">
            <p>Welcome to the $($config.name) Company News section. Here you'll find the latest updates about our company, including partnership announcements, strategic initiatives, investment news, and other important milestones. Stay informed about our growth and innovations shaping the future of enterprise technology.</p>
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
            <p>&copy; 2025 $($config.name) Company. All rights reserved. | Web Scraping Test Suite</p>
        </div>
    </footer>
</body>
</html>
"@
    return $html
}

function Create-PressReleasesPage {
    param($number, $config)

    $logoName = $config.name.ToUpper()
    $navNews = if ($config.depth -eq 2) { '<li class="nav-item"><a href="/news" class="nav-link">News</a></li>' } else { '' }
    $breadcrumbNews = if ($config.depth -eq 2) { '/ <a href="/news">News</a>' } else { '' }

    $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Press Releases - $($config.name) Company</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #2c3e50; background-color: #f8fafb; }
        header { background-color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 100; }
        nav { max-width: 1400px; margin: 0 auto; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 28px; font-weight: 700; color: $($config.color); text-decoration: none; letter-spacing: -0.5px; }
        .nav-menu { display: flex; list-style: none; gap: 0; }
        .nav-item { position: relative; }
        .nav-link { color: #2c3e50; text-decoration: none; padding: 0.75rem 1.25rem; display: block; font-size: 0.95rem; font-weight: 500; transition: color 0.3s ease; }
        .nav-link:hover { color: $($config.color); }
        .breadcrumb { padding: 1.5rem 2rem; color: #666; font-size: 0.95rem; background-color: white; border-bottom: 1px solid #e0e8f0; }
        .breadcrumb a { color: $($config.color); text-decoration: none; }
        .breadcrumb a:hover { text-decoration: underline; }
        .page-header { background: linear-gradient(135deg, $($config.color) 0%, $($config.bg) 100%); color: white; padding: 3rem 2rem; text-align: center; }
        .page-header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .page-header p { font-size: 1.1rem; opacity: 0.95; }
        .releases-container { max-width: 1000px; margin: 2rem auto; padding: 0 2rem; }
        .releases-list { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        .release-link { background: white; padding: 1.5rem; border-radius: 8px; text-decoration: none; color: inherit; border-left: 4px solid $($config.color); transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .release-link:hover { box-shadow: 0 4px 12px rgba(100, 100, 100, 0.2); transform: translateX(4px); }
        .release-link-title { display: block; font-size: 1.2rem; font-weight: 600; color: $($config.color); margin-bottom: 0.5rem; }
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
            <a href="/" class="logo">$logoName</a>
            <ul class="nav-menu">
                <li class="nav-item"><a href="/" class="nav-link">Home</a></li>
                $navNews
                <li class="nav-item"><a href="/press-releases" class="nav-link">Press Releases</a></li>
            </ul>
        </nav>
    </header>

    <div class="breadcrumb">
        <a href="/">Home</a> $breadcrumbNews / Press Releases
    </div>

    <div class="page-header">
        <h1>Press Releases</h1>
        <p>News and Announcements from $($config.name) Company</p>
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
            <p>&copy; 2025 $($config.name) Company. All rights reserved. | Web Scraping Test Suite</p>
        </div>
    </footer>
</body>
</html>
"@
    return $html
}

# Create files for websites 4-10
foreach ($siteNum in 4..10) {
    $config = $websites[$siteNum]
    $siteDir = "website $siteNum"

    # Create index.html
    $indexContent = Create-HomePage -number $siteNum -config $config
    Set-Content -Path "$siteDir\index.html" -Value $indexContent -Encoding UTF8
    Write-Host "✓ Created index.html for Website $siteNum ($($config.name) Company)"

    # Create news.html if depth is 2
    if ($config.depth -eq 2) {
        $newsContent = Create-NewsPage -number $siteNum -config $config
        Set-Content -Path "$siteDir\news.html" -Value $newsContent -Encoding UTF8
        Write-Host "✓ Created news.html for Website $siteNum ($($config.name) Company) - DEPTH 2"
    } else {
        Write-Host "  Skipped news.html for Website $siteNum ($($config.name) Company) - DEPTH 1"
    }

    # Create press-releases.html
    $pressContent = Create-PressReleasesPage -number $siteNum -config $config
    Set-Content -Path "$siteDir\press-releases.html" -Value $pressContent -Encoding UTF8
    Write-Host "✓ Created press-releases.html for Website $siteNum ($($config.name) Company)"

    # Update .env
    $envPath = "$siteDir\.env"
    $envContent = Get-Content -Path $envPath -Raw
    $envContent = $envContent -replace "NAVIGATION_DEPTH=\d+", "NAVIGATION_DEPTH=$($config.depth)"
    if ($envContent -notmatch "RATE_LIMIT_PROB") {
        $envContent += "`nRATE_LIMIT_PROB=0.2"
    }
    Set-Content -Path $envPath -Value $envContent -Encoding UTF8
    Write-Host "✓ Updated .env for Website $siteNum - NAVIGATION_DEPTH=$($config.depth)"
}

Write-Host "`n✅ Homepage generation complete!"
Write-Host "`nNavigation Depths Assigned:`n"
foreach ($siteNum in 4..10) {
    $config = $websites[$siteNum]
    Write-Host "  Website $siteNum ($($config.name) Company): $($config.depth) level$(if ($config.depth -gt 1) { 's' })"
}
