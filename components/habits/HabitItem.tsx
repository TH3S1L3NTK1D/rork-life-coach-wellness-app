import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Habit } from '@/types';

interface HabitItemProps {
  habit: Habit;
  onToggle: (id: number) => void;
}

export const HabitItem: React.FC<HabitItemProps> = ({ habit, onToggle }) => {
  const { theme } = useTheme();
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.card,
          borderColor: theme.border
        }
      ]}
    >
      <View style={styles.contentContainer}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            {
              backgroundColor: habit.completed ? theme.primary : 'transparent',
              borderColor: habit.completed ? theme.primary : theme.textSecondary
            }
          ]}
          onPress={() => onToggle(habit.id)}
          activeOpacity={0.7}
        >
          {habit.completed && <Check size={16} color="#FFFFFF" />}
        </TouchableOpacity>
        
        <View style={styles.textContainer}>
          <Text 
            style={[
              styles.title,
              { 
                color: habit.completed ? theme.textSecondary : theme.text,
                textDecorationLine: habit.completed ? 'line-through' : 'none'
              }
            ]}
          >
            {habit.name}
          </Text>
          <Text style={[styles.category, { color: theme.textSecondary }]}>
            {habit.category}
          </Text>
        </View>
      </View>
      
      <View style={styles.streakContainer}>
        <Text style={[styles.streak, { color: theme.accent }]}>
          {habit.streak} days
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  textContainer: {
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  category: {
    fontSize: 14
  },
  streakContainer: {
    paddingLeft: 8
  },
  streak: {
    fontSize: 14,
    fontWeight: '600'
  }
});