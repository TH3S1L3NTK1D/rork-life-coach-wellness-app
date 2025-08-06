import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Addiction, AddictionTip } from '@/types';
import { mockAddictions, mockAddictionTips } from '@/constants/mockData';

export const [AddictionsProvider, useAddictions] = createContextHook(() => {
  const [addictions, setAddictions] = useState<Addiction[]>([]);
  const [tips, setTips] = useState<AddictionTip[]>(mockAddictionTips);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAddictions = async () => {
      try {
        const savedAddictions = await AsyncStorage.getItem('addictions');
        if (savedAddictions) {
          setAddictions(JSON.parse(savedAddictions));
        } else {
          setAddictions(mockAddictions);
          await AsyncStorage.setItem('addictions', JSON.stringify(mockAddictions));
        }
      } catch (error) {
        console.error('Failed to load addictions:', error);
        setAddictions(mockAddictions);
      } finally {
        setIsLoading(false);
      }
    };

    loadAddictions();
  }, []);

  const saveAddictions = async (updatedAddictions: Addiction[]) => {
    try {
      await AsyncStorage.setItem('addictions', JSON.stringify(updatedAddictions));
      setAddictions(updatedAddictions);
    } catch (error) {
      console.error('Failed to save addictions:', error);
    }
  };

  const addAddiction = async (addiction: Omit<Addiction, 'id' | 'createdAt'>) => {
    const newAddiction: Addiction = {
      ...addiction,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    const updatedAddictions = [...addictions, newAddiction];
    await saveAddictions(updatedAddictions);
  };

  const updateAddiction = async (id: number, updates: Partial<Addiction>) => {
    const updatedAddictions = addictions.map(addiction =>
      addiction.id === id ? { ...addiction, ...updates } : addiction
    );
    await saveAddictions(updatedAddictions);
  };

  const deleteAddiction = async (id: number) => {
    const updatedAddictions = addictions.filter(addiction => addiction.id !== id);
    await saveAddictions(updatedAddictions);
  };

  const incrementSoberDay = async (id: number) => {
    const addiction = addictions.find(a => a.id === id);
    if (addiction) {
      await updateAddiction(id, { daysSober: addiction.daysSober + 1 });
    }
  };

  const recordRelapse = async (id: number) => {
    await updateAddiction(id, {
      daysSober: 0,
      lastRelapse: new Date().toISOString()
    });
  };

  const addTrigger = async (id: number, trigger: string) => {
    const addiction = addictions.find(a => a.id === id);
    if (addiction && !addiction.triggers.includes(trigger)) {
      const updatedTriggers = [...addiction.triggers, trigger];
      await updateAddiction(id, { triggers: updatedTriggers });
    }
  };

  const removeTrigger = async (id: number, trigger: string) => {
    const addiction = addictions.find(a => a.id === id);
    if (addiction) {
      const updatedTriggers = addiction.triggers.filter(t => t !== trigger);
      await updateAddiction(id, { triggers: updatedTriggers });
    }
  };

  const addCopingStrategy = async (id: number, strategy: string) => {
    const addiction = addictions.find(a => a.id === id);
    if (addiction && !addiction.copingStrategies.includes(strategy)) {
      const updatedStrategies = [...addiction.copingStrategies, strategy];
      await updateAddiction(id, { copingStrategies: updatedStrategies });
    }
  };

  const removeCopingStrategy = async (id: number, strategy: string) => {
    const addiction = addictions.find(a => a.id === id);
    if (addiction) {
      const updatedStrategies = addiction.copingStrategies.filter(s => s !== strategy);
      await updateAddiction(id, { copingStrategies: updatedStrategies });
    }
  };

  const getTipsForAddiction = (addictionType: string, category?: string): AddictionTip[] => {
    return tips.filter(tip => {
      const matchesType = tip.addictionTypes.includes(addictionType) || tip.addictionTypes.includes('other');
      const matchesCategory = !category || tip.category === category;
      return matchesType && matchesCategory;
    });
  };

  const getActiveAddictions = (): Addiction[] => {
    return addictions.filter(addiction => addiction.isActive);
  };

  const getTotalSoberDays = (): number => {
    return addictions.reduce((total, addiction) => total + addiction.daysSober, 0);
  };

  const getLongestStreak = (): number => {
    return Math.max(...addictions.map(addiction => addiction.daysSober), 0);
  };

  const getAddictionsByType = (type: string): Addiction[] => {
    return addictions.filter(addiction => addiction.type === type);
  };

  return {
    addictions,
    tips,
    isLoading,
    addAddiction,
    updateAddiction,
    deleteAddiction,
    incrementSoberDay,
    recordRelapse,
    addTrigger,
    removeTrigger,
    addCopingStrategy,
    removeCopingStrategy,
    getTipsForAddiction,
    getActiveAddictions,
    getTotalSoberDays,
    getLongestStreak,
    getAddictionsByType
  };
});