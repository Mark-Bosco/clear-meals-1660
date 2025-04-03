# Prerequisites
- [Node.js (version 14 or later)](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- npm or yarn
- Expo CLI (install globally via `npm install -g expo-cli`)
- Firebase CLI (if you plan to work on backend functions `install via npm install -g firebase-tools`)

# Initial Setup
0. Navigate to where you want to store the project
1. Clone the repository and enter the directory
    - `git clone https://github.com/Mark-Bosco/clear-meals-1660.git`
    - `cd clear-meals-1660`
2. In the project root, install the main project dependencies
    - `npm install`
3. If working on Firebase functions, navigate to the functions directory and install its dependencies:
    - `cd functions`
    - `npm install`
    - `cd ..` (Move back to the root directory)

# Configuring Secrets and Enviornment Variables
0. Pull up the Google doc I have shared containing the secrets
1. Create a `.env` file and paste in the contents
    - *This is an environment variables file containing configuration keys for Firebase and OAuth authentication*
2. Create a `google-services.json` file and paste in the contents
    - *This is the Firebase configuration file specifically for Android applications*
3. Create a `serviceAccountKey.json` file and paste in the contents
    - *This is a Firebase Admin SDK credential file used for server-side authentication*
4. Create a `GoogleService-Info.plist` file and paste in the contents
    - *This is the Firebase configuration file specifically for IOS applications*

# Running the Project
1. Start the Expo Development Server by entering the following command while in the project root:
    - `npx expo start`
2. Use an emulator or the Expo Go app on your mobile device to preview the application

# Firebase Functions 
1. If your work involves backend updates, log in to Firebase:
    - `firebase login`
2. Start the local emulators
    - `firebase emulators:start`
