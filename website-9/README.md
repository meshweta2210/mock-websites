# SupplyChain Dynamics Website

Company: SupplyChain Dynamics
Industry: Logistics/Supply Chain
Website Number: 9

## Local Development

### Prerequisites
- Node.js 16+ installed
- npm package manager

### Installation

```bash
npm install
```

### Running

```bash
npm start
```

Server starts on port 3009 (see .env)

### Features

- Branded homepage with SupplyChain branding
- 10 press release articles
- Dynamic press release archive with pagination
- Captcha-protected articles (~20% of articles)
- Sub-pages for even-numbered articles (details, related, timeline)
- Rate limiting on API endpoints (5 req/min)

### File Structure

```
website-9/
├── server.js              # Express server
├── package.json           # Dependencies
├── .env                   # Environment variables
├── index.html             # Homepage
├── company/
│   ├── overview.html      # Company overview
│   └── press-releases.html # Archive page
├── press-releases/
│   ├── pr-001.html through pr-010.html
│   └── pr-00X/
│       ├── details.html
│       ├── related.html
│       └── timeline.html
└── public/
    ├── css/
    │   ├── style.css
    │   └── captcha.css
    └── js/
        ├── main.js
        ├── captcha.js
        └── ajax-pagination.js
```

### Environment Variables

See `.env` file:
- `PORT=3009` - Server port
- `NODE_ENV=production`
- `RATE_LIMIT_MAX=5` - Max requests per minute

### Deployment

For Render deployment, see: `RENDER_QUICK_START.md`
