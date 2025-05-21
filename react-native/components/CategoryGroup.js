import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp, Play, Pause, RotateCcw } from 'lucide-react-native';
import TimerItem from './TimerItem';
import { updateTimer } from '../utils/storage';

const CategoryGroup = ({ category, timers, onTimerComplete, onDataChange }) => {
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const startAllTimers = async () => {
    try {
      for (const timer of timers) {
        if (timer.status !== 'completed') {
          const updatedTimer = {
            ...timer,
            status: 'running',
          };
          await updateTimer(updatedTimer);
        }
      }
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error('Error starting all timers:', error);
    }
  };

  const pauseAllTimers = async () => {
    try {
      for (const timer of timers) {
        if (timer.status === 'running') {
          const updatedTimer = {
            ...timer,
            status: 'paused',
          };
          await updateTimer(updatedTimer);
        }
      }
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error('Error pausing all timers:', error);
    }
  };

  const resetAllTimers = async () => {
    try {
      for (const timer of timers) {
        const updatedTimer = {
          ...timer,
          remaining: timer.duration,
          status: 'idle',
        };
        await updateTimer(updatedTimer);
      }
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error('Error resetting all timers:', error);
    }
  };

  // Get counts for stats
  const activeTimers = timers.filter(t => t.status === 'running').length;
  const completedTimers = timers.filter(t => t.status === 'completed').length;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleExpanded} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.categoryTitle}>{category}</Text>
          <View style={styles.categoryStats}>
            <Text style={styles.statsText}>
              {timers.length} timer{timers.length !== 1 ? 's' : ''} • {activeTimers} active • {completedTimers} completed
            </Text>
          </View>
        </View>
        {expanded ? (
          <ChevronUp color="#64748B" size={20} />
        ) : (
          <ChevronDown color="#64748B" size={20} />
        )}
      </TouchableOpacity>

      {expanded && (
        <>
          <View style={styles.bulkControls}>
            <TouchableOpacity style={[styles.bulkButton, styles.startAllButton]} onPress={startAllTimers}>
              <Play color="#FFFFFF" size={16} />
              <Text style={styles.bulkButtonText}>Start All</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.bulkButton, styles.pauseAllButton]} onPress={pauseAllTimers}>
              <Pause color="#FFFFFF" size={16} />
              <Text style={styles.bulkButtonText}>Pause All</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.bulkButton, styles.resetAllButton]} onPress={resetAllTimers}>
              <RotateCcw color="#FFFFFF" size={16} />
              <Text style={styles.bulkButtonText}>Reset All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timersList}>
            {timers.map((timer) => (
              <TimerItem
                key={timer.id}
                timer={timer}
                onComplete={onTimerComplete}
                onUpdate={onDataChange}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F1F5F9',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  categoryStats: {
    marginTop: 4,
  },
  statsText: {
    fontSize: 13,
    color: '#64748B',
  },
  bulkControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  bulkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  startAllButton: {
    backgroundColor: '#22C55E', // green
  },
  pauseAllButton: {
    backgroundColor: '#FACC15', // yellow
  },
  resetAllButton: {
    backgroundColor: '#EF4444', // red
  },
  bulkButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 6,
  },
  timersList: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
});


export default CategoryGroup;