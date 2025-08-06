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
        animation: 'slide_from_right' // Add smooth animation
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
      {/* Add index route to prevent navigation errors */}
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          // Redirect to auth or tabs based on auth state
        }} 
      />
    </Stack>
  );
});

// Add display name for debugging
RootLayoutNav.displayName = 'RootLayoutNav';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);

  // Memoize the hide splash function
  const hideSplash = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
    } catch (error) {
      console.warn('Error hiding splash screen:', error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    let timer: NodeJS.Timeout;

    const initialize = async () => {
      // Hide splash screen
      await hideSplash();
      
      // Show greeting for 2 seconds
      timer = setTimeout(() => {
        if (mounted) {
          setShowGreeting(false);
          setIsReady(true);
        }
      }, 2000);
    };

    initialize();

    // Cleanup function
    return () => {
      mounted = false;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [hideSplash]);

  // Show greeting screen
  if (showGreeting) {
    return (
      <SafeAreaProvider>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>
            Welcome to Your{'\n'}Life Coach Wellness App
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  // Wait until ready to prevent flashing
  if (!isReady) {
    return null;
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