<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&height=220&color=0:0f172a,50:111827,100:020617&text=FyoiaAi&fontColor=ffffff&fontSize=46&fontAlignY=38&desc=Build%20%7C%20Create%20%7C%20Automate&descAlignY=58&animation=fadeIn" alt="FyoiaAi Banner" />

# FyoiaAi

### Multi-model AI platform experience for chat, creation, automation, and media workflows.

<p>
  <img src="https://img.shields.io/badge/Status-Active-22c55e?style=for-the-badge" alt="Status Badge" />
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-646cff?style=for-the-badge&logo=vite&logoColor=white" alt="React Vite Badge" />
  <img src="https://img.shields.io/badge/Language-TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge" />
  <img src="https://img.shields.io/badge/Styling-TailwindCSS-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind Badge" />
  <img src="https://img.shields.io/badge/Animations-Motion-000000?style=for-the-badge&logo=framer&logoColor=white" alt="Motion Badge" />
</p>

<p>
  <a href="https://github.com/lostingness"><img src="https://img.shields.io/badge/GitHub-lostingness-181717?style=flat-square&logo=github" alt="GitHub" /></a>
  <a href="https://lostingness.site"><img src="https://img.shields.io/badge/Website-lostingness.site-0f172a?style=flat-square&logo=googlechrome&logoColor=white" alt="Website" /></a>
  <a href="https://www.instagram.com/lostingness"><img src="https://img.shields.io/badge/Instagram-@lostingness-E4405F?style=flat-square&logo=instagram&logoColor=white" alt="Instagram" /></a>
</p>

</div>

---

## Overview

**FyoiaAi** is a premium AI-style frontend experience built to present a modern multi-model platform with a polished, conversion-focused landing page. The current codebase is centered around visual presentation, motion, and brand positioning rather than a required backend setup.

This project is designed for:

- premium SaaS-style landing pages
- modern AI product presentation
- smooth animations and scroll interactions
- responsive layouts across devices
- fast local development with Vite
- easy branding, editing, and redeployment

---

## Live Links

- **Production URL:** `https://fyoia.app`
- **Canonical live site:** `https://www.fyoia.app/`
- **Local development:** `http://localhost:3000`
- **Local production preview:** usually available after `npm run preview` in the terminal output

> `https://fyoia.app` currently redirects to `https://www.fyoia.app/`, and the live site resolves with the title **“FyoiaAi - Build, Create & Automate.”**

---

## Highlights

- Premium hero section with motion-based UI
- Modern responsive navbar and landing layout
- Pricing, feature, testimonial, and FAQ style sections
- Vite-powered frontend workflow
- TypeScript-based structure
- Tailwind-powered styling pipeline
- HLS video support
- Clean reusable utility structure
- Easy to customize for a personal brand, SaaS product, AI tool, or agency landing page

---

## Tech Stack

<p>
  <img src="https://skillicons.dev/icons?i=react,ts,vite,tailwind,nodejs,express" alt="Tech Stack Icons" />
</p>

**Core stack used in the repo:**

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Motion
- Lucide React
- HLS.js
- Express
- clsx + tailwind-merge

---

## Project Structure

```bash
fyoiaai-main/
├── app/
│   └── applet/
│       ├── dump.js
│       ├── test-icons.js
│       └── test.js
├── src/
│   ├── App.tsx
│   ├── Spiral.jsx
│   ├── index.css
│   ├── main.tsx
│   └── lib/
│       └── utils.ts
├── .env.example
├── .gitignore
├── download.js
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Features Included

Based on the current repository structure and source files, this project includes or is organized for:

- AI landing page presentation
- motion-heavy UI sections
- animated visual components
- navbar with responsive interactions
- section-based homepage flow
- video/media-ready frontend setup
- utility-based class merging
- easy expansion for future API or backend integrations

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** 18 or later
- **npm** or another compatible package manager

---

### 1) Clone the repository

```bash
git clone https://github.com/lostingness/fyoiaai.git
cd fyoiaai
```

> If your repository name is different, replace `fyoiaai` with your actual repo folder name.

---

### 2) Install dependencies

```bash
npm install
```

---

### 3) Run locally

```bash
npm run dev
```

The current repo is configured to start the Vite dev server on:

```bash
http://localhost:3000
```

---

### 4) Build for production

```bash
npm run build
```

This creates the optimized production build inside the output directory.

---

### 5) Preview the production build locally

```bash
npm run preview
```

Vite will print the local preview URL in your terminal when the preview server starts.

---

## Available Scripts

```bash
npm run dev      # Start local dev server on port 3000
npm run build    # Build project for production
npm run preview  # Preview production build locally
npm run clean    # Remove dist output
npm run lint     # Run TypeScript noEmit check
```

---

## No API / No .env Requirement for Basic Frontend Use

For the current public-facing frontend experience, you can work on the UI without setting up any API key or `.env` file first.

That means you can:

- install dependencies
- run the site locally
- edit the design
- update branding and content
- build and deploy the frontend

If you later connect real AI providers, server logic, or external services, you can add environment variables at that stage.

---

## Files You’ll Most Likely Edit

These are the main places to customize the project:

- `src/App.tsx` → primary landing page sections and content
- `src/index.css` → global styles and visual tuning
- `src/Spiral.jsx` → visual/animated component behavior
- `src/lib/utils.ts` → utility helpers
- `metadata.json` → project metadata
- `index.html` → document head / root shell

---

## Customization Ideas

You can easily turn this repo into:

- an AI SaaS landing page
- a startup product site
- an agency brand website
- a personal portfolio with premium UI
- a waitlist / product launch page
- a creator or automation tool landing page

Recommended edits:

- brand name
- logo
- hero copy
- CTA buttons
- pricing content
- FAQ content
- section order
- colors and gradients
- animation intensity
- contact links and socials

---

## Deploying the Project

You can deploy this project on:

- **Vercel**
- **Netlify**
- **Render**
- **Cloudflare Pages**
- **any static hosting that supports Vite output**

### Standard deployment flow

```bash
npm install
npm run build
```

Then deploy the generated build output using your preferred hosting platform.

### Domain already in use

If this repo is tied to your live product domain, use:

```bash
https://fyoia.app
```

For a direct canonical version:

```bash
https://www.fyoia.app/
```

---

## Preview Assets

If you want the README to look even stronger publicly, add preview screenshots or GIFs inside your repo and place them here:

```md
## Preview

![Homepage Preview](./public/preview.png)
```

You can also use a hosted banner image or product mockup.

---

## Public Repo Notes

If this repository is public, it is recommended to:

- never commit secret keys
- never upload private `.env` files
- replace any placeholder links
- add a proper license
- add preview screenshots
- keep branding consistent
- remove unused dependencies if you want a cleaner public repo impression

---

## Connect

<p>
  <a href="https://github.com/lostingness"><img src="https://img.shields.io/badge/GitHub-lostingness-181717?style=for-the-badge&logo=github" alt="GitHub" /></a>
  <a href="https://lostingness.site"><img src="https://img.shields.io/badge/Website-Visit%20Site-111827?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Website" /></a>
  <a href="https://www.instagram.com/lostingness"><img src="https://img.shields.io/badge/Instagram-@lostingness-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" /></a>
</p>

---

## About the Developer

This repository is associated with **lostingness**.

Public profile positioning can be presented as:

- Full-stack developer
- modern frontend + product UI builder
- JavaScript / TypeScript ecosystem focused
- builder of bots, dashboards, APIs, and scalable web experiences

You can replace this section with your exact public intro, company name, or personal brand positioning.

---

## License

Choose the one that fits your goal best:

```text
MIT License
```

or

```text
All Rights Reserved © 2026
```

---

## Star the Repo

If you like this project, consider giving it a star.

```bash
⭐ Star this repo if you found it useful
```
