import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { 
  Calendar, 
  AlertTriangle, 
  Shield, 
  Trash2, 
  Edit3, 
  MessageCircle,
  TrendingUp,
  Clock
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { useTheme } from '@/hooks/useTheme';
import { useAddictions } from '@/hooks/useAddictions';
import { useAICoach } from '@/hooks/useAICoach';
import { Addiction } from '@/types';

interface AddictionItemProps {
  addiction: Addiction;
  onEdit: (addiction: Addiction) => void;
}

export function AddictionItem({ addiction, onEdit }: AddictionItemProps) {
  const { theme } = useTheme();
  const { deleteAddiction, incrementSoberDay, recordRelapse } = useAddictions();
  const { coach, getMotivationalMessage, getEmergencySupport, speakResponse } = useAICoach();
  const [isGettingSupport, setIsGettingSupport] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#22c55e';
      case 'moderate': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return theme.primary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'substance': return '💊';
      case 'behavioral': return '🔄';
      case 'digital': return '📱';
      default: return '⚠️';
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Addiction',
      `Are you sure you want to delete "${addiction.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteAddiction(addiction.id)
        }
      ]
    );
  };

  const handleIncrementDay = () => {
    incrementSoberDay(addiction.id);
    const message = getMotivationalMessage(addiction.daysSober + 1, addiction.name);
    speakResponse(message);
  };

  const handleRelapse = () => {
    Alert.alert(
      'Record Relapse',
      'It\'s okay - recovery is a journey with ups and downs. Recording this helps track your progress.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Record', 
          onPress: () => recordRelapse(addiction.id)
        }
      ]
    );
  };

  const handleEmergencySupport = async () => {
    setIsGettingSupport(true);
    try {
      const support = await getEmergencySupport(addiction.name);
      Alert.alert(
        `${coach.name} says:`,
        support,
        [{ text: 'Thank you', onPress: () => speakResponse(support) }]
      );
    } catch {
      Alert.alert('Support', 'Take a deep breath. You are stronger than this craving. It will pass.');
    } finally {
      setIsGettingSupport(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.emoji}>{getTypeIcon(addiction.type)}</Text>
          <View style={styles.titleContainer}>
            <Text style={[styles.name, { color: theme.text }]}>
              {addiction.name}
            </Text>
            <View style={styles.metaRow}>
              <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(addiction.severity) }]}>
                <Text style={styles.severityText}>{addiction.severity}</Text>
              </View>
              <Text style={[styles.type, { color: theme.textSecondary }]}>
                {addiction.type}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actions}>
          <IconButton
            icon={<Edit3 size={16} color={theme.primary} />}
            onPress={() => onEdit(addiction)}
            variant="outline"
            size='small'
          />
          <IconButton
            icon={<Trash2 size={16} color='#ef4444' />}
            onPress={handleDelete}
            variant="outline"
            size='small'
          />
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Calendar size={20} color={theme.primary} />
          <Text style={[styles.statValue, { color: theme.text }]}>
            {addiction.daysSober}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            days sober
          </Text>
        </View>

        {addiction.lastRelapse && (
          <View style={styles.statItem}>
            <Clock size={20} color={theme.textSecondary} />
            <Text style={[styles.statValue, { color: theme.text }]}>
              {formatDate(addiction.lastRelapse)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              last relapse
            </Text>
          </View>
        )}
      </View>

      {addiction.notes && (
        <View style={[styles.notesContainer, { backgroundColor: theme.background }]}>
          <Text style={[styles.notes, { color: theme.textSecondary }]}>
            {addiction.notes}
          </Text>
        </View>
      )}

      <View style={styles.triggersContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Triggers</Text>
        <View style={styles.tagContainer}>
          {addiction.triggers.slice(0, 3).map((trigger, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: '#ef4444', opacity: 0.1 }]}>
              <AlertTriangle size={12} color='#ef4444' />
              <Text style={[styles.tagText, { color: '#ef4444' }]}>{trigger}</Text>
            </View>
          ))}
          {addiction.triggers.length > 3 && (
            <Text style={[styles.moreText, { color: theme.textSecondary }]}>
              +{addiction.triggers.length - 3} more
            </Text>
          )}
        </View>
      </View>

      <View style={styles.strategiesContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Coping Strategies</Text>
        <View style={styles.tagContainer}>
          {addiction.copingStrategies.slice(0, 3).map((strategy, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: '#22c55e', opacity: 0.1 }]}>
              <Shield size={12} color='#22c55e' />
              <Text style={[styles.tagText, { color: '#22c55e' }]}>{strategy}</Text>
            </View>
          ))}
          {addiction.copingStrategies.length > 3 && (
            <Text style={[styles.moreText, { color: theme.textSecondary }]}>
              +{addiction.copingStrategies.length - 3} more
            </Text>
          )}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.emergencyButton]}
          onPress={handleEmergencySupport}
          disabled={isGettingSupport}
        >
          <MessageCircle size={16} color='white' />
          <Text style={styles.buttonText}>
            {isGettingSupport ? 'Getting Support...' : 'Need Support'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.incrementButton]}
          onPress={handleIncrementDay}
        >
          <TrendingUp size={16} color='white' />
          <Text style={styles.buttonText}>+1 Day</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.relapseButton]}
          onPress={handleRelapse}
        >
          <Text style={[styles.buttonText, { color: '#ef4444' }]}>Relapse</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 12
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1
  },
  emoji: {
    fontSize: 24,
    marginRight: 12
  },
  titleContainer: {
    flex: 1
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12
  },
  severityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize'
  },
  type: {
    fontSize: 12,
    textTransform: 'capitalize'
  },
  actions: {
    flexDirection: 'row',
    gap: 4
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16
  },
  statItem: {
    alignItems: 'center',
    gap: 4
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  statLabel: {
    fontSize: 12
  },
  notesContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },
  notes: {
    fontSize: 14,
    fontStyle: 'italic'
  },
  triggersContainer: {
    marginBottom: 16
  },
  strategiesContainer: {
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center'
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500'
  },
  moreText: {
    fontSize: 12,
    fontStyle: 'italic'
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6
  },
  emergencyButton: {
    backgroundColor: '#ef4444'
  },
  incrementButton: {
    backgroundColor: '#22c55e'
  },
  relapseButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ef4444'
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  }
});