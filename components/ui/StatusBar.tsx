import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface StatusBarProps {
  time: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ time }) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.leftSection}>
        <Text style={[styles.timeText, { color: theme.text }]}>{time}</Text>
      </View>
      
      <View style={styles.rightSection}>
        <View style={styles.signalContainer}>
          <View style={[styles.signalDot, { backgroundColor: theme.text }]} />
          <View style={[styles.signalDot, { backgroundColor: theme.text }]} />
          <View style={[styles.signalDot, { backgroundColor: theme.text }]} />
          <View style={[styles.signalDot, { backgroundColor: theme.text }]} />
        </View>
        <View style={styles.wifiIcon}>
          <View style={[styles.wifiBar, { backgroundColor: theme.text }]} />
          <View style={[styles.wifiBar, { backgroundColor: theme.text }]} />
          <View style={[styles.wifiBar, { backgroundColor: theme.text }]} />
        </View>
        <View style={[styles.batteryContainer, { borderColor: theme.text }]}>
          <View style={[styles.batteryFill, { backgroundColor: theme.text }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44
  },
  leftSection: {
    flex: 1
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  timeText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.4
  },
  signalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2
  },
  signalDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5
  },
  wifiIcon: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1
  },
  wifiBar: {
    width: 2,
    borderRadius: 1
  },
  batteryContainer: {
    width: 24,
    height: 12,
    borderWidth: 1,
    borderRadius: 2,
    padding: 1,
    position: 'relative'
  },
  batteryFill: {
    flex: 1,
    borderRadius: 1
  }
});