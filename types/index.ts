export interface User {
  id: number;
  username: string;
  name: string;
  theme: string;
}

export interface Habit {
  id: number;
  name: string;
  completed: boolean;
  streak: number;
  category: string;
}

export interface MealPrep {
  id: number;
  name: string;
  foods: string[];
  scheduledDate: string;
  scheduledTime: string;
  calories: number;
  protein: number;
  completed: boolean;
}

export interface Supplement {
  id: number;
  name: string;
  dosage: string;
  unit: string;
  scheduledDate: string;
  scheduledTime: string;
  frequency: string;
  notes?: string;
  completed: boolean;
  streak: number;
}

export interface Addiction {
  id: number;
  name: string;
  type: 'substance' | 'behavioral' | 'digital' | 'other';
  severity: 'low' | 'moderate' | 'high';
  daysSober: number;
  lastRelapse?: string;
  triggers: string[];
  copingStrategies: string[];
  notes?: string;
  isActive: boolean;
  createdAt: string;
}

export interface AddictionTip {
  id: number;
  title: string;
  content: string;
  category: 'motivation' | 'strategy' | 'emergency' | 'mindfulness';
  addictionTypes: string[];
}

export interface AICoach {
  name: string;
  personality: 'supportive' | 'tough-love' | 'clinical' | 'friendly';
  voiceEnabled: boolean;
  voiceActivation?: boolean;
  appControl?: boolean;
  customVoiceFile?: string;
}

export interface Reminder {
  id: string;
  title: string;
  message: string;
  scheduledDate: string;
  scheduledTime: string;
  type: 'habit' | 'meal' | 'supplement' | 'water' | 'exercise' | 'medication' | 'custom';
  isActive: boolean;
  isRecurring: boolean;
  recurringDays?: string[]; // ['monday', 'tuesday', etc.]
  createdAt: string;
  lastTriggered?: string;
}

export type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image'; image: string };

export type CoreMessage =
  | { role: 'system'; content: string }
  | { role: 'user'; content: string | ContentPart[] }
  | { role: 'assistant'; content: string | ContentPart[] };

export interface ThemeColors {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
}