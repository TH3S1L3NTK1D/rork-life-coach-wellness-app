import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { AudioProvider } from "@/hooks/useAudio";
import { DataProvider } from "@/hooks/useData";
import { AddictionsProvider } from "@/hooks/useAddictions";
import { AICoachProvider } from "@/hooks/useAICoach";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const RootLayoutNav = React.memo(() => {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false, presentation: 'modal' }} />
    </Stack>
  );
});

export default function RootLayout() {
  const [showGreeting, setShowGreeting] = useState(true);

  useEffect(() => {
    SplashScreen.hideAsync();
    const timer = setTimeout(() => {
      setShowGreeting(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showGreeting) {
    return (
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>Welcome to Your Life Coach Wellness App</Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <ThemeProvider>
            <AudioProvider>
              <DataProvider>
                <AddictionsProvider>
                  <AICoachProvider>
                    <RootLayoutNav />
                  </AICoachProvider>
                </AddictionsProvider>
              </DataProvider>
            </AudioProvider>
          </ThemeProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  greetingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});