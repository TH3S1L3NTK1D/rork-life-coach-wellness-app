import { Habit, MealPrep, Supplement, User, Addiction, AddictionTip } from '@/types';

export const mockUsers: User[] = [
  { id: 1, username: 'victoria_doe', name: 'Victoria', theme: 'default' },
  { id: 2, username: 'jane_smith', name: 'Jane', theme: 'ocean' }
];

export const defaultAICoach = {
  name: 'Anuna',
  personality: 'supportive' as const,
  voiceEnabled: true,
  voiceActivation: true,
  appControl: true
};

export const mockHabits: Habit[] = [
  { id: 1, name: 'Drink 8 glasses of water', completed: false, streak: 7, category: 'health' },
  { id: 2, name: 'Meditate 10 minutes', completed: true, streak: 15, category: 'mindfulness' },
  { id: 3, name: 'Read for 30 minutes', completed: false, streak: 3, category: 'learning' },
  { id: 4, name: 'Exercise', completed: true, streak: 12, category: 'fitness' }
];

export const mockMealPreps: MealPrep[] = [
  { 
    id: 1, 
    name: 'Greek Yogurt Bowl', 
    foods: ['Greek yogurt', 'Blueberries', 'Granola', 'Honey'], 
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '08:00',
    calories: 320, 
    protein: 20, 
    completed: true 
  },
  { 
    id: 2, 
    name: 'Quinoa Power Salad', 
    foods: ['Quinoa', 'Chicken breast', 'Spinach', 'Cherry tomatoes', 'Avocado'], 
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '12:30',
    calories: 450, 
    protein: 35, 
    completed: false 
  },
  { 
    id: 3, 
    name: 'Grilled Salmon Dinner', 
    foods: ['Salmon fillet', 'Asparagus', 'Sweet potato', 'Olive oil'], 
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '19:00',
    calories: 520, 
    protein: 38, 
    completed: false 
  }
];

export const mockSupplements: Supplement[] = [
  {
    id: 1,
    name: 'Vitamin D3',
    dosage: '2000',
    unit: 'IU',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '09:00',
    frequency: 'daily',
    notes: 'Take with food for better absorption',
    completed: false,
    streak: 5
  },
  {
    id: 2,
    name: 'Omega-3',
    dosage: '1000',
    unit: 'mg',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '18:00',
    frequency: 'daily',
    notes: 'Fish oil supplement for heart health',
    completed: true,
    streak: 12
  }
];

export const mockAddictions: Addiction[] = [
  {
    id: 1,
    name: 'Social Media',
    type: 'digital',
    severity: 'moderate',
    daysSober: 7,
    triggers: ['Boredom', 'Stress', 'FOMO'],
    copingStrategies: ['Read a book', 'Go for a walk', 'Call a friend'],
    notes: 'Trying to limit usage to 30 minutes per day',
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    name: 'Smoking',
    type: 'substance',
    severity: 'high',
    daysSober: 45,
    lastRelapse: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    triggers: ['Stress', 'Alcohol', 'Work breaks'],
    copingStrategies: ['Deep breathing', 'Chew gum', 'Exercise'],
    notes: 'Using nicotine patches to help with withdrawal',
    isActive: true,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const mockAddictionTips: AddictionTip[] = [
  {
    id: 1,
    title: 'The 5-4-3-2-1 Grounding Technique',
    content: 'When you feel a craving, identify: 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.',
    category: 'emergency',
    addictionTypes: ['substance', 'behavioral', 'digital']
  },
  {
    id: 2,
    title: 'Progress Over Perfection',
    content: 'Recovery is not about being perfect. Every day you choose recovery is a victory, no matter how small it may seem.',
    category: 'motivation',
    addictionTypes: ['substance', 'behavioral', 'digital', 'other']
  },
  {
    id: 3,
    title: 'Replace the Habit',
    content: 'Instead of just stopping a behavior, replace it with a positive one. If you reach for your phone, reach for a book instead.',
    category: 'strategy',
    addictionTypes: ['digital', 'behavioral']
  },
  {
    id: 4,
    title: 'Mindful Breathing',
    content: 'Take 10 deep breaths, focusing only on the sensation of breathing. This helps reset your nervous system and reduce cravings.',
    category: 'mindfulness',
    addictionTypes: ['substance', 'behavioral', 'digital', 'other']
  },
  {
    id: 5,
    title: 'Your Why Matters',
    content: 'Remember why you started this journey. Write down your reasons and read them when motivation is low.',
    category: 'motivation',
    addictionTypes: ['substance', 'behavioral', 'digital', 'other']
  },
  {
    id: 6,
    title: 'HALT Check',
    content: 'Before giving in to a craving, ask yourself: Am I Hungry, Angry, Lonely, or Tired? Address the real need first.',
    category: 'strategy',
    addictionTypes: ['substance', 'behavioral', 'digital', 'other']
  }
];