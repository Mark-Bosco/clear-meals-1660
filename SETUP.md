# Prerequisites
- [Node.js (version 14 or later)](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- npm or yarn
- [Expo CLI](https://docs.expo.dev/more/expo-cli/) (install globally via `npm add expo`)
- [Firebase CLI](https://firebase.google.com/docs/cli/) (if you plan to work on backend functions `install via npm install -g firebase-tools`)

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

# To Create a Build
1. Create an Expo account and join the 1660 organization
2. Install the Expo EAS CLI using this terminal command: `npm install -g eas-cli`
3. Login to your Expo account in the terminal: `eas login`
4. Increment `version` in `app.config.js` (i.e. 1.0.0 --> 1.0.1)
5. Make sure all your changes are committed to git
6. (This step may not be needed) Temporarily adjust the `.gitignore` as indicated by the comments
7. Run the build command: `eas build --platform android --profile preview`
8. Use the exisiting keystore if prompted
9. Check the progress of the build [here](https://expo.dev/accounts/cs1660/projects/clear-meals-1660/builds)
10. Alternatively, you may try to build using GitHub [here](https://expo.dev/accounts/cs1660/projects/clear-meals-1660/builds)
    - I have not personally tried this
11. Click `Build From Github`
    - Base directory: '/'
    - Platform: 'Android'
    - Git ref: 'dev'or 'main'
    - EAS Build profile: 'preview'
    - Enviornment: 'preview'
    - EAS Submit: Unchecked
    - EAS Submit Profile: Blank