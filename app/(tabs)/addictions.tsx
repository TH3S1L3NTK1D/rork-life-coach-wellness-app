import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Plus, Brain, Mic, X, Save } from 'lucide-react-native';
import { StatusBar } from '@/components/ui/StatusBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { AddictionItem } from '@/components/addictions/AddictionItem';
import { useTheme } from '@/hooks/useTheme';
import { useAddictions } from '@/hooks/useAddictions';
import { useAICoach } from '@/hooks/useAICoach';
import { Addiction } from '@/types';

export default function AddictionsScreen() {
  const { theme } = useTheme();
  const { addictions, isLoading, addAddiction, updateAddiction, getTotalSoberDays, getLongestStreak } = useAddictions();
  const { coach, askCoach, speakResponse, isResponding } = useAICoach();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [editingAddiction, setEditingAddiction] = useState<Addiction | null>(null);
  const [coachQuestion, setCoachQuestion] = useState('');
  const [coachResponse, setCoachResponse] = useState('');
  
  const [newAddiction, setNewAddiction] = useState<{
    name: string;
    type: 'substance' | 'behavioral' | 'digital' | 'other';
    severity: 'low' | 'moderate' | 'high';
    daysSober: number;
    triggers: string[];
    copingStrategies: string[];
    notes: string;
    isActive: boolean;
  }>({
    name: '',
    type: 'substance',
    severity: 'moderate',
    daysSober: 0,
    triggers: [],
    copingStrategies: [],
    notes: '',
    isActive: true
  });

  const [currentTrigger, setCurrentTrigger] = useState('');
  const [currentStrategy, setCurrentStrategy] = useState('');

  const resetForm = () => {
    setNewAddiction({
      name: '',
      type: 'substance',
      severity: 'moderate',
      daysSober: 0,
      triggers: [],
      copingStrategies: [],
      notes: '',
      isActive: true
    });
    setCurrentTrigger('');
    setCurrentStrategy('');
    setEditingAddiction(null);
  };

  const handleSave = async () => {
    if (!newAddiction.name.trim()) {
      Alert.alert('Error', 'Please enter an addiction name');
      return;
    }

    try {
      if (editingAddiction) {
        await updateAddiction(editingAddiction.id, newAddiction);
      } else {
        await addAddiction(newAddiction);
      }
      setShowAddModal(false);
      resetForm();
    } catch {
      Alert.alert('Error', 'Failed to save addiction');
    }
  };

  const handleEdit = (addiction: Addiction) => {
    setEditingAddiction(addiction);
    setNewAddiction({
      name: addiction.name,
      type: addiction.type,
      severity: addiction.severity,
      daysSober: addiction.daysSober,
      triggers: addiction.triggers,
      copingStrategies: addiction.copingStrategies,
      notes: addiction.notes || '',
      isActive: addiction.isActive
    });
    setShowAddModal(true);
  };

  const addTrigger = () => {
    if (currentTrigger.trim() && !newAddiction.triggers.includes(currentTrigger.trim())) {
      setNewAddiction(prev => ({
        ...prev,
        triggers: [...prev.triggers, currentTrigger.trim()]
      }));
      setCurrentTrigger('');
    }
  };

  const removeTrigger = (trigger: string) => {
    setNewAddiction(prev => ({
      ...prev,
      triggers: prev.triggers.filter(t => t !== trigger)
    }));
  };

  const addStrategy = () => {
    if (currentStrategy.trim() && !newAddiction.copingStrategies.includes(currentStrategy.trim())) {
      setNewAddiction(prev => ({
        ...prev,
        copingStrategies: [...prev.copingStrategies, currentStrategy.trim()]
      }));
      setCurrentStrategy('');
    }
  };

  const removeStrategy = (strategy: string) => {
    setNewAddiction(prev => ({
      ...prev,
      copingStrategies: prev.copingStrategies.filter(s => s !== strategy)
    }));
  };

  const handleAskCoach = async () => {
    if (!coachQuestion.trim()) return;

    try {
      const response = await askCoach(coachQuestion, 'User is asking for addiction recovery support');
      setCoachResponse(response);
      speakResponse(response);
    } catch {
      setCoachResponse('I\'m here to support you. Remember, recovery is a journey, and every step forward matters.');
    }
  };

  const activeAddictions = addictions.filter(a => a.isActive);
  const totalSoberDays = getTotalSoberDays();
  const longestStreak = getLongestStreak();
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar time={currentTime} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.text }]}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar time={currentTime} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Stats */}
        <Card gradient style={styles.headerCard}>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: 'white' }]}>
              Recovery Journey
            </Text>
            <Text style={[styles.headerSubtitle, { color: 'rgba(255, 255, 255, 0.8)' }]}>
              Every day is a victory
            </Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: 'white' }]}>{totalSoberDays}</Text>
              <Text style={[styles.statLabel, { color: 'rgba(255, 255, 255, 0.8)' }]}>
                Total Sober Days
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: 'white' }]}>{longestStreak}</Text>
              <Text style={[styles.statLabel, { color: 'rgba(255, 255, 255, 0.8)' }]}>
                Longest Streak
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: 'white' }]}>{activeAddictions.length}</Text>
              <Text style={[styles.statLabel, { color: 'rgba(255, 255, 255, 0.8)' }]}>
                Active Recovery
              </Text>
            </View>
          </View>
        </Card>

        {/* AI Coach Quick Access */}
        <Card style={styles.coachCard}>
          <View style={styles.coachHeader}>
            <View style={styles.coachInfo}>
              <Brain size={24} color={theme.primary} />
              <View>
                <Text style={[styles.coachName, { color: theme.text }]}>
                  {coach.name} - Your AI Coach
                </Text>
                <Text style={[styles.coachPersonality, { color: theme.textSecondary }]}>
                  {coach.personality} support
                </Text>
              </View>
            </View>
            
            <Button
              title="Ask Coach"
              onPress={() => setShowCoachModal(true)}
              variant="primary"
              size="small"
            />
          </View>
        </Card>

        {/* Addictions List */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Your Recovery Journey
            </Text>
            <IconButton
              icon={<Plus size={20} color="white" />}
              onPress={() => setShowAddModal(true)}
              variant="primary"
            />
          </View>
          
          {activeAddictions.length > 0 ? (
            activeAddictions.map((addiction) => (
              <AddictionItem
                key={addiction.id}
                addiction={addiction}
                onEdit={handleEdit}
              />
            ))
          ) : (
            <Card>
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyTitle, { color: theme.text }]}>
                  Start Your Recovery Journey
                </Text>
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                  Add an addiction to begin tracking your progress and get personalized support.
                </Text>
                <Button
                  title="Add First Addiction"
                  onPress={() => setShowAddModal(true)}
                  variant="primary"
                  style={styles.emptyButton}
                />
              </View>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Addiction Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {editingAddiction ? 'Edit Addiction' : 'Add Addiction'}
            </Text>
            <IconButton
              icon={<X size={24} color={theme.text} />}
              onPress={() => {
                setShowAddModal(false);
                resetForm();
              }}
              variant="outline"
            />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Name *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.card, 
                  color: theme.text,
                  borderColor: theme.border 
                }]}
                value={newAddiction.name}
                onChangeText={(text) => setNewAddiction(prev => ({ ...prev, name: text }))}
                placeholder="e.g., Smoking, Social Media, Alcohol"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.label, { color: theme.text }]}>Type</Text>
                <View style={styles.segmentedControl}>
                  {(['substance', 'behavioral', 'digital', 'other'] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.segmentButton,
                        newAddiction.type === type && { backgroundColor: theme.primary }
                      ]}
                      onPress={() => setNewAddiction(prev => ({ ...prev, type }))}
                    >
                      <Text style={[
                        styles.segmentText,
                        { color: newAddiction.type === type ? 'white' : theme.textSecondary }
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.label, { color: theme.text }]}>Severity</Text>
                <View style={styles.segmentedControl}>
                  {(['low', 'moderate', 'high'] as const).map((severity) => (
                    <TouchableOpacity
                      key={severity}
                      style={[
                        styles.segmentButton,
                        newAddiction.severity === severity && { backgroundColor: theme.primary }
                      ]}
                      onPress={() => setNewAddiction(prev => ({ ...prev, severity }))}
                    >
                      <Text style={[
                        styles.segmentText,
                        { color: newAddiction.severity === severity ? 'white' : theme.textSecondary }
                      ]}>
                        {severity}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Days Sober</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.card, 
                  color: theme.text,
                  borderColor: theme.border 
                }]}
                value={newAddiction.daysSober.toString()}
                onChangeText={(text) => setNewAddiction(prev => ({ 
                  ...prev, 
                  daysSober: parseInt(text) || 0 
                }))}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Triggers</Text>
              <View style={styles.tagInputContainer}>
                <TextInput
                  style={[styles.tagInput, { 
                    backgroundColor: theme.card, 
                    color: theme.text,
                    borderColor: theme.border 
                  }]}
                  value={currentTrigger}
                  onChangeText={setCurrentTrigger}
                  placeholder="Add a trigger"
                  placeholderTextColor={theme.textSecondary}
                  onSubmitEditing={addTrigger}
                />
                <Button title="Add" onPress={addTrigger} size="small" />
              </View>
              <View style={styles.tagContainer}>
                {newAddiction.triggers.map((trigger, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.tag, { backgroundColor: '#ef4444', opacity: 0.1 }]}
                    onPress={() => removeTrigger(trigger)}
                  >
                    <Text style={[styles.tagText, { color: '#ef4444' }]}>{trigger}</Text>
                    <X size={12} color="#ef4444" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Coping Strategies</Text>
              <View style={styles.tagInputContainer}>
                <TextInput
                  style={[styles.tagInput, { 
                    backgroundColor: theme.card, 
                    color: theme.text,
                    borderColor: theme.border 
                  }]}
                  value={currentStrategy}
                  onChangeText={setCurrentStrategy}
                  placeholder="Add a coping strategy"
                  placeholderTextColor={theme.textSecondary}
                  onSubmitEditing={addStrategy}
                />
                <Button title="Add" onPress={addStrategy} size="small" />
              </View>
              <View style={styles.tagContainer}>
                {newAddiction.copingStrategies.map((strategy, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.tag, { backgroundColor: '#22c55e', opacity: 0.1 }]}
                    onPress={() => removeStrategy(strategy)}
                  >
                    <Text style={[styles.tagText, { color: '#22c55e' }]}>{strategy}</Text>
                    <X size={12} color="#22c55e" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Notes</Text>
              <TextInput
                style={[styles.textArea, { 
                  backgroundColor: theme.card, 
                  color: theme.text,
                  borderColor: theme.border 
                }]}
                value={newAddiction.notes}
                onChangeText={(text) => setNewAddiction(prev => ({ ...prev, notes: text }))}
                placeholder="Additional notes about your recovery journey..."
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={4}
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title="Cancel"
              onPress={() => {
                setShowAddModal(false);
                resetForm();
              }}
              variant="secondary"
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button
              title={editingAddiction ? "Update" : "Save"}
              onPress={handleSave}
              variant="primary"
              style={{ flex: 1, marginLeft: 8 }}
              icon={<Save size={16} color="white" />}
            />
          </View>
        </View>
      </Modal>

      {/* AI Coach Modal */}
      <Modal
        visible={showCoachModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Ask {coach.name}
            </Text>
            <IconButton
              icon={<X size={24} color={theme.text} />}
              onPress={() => {
                setShowCoachModal(false);
                setCoachQuestion('');
                setCoachResponse('');
              }}
              variant="outline"
            />
          </View>

          <View style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Your Question</Text>
              <TextInput
                style={[styles.textArea, { 
                  backgroundColor: theme.card, 
                  color: theme.text,
                  borderColor: theme.border 
                }]}
                value={coachQuestion}
                onChangeText={setCoachQuestion}
                placeholder="Ask for support, advice, or motivation..."
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={4}
              />
            </View>

            <Button
              title={isResponding ? "Getting Response..." : "Ask Coach"}
              onPress={handleAskCoach}
              variant="primary"
              disabled={isResponding || !coachQuestion.trim()}
              icon={<Mic size={16} color="white" />}
            />

            {coachResponse && (
              <View style={styles.responseContainer}>
                <Text style={[styles.responseLabel, { color: theme.text }]}>
                  {coach.name} says:
                </Text>
                <View style={[styles.responseBox, { backgroundColor: theme.card }]}>
                  <Text style={[styles.responseText, { color: theme.text }]}>
                    {coachResponse}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    fontSize: 16
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: 16
  },
  headerCard: {
    padding: 20,
    marginBottom: 16
  },
  headerContent: {
    marginBottom: 20
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 16
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  statItem: {
    alignItems: 'center'
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center'
  },
  coachCard: {
    padding: 16,
    marginBottom: 16
  },
  coachHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  coachInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  coachName: {
    fontSize: 16,
    fontWeight: '600'
  },
  coachPersonality: {
    fontSize: 14,
    textTransform: 'capitalize'
  },
  sectionContainer: {
    marginBottom: 24
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600'
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20
  },
  emptyButton: {
    minWidth: 200
  },
  modalContainer: {
    flex: 1
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600'
  },
  modalContent: {
    flex: 1,
    padding: 16
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb'
  },
  formGroup: {
    marginBottom: 20
  },
  formRow: {
    flexDirection: 'row'
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top'
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center'
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize'
  },
  tagInputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500'
  },
  responseContainer: {
    marginTop: 20
  },
  responseLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8
  },
  responseBox: {
    padding: 16,
    borderRadius: 12
  },
  responseText: {
    fontSize: 14,
    lineHeight: 20
  }
});