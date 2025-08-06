import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import { Habit, MealPrep, Supplement } from '@/types';
import { mockHabits, mockMealPreps, mockSupplements } from '@/constants/mockData';

export const [DataProvider, useData] = createContextHook(() => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [mealPreps, setMealPreps] = useState<MealPrep[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [habitsData, mealsData, supplementsData] = await Promise.all([
          AsyncStorage.getItem('habits'),
          AsyncStorage.getItem('meals'),
          AsyncStorage.getItem('supplements')
        ]);

        setHabits(habitsData ? JSON.parse(habitsData) : mockHabits);
        setMealPreps(mealsData ? JSON.parse(mealsData) : mockMealPreps);
        setSupplements(supplementsData ? JSON.parse(supplementsData) : mockSupplements);
      } catch (error) {
        console.error('Failed to load data:', error);
        // Fallback to mock data
        setHabits(mockHabits);
        setMealPreps(mockMealPreps);
        setSupplements(mockSupplements);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const saveHabits = async (updatedHabits: Habit[]) => {
    setHabits(updatedHabits);
    await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
  };

  const saveMealPreps = async (updatedMealPreps: MealPrep[]) => {
    setMealPreps(updatedMealPreps);
    await AsyncStorage.setItem('meals', JSON.stringify(updatedMealPreps));
  };

  const saveSupplements = async (updatedSupplements: Supplement[]) => {
    setSupplements(updatedSupplements);
    await AsyncStorage.setItem('supplements', JSON.stringify(updatedSupplements));
  };

  const toggleHabitCompletion = async (id: number) => {
    const updatedHabits = habits.map(habit => 
      habit.id === id 
        ? { 
            ...habit, 
            completed: !habit.completed, 
            streak: habit.completed ? habit.streak : habit.streak + 1 
          }
        : habit
    );
    await saveHabits(updatedHabits);
  };

  const toggleMealCompletion = async (id: number) => {
    const updatedMealPreps = mealPreps.map(meal => 
      meal.id === id ? { ...meal, completed: !meal.completed } : meal
    );
    await saveMealPreps(updatedMealPreps);
  };

  const toggleSupplementCompletion = async (id: number) => {
    const updatedSupplements = supplements.map(supplement => 
      supplement.id === id 
        ? { 
            ...supplement, 
            completed: !supplement.completed,
            streak: supplement.completed ? supplement.streak : supplement.streak + 1 
          }
        : supplement
    );
    await saveSupplements(updatedSupplements);
  };

  const addHabit = async (habit: Omit<Habit, 'id'>) => {
    const newHabit: Habit = {
      ...habit,
      id: habits.length > 0 ? Math.max(...habits.map(h => h.id)) + 1 : 1
    };
    const updatedHabits = [...habits, newHabit];
    await saveHabits(updatedHabits);
  };

  const addMealPrep = async (meal: Omit<MealPrep, 'id'>) => {
    const newMeal: MealPrep = {
      ...meal,
      id: mealPreps.length > 0 ? Math.max(...mealPreps.map(m => m.id)) + 1 : 1
    };
    const updatedMealPreps = [...mealPreps, newMeal];
    await saveMealPreps(updatedMealPreps);
  };

  const addSupplement = async (supplement: Omit<Supplement, 'id'>) => {
    const newSupplement: Supplement = {
      ...supplement,
      id: supplements.length > 0 ? Math.max(...supplements.map(s => s.id)) + 1 : 1
    };
    const updatedSupplements = [...supplements, newSupplement];
    await saveSupplements(updatedSupplements);
  };

  return {
    habits,
    mealPreps,
    supplements,
    isLoading,
    toggleHabitCompletion,
    toggleMealCompletion,
    toggleSupplementCompletion,
    addHabit,
    addMealPrep,
    addSupplement
  };
});