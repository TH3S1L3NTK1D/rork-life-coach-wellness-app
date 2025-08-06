import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

// Types
export type VoiceMode = 'tts' | 'custom';

export interface AudioContext {
  audioEnabled: boolean;
  isPlaying: boolean;
  voiceMode: VoiceMode;
  customVoice: string | null;
  toggleAudio: () => Promise<void>;
  playGreeting: () => Promise<void>;
  stopSpeech: () => Promise<void>;
  uploadCustomVoice: () => Promise<boolean>;
  removeCustomVoice: () => Promise<void>;
  switchVoiceMode: (mode: VoiceMode) => Promise<void>;
}

export const [AudioProvider, useAudio] = createContextHook(() => {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceMode, setVoiceMode] = useState<VoiceMode>('tts');
  const [customVoice, setCustomVoice] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const toggleAudio = async () => {
    setAudioEnabled(prev => !prev);
  };

  const playGreeting = async () => {
    if (!audioEnabled) return;
    if (isPlaying) return; // Prevent multiple plays
    setIsPlaying(true);
    
    try {
      if (Platform.OS !== 'web') {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: 'https://cdn.freesound.org/previews/431/431801_5123851-lq.mp3' } // Valid audio URL for welcome greeting
        );
        setSound(newSound);
        await newSound.playAsync();
      } else {
        console.log('Audio playback not supported on web');
      }
    } catch (error) {
      console.error('Error playing greeting:', error);
    } finally {
      setTimeout(() => setIsPlaying(false), 1000); // Delay state update to prevent immediate re-render loop
    }
  };

  const stopSpeech = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  const uploadCustomVoice = async () => {
    // Placeholder for uploading custom voice
    console.log('Custom voice upload not implemented');
    return false;
  };

  const removeCustomVoice = async () => {
    setCustomVoice(null);
  };

  const switchVoiceMode = async (mode: VoiceMode) => {
    setVoiceMode(mode);
  };

  return {
    audioEnabled,
    isPlaying,
    voiceMode,
    customVoice,
    toggleAudio,
    playGreeting,
    stopSpeech,
    uploadCustomVoice,
    removeCustomVoice,
    switchVoiceMode
  };
});
