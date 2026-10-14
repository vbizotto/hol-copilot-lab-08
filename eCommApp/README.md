# The Daily Harvest

A modern TypeScript-based shopping website built with React and Vite.

For a developer-focused setup and project overview, see the [Quick Start Guide](./QUICK_START.md).

## 🚀 Getting Started

### Prerequisites

- Node.js `^20.19.0` or `>=22.12.0` (required by the installed Vite version)
- npm

### Installation

1. Install dependencies from the `eCommApp` directory:
   ```bash
   npm ci
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and visit `http://localhost:3000`

## 📁 Project Structure

```
eCommApp/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main App component
│   ├── App.css         # App styles
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── README.md          # This file
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
