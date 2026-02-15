# 🌌 Q-Metaram: Galactic Q + Hub Platform

A modular, decentralized platform featuring a Matrix-inspired landing page, 3D galaxy navigation, and an AI marketplace hub. Built with React, Vite, Three.js, and Zustand.

**Website**: [galaxial-whispers on GitHub Pages](https://mohamadjavad70.github.io/galaxial-whispers/)

## 🎯 Features

- **Matrix Choice Landing** (`/`) - Red/Blue pill selection gateway
- **Galactic Q** (`/galaxy`) - 3D spaceship navigation + modular star world
- **Q-Hub** (`/hub`) - AI marketplace + chat interface
- **Settings** (`/settings`) - User profile & subscription management
- **Offline-First State** - Zustand store with localStorage persistence
- **Production-Ready Bundles** - Optimized chunks: vendor-3d (828KB), vendor-ui (168KB), vendor-utils (196KB)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (use [nvm](https://github.com/nvm-sh/nvm))
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/mohamadjavad70/galaxial-whispers.git
cd galaxial-whispers

# Install dependencies
npm install

# Start development server (http://localhost:8080)
npm run dev
```

### Development Commands

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Run tests
npm run test

# Watch tests
npm run test:watch

# Lint code
npm run lint
```

## 🏗 Architecture

### Pages & Routes

| Route | Component | Status |
|-------|-----------|--------|
| `/` | MatrixChoice (landing) | ✅ Ready |
| `/galaxy` | GalacticQ (3D world) | ✅ Ready (lazy-loaded) |
| `/hub` | QHub (marketplace) | ✅ Ready (lazy-loaded) |
| `/settings` | Settings (profile) | ✅ Ready (lazy-loaded) |
| `/star/:slug` | StarWorld (legacy) | ✅ Ready |
| `/*` | NotFound (404) | ✅ Ready |

### State Management (Zustand)

Located in `src/state/useQStore.ts`:
- **User**: id, tier (FREE/EXPLORER/COMMANDER), tokenBalance, connectedSocials
- **Galaxy**: shipPosition, autopilotActive, autopilotTarget, discoveredPlanets
- **Hub**: chatHistory, favoriteAIs, aiRatings
- **Sync**: lastSyncTime + placeholder sync up/down

Data persists to localStorage under key: `qmetaram_v1`

### Design System

- **MatrixLayout**: Wraps all pages with Matrix rain + grid + vignette
- **MatrixRain**: Canvas background animation (from `components/stars/MatrixTool`)
- **Typography**: Monospace font, green glow accents, cyber theme
- **Colors**: Black background, green highlights (#00ff00), red/blue pill buttons

### Bundle Optimization

**Vite config** (`vite.config.ts`) uses manual chunk splitting:
```typescript
manualChunks: {
  "vendor-3d": ["three", "@react-three/fiber", "@react-three/drei"],
  "vendor-ui": ["framer-motion", "lucide-react", "react-router-dom"],
  "vendor-utils": ["@tanstack/react-query", "sonner", "recharts"],
}
```

Result:
- `index-*.js`: 102 KB (gzip: 35 KB)
- `vendor-3d-*.js`: 828 KB (gzip: 225 KB) ← Lazy-loaded on /galaxy
- `vendor-ui-*.js`: 168 KB (gzip: 54 KB)
- `vendor-utils-*.js`: 196 KB (gzip: 61 KB)

## 🔐 Security & Environment

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Stripe (frontend public key only)
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx

# (Optional) GitHub Pages base path
# VITE_BASE_PATH=/galaxial-whispers
```

**Important**: Never commit `.env` or real API keys. See [SECURITY.md](./SECURITY.md) for best practices.

### Protected Files

- `.env` → Ignored by git
- `*.pem`, `*.key` → Private keys must never be committed
- Backend secrets (Stripe webhook, API keys) → Server-side only

## 📦 Deployment

### GitHub Pages (Recommended)

Automated via GitHub Actions on `main` branch push:

1. GitHub Actions builds the app (`npm run build`)
2. Uploads dist to GitHub Pages branch
3. Site available at `https://mohamadjavad70.github.io/galaxial-whispers/`

Check workflow: [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)

### Manual Deployment

```bash
# Build
npm run build

# Deploy using gh-pages (requires write access to repo)
npm run deploy
```

### GitHub Pages Settings

In repository **Settings → Pages**:
- Source: Deploy from a branch
- Branch: `gh-pages`
- Folder: `/(root)`

## 🧪 Testing

```bash
# Run tests (Vitest)
npm run test

# Watch mode
npm run test:watch
```

Test files in `src/test/`

## 🔧 Technology Stack

- **Frontend**: React 18, TypeScript, Vite 5
- **3D**: Three.js, @react-three/fiber, @react-three/drei
- **Styling**: Tailwind CSS 3, shadcn/ui components
- **State**: Zustand with localStorage persist
- **Animation**: Framer Motion
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build**: SWC (faster TypeScript compilation)
- **Testing**: Vitest

## 📝 Project Structure

```
src/
├── pages/                 # Route pages (lazy-loaded)
│   ├── Index.tsx         # Matrix choice landing
│   ├── GalacticQ.tsx     # 3D galaxy world
│   ├── QHub.tsx          # AI marketplace
│   ├── Settings.tsx      # User settings
│   └── ...
├── components/
│   ├── MatrixLayout.tsx  # Global layout shell
│   ├── galaxy/           # 3D scene components
│   ├── solarsystem/      # Solar system components
│   ├── stars/            # Module tools (Tesla, DaVinci, etc)
│   └── ui/               # shadcn components
├── state/
│   └── useQStore.ts      # Zustand store (offline-first)
├── lib/
│   ├── utils.ts          # Utility helpers
│   └── validation.ts     # Input validation (Zod)
├── data/
│   ├── contentBlocks.ts  # i18n content
│   └── starRegistry.ts   # Module metadata
└── App.tsx               # Main router + providers
```

## 🚀 Next Steps

- [ ] Backend API integration (`VITE_API_BASE_URL`)
- [ ] Stripe checkout flow for subscriptions
- [ ] Voice chat in Hub (WebRTC/Twilio)
- [ ] Autopilot AI for galaxy navigation
- [ ] Push notifications (optional)
- [ ] Mobile-optimized UI refinements

## 🤝 Contributing

1. Create a branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -m "Add feature"`
3. Push: `git push origin feature/my-feature`
4. Open a Pull Request

## 📄 License

[Add your license here]

## 📞 Support

For issues, questions, or security concerns:
- Open an issue on GitHub
- Check [SECURITY.md](./SECURITY.md) for security-related questions
- See [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) for dependency vulnerabilities

- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
