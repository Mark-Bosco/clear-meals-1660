require('dotenv').config();

module.exports = {
  expo: {
    name: "Clear Meals",
    slug: "clear-meals-1660",
    version: "1.0.2",
    newArchEnabled: true,
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/icon-nobg.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.bosco.mealtracker",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON || "./google-services.json" || "./android/app/google-services.json",
    },
    ios: {
      bundleIdentifier: "com.bosco.mealtracker",
      googleServicesFile: process.env.GOOGLE_SERVICES_PLIST || "./GoogleService-Info.plist",
      supportsTablet: false,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    plugins: [
      "expo-router",
      "@react-native-google-signin/google-signin",
    ],
    experiments: {
      typedRoutes: true
    },
    owner: "cs1660",
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "07b9d0da-a51b-4368-9d3d-3d35a9bb8444"
      },
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      clientSecret: process.env.CLIENT_SECRET,
      clientId: process.env.CLIENT_ID,
    }
  }
};