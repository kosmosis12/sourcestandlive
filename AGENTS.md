# SourceStand - AI News Aggregator

## Project Overview
A modern, minimalist news aggregator focusing on AI, startups, and venture capital news from multiple sources.

## Technology Stack
- React 19.1.1
- Vite 7.1.2
- TypeScript 5.8.3

## Color Palette
- **Onyx Black**: #0a0a0a (primary background)
- **Graphite Grey**: #3a3a3a (borders, secondary elements)
- **Off White**: #f5f5f5 (primary text)
- **Cyan**: #00d9ff (accent, highlights, CTAs)

## News Sources
1. **GNews API** - Primary news aggregation
2. **NewsAPI** - Secondary news source
3. **RSS Feeds**:
   - TechCrunch (AI category)
   - The Verge (AI/Tech)
   - VentureBeat (AI category)
   - Wired (AI tag)
   - AI News

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Features
- Multi-source news aggregation with fallback support
- Real-time search filtering
- Sort by date or relevance
- Auto-categorization with tags (Product, Research, Infrastructure, Business)
- Dark theme with cyan accents
- Responsive grid layout

## API Keys
- GNews API key configured in App.jsx
- NewsAPI key configured in App.jsx
- RSS2JSON API used for RSS feed parsing
