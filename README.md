# Fitness Tracker App

A simple React Native fitness tracking app built with Expo.

## Features

- 🏠 **Home Dashboard**: View your overall fitness statistics at a glance
- 💪 **Workout Tracking**: Log and manage your workouts with details like type, duration, and calories
- 📊 **Statistics**: View detailed analytics about your fitness journey
- 🎯 **Multiple Workout Types**: Track Running, Cycling, Swimming, Gym, Yoga, and Walking

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- iOS Simulator (for macOS) or Android Emulator

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on iOS:
```bash
npm run ios
```

4. Run on Android:
```bash
npm run android
```

## App Structure

```
app/
├── App.js                          # Main app entry point
├── src/
│   ├── components/                 # Reusable components
│   │   ├── Button.js
│   │   ├── StatCard.js
│   │   └── WorkoutItem.js
│   ├── screens/                    # Main screens
│   │   ├── HomeScreen.js
│   │   ├── WorkoutScreen.js
│   │   └── StatsScreen.js
│   └── context/                    # State management
│       └── WorkoutContext.js
├── package.json
└── app.json
```

## Technologies Used

- **React Native**: Mobile app framework
- **Expo**: Development platform
- **React Navigation**: Navigation library
- **Context API**: State management
- **Ionicons**: Icon library

## Features Details

### Home Screen
- Displays total calories burned, workout duration, and workout count
- Shows daily steps (mock data)
- Provides quick fitness tips

### Workout Screen
- Add new workouts with type, duration, and calories
- View all logged workouts
- Delete workouts
- Modal interface for easy workout entry

### Statistics Screen
- Overall statistics view
- Average calculations
- Workout type breakdown
- Achievement tracking
- Motivational quotes

## License

MIT
