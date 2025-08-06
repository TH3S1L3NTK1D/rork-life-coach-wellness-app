import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { MealPrep } from '@/types';

interface MealItemProps {
  meal: MealPrep;
  onToggle: (id: number) => void;
}

export const MealItem: React.FC<MealItemProps> = ({ meal, onToggle }) => {
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
            {meal.name}
          </Text>
          <Text style={[styles.time, { color: theme.textSecondary }]}>
            {meal.scheduledTime}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[
            styles.checkbox,
            {
              backgroundColor: meal.completed ? theme.primary : 'transparent',
              borderColor: meal.completed ? theme.primary : theme.textSecondary
            }
          ]}
          onPress={() => onToggle(meal.id)}
          activeOpacity={0.7}
        >
          {meal.completed && <Check size={16} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>
      
      <View style={styles.foodsContainer}>
        {meal.foods.map((food, index) => (
          <View 
            key={index} 
            style={[
              styles.foodTag, 
              { backgroundColor: `${theme.secondary}40` }
            ]}
          >
            <Text style={[styles.foodText, { color: theme.text }]}>
              {food}
            </Text>
          </View>
        ))}
      </View>
      
      <View style={styles.nutritionContainer}>
        <View style={styles.nutritionItem}>
          <Text style={[styles.nutritionValue, { color: theme.accent }]}>
            {meal.calories}
          </Text>
          <Text style={[styles.nutritionLabel, { color: theme.textSecondary }]}>
            Calories
          </Text>
        </View>
        
        <View style={styles.nutritionItem}>
          <Text style={[styles.nutritionValue, { color: theme.accent }]}>
            {meal.protein}g
          </Text>
          <Text style={[styles.nutritionLabel, { color: theme.textSecondary }]}>
            Protein
          </Text>
        </View>
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
  foodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8
  },
  foodTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  foodText: {
    fontSize: 12,
    fontWeight: '500'
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)'
  },
  nutritionItem: {
    alignItems: 'center'
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4
  },
  nutritionLabel: {
    fontSize: 14
  }
});