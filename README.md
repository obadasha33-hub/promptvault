# VibePrompt Hub

VibePrompt Hub is a professional, cosmic-themed prompt-engineering workstation and UI playground designed for the era of "vibe coding." Inspired by state-of-the-art IDE design aesthetics, it combines a high-fidelity stardust particle system, responsive bento grids, full Arabic (RTL) localizations, and a glassmorphic authorization security console.

---

## 🌌 Core Features

### 1. Interactive Star Dust Particle Engine
* **Dynamic Physics**: An HTML5 Canvas particle system tracking cursor movements.
* **Theme Synchronization**: Particles emit fluid HSL color streams tailored dynamically to the active interface theme.

### 2. Glassmorphic Mock Authorization Console
* **Diagnostics Terminal**: Visualizes telemetry logs, active encryption algorithms, and secure connection statuses.
* **Authentication Gate**: Fully integrated authentication flow using Clerk.

### 3. Cosmic Bento Workspace
* **Smooth Transitions**: Hover-raising cards with strict layout-shift mitigation.
* **Interactive Code Blocks**: Syntax-highlighted prompt showcases with one-click flash copy buttons.
* **Progress Tracking**: Top-mounted reading progress indicator tracking scroll metrics.

### 4. Arabic Localization (RTL Support)
* **Fluid Layout Mirroring**: Implements native `dir="rtl"` layout toggles with zero layout breakage.
* **Localized Context**: Complete translation catalogues covering all terminal outputs, prompt parameters, and interfaces.

### 5. Local Storage Persistence
* **Theme Preferences**: Toggle between Dark, Light, and Cyberpunk themes with settings persisting across sessions.
* **Bookmark Manager**: Offline saving of prompt logs and components.

---

## 🛠️ Technology Stack

* **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
* **Language**: [TypeScript](https://www.typescriptlang.org/) for static type-safety
* **Styling**: [TailwindCSS](https://tailwindcss.com/) for cosmic design tokens and utilities
* **Authentication**: [Clerk](https://clerk.com/) for user management
* **Database**: [Supabase](https://supabase.com/) for backend analytics and logs
* **Testing**: [Vitest](https://vitest.dev/) for unit and integration testing

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18.x or later) and `npm` installed.

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/obadasha33-hub/promptvault.git
cd promptvault
npm install
```

### Configuration

Create a `.env.local` file in the root directory and add your keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Running Locally

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Tests

To run the unit tests:

```bash
npm run test
```

### Production Build

To compile a production-ready package:

```bash
npm run build
```

---

## 📂 Repository Structure

```text
├── public/                 # Static assets and icons
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── page.tsx        # Cosmic Landing workstation
│   │   ├── layout.tsx      # Core root layout
│   │   └── creative/       # Isolated sandbox workspace
│   ├── components/         # Reusable React components
│   │   ├── StarDustCanvas  # Interactive canvas particle emitter
│   │   └── ui/             # Glassmorphic primitives
│   ├── lib/                # Database/Auth helpers
│   └── styles/             # Global CSS & Tailwind configuration
├── vitest.config.ts        # Test configuration
└── package.json            # Scripts & project metadata
```
