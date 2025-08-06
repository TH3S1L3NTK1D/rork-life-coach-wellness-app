import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon,
  color
}) => {
  const { theme } = useTheme();
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: `${theme.secondary}30`,
          borderColor: `${theme.border}50`
        }
      ]}
    >
      <View style={styles.header}>
        <View style={[
          styles.iconContainer, 
          { backgroundColor: color || theme.accent }
        ]}>
          {icon}
        </View>
        <Text style={[styles.value, { color: theme.text }]}>
          {value}
        </Text>
      </View>
      <Text style={[styles.title, { color: theme.textSecondary }]}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 0,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: -0.2
  }
});