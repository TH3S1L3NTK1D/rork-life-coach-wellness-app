import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

interface GlobalAICoachProps {
  visible: boolean;
  onClose: () => void;
}

export const GlobalAICoach: React.FC<GlobalAICoachProps> = ({ visible, onClose }) => {
  if (!visible) return null;
  
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>AI Coach</Text>
        <Text style={styles.message}>How can I help you today?</Text>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '50%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  closeButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
