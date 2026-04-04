# ResumeAI — MERN Stack Resume Analyzer

A full-stack AI-powered resume analyzer with a stunning dark UI built with GSAP, Three.js, Framer Motion, Aceternity UI patterns, and shadcn/ui components.

## Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **GSAP** — page transitions, scroll triggers, character animations, score ring counters
- **Three.js** + **@react-three/fiber** — floating particle background, animated 3D rings
- **Framer Motion** — tab transitions, list animations, AnimatePresence
- **Tailwind CSS** — custom dark theme with emerald accent palette
- **Aceternity UI patterns** — SpotlightCard (mouse-follow radial glow), BorderBeam
- **shadcn/ui primitives** — Radix UI tabs, tooltips, dialog
- **react-dropzone** — drag-and-drop resume upload

### Backend
- **Node.js** + **Express**
- **MongoDB** + **Mongoose** — stores analysis history
- **Anthropic Claude API** — AI analysis engine
- **helmet** + **express-rate-limit** — security
- **multer** + **pdf-parse** — file uploads (optional extension)

## Project Structure

```
resume-analyzer/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── three/       # Three.js ParticleBackground
│   │   │   ├── animations/  # GSAP: TextReveal, ScoreRing, PageTransition
│   │   │   ├── ui/          # SpotlightCard, BorderBeam (Aceternity patterns)
│   │   │   ├── Navbar.tsx
│   │   │   └── CustomCursor.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx    # Landing with hero + features
│   │   │   ├── AnalyzePage.tsx # Input form with dropzone
│   │   │   ├── ResultsPage.tsx # Score rings + tabs
│   │   │   └── HistoryPage.tsx # MongoDB history
│   │   ├── hooks/
│   │   │   └── useAnalysis.ts  # API call hook
│   │   └── styles/
│   │       └── globals.css     # Dark theme + noise texture + cursor
│   └── ...config files
│
└── server/                  # Express backend
    ├── index.js             # Entry point
    ├── routes/
    │   ├── analyze.js
    │   └── history.js
    ├── controllers/
    │   ├── analyzeController.js  # Anthropic API call
    │   └── historyController.js
    └── models/
        └── Analysis.js          # Mongoose schema
```

## Setup & Run

### 1. Clone and install

```bash
git clone <your-repo>
cd resume-analyzer
npm run install:all
```

### 2. Configure environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
ANTHROPIC_API_KEY=sk-ant-...      # Get from console.anthropic.com
MONGODB_URI=mongodb://localhost:27017/resume-analyzer
CLIENT_URL=http://localhost:5173
```

### 3. Start MongoDB

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Ubuntu
sudo systemctl start mongod

# Or use MongoDB Atlas (cloud) — just replace MONGODB_URI
```

### 4. Run dev servers

```bash
# From root — starts both frontend and backend
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Deploy to Vercel + Railway

### Frontend → Vercel
```bash
cd client
npm run build
# Deploy /client/dist to Vercel
```

### Backend → Railway
1. Push to GitHub
2. Connect Railway to your repo
3. Set root directory to `/server`
4. Add environment variables in Railway dashboard

## Portfolio Resume Line

> *"Built a full-stack AI SaaS with React, TypeScript, GSAP, Three.js, and Claude API — features animated 3D particle UI, real-time resume-JD analysis, ATS scoring, and MongoDB-persisted history. Deployed on Vercel + Railway."*

## License
MIT
