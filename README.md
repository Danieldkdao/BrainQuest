# BrainQuest

> This is an app I (Daniel Dao) designed and created to help people with their critcal thinking skills and puzzle solving skills. It is my submission for the 2025 Congressional App Challenge.

## ✨ Features

* **Training**: Users can sharpen their critical thinking skills through a wide array of puzzles.
* **Engagement**: Integrates leaderboards, streak features, daily challenges, and other to keep users engaged and excited.
* **Progress Tracking**: Tracks users progress daily, weekly, and across all time to show users how far they've come.
* **Community**: Users can create their own puzzles and share them with the community. They can also see puzzles that others have made and try them.
* **And more**: Watch the youtube video linked below to see a full demonstration!

## 🚀 Getting Started

1. Clone the repository: `git clone https://github.com/Danieldkdao/BrainQuest.git`
   ### Mobile
   1. Go into the mobile folder: `cd mobile`
   2. Install dependencies: `npm install`
   3. Create a .env file at the root and add the variables:
      - `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
      - `EXPO_PUBLIC_BACKEND_URL`
   4. Start the mobile:
   ```bash
   npx expo start -c
   ```
   ### Backend
   1. Go into the mobile folder: `cd backend`
   2. Install dependencies: `npm install`
   3. Create a .env file at the root and add the variables:
      - `PORT`
      - `DATABASE_URL`
      - `OPEN_ROUTER_KEY`
      - `CLERK_PUBLISHABLE_KEY`
      - `CLERK_SECRET_KEY`
      - `CLOUDINARY_CLOUD_NAME`
      - `CLOUDINARY_CLOUD_NAME`
      - `CLOUDINARY_API_SECRET`
      - The URL of your backend: `API_URL`
      - In case Open Router rate limits: `GEMINI_API_KEY`
   4. Start the server:
   ```bash
   npm run dev
   ```
   
## 🔗 Links

> Youtube Video: [Intro to BrainQuest]("https://www.youtube.com/watch?v=yVew4DAWAns")
