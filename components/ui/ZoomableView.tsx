import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

interface ZoomableViewProps {
  children: ReactNode;
  style?: any;
}

export function ZoomableView({ children, style }: ZoomableViewProps) {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
