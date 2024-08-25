require('dotenv').config();

module.exports = {
  expo: {
    name: "Clear Meals",
    slug: "clear-meals",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/eating.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/eating.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/eating.png",
        backgroundColor: "#ffffff"
      },
      package: "com.bosco.clearmeals",
    },
    plugins: [
      "expo-router",
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "fabb4ccd-42aa-4703-91e9-87c997c539fb"
      },
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      proxyIp: process.env.PROXY_IP,
      clientSecret: process.env.CLIENT_SECRET,
      clientId: process.env.CLIENT_ID,
    }
  }
};