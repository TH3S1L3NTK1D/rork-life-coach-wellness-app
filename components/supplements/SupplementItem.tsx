import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Supplement } from '@/types';

interface SupplementItemProps {
  supplement: Supplement;
  onToggle: (id: number) => void;
}

export const SupplementItem: React.FC<SupplementItemProps> = ({ supplement, onToggle }) => {
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
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>
            {supplement.name}
          </Text>
          <Text style={[styles.dosage, { color: theme.textSecondary }]}>
            {supplement.dosage} {supplement.unit}
          </Text>
          <Text style={[styles.time, { color: theme.textSecondary }]}>
            {supplement.scheduledTime}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[
            styles.checkbox,
            {
              backgroundColor: supplement.completed ? theme.primary : 'transparent',
              borderColor: supplement.completed ? theme.primary : theme.textSecondary
            }
          ]}
          onPress={() => onToggle(supplement.id)}
          activeOpacity={0.7}
        >
          {supplement.completed && <Check size={16} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>
      
      {supplement.notes && (
        <View 
          style={[
            styles.notesContainer, 
            { backgroundColor: `${theme.secondary}20` }
          ]}
        >
          <Text style={[styles.notesText, { color: theme.text }]}>
            {supplement.notes}
          </Text>
        </View>
      )}
      
      <View style={styles.streakContainer}>
        <Text style={[styles.streak, { color: theme.accent }]}>
          {supplement.streak} day streak
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
    borderWidth: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4
  },
  dosage: {
    fontSize: 14,
    marginBottom: 2
  },
  time: {
    fontSize: 14
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  notesContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12
  },
  notesText: {
    fontSize: 14
  },
  streakContainer: {
    alignItems: 'center'
  },
  streak: {
    fontSize: 14,
    fontWeight: '600'
  }
});