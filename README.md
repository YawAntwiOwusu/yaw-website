# Yaw Website

A professional Next.js portfolio website for Yaw - Operator, Designer & Entrepreneur.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React 18** - UI library

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
yaw-website/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── notes/             # Notes page
│   │   └── page.tsx
│   ├── about/             # About page
│   │   └── page.tsx
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx        # Site header with logo and navigation
│   ├── Logo.tsx          # Logo component
│   ├── Navigation.tsx    # Navigation links
│   ├── Hero.tsx          # Hero section
│   └── SocialLinks.tsx   # Social media links
├── public/               # Static assets
└── ...config files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features

- ✅ Responsive design
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ Component-based architecture
- ✅ SEO-friendly metadata
- ✅ Clean, professional design

## Customization

Update social links, content, and styling in the respective component files:
- Social links: `app/page.tsx`
- Hero content: `components/Hero.tsx`
- Styling: `tailwind.config.ts` and `app/globals.css`

