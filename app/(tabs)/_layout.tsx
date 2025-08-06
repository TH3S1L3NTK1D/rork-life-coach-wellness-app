import { Tabs, router } from "expo-router";
import { Platform } from "react-native";
import { Home, Target, UtensilsCrossed, Pill, Settings, ShieldX, Bot } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useAICoach } from "@/hooks/useAICoach";
import { GlobalAICoach } from "@/components/ai/GlobalAICoach";

export default function TabLayout() {
  const { isLoggedIn, isLoading, user } = useAuth();
  const { theme } = useTheme();
  const { setNavigationFunction, setAppActionFunction } = useAICoach();
  const [showAICoach, setShowAICoach] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace('/auth');
    }
  }, [isLoading, isLoggedIn]);
  
  // Set up Anuna's navigation and app control functions
  // Use useCallback to memoize the functions and prevent unnecessary updates
  const navigate = React.useCallback((route: string) => {
    const routeMap: { [key: string]: string } = {
      'dashboard': '/(tabs)/',
      'habits': '/(tabs)/habits',
      'meals': '/(tabs)/meals',
      'supplements': '/(tabs)/supplements',
      'addictions': '/(tabs)/addictions',
      'settings': '/(tabs)/settings'
    };
    
    const targetRoute = routeMap[route];
    if (targetRoute) {
      router.push(targetRoute as any);
    }
  }, []);
  
  const executeAppAction = React.useCallback((action: string, params?: any) => {
    switch (action) {
      case 'emergency_support':
        setShowAICoach(true);
        break;
      case 'complete_item':
        // This would need to be implemented based on current screen
        console.log('Complete item action triggered');
        break;
      case 'add_item':
        // This would need to be implemented based on current screen
        console.log('Add item action triggered');
        break;
      default:
        console.log('Unknown app action:', action);
    }
  }, []);
  
  useEffect(() => {
    if (isLoggedIn && user) {
      setNavigationFunction(navigate);
      setAppActionFunction(executeAppAction);
    }
  }, [isLoggedIn, user, navigate, executeAppAction, setNavigationFunction, setAppActionFunction]);
  
  // AI coach welcome greeting disabled - Anuna only responds when called with "hey anuna"

  if (isLoading || !isLoggedIn) {
    return null;
  }

  return (
    <>
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: 'rgba(0, 0, 0, 0.1)',
          borderTopWidth: 0.5,
          paddingBottom: Platform.OS === 'android' ? 5 : 10,
          paddingTop: Platform.OS === 'android' ? 2 : 5,
          height: Platform.OS === 'android' ? 65 : 70,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4
        },
        tabBarIconStyle: {
          marginTop: 4
        },
        headerStyle: {
          backgroundColor: theme.background,
          shadowColor: 'transparent',
          elevation: 0
        },
        headerTintColor: theme.text,
        headerShadowVisible: false,
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600'
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: "Habits",
          tabBarIcon: ({ color, size }) => <Target size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: "Meals",
          tabBarIcon: ({ color, size }) => <UtensilsCrossed size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="supplements"
        options={{
          title: "Supplements",
          tabBarIcon: ({ color, size }) => <Pill size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="addictions"
        options={{
          title: "Recovery",
          tabBarIcon: ({ color, size }) => <ShieldX size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
      </Tabs>
      
      {/* Floating AI Coach Button */}
      <TouchableOpacity
        style={[
          styles.floatingAIButton,
          { backgroundColor: theme.primary }
        ]}
        onPress={() => setShowAICoach(true)}
        activeOpacity={0.8}
      >
        <Bot size={28} color="white" />
      </TouchableOpacity>
      
      {/* Global AI Coach Modal */}
      <GlobalAICoach
        visible={showAICoach}
        onClose={() => setShowAICoach(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  floatingAIButton: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 75 : 80,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000
  }
});