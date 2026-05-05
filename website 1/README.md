# XNC Mock Website - Complete Package

This is a production-ready mock website for testing web scraping solutions.

## 📦 Quick Links

- **Start Here:** See [XNC_WEBSITE_SUMMARY.md](XNC_WEBSITE_SUMMARY.md) for overview
- **Deploy Now:** Follow [XNC_DEPLOYMENT_GUIDE.md](XNC_DEPLOYMENT_GUIDE.md)
- **Full Specs:** Read [MOCK_WEBSITE_GUIDE.md](MOCK_WEBSITE_GUIDE.md)

## 🌐 Website Files

| File | Purpose | How to Access |
|------|---------|---------------|
| xnc-homepage.html | Main landing page | `/` or `/xnc-homepage.html` |
| xnc-company-overview.html | Company info (Level 1) | `/company/overview.html` |
| xnc-press-releases-page.html | Press releases (Level 2) | `/company/press-releases.html` |

## 📰 What's Inside

✅ **100 Press Releases** across 3 tiers
✅ **2 Levels Deep** navigation (exactly as requested)
✅ **OXB-Inspired Design** with professional styling
✅ **All Company Relationships** (investor, research, partnerships, JV, distribution, marketing)
✅ **Ready to Deploy** (no setup required)

## 🚀 Quick Start

```bash
# Option 1: Python (Instant)
python -m http.server 8000
# Visit: http://localhost:8000/xnc-homepage.html

# Option 2: Node.js
npm install express
node server.js
# Visit: http://localhost:3000

# Option 3: Docker
docker build -t xnc-website .
docker run -p 3000:3000 xnc-website
```

## 📍 Navigation Path to Press Releases

```
Homepage (/)
  ↓
Company dropdown menu (in header)
  ↓
Press Releases link → /company/press-releases.html
```

**Total: 2 clicks from homepage to press releases archive**

## 📊 Release Tiers

- **Tier 1 (60):** ✅ Clean, consistent
- **Tier 2 (25):** ⚠️ Mixed formats, inconsistencies  
- **Tier 3 (15):** 🔴 Advanced challenges (auth, rate limiting, malformed HTML, etc.)

## 📁 File Structure

```
mock websites/Revere/
├── xnc-homepage.html              ← Start here
├── xnc-company-overview.html      ← Level 1
├── xnc-press-releases-page.html   ← Level 2 (all 100 releases)
├── mock-website-config.json       ← Release data
├── README.md                       ← This file
├── XNC_WEBSITE_SUMMARY.md         ← Project overview
├── XNC_DEPLOYMENT_GUIDE.md        ← How to deploy
└── MOCK_WEBSITE_GUIDE.md          ← Full specifications
```

## 🎯 Use Cases

1. **Web Scraper Testing** - Extract and validate company relationships
2. **Product Demo** - Show OXB-inspired professional design
3. **Training Material** - Real-world web scraping challenges
4. **Development Practice** - Test handling of various HTML/data scenarios

## 💻 Browser Support

- ✅ Chrome, Firefox, Safari, Edge (all modern versions)
- ✅ Mobile & tablet responsive
- ✅ Works offline (all files included)

## 🔧 Customization

Edit any HTML file to customize:
- Company name: Replace "XNC" with your company
- Colors: Change hex values in `<style>` section
- Content: Update text directly in HTML
- Releases: Modify RELEASES_DATA array in press-releases page

## ❓ Need Help?

| Question | Answer |
|----------|--------|
| How do I deploy? | See XNC_DEPLOYMENT_GUIDE.md |
| What are all the features? | See MOCK_WEBSITE_GUIDE.md |
| What's in each tier? | See XNC_WEBSITE_SUMMARY.md |
| Can I customize it? | Yes! All files are editable HTML |

## 📞 Support

- **Troubleshooting:** XNC_DEPLOYMENT_GUIDE.md → Troubleshooting section
- **Technical Details:** MOCK_WEBSITE_GUIDE.md → Full specifications
- **Overview:** XNC_WEBSITE_SUMMARY.md → Project summary

---

**Ready to start?** 
1. Read [XNC_WEBSITE_SUMMARY.md](XNC_WEBSITE_SUMMARY.md) for a quick overview
2. Follow [XNC_DEPLOYMENT_GUIDE.md](XNC_DEPLOYMENT_GUIDE.md) to deploy
3. Navigate to `/company/press-releases.html` to see all 100 releases!

**Version:** 1.0 | **Status:** ✅ Production Ready
