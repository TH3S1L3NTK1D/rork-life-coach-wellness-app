import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import { StatusBar } from '@/components/ui/StatusBar';
import { HabitItem } from '@/components/habits/HabitItem';
import { useTheme } from '@/hooks/useTheme';
import { useData } from '@/hooks/useData';

export default function HabitsScreen() {
  const { theme } = useTheme();
  const { habits, toggleHabitCompletion } = useData();
  
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar time={currentTime} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Habits</Text>
        
        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: theme.primary }
          ]}
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {habits.length > 0 ? (
          habits.map(habit => (
            <HabitItem
              key={habit.id}
              habit={habit}
              onToggle={toggleHabitCompletion}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No habits added yet
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 40
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center'
  }
});