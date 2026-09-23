# Nikhil Desai - Personal Website

A sustainable personal portfolio website built with static HTML. No JavaScript frameworks, no build tools, just clean markup.

## Sustainability Guidelines

This site is designed to minimise carbon emissions. Follow these rules for all future updates.

### 1. No JavaScript Frameworks

- **Do not** use React, Vue, Angular, or any JS framework
- **Do not** add client-side rendering or hydration
- All pages are pre-rendered static HTML
- The only acceptable JavaScript is for essential interactivity (e.g., a mobile menu toggle)

### 2. Image Optimisation

All images must be:

| Rule | Requirement |
|------|-------------|
| Format | WebP only (not PNG, JPG, or GIF) |
| Quality | 60 or lower when compressing |
| Max width | 1400px for full-width images, 800px for thumbnails |
| Loading | Always use `loading="lazy"` and `decoding="async"` |

**To compress images:**
```bash
# Convert to WebP at quality 60
cwebp -q 60 input.jpg -o output.webp

# Recompress existing WebP (decode then re-encode)
dwebp image.webp -o /tmp/temp.png && cwebp -q 60 /tmp/temp.png -o image.webp
```

### 3. Fonts

- Fonts are self-hosted in `/fonts/`
- Only include the weights actually used (300 and 400)
- Use `font-display: swap` to prevent render blocking
- Do not add Google Fonts CDN links

### 4. File Structure

```
/
├── index.html              # Homepage
├── experience/index.html   # Experience page
├── contact/index.html      # Contact page
├── writing/
│   ├── index.html          # Writing listing
│   ├── dalston/index.html  # Article
│   └── heat-vulnerability-index/index.html
├── assets/
│   ├── opt/                # Optimised images for the site
│   └── heat/               # Heat vulnerability article images
├── fonts/
│   ├── fonts.css
│   ├── LibreFranklin-Light.ttf
│   └── LibreFranklin-Regular.ttf
└── README.md
```

### 5. Page Weight Targets

| Page | Target | Current |
|------|--------|---------|
| Homepage | < 800KB | ~750KB |
| Article pages | < 500KB | ~400KB |
| Simple pages (contact, experience) | < 100KB | ~20KB |

### 6. Adding New Content

**New page:**
1. Create a folder with the URL path (e.g., `/writing/new-article/`)
2. Add an `index.html` file inside it
3. Copy the HTML structure from an existing page
4. Update navigation to highlight the correct section

**New image:**
1. Resize to max 1400px width
2. Convert to WebP at quality 60
3. Place in `/assets/opt/`
4. Use lazy loading in the HTML

### 7. Colour Palette

**Dark theme (homepage, experience, writing listing):**
- Background: `#111210`
- Text: `#f2f1ec`
- Muted text: `#8d8f83`
- Links: `#dfe3d6`
- Borders: `#2c2e28`

**Light theme (articles):**
- Background: `#f4f2ee`
- Text: `#14150f`
- Muted text: `#6d6f60`
- Links: `#1f3d2b`
- Borders: `#d8d3c7`

### 8. Deployment

- Hosted on GitHub Pages from the `main` branch
- No build step required
- Changes go live within minutes of pushing

### 9. Testing Sustainability

Check the site's carbon score at:
- https://www.websitecarbon.com
- https://ecograder.com

Target: **B rating or higher**.

---

## What Was Removed

The site was originally built with a React-based framework (DC/Document Canvas). This was removed in September 2026 to improve sustainability:

- `support.js` (68KB) - DC framework runtime
- `react.min.js` (8KB) - React library
- `react-dom.min.js` (133KB) - React DOM
- All `.dc.html` component files

**Result:** 210KB of JavaScript eliminated, 37% total page weight reduction.

---

## Quick Reference

```html
<!-- Image template -->
<img
  loading="lazy"
  decoding="async"
  src="/assets/opt/image-name.webp"
  alt="Descriptive alt text"
  style="width:100%;height:100%;object-fit:cover;display:block"
>

<!-- Navigation link (update aria-current for active page) -->
<a href="/experience" aria-current="page">Experience</a>

<!-- External link -->
<a href="https://example.com" target="_blank" rel="noopener">Link text</a>
```
