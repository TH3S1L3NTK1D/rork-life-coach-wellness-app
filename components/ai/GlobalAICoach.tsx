import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import { useAudio } from '../../hooks/useAudio';

type CoachPersonality = 'supportive' | 'motivational' | 'analytical';

interface AICoach {
  name: string;
  personality: CoachPersonality;
  voiceEnabled: boolean;
  voiceActivation: boolean;
  appControl: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface AICoachContextType {
  coach: AICoach;
  messages: Message[];
  isListening: boolean;
  isSpeaking: boolean;
  updateCoach: (coach: Partial<AICoach>) => void;
  sendMessage: (content: string) => void;
  startListening: () => void;
  stopListening: () => void;
  clearMessages: () => void;
}

const AICoachContext = createContext<AICoachContextType | undefined>(undefined);

export const AICoachProvider = ({ children }: { children: ReactNode }) => {
  const { playGreeting } = useAudio();
  const [coach, setCoach] = useState<AICoach>({
    name: 'Anuna',
    personality: 'supportive',
    voiceEnabled: true,
    voiceActivation: true,
    appControl: false,
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const updateCoach = (updates: Partial<AICoach>) => {
    setCoach(prev => ({ ...prev, ...updates }));
  };

  const sendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newMessage]);
    // Simulate AI response for now
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: coach.voiceActivation && content.toLowerCase().includes('hey anuna') 
          ? 'Hello! How can I assist you today?' 
          : `Echo: ${content}`,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiResponse]);
      if (coach.voiceEnabled && content.toLowerCase().includes('hey anuna')) {
        setIsSpeaking(true);
        playGreeting().finally(() => setIsSpeaking(false));
      }
    }, 500);
  };

  const startListening = () => {
    setIsListening(true);
    // Simulate voice activation detection for 'Hey Anuna'
    if (coach.voiceActivation) {
      setTimeout(() => {
        sendMessage('Hey Anuna');
      }, 2000);
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      setIsListening(false);
      setIsSpeaking(false);
    };
  }, []);

  return (
    <AICoachContext.Provider
      value={{
        coach,
        messages,
        isListening,
        isSpeaking,
        updateCoach,
        sendMessage,
        startListening,
        stopListening,
        clearMessages,
      }}
    >
      {children}
    </AICoachContext.Provider>
  );
};

export const useAICoach = () => {
  const context = useContext(AICoachContext);
  if (context === undefined) {
    throw new Error('useAICoach must be used within an AICoachProvider');
  }
  return context;
};
