import { AuthProvider } from "../contexts/AuthContext";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';

export default function RootLayout() {
    useEffect(() => {
        const clientId = Constants.expoConfig?.extra?.webClientId || '';
        if (!clientId) {
            console.warn("WEB_CLIENT_ID environment variable is not set. Google Sign-In might not work correctly.");
        }
        GoogleSignin.configure({
            webClientId: clientId,
        });
    }, []);

    return (
        <AuthProvider>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(screens)" options={{ headerShown: false }} />
            </Stack>
        </AuthProvider>
    );
}
