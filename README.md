# PARLAY. — NBA Parlay Generator

A sleek, sportsbook-style web app for building NBA parlay bets. Pick your legs, customize odds, calculate payouts, and share with friends.

![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)

## Features

- **Sportsbook-style game cards** — Moneyline, Spread, Over/Under in a clean grid
- **Build parlays** — Tap any odds cell to add legs to your slip
- **Auto-calculated payouts** — Combined parlay odds + profit calculated in real-time
- **Editable odds** — Click any odds in your slip to override with real sportsbook odds
- **User accounts** — Sign up with email, phone, name via Supabase auth
- **Save & track parlays** — Save parlays, mark as placed, track wins/losses
- **Share via link** — Generate a shareable URL for any parlay
- **ESPN team logos** — Real logos for all 30 NBA teams
- **Date navigation** — Browse games by date
- **Fully responsive** — Mobile drawer + desktop sidebar layout

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

App runs at `http://localhost:5173`

> The app works out of the box with sample game data. No API keys required for basic usage.

## Setting Up User Accounts (Supabase)

To enable sign up, saved parlays, and bet tracking:

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New Project** — name it anything, pick your region
3. Save the database password somewhere safe

### 2. Run the Database Schema
1. In Supabase dashboard → **SQL Editor**
2. Click **New query**
3. Copy-paste the contents of `supabase-schema.sql` → click **Run**

### 3. Get API Keys
1. Go to **Settings → API**
2. Copy your **Project URL** and **anon public key**

### 4. Configure Environment
```bash
cp .env.example .env
```
Edit `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Enable Email Auth
1. In Supabase → **Authentication → Providers**
2. Ensure **Email** is enabled
3. For development: disable **Confirm email** in Email settings

## Deploying to Vercel

### Via GitHub (Recommended)
1. Push your code to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → Import your repo
3. Vercel auto-detects Vite — click Deploy
4. Add env vars in **Settings → Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Redeploy

### Via CLI
```bash
npx vercel
```

## Project Structure

```
src/
├── components/
│   ├── AuthPage.jsx         # Sign in / sign up page
│   ├── GameCard.jsx          # Sportsbook-style game card with odds grid
│   ├── Header.jsx            # Top nav bar with branding + auth
│   ├── ParlaySlip.jsx        # Parlay builder slip with legs + payout
│   ├── ProfilePage.jsx       # User profile + saved parlays
│   ├── SharedParlayView.jsx  # Overlay for viewing shared parlays
│   └── TeamLogo.jsx          # ESPN logo component with fallback
├── data/
│   ├── nbaApi.js             # Game data fetching + sample data
│   └── teams.js              # All 30 NBA teams + logo URLs
├── hooks/
│   ├── useAuth.jsx           # Supabase auth context + provider
│   └── useParlayStore.jsx    # Parlay state management (useReducer)
├── lib/
│   ├── parlayService.js      # Supabase CRUD for saved parlays
│   └── supabase.js           # Supabase client initialization
├── utils/
│   ├── odds.js               # Odds math (American ↔ decimal, parlay calc)
│   └── share.js              # URL encoding/decoding for sharing
├── App.jsx                   # Main app with routing + layout
├── index.css                 # Tailwind + custom theme
└── main.jsx                  # React entry point
```

## Key Technical Decisions

- **Estimated odds**: Game odds are generated algorithmically (not from a live feed). Users can override any odds in their slip with real values from their sportsbook.
- **Graceful degradation**: The app works without Supabase configured — auth features simply won't appear, and you can still build/share parlays.
- **No live API required**: Falls back to sample data if no NBA API key is set. To use live data, add `VITE_NBA_API_KEY` with a [balldontlie](https://www.balldontlie.io/) API key.

## V2 Roadmap

- [ ] Real-time odds from a sportsbook API
- [ ] Player props (points, rebounds, assists)
- [ ] Parlay visual card for sharing (image export)
- [ ] Push notifications for game results
- [ ] Odds comparison across sportsbooks
- [ ] Parlay analytics (win rate, ROI tracking)

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Vite](https://vite.dev) | Build tool + dev server |
| [React](https://react.dev) | UI framework |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling |
| [Supabase](https://supabase.com) | Auth + PostgreSQL database |
| [Lucide React](https://lucide.dev) | Icons |
| [date-fns](https://date-fns.org) | Date formatting |
| [ESPN CDN](https://a.espncdn.com) | Team logos |

## License

MIT
