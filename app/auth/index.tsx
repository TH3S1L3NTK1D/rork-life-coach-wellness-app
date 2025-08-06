import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from '@/components/ui/StatusBar';
import { useTheme } from '@/hooks/useTheme';

export default function AuthScreen() {
  const { theme } = useTheme();
  
  // Automatically redirect to tabs
  React.useEffect(() => {
    router.replace('/(tabs)');
  }, []);
  
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <View style={[styles.container, { backgroundColor: '#007AFF' }]}>
      <StatusBar time={currentTime} />
      <View style={styles.content}>
        <Text style={[styles.text, { color: '#FFFFFF' }]}>Welcome to Your Life Coach Wellness App</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold'
  }
});