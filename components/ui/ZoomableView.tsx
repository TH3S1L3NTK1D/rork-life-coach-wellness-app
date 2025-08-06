import React, { ReactNode } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

interface ZoomableViewProps {
  children: ReactNode;
  minZoom?: number;
  maxZoom?: number;
}

export const ZoomableView = ({ children, minZoom = 1, maxZoom = 3 }: ZoomableViewProps) => {
  const scale = useSharedValue(1);
  const pinch = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.max(minZoom, Math.min(maxZoom, event.scale * scale.value));
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Fallback for web since reanimated pinch gestures have limitations on web
  if (Platform.OS === 'web') {
    return <View style={styles.container}>{children}</View>;
  }

  return (
    <GestureDetector gesture={pinch}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
