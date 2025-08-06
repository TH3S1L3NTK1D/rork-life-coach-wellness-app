import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Flame, UtensilsCrossed, Pill, Volume2, Pause } from 'lucide-react-native';
import { StatusBar } from '@/components/ui/StatusBar';
import { Card } from '@/components/ui/Card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ScheduleItem } from '@/components/dashboard/ScheduleItem';
import { IconButton } from '@/components/ui/IconButton';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useAudio } from '@/hooks/useAudio';
import { useData } from '@/hooks/useData';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { audioEnabled, isPlaying, playGreeting, stopSpeech } = useAudio();
  const { habits, mealPreps, supplements } = useData();
  const [currentTime, setCurrentTime] = useState(new Date());
  const hasPlayedGreeting = useRef<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);



  const formattedTime = currentTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const formattedDate = currentTime.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  const todayItems = [
    ...mealPreps.filter(item => item.scheduledDate === currentTime.toISOString().split('T')[0]),
    ...supplements.filter(item => item.scheduledDate === currentTime.toISOString().split('T')[0])
  ].sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar time={formattedTime} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Greeting */}
        <Card gradient style={styles.headerCard}>
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.greeting, { color: 'white' }]}>
                Welcome back, {user?.name}!
              </Text>
              <Text style={[styles.date, { color: 'rgba(255, 255, 255, 0.8)' }]}>
                {formattedDate}
              </Text>
            </View>
            
            <IconButton
              icon={isPlaying 
                ? <Pause size={24} color="white" /> 
                : <Volume2 size={24} color={audioEnabled ? "white" : "rgba(255, 255, 255, 0.5)"} />
              }
              onPress={isPlaying ? stopSpeech : () => {}}
              variant="transparent"
              style={[
                styles.audioButton,
                { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
              ]}
            />
          </View>
          
          <View style={styles.statsContainer}>
            <StatsCard
              title="Habits"
              value={`${habits.filter(h => h.completed).length}/${habits.length}`}
              icon={<Flame size={20} color="white" />}
              color="#f97316"
            />
            
            <StatsCard
              title="Meals"
              value={`${mealPreps.filter(m => m.completed).length}/${mealPreps.length}`}
              icon={<UtensilsCrossed size={20} color="white" />}
              color="#22c55e"
            />
            
            <StatsCard
              title="Supplements"
              value={`${supplements.filter(s => s.completed).length}/${supplements.length}`}
              icon={<Pill size={20} color="white" />}
              color="#3b82f6"
            />
          </View>
        </Card>
        
        {/* Today's Schedule */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Today&apos;s Schedule
          </Text>
          
          {todayItems.length > 0 ? (
            todayItems.slice(0, 5).map((item, index) => (
              <ScheduleItem
                key={`${item.id}-${index}`}
                title={item.name}
                time={item.scheduledTime}
                completed={item.completed}
              />
            ))
          ) : (
            <Card>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No scheduled items for today
              </Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100
  },
  headerCard: {
    padding: 24,
    marginBottom: 28,
    borderRadius: 24
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: -0.5
  },
  date: {
    fontSize: 17,
    letterSpacing: -0.2
  },
  audioButton: {
    borderRadius: 16,
    width: 48,
    height: 48
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16
  },
  sectionContainer: {
    marginBottom: 28
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: -0.3
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    letterSpacing: -0.2
  }
});