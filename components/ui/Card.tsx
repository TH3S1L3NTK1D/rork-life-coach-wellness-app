import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, gradient = false }) => {
  const { theme } = useTheme();
  
  return (
    <View 
      style={[
        styles.card, 
        { 
          backgroundColor: gradient ? theme.secondary : theme.card,
          borderColor: theme.border
        },
        style
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4
  }
});