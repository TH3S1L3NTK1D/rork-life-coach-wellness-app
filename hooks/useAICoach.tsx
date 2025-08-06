import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import { AICoach, Reminder, CoreMessage } from '@/types';
import { defaultAICoach } from '@/constants/mockData';
import { useAudio } from './useAudio';

// AI Coach Context
export interface AICoachContext {
  coach: AICoach;
  isResponding: boolean;
  conversationHistory: CoreMessage[];
  isRecording: boolean;
  isListeningForActivation: boolean;
  isProcessingAudio: boolean;
  capabilities: {
    internetAccess: boolean;
    socialMediaAccess: boolean;
    realTimeData: boolean;
  };
  updateCoach: (settings: Partial<AICoach>) => Promise<void>;
  askCoach: (message: string) => Promise<string>;
  speakResponse: (text: string) => Promise<void>;
  getMotivationalMessage: () => string;
  getEmergencySupport: () => Promise<string>;
  startVoiceRecording: () => Promise<void>;
  stopVoiceRecording: () => Promise<void>;
  clearConversation: () => Promise<void>;
  toggleCapability: (capability: keyof AICoachContext['capabilities']) => Promise<void>;
  setNavigationFunction: (fn: (route: string) => void) => void;
  setAppActionFunction: (fn: (action: string, params?: any) => void) => void;
  startBackgroundListening: () => Promise<void>;
  stopBackgroundListening: () => void;
  uploadCustomVoice: () => Promise<boolean>;
  removeCustomVoice: () => Promise<void>;
  updateAnunaVoiceUrl: (url: string) => Promise<boolean>;
  playWelcomeGreeting: () => Promise<void>;
  resetGreetingFlag: () => void;
  stopTTS: () => void;
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id'>) => Promise<string>;
  removeReminder: (id: string) => Promise<boolean>;
  updateReminder: (id: string, reminder: Partial<Reminder>) => Promise<boolean>;
  checkReminders: () => Promise<void>;
}

export const [AICoachProvider, useAICoach] = createContextHook(() => {
  const [coach, setCoach] = useState<AICoach>(defaultAICoach);
  const [isResponding, setIsResponding] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<CoreMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isListeningForActivation, setIsListeningForActivation] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [capabilities, setCapabilities] = useState({
    internetAccess: false,
    socialMediaAccess: false,
    realTimeData: false
  });
  // Avoid direct usage of useAudio to prevent potential update loops
  const audio = useAudio();
  let navigationFn: ((route: string) => void) | null = null;
  let appActionFn: ((action: string, params?: any) => void) | null = null;

  const updateCoach = async (settings: Partial<AICoach>) => {
    setCoach(prev => ({ ...prev, ...settings }));
  };

  const askCoach = async (message: string) => {
    setIsResponding(true);
    try {
      // Simulate AI response
      const response = `Response to: ${message}`;
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: message },
        { role: 'assistant', content: response }
      ]);
      return response;
    } finally {
      setIsResponding(false);
    }
  };

  const speakResponse = async (text: string) => {
    // Placeholder for text-to-speech functionality
    console.log('Speaking response:', text);
  };

  const getMotivationalMessage = () => {
    return 'Keep pushing forward! Every step counts.';
  };

  const getEmergencySupport = async () => {
    return 'I\'m here to help. Please tell me what\'s wrong.';
  };

  const startVoiceRecording = async () => {
    setIsRecording(true);
  };

  const stopVoiceRecording = async () => {
    setIsRecording(false);
  };

  const clearConversation = async () => {
    setConversationHistory([]);
  };

  const toggleCapability = async (capability: keyof typeof capabilities) => {
    setCapabilities(prev => ({ ...prev, [capability]: !prev[capability] }));
  };

  const setNavigationFunction = (fn: (route: string) => void) => {
    navigationFn = fn;
  };

  const setAppActionFunction = (fn: (action: string, params?: any) => void) => {
    appActionFn = fn;
  };

  const startBackgroundListening = async () => {
    setIsListeningForActivation(true);
  };

  const stopBackgroundListening = () => {
    setIsListeningForActivation(false);
  };

  const uploadCustomVoice = async () => {
    return false;
  };

  const removeCustomVoice = async () => {
    // Placeholder
  };

  const updateAnunaVoiceUrl = async (url: string) => {
    return false;
  };

  const playWelcomeGreeting = async () => {
    await audio.playGreeting();
  };

  const resetGreetingFlag = () => {
    // Placeholder
  };

  const stopTTS = () => {
    audio.stopSpeech();
  };

  const addReminder = async (reminder: Omit<Reminder, 'id'>) => {
    const id = Date.now().toString();
    setReminders(prev => [...prev, { ...reminder, id }]);
    return id;
  };

  const removeReminder = async (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    return true;
  };

  const updateReminder = async (id: string, updates: Partial<Reminder>) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    return true;
  };

  const checkReminders = async () => {
    // Placeholder for reminder checking logic
  };

  return {
    coach,
    isResponding,
    conversationHistory,
    isRecording,
    isListeningForActivation,
    isProcessingAudio,
    capabilities,
    updateCoach,
    askCoach,
    speakResponse,
    getMotivationalMessage,
    getEmergencySupport,
    startVoiceRecording,
    stopVoiceRecording,
    clearConversation,
    toggleCapability,
    setNavigationFunction,
    setAppActionFunction,
    startBackgroundListening,
    stopBackgroundListening,
    uploadCustomVoice,
    removeCustomVoice,
    updateAnunaVoiceUrl,
    playWelcomeGreeting,
    resetGreetingFlag,
    stopTTS,
    reminders,
    addReminder,
    removeReminder,
    updateReminder,
    checkReminders
  };
});
