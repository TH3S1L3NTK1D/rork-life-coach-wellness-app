import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface ScheduleItemProps {
  title: string;
  time: string;
  completed: boolean;
}

export const ScheduleItem: React.FC<ScheduleItemProps> = ({ 
  title, 
  time, 
  completed 
}) => {
  const { theme } = useTheme();
  
  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: theme.card }
      ]}
    >
      <View style={styles.content}>
        <View 
          style={[
            styles.iconContainer, 
            { 
              backgroundColor: theme.primary,
              borderColor: `${theme.accent}50`
            }
          ]}
        >
          <Clock size={20} color="#FFFFFF" />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.text }]}>
            {title}
          </Text>
          <Text style={[styles.time, { color: theme.textSecondary }]}>
            {time}
          </Text>
        </View>
      </View>
      
      <View 
        style={[
          styles.statusIndicator, 
          { 
            backgroundColor: completed ? theme.accent : 'transparent',
            borderColor: completed ? theme.accent : theme.textSecondary
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 0
  },
  textContainer: {
    flex: 1
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: -0.2
  },
  time: {
    fontSize: 15,
    letterSpacing: -0.1
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2
  }
});