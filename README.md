# Smartwatch Health Tracking App

This app syncs with the open-source smartwatch, scanning for Bluetooth signals and attempting to pair and obtain a UTF-8 encoded file with heart rate and movement data, along with the UUID identifier for persistent sync. Built by the 2025 Embedded Systems @ Purdue Smartwatch Team.

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

2. Run on iOS:
```bash
npx expo start
```
Press `i`

3. Run on Android:
```bash
npm expo start
```
Press `a`

4. Run dev server (back-end)
```bash
npm start
```

## Starting Guide for Embedded Systems @ Purdue contributors
Download [GitHub Desktop](https://desktop.github.com/download/) and clone this repository to the GitHub folder in either `C:\Users\<YourUsername>\Documents\GitHub` for Windows or `~/Documents/GitHub` for MacOS/Linux.
Launch Visual Studio Code (download [here](https://code.visualstudio.com/)) and additionally install [Node.js](https://nodejs.org/en/download). Detailed instructions below, organized by platform. Installation instructions are current as of October 5, 2025. Note that you do not need to run the commands below if you already have Node.js installed on your device.

#### Windows
Use Powershell:
```bash
# Download and install Chocolatey:
powershell -c "irm https://community.chocolatey.org/install.ps1|iex"

# Download and install Node.js:
choco install nodejs --version="22.20.0"

# Verify the Node.js version:
node -v # Should print "v22.20.0".

# Verify npm version:
npm -v # Should print "10.9.3".
```

#### MacOS/Linux
Use Terminal:
```bash
# Download and install Homebrew (MacOS/Linux package manager)
curl -o- https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh | bash

# Download and install Node.js:
brew install node@22

# Verify the Node.js version:
node -v # Should print "v22.20.0".

# Verify npm version:
npm -v # Should print "10.9.3".
```

Once Node.js is installed, open the project in Visual Studio Code (the folder will be named `app`) and run `npm install` to complete setup.

## Tech Stack
- JavaScript & TypeScript for front-end (built with React.js)
- NodeJS for back-end
- Built with React Native for inter-platform compatibility across web, iOS, and Android devices.

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

### Bluetooth Screen
- View current paired devices
- Add new devices for fitness data tracking through BLE with custom device UUID

### Statistics Screen
- Overall statistics view
- Average calculations
- Workout type breakdown

## License
This project is licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0).
Copyright &copy; 2025 by William Zhang
