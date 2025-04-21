import { AuthProvider } from "../contexts/AuthContext";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function RootLayout() {
    useEffect(() => {
        const clientId = process.env.EXPO_PUBLIC_WEB_CLIENT_ID || '';
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
