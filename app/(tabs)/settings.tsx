import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { LogOut, User, Volume2, Upload, Trash2, Bot, Globe, MessageSquare, Zap, Bell, Code, Mic } from 'lucide-react-native';
import { StatusBar } from '@/components/ui/StatusBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useAudio } from '@/hooks/useAudio';
import { useAICoach } from '@/hooks/useAICoach';
import { ReminderManager } from '@/components/ai/ReminderManager';
import { SourceCodeViewer } from '@/components/ui/SourceCodeViewer';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { theme, themes, changeTheme, currentTheme } = useTheme();
  const { 
    audioEnabled, 
    toggleAudio, 
    playGreeting, 
    isPlaying, 
    voiceMode, 
    customVoice, 
    uploadCustomVoice, 
    removeCustomVoice, 
    switchVoiceMode 
  } = useAudio();
  const { coach, capabilities, updateCoach, toggleCapability, reminders, uploadCustomVoice: uploadAnunaVoice, removeCustomVoice: removeAnunaVoice } = useAICoach();
  const [showAISettings, setShowAISettings] = useState<boolean>(false);
  const [showReminders, setShowReminders] = useState<boolean>(false);
  const [showSourceCode, setShowSourceCode] = useState<boolean>(false);
  const [showAnunaVoice, setShowAnunaVoice] = useState<boolean>(false);
  
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar time={currentTime} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        
        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: `${theme.primary}20` }
          ]}
          onPress={handleLogout}
        >
          <LogOut size={20} color={theme.primary} />
          <Text style={[styles.logoutText, { color: theme.primary }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile */}
        <Card style={styles.profileCard}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Profile
          </Text>
          
          <View style={styles.profileContent}>
            <View 
              style={[
                styles.profileAvatar,
                { backgroundColor: theme.primary }
              ]}
            >
              <User size={32} color="white" />
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.text }]}>
                {user?.name}
              </Text>
              <Text style={[styles.profileUsername, { color: theme.textSecondary }]}>
                @{user?.username}
              </Text>
            </View>
          </View>
        </Card>
        
        {/* Theme Selection */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Theme Selection
          </Text>
          
          <View style={styles.themesGrid}>
            {Object.entries(themes).map(([key, themeOption]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.themeOption,
                  {
                    borderColor: currentTheme === key ? theme.accent : theme.border,
                    backgroundColor: currentTheme === key ? `${theme.accent}20` : 'transparent'
                  }
                ]}
                onPress={() => changeTheme(key)}
              >
                <View 
                  style={[
                    styles.themePreview,
                    { backgroundColor: themeOption.primary }
                  ]}
                />
                <Text 
                  style={[
                    styles.themeName,
                    { color: currentTheme === key ? theme.accent : theme.text }
                  ]}
                >
                  {themeOption.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
        
        {/* Audio Settings */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Audio Settings
          </Text>
          
          <View style={styles.settingRow}>
            <View>
              <Text style={[styles.settingTitle, { color: theme.text }]}>
                Voice Greetings
              </Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                Hear personalized welcome messages
              </Text>
            </View>
            
            <Switch
              value={audioEnabled}
              onValueChange={toggleAudio}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor="#f4f3f4"
            />
          </View>
          
          {audioEnabled && (
            <>
              <View style={styles.voiceModeSection}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>
                  Voice Mode
                </Text>
                <View style={styles.voiceModeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.voiceModeButton,
                      {
                        backgroundColor: voiceMode === 'tts' ? theme.primary : 'transparent',
                        borderColor: theme.primary
                      }
                    ]}
                    onPress={() => switchVoiceMode('tts')}
                  >
                    <Text style={[
                      styles.voiceModeText,
                      { color: voiceMode === 'tts' ? 'white' : theme.text }
                    ]}>
                      Text-to-Speech
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.voiceModeButton,
                      {
                        backgroundColor: voiceMode === 'custom' ? theme.primary : 'transparent',
                        borderColor: theme.primary
                      }
                    ]}
                    onPress={() => switchVoiceMode('custom')}
                    disabled={!customVoice}
                  >
                    <Text style={[
                      styles.voiceModeText,
                      { color: voiceMode === 'custom' ? 'white' : customVoice ? theme.text : theme.textSecondary }
                    ]}>
                      Custom Voice
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {customVoice ? (
                <View style={styles.customVoiceSection}>
                  <View style={styles.customVoiceInfo}>
                    <Text style={[styles.customVoiceName, { color: theme.text }]}>
                      {customVoice.name}
                    </Text>
                    <TouchableOpacity
                      onPress={async () => {
                        Alert.alert(
                          'Remove Custom Voice',
                          'Are you sure you want to remove your custom voice?',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: 'Remove',
                              style: 'destructive',
                              onPress: removeCustomVoice
                            }
                          ]
                        );
                      }}
                    >
                      <Trash2 size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <Button
                  title="Upload Custom Voice"
                  onPress={async () => {
                    const success = await uploadCustomVoice();
                    if (success) {
                      Alert.alert('Success', 'Custom voice uploaded successfully!');
                    }
                  }}
                  icon={<Upload size={18} color="white" />}
                  style={{ marginTop: 12 }}
                />
              )}
              
              <Button
                title={isPlaying ? "Playing..." : "Test Voice Greeting"}
                onPress={() => playGreeting(user?.name || '', true)}
                loading={isPlaying}
                icon={<Volume2 size={18} color="white" />}
                style={{ marginTop: 16 }}
              />
            </>
          )}
        </Card>
        
        {/* Anuna Voice Settings */}
        <Card>
          <TouchableOpacity
            style={styles.aiCoachHeader}
            onPress={() => setShowAnunaVoice(!showAnunaVoice)}
          >
            <View style={styles.aiCoachTitleRow}>
              <Mic size={24} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0, marginLeft: 12 }]}>
Anuna&apos;s Voice
              </Text>
            </View>
            <Text style={[styles.aiCoachSubtitle, { color: theme.textSecondary }]}>
              {coach.customVoiceFile ? 'Custom voice active' : 'Using default TTS voice'}
            </Text>
          </TouchableOpacity>
          
          {showAnunaVoice && (
            <View style={styles.anunaVoiceContent}>
              <Text style={[styles.settingDescription, { color: theme.textSecondary, marginBottom: 16 }]}>
                Upload an audio file to give Anuna her unique voice. You can extract audio from the YouTube video or upload any audio file.
              </Text>
              
              {coach.customVoiceFile ? (
                <View style={styles.customVoiceSection}>
                  <View style={styles.customVoiceInfo}>
                    <Text style={[styles.customVoiceName, { color: theme.text }]}>
                      Custom Anuna Voice Active
                    </Text>
                    <TouchableOpacity
                      onPress={async () => {
                        Alert.alert(
                          'Remove Anuna Voice',
                          'Are you sure you want to remove Anuna&apos;s custom voice? She will revert to the default TTS voice.',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: 'Remove',
                              style: 'destructive',
                              onPress: async () => {
                                await removeAnunaVoice();
                                Alert.alert('Success', 'Anuna&apos;s voice has been reset to default.');
                              }
                            }
                          ]
                        );
                      }}
                    >
                      <Trash2 size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.voiceUploadSection}>
                  <Text style={[styles.voiceInstructions, { color: theme.text, marginBottom: 12 }]}>
                    How to add Anuna&apos;s voice:
                  </Text>
                  <Text style={[styles.voiceStep, { color: theme.textSecondary, marginBottom: 8 }]}>
                    1. Download audio from: https://youtu.be/bHOD4pLrZDo
                  </Text>
                  <Text style={[styles.voiceStep, { color: theme.textSecondary, marginBottom: 8 }]}>
                    2. Use a YouTube to MP3 converter to extract the audio
                  </Text>
                  <Text style={[styles.voiceStep, { color: theme.textSecondary, marginBottom: 16 }]}>
                    3. Upload the audio file below
                  </Text>
                  
                  <Button
                    title="Upload Anuna&apos;s Voice"
                    onPress={async () => {
                      // Create file input for web
                      if (typeof window !== 'undefined') {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'audio/*';
                        input.onchange = async (e: any) => {
                          const file = e.target.files[0];
                          if (file) {
                            const success = await uploadAnunaVoice(file);
                            if (success) {
                              Alert.alert('Success', 'Anuna&apos;s voice has been uploaded successfully! She will now use this voice when speaking.');
                            } else {
                              Alert.alert('Error', 'Failed to upload the voice file. Please try again with a different audio file.');
                            }
                          }
                        };
                        input.click();
                      }
                    }}
                    icon={<Upload size={18} color="white" />}
                  />
                </View>
              )}
              
              <View style={styles.voiceTestSection}>
                <Button
                  title="Test Anuna&apos;s Voice"
                  onPress={async () => {
                    // Test the current voice setup by showing instructions
                    if (coach.voiceEnabled) {
                      // This would trigger the speakResponse function
                      Alert.alert('Voice Test', 'Say &quot;Hey Anuna&quot; to test the voice, or enable voice responses in AI Coach Settings.');
                    } else {
                      Alert.alert('Voice Disabled', 'Please enable AI Voice Responses in the AI Coach Settings section first.');
                    }
                  }}
                  variant="secondary"
                  icon={<Volume2 size={18} color={theme.primary} />}
                  style={{ marginTop: 16 }}
                />
              </View>
            </View>
          )}
        </Card>
        
        {/* Reminders */}
        <Card>
          <TouchableOpacity
            style={styles.aiCoachHeader}
            onPress={() => setShowReminders(!showReminders)}
          >
            <View style={styles.aiCoachTitleRow}>
              <Bell size={24} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0, marginLeft: 12 }]}>
                Reminders
              </Text>
            </View>
            <Text style={[styles.aiCoachSubtitle, { color: theme.textSecondary }]}>
              {reminders.filter(r => r.isActive).length} active reminders
            </Text>
          </TouchableOpacity>
          
          {showReminders && (
            <View style={styles.reminderContent}>
              <ReminderManager testId="reminder-manager" />
            </View>
          )}
        </Card>
        
        {/* AI Coach Settings */}
        <Card>
          <TouchableOpacity
            style={styles.aiCoachHeader}
            onPress={() => setShowAISettings(!showAISettings)}
          >
            <View style={styles.aiCoachTitleRow}>
              <Bot size={24} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0, marginLeft: 12 }]}>
                AI Coach Settings
              </Text>
            </View>
            <Text style={[styles.aiCoachSubtitle, { color: theme.textSecondary }]}>
              {coach.name} • {coach.personality}
            </Text>
          </TouchableOpacity>
          
          {showAISettings && (
            <View style={styles.aiSettingsContent}>
              {/* Coach Name */}
              <View style={styles.settingRow}>
                <View>
                  <Text style={[styles.settingTitle, { color: theme.text }]}>
                    Coach Name
                  </Text>
                  <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                    {coach.name}
                  </Text>
                </View>
              </View>
              
              {/* Voice Enabled */}
              <View style={styles.settingRow}>
                <View>
                  <Text style={[styles.settingTitle, { color: theme.text }]}>
                    AI Voice Responses
                  </Text>
                  <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                    Let your AI coach speak responses
                  </Text>
                </View>
                <Switch
                  value={coach.voiceEnabled}
                  onValueChange={(value) => updateCoach({ voiceEnabled: value })}
                  trackColor={{ false: '#767577', true: theme.primary }}
                  thumbColor="#f4f3f4"
                />
              </View>
              
              {/* AI Capabilities */}
              <Text style={[styles.capabilitiesTitle, { color: theme.text }]}>
                AI Capabilities
              </Text>
              
              <View style={styles.settingRow}>
                <View style={styles.capabilityRow}>
                  <Globe size={20} color={theme.primary} />
                  <View style={styles.capabilityText}>
                    <Text style={[styles.settingTitle, { color: theme.text }]}>
                      Internet Access
                    </Text>
                    <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                      Access real-time information
                    </Text>
                  </View>
                </View>
                <Switch
                  value={capabilities.internetAccess}
                  onValueChange={() => toggleCapability('internetAccess')}
                  trackColor={{ false: '#767577', true: theme.primary }}
                  thumbColor="#f4f3f4"
                />
              </View>
              
              <View style={styles.settingRow}>
                <View style={styles.capabilityRow}>
                  <MessageSquare size={20} color={theme.primary} />
                  <View style={styles.capabilityText}>
                    <Text style={[styles.settingTitle, { color: theme.text }]}>
                      Social Media Access
                    </Text>
                    <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                      Reference current trends and discussions
                    </Text>
                  </View>
                </View>
                <Switch
                  value={capabilities.socialMediaAccess}
                  onValueChange={() => toggleCapability('socialMediaAccess')}
                  trackColor={{ false: '#767577', true: theme.primary }}
                  thumbColor="#f4f3f4"
                />
              </View>
              
              <View style={styles.settingRow}>
                <View style={styles.capabilityRow}>
                  <Zap size={20} color={theme.primary} />
                  <View style={styles.capabilityText}>
                    <Text style={[styles.settingTitle, { color: theme.text }]}>
                      Real-Time Data
                    </Text>
                    <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                      Access live data and current events
                    </Text>
                  </View>
                </View>
                <Switch
                  value={capabilities.realTimeData}
                  onValueChange={() => toggleCapability('realTimeData')}
                  trackColor={{ false: '#767577', true: theme.primary }}
                  thumbColor="#f4f3f4"
                />
              </View>
            </View>
          )}
        </Card>
        
        {/* Open Source Code */}
        <Card>
          <TouchableOpacity
            style={styles.aiCoachHeader}
            onPress={() => setShowSourceCode(!showSourceCode)}
          >
            <View style={styles.aiCoachTitleRow}>
              <Code size={24} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0, marginLeft: 12 }]}>
                Open Source Code
              </Text>
            </View>
            <Text style={[styles.aiCoachSubtitle, { color: theme.textSecondary }]}>
              View and download the complete source code
            </Text>
          </TouchableOpacity>
          
          {showSourceCode && (
            <View style={styles.sourceCodeContent}>
              <SourceCodeViewer testId="source-code-viewer" />
            </View>
          )}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8
  },
  logoutText: {
    marginLeft: 8,
    fontWeight: '500'
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16
  },
  profileCard: {
    marginBottom: 16
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  profileInfo: {
    flex: 1
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4
  },
  profileUsername: {
    fontSize: 14
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  themeOption: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 2,
    padding: 12,
    marginBottom: 8
  },
  themePreview: {
    height: 32,
    borderRadius: 8,
    marginBottom: 8
  },
  themeName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center'
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  settingDescription: {
    fontSize: 14
  },
  voiceModeSection: {
    marginTop: 16
  },
  voiceModeButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8
  },
  voiceModeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center'
  },
  voiceModeText: {
    fontSize: 14,
    fontWeight: '500'
  },
  customVoiceSection: {
    marginTop: 12
  },
  customVoiceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8
  },
  customVoiceName: {
    fontSize: 14,
    fontWeight: '500'
  },
  aiCoachHeader: {
    marginBottom: 16
  },
  aiCoachTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  aiCoachSubtitle: {
    fontSize: 14,
    marginLeft: 36
  },
  aiSettingsContent: {
    marginTop: 16
  },
  capabilitiesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12
  },
  capabilityRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  capabilityText: {
    marginLeft: 12,
    flex: 1
  },
  reminderContent: {
    marginTop: 16,
    marginHorizontal: -20,
    marginBottom: -20
  },
  sourceCodeContent: {
    marginTop: 16,
    marginHorizontal: -20,
    marginBottom: -20,
    height: 600
  },
  anunaVoiceContent: {
    marginTop: 16
  },
  voiceUploadSection: {
    marginBottom: 16
  },
  voiceInstructions: {
    fontSize: 16,
    fontWeight: '600'
  },
  voiceStep: {
    fontSize: 14,
    lineHeight: 20
  },
  voiceTestSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 16
  }
});

