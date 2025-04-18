# TwoPeck's Eggs - Chicken Egg Tracker

A web application for tracking the daily collection of chicken eggs, including features for recording egg weights, colors, and analyzing egg production statistics.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)

## Features

- **Daily Egg Tracking**: Record eggs collected each day with details on weight, color, and whether they're speckled
- **Interactive Timeline**: View a 7-day history of collected eggs with visual representations
- **Egg Analytics**: Access statistics including total eggs, average weights, and daily collection patterns
- **Responsive Design**: Works on both desktop and mobile devices
- **Data Visualization**: Charts and graphs to show egg production patterns and weight distribution
- **Edit Functionality**: Modify or delete previously recorded eggs

## Project Structure

```
egg-tracker/
├── app/                  # Next.js application pages
│   ├── about/            # About page
│   ├── add-egg/          # Form for adding new eggs
│   ├── analytics/        # Statistics and data visualization
│   ├── api/              # API routes for data handling
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Home page with egg timeline
├── components/           # Reusable UI components
│   ├── egg-oval.tsx      # Visual egg representation
│   ├── egg-timeline.tsx  # Timeline of collected eggs
│   ├── add-egg-modal.tsx # Modal for adding eggs
│   ├── edit-egg-modal.tsx # Modal for editing eggs
│   └── ui/               # UI component library
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and data services
│   ├── data-service.ts   # Functions for data handling
│   └── utils.ts          # Helper utilities
├── public/               # Static assets
│   ├── data/             # JSON data storage
│   │   └── eggs.json     # Egg collection data
│   └── images/           # Images and icons
└── styles/               # CSS and styling files
```

## Technologies Used

- **Next.js 15**: React framework for server-rendered applications
- **React 19**: JavaScript library for building user interfaces
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Recharts**: Charting library for data visualization
- **date-fns**: Date utility library
- **Radix UI**: Headless UI components
- **React Hook Form**: Form handling library
- **Lucide React**: Icon library

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/egg-tracker.git
   cd egg-tracker
   ```

2. Install dependencies:
   ```bash
   # Using npm
   npm install
   
   # Or using yarn
   yarn
   
   # Or using pnpm
   pnpm install
   ```

3. Create the data directory:
   ```bash
   mkdir -p public/data
   ```

4. Set up initial data file:
   ```bash
   echo '{"eggs":[]}' > public/data/eggs.json
   ```

## Usage

1. Start the development server:
   ```bash
   # Using npm
   npm run dev
   
   # Or using yarn
   yarn dev
   
   # Or using pnpm
   pnpm dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Use the interface to:
   - View your daily egg collection on the home page
   - Click on a day to add new eggs
   - Click on existing eggs to edit or delete them
   - Navigate to the Analytics page to view statistics

## License

This project is MIT licensed.