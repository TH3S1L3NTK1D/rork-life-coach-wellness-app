import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { AudioProvider } from "@/hooks/useAudio";
import { DataProvider } from "@/hooks/useData";
import { AddictionsProvider } from "@/hooks/useAddictions";
import { AICoachProvider } from "@/hooks/useAICoach";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(() => {
  // Handle error if splash screen is already hidden
});

// Create QueryClient outside component to prevent recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const RootLayoutNav = React.memo(() => {
  return (
    <Stack 
      screenOptions={{ 
        headerBackTitle: "Back",
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="auth" 
        options={{ 
          headerShown: false, 
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }} 
      />
    </Stack>
  );
});

// Add display name for debugging
RootLayoutNav.displayName = 'RootLayoutNav';

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  // Memoize the hide splash function
  const hideSplash = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
    } catch (error) {
      console.warn('Error hiding splash screen:', error);
    }
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        // Add any initialization logic here if needed
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        await hideSplash();
      }
    }

    prepare();
  }, [hideSplash]);

  if (!appIsReady) {
    return (
      <SafeAreaProvider>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>
            Welcome to Your{'
'}Life Coach Wellness App
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={styles.container}>
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
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greetingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 20,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 36,
  },
});