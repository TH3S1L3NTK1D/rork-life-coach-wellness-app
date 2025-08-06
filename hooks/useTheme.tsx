import createContextHook from '@nkzw/create-context-hook';
import { ThemeColors } from '@/types';
import { defaultThemes } from '@/constants/themes';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  return {
    currentTheme: 'default',
    theme: defaultThemes.default,
    themes: defaultThemes,
    changeTheme: async () => {},
    addCustomTheme: async () => {},
    removeCustomTheme: async () => {},
    isLoading: false
  };
});