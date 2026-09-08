# HEILC Website

**Where Human Intelligence Meets the Future.**

## Setup

```bash
npm install
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local
npm run dev
```

Open the dev server printed in your terminal (http://localhost:3000 by default).

## Add Your Assets

Drop these into `/public/assets/`:
- `hero-1.jpg` — dark atmospheric hero background
- `hero-2.jpg` — dark tech/city visual
- `hero-3.jpg` — abstract dark close-up
- `about-bg.jpg` — founders/office image
- `generisk-mockup.jpg` — GeneRisk AI dashboard screenshot
- `cinegenome-mockup.jpg` — CineGenome interface screenshot
- `resumeai-mockup.jpg` — ResumeAI interface screenshot

Drop scroll frames into `/public/frames/`:
- `frame_001.jpg` through `frame_120.jpg`
- Generated via: Whisk → Google Flow → EZGif

## Tech Stack
- Next.js 14 (App Router)
- TypeScript + Tailwind CSS
- Framer Motion (all animations)
- Lenis (smooth scroll)
- Claude API (chatbot + proposal generator)

## Deploy
```bash
npm i -g vercel
vercel
# Add ANTHROPIC_API_KEY in Vercel dashboard
```
