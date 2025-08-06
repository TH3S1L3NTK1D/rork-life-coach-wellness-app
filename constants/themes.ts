import { ThemeColors } from '@/types';

export const defaultThemes: Record<string, ThemeColors> = {
  default: {
    name: 'iOS Dark',
    primary: '#007AFF',
    secondary: '#5856D6',
    accent: '#34C759',
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A'
  },
  light: {
    name: 'iOS Light',
    primary: '#007AFF',
    secondary: '#5856D6',
    accent: '#34C759',
    background: '#F2F2F7',
    card: '#FFFFFF',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#C6C6C8'
  },
  ocean: {
    name: 'Ocean Blue',
    primary: '#0ea5e9',
    secondary: '#0369a1',
    accent: '#38bdf8',
    background: '#f0f9ff',
    card: '#ffffff',
    text: '#0c4a6e',
    textSecondary: '#0284c7',
    border: '#bae6fd'
  },
  sunset: {
    name: 'Sunset Orange',
    primary: '#f97316',
    secondary: '#c2410c',
    accent: '#fb923c',
    background: '#fff7ed',
    card: '#ffffff',
    text: '#7c2d12',
    textSecondary: '#ea580c',
    border: '#fed7aa'
  },
  forest: {
    name: 'Forest Green',
    primary: '#22c55e',
    secondary: '#15803d',
    accent: '#4ade80',
    background: '#f0fdf4',
    card: '#ffffff',
    text: '#14532d',
    textSecondary: '#16a34a',
    border: '#bbf7d0'
  },
  dark: {
    name: 'Midnight',
    primary: '#6b7280',
    secondary: '#374151',
    accent: '#9ca3af',
    background: '#111827',
    card: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#e5e7eb',
    border: '#4b5563'
  },
  android: {
    name: 'Android Material',
    primary: '#3F51B5',
    secondary: '#00BCD4',
    accent: '#FF4081',
    background: '#F5F5F5',
    card: '#FFFFFF',
    text: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0'
  }
};