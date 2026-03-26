# Naftali's Solutions

A bilingual (Hebrew/English) business website for Naftali's Solutions — providing smart tech solutions for small businesses including appointment scheduling, WhatsApp Business integration, and custom dashboards.

🌐 **Live site:** [naftalissolutions.com](https://naftalissolutions.com)

---

## Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** + **Radix UI**
- **Framer Motion** — animations
- **React Router** — client-side routing
- **EmailJS** — contact form
- **React Helmet** — SEO meta tags
- **Google Analytics** (GA4)

---

## Features

- Bilingual support (Hebrew RTL / English LTR)
- Cookie consent banner (GDPR compliant)
- Accessibility widget (font size, contrast, dyslexia font, highlight links)
- SEO optimized (Open Graph, JSON-LD, sitemap, robots.txt)
- 404 page
- Skip-to-content for keyboard users

---

## Pages

| Route | Page |
|-------|------|
| `/` | Home / Solutions |
| `/services` | Services |
| `/about` | About |
| `/contact` | Contact |
| `/quote` | Pricing |
| `/quote-thank-you` | Quote confirmation |

---

## Getting Started

```bash
npm install
npm run dev
```

Runs on `http://localhost:3000`

---

## Environment Variables

Create a `.env` file in the root:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

> Also add these in **Netlify → Site settings → Environment variables** for production.

---

## Branches

| Branch | Description |
|--------|-------------|
| `main` | Production |
| `naftali_01` | Active development |
| `futuristic-background` | Dark HoloCity animated background (experimental) |

---

## Deployment

Deployed on **Netlify** — auto-deploys on push to `main`.

Build command and redirects are configured in [`netlify.toml`](./netlify.toml).
