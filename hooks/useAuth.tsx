import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { mockUsers } from '@/constants/mockData';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const user = mockUsers.find(u => u.username === username);
    
    // Simulate password check (in a real app, never store passwords in plain text)
    if (user && (password === 'password123' || password === 'mypass456')) {
      setUser(user);
      setIsLoggedIn(true);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    
    return false;
  };

  const register = async (username: string, name: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const newUser: User = {
      id: mockUsers.length + 1,
      username,
      name,
      theme: 'default'
    };
    
    setUser(newUser);
    setIsLoggedIn(true);
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    return true;
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    setIsLoggedIn(false);
    await AsyncStorage.removeItem('user');
  };

  const updateUserTheme = async (theme: string): Promise<void> => {
    if (user) {
      const updatedUser = { ...user, theme };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return {
    user,
    isLoading,
    isLoggedIn,
    login,
    register,
    logout,
    updateUserTheme
  };
});