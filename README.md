## Open Source Smartwatch Health Tracking App

This app syncs with the open-source smartwatch, scanning for Bluetooth signals and attempting to pair and obtain a UTF-8 encoded file with heart rate and movement data, along with the UUID identifier for persistent sync.

## Starting Guide for Embedded Systems @ Purdue contributors
Download [GitHub Desktop](https://desktop.github.com/download/) and clone this repository to the GitHub folder in either `C:\Users\<YourUsername>\Documents\GitHub` for Windows or `~/Documents/GitHub` for MacOS/Linux.
Launch Visual Studio Code (download [here](https://code.visualstudio.com/)) and download [Node.js](https://nodejs.org/en/download). Detailed instructions below, organized by platform. Installation instructions are current as of October 5, 2025.

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
