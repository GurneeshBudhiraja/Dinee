# Restaurant Call Management App

A Next.js application for managing AI agent calls and orders for restaurants.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── onboarding/     # Onboarding flow components
│   ├── dashboard/      # Dashboard components
│   └── common/         # Shared components
├── lib/                # Utility functions and constants
├── types/              # TypeScript type definitions
└── styles/             # Global styles and CSS
```

## Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint with Next.js config

## Design System

The application uses a clean, accessible design system with:

- Light theme with high contrast colors
- Inter font family for optimal readability
- Consistent spacing and typography scale
- Accessible focus states and keyboard navigation
- WCAG 2.1 AA compliant color combinations
