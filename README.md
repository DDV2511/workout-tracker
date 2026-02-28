# Workout Tracker 🏋️

Progressive Web App for tracking your workouts. Built with Next.js + Tailwind CSS.

## Features

- 📅 **4-Day Split** - Upper Strength, Lower Hypertrophy, Upper Hypertrophy, Lower Strength
- 📊 **Progress Tracking** - Volume over time, body stats
- ⏱️ **Rest Timer** - 60/90/120/180 second presets with audio notification
- 📱 **PWA** - Installable on phone, works offline
- 💾 **Local Storage** - All data stays on your device

## Tech Stack

- Next.js 14
- Tailwind CSS
- TypeScript
- localStorage for persistence

## Getting Started

```bash
npm install
npm run dev
```

## PWA Installation

When visiting on mobile:
- **iOS**: Share → Add to Home Screen
- **Android**: Menu → Install App

The app works offline after first load.

## Data

All workout data is stored in localStorage. Export/import coming soon.

## Deploy

```bash
npm run build
```

Deploy to Vercel or any static host.
