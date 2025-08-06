import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

type ReminderType = 'habit' | 'meal' | 'supplement' | 'addiction' | 'custom';

dayjs.extend(isSameOrBefore);

interface Reminder {
  id: string;
  type: ReminderType;
  title: string;
  message: string;
  scheduledTime: string; // ISO time string (HH:mm)
  scheduledDate?: string; // ISO date string (YYYY-MM-DD), for one-time reminders
  isRecurring: boolean;
  recurringDays: number[]; // 0-6 (Sunday-Saturday) for recurring reminders
  isActive: boolean;
  lastCompleted?: string; // ISO date string
}

interface ReminderContextType {
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id' | 'lastCompleted'>) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  completeReminder: (id: string) => void;
  getRemindersByType: (type: ReminderType) => Reminder[];
  getActiveReminders: () => Reminder[];
}

const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export const ReminderProvider = ({ children }: { children: ReactNode }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const addReminder = (reminder: Omit<Reminder, 'id' | 'lastCompleted'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(),
    };
    setReminders(prev => [...prev, newReminder]);
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id ? { ...reminder, ...updates } : reminder
      )
    );
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const completeReminder = (id: string) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id
          ? { ...reminder, lastCompleted: new Date().toISOString() }
          : reminder
      )
    );
  };

  const getRemindersByType = (type: ReminderType) => {
    return reminders.filter(reminder => reminder.type === type);
  };

  const getActiveReminders = () => {
    return reminders.filter(reminder => reminder.isActive);
  };

  useEffect(() => {
    // Load reminders from storage or set initial reminders if needed
    const initialReminders: Reminder[] = [];
    setReminders(initialReminders);
  }, []);

  return (
    <ReminderContext.Provider
      value={{
        reminders,
        addReminder,
        updateReminder,
        deleteReminder,
        completeReminder,
        getRemindersByType,
        getActiveReminders,
      }}
    >
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminders = () => {
  const context = useContext(ReminderContext);
  if (context === undefined) {
    throw new Error('useReminders must be used within a ReminderProvider');
  }
  return context;
};
