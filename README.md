# PNC InfraTech Mock Website - Web Scraper Testing Platform

A realistic tech company press release website designed to test and validate web scraping solutions. The site includes embedded scraping challenges to help validate scraper capabilities.

## Features

- **Homepage** with company overview and service descriptions
- **Press Releases Hub** listing 8 news articles
- **Individual Article Pages** with realistic infrastructure news content
- **Embedded Partnership Details** naturally integrated into article narratives
- **Related Article Links** within article content
- **Distributed Scraping Challenges**:
  - Rate Limiting (delayed responses: 800-1600ms)
  - JavaScript Rendering (dynamically injected content)
  - CAPTCHA Form (text-based verification)
  - Image CAPTCHA (distorted text verification)

## Scraping Challenges Distribution

| Article | Title | Challenges |
|---------|-------|------------|
| 1 | 5G Infrastructure Partnership | Rate Limiting + JS Rendering |
| 2 | Smart City Infrastructure Deal | Rate Limiting + Image CAPTCHA + JS Rendering |
| 3 | Data Center Expansion | Rate Limiting |
| 4 | Quantum-Resistant Encryption | CAPTCHA Form |
| 5 | Infrastructure Innovation Award | Image CAPTCHA |
| 6 | Cyber Security Report | JS Rendering |
| 7 | Green Energy Initiative | Rate Limiting |
| 8 | Workforce Development | CAPTCHA Form |

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm

### Install Dependencies

```bash
npm install
```

### Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` if needed (defaults work for local testing):

```
PORT=3000
NODE_ENV=development
SESSION_SECRET=your-secret-key-change-this
```

## Running the Server

### Development Mode

```bash
npm start
```

Server will start on `http://localhost:3000`

### Development with Auto-Reload

```bash
npm run dev
```

(Requires nodemon: `npm install --save-dev nodemon`)

## Site Structure

```
/                          Homepage
/press-releases            Press releases listing (2 levels deep: / → /press-releases)
/articles/:slug            Individual article pages
  /articles/article-1      Article 1: 5G Infrastructure
  /articles/article-2      Article 2: Smart City
  /articles/article-3      Article 3: Data Centers
  /articles/article-4      Article 4: Encryption
  /articles/article-5      Article 5: Innovation Award
  /articles/article-6      Article 6: Security
  /articles/article-7      Article 7: Green Energy
  /articles/article-8      Article 8: Workforce
/api/articles/:id/content  Dynamic content endpoint
```

## Challenge Details

### Rate Limiting
- **Type**: Server-side delayed response
- **Implementation**: 800-1600ms random delay on applicable articles
- **Test For**: Scraper's ability to handle slow responses, concurrency limits
- **Articles**: 1, 2, 3, 7

### JavaScript Rendering
- **Type**: Client-side dynamic content injection
- **Implementation**: Content loaded via fetch API after page load
- **Test For**: Scraper's JavaScript execution capability (requires headless browser)
- **Articles**: 1, 2, 6

### CAPTCHA Form
- **Type**: Text-based security question
- **Questions**: 
  - Article 4: "What is a key focus for modern infrastructure?" → Answer: "security"
  - Article 8: "What word describes positive expansion?" → Answer: "growth"
- **Implementation**: Server-side verification with session tracking
- **Test For**: Scraper's ability to answer security questions or bypass forms
- **Articles**: 4, 8

### Image CAPTCHA
- **Type**: Distorted text image verification
- **Implementation**: SVG-based CAPTCHA images with random text, rotated text, background noise
- **Test For**: Scraper's OCR capabilities or image analysis
- **Articles**: 2, 5

## Article Content

All articles feature realistic infrastructure news with:
- **Titles**: Project names, partnerships, initiatives
- **Dates**: Realistic news publication dates
- **Content**: Detailed paragraphs with technical information
- **Partnership Details**:
  - Research collaborations (e.g., "research collaboration with TechCorp Research Institute")
  - Vendor partnerships (e.g., "vendor partnerships with Siemens and Cisco")
  - Manufacturer partnerships (e.g., "manufacturer partners Bosch and Honeywell")
- **Related Articles**: 3 natural cross-references per article

## Testing Your Scraper

### Basic Test Flow

1. **Start server**: `npm start`
2. **Homepage test**: GET `http://localhost:3000/`
3. **Press releases test**: GET `http://localhost:3000/press-releases`
4. **Article with rate limiting**: GET `http://localhost:3000/articles/article-3` (observe delay)
5. **Article with CAPTCHA**: GET `http://localhost:3000/articles/article-4` (solve form before content)
6. **Article with JS rendering**: GET `http://localhost:3000/articles/article-1` (execute JS to see content)
7. **Article with image CAPTCHA**: GET `http://localhost:3000/articles/article-2` (OCR the image)

### Verification Checklist

- ✓ Scraper identifies all 8 articles on press releases page
- ✓ Scraper retrieves article content despite rate limiting
- ✓ Scraper solves or bypasses CAPTCHA forms
- ✓ Scraper handles JS rendering (via Selenium, Playwright, Puppeteer)
- ✓ Scraper recognizes and extracts partnership details from article content
- ✓ Scraper identifies related article links within content
- ✓ Scraper handles mixed challenges (articles with multiple constraints)

## Technology Stack

- **Framework**: Express.js
- **Templating**: EJS
- **Session Management**: express-session
- **Image Generation**: Sharp
- **Node.js version**: 14+

## File Structure

```
website 2/
├── server.js                     Main Express server
├── package.json                  Dependencies
├── .env                          Environment config (gitignored)
├── .env.example                  Environment template
├── .gitignore                    Git ignore rules
├── README.md                     This file
├── routes/
│   ├── index.js                 Home route
│   ├── pressReleases.js         Press releases route
│   └── articles.js              Article routes with challenges
├── middleware/
│   ├── rateLimiter.js           Rate limiting middleware
│   ├── captcha.js               CAPTCHA verification middleware
│   ├── imageCaptcha.js          Image CAPTCHA middleware
│   └── jsContent.js             JS rendering flag middleware
├── views/
│   ├── home.ejs                 Homepage template
│   ├── pressReleases.ejs        Press releases listing
│   ├── article.ejs              Article template
│   ├── captcha.ejs              CAPTCHA form
│   ├── imageCaptcha.ejs         Image CAPTCHA form
│   ├── 404.ejs                  Error page
│   └── 500.ejs                  Server error page
├── public/
│   ├── css/
│   │   └── style.css            Stylesheet
│   ├── js/
│   │   └── dynamic-content.js   Client-side JS rendering
│   └── img/                     Generated CAPTCHA images
├── data/
│   └── articles.json            Article metadata
└── utils/
    ├── contentGenerator.js      Article content data
    └── imageGenerator.js        CAPTCHA image generation
```

## Customization

### Adjust Challenge Difficulty

Edit `data/articles.json` to change which articles have which challenges:

```json
{
  "id": 1,
  "challenges": ["rateLimiting", "jsRendering"]
}
```

### Change Rate Limiting Delay

Edit `middleware/rateLimiter.js`:

```javascript
rateLimiter(1000)
```

### Modify CAPTCHA Questions

Edit `middleware/captcha.js` `correctAnswers` object and `getCaptchaQuestion` function.

### Update Article Content

Edit `utils/contentGenerator.js` to modify article text, titles, and details.

## License

This project is provided for testing and development purposes only.

## Support

For issues or questions about the scraper testing platform, contact your infrastructure team.
