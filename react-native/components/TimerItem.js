import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Play, Pause, RotateCcw } from 'lucide-react-native';
import { formatTimeDisplay } from '../utils/helpers';
import { updateTimer, addToHistory } from '../utils/storage';
import ProgressBar from './ProgressBar';

const TimerItem = ({ timer, onComplete, onUpdate }) => {
  const [timerState, setTimerState] = useState(timer);
  const intervalRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setTimerState(timer);
  }, [timer]);

  useEffect(() => {
    if (timerState.status === 'running') {
      startCountdown();
    } else {
      stopCountdown();
    }

    return () => stopCountdown();
  }, [timerState.status]);

  useEffect(() => {
    if (timerState.status === 'running') {
      const pulseAnimation = Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]);

      Animated.loop(pulseAnimation).start();
    } else {
      pulseAnim.setValue(1);
      Animated.timing(pulseAnim).stop();
    }
  }, [timerState.status, pulseAnim]);

  const startCountdown = () => {
    if (intervalRef.current !== null) return;

    intervalRef.current = setInterval(async () => {
      setTimerState((prev) => {
        if (prev.remaining <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;

          const completedTimer = {
            ...prev,
            remaining: 0,
            status: 'completed',
          };

          updateTimer(completedTimer);
          
          addToHistory({
            id: prev.id,
            name: prev.name,
            category: prev.category,
            duration: prev.duration,
            completedAt: new Date().toISOString(),
          });

          if (onComplete) {
            onComplete(completedTimer);
          }
          
          if (onUpdate) {
            onUpdate();
          }

          return completedTimer;
        }

        const updatedTimer = {
          ...prev,
          remaining: prev.remaining - 1,
        };

        if (prev.remaining % 5 === 0) {
          updateTimer(updatedTimer);
        }

        return updatedTimer;
      });
    }, 1000);
  };

  const stopCountdown = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleStart = async () => {
    const updatedTimer = {
      ...timerState,
      status: 'running',
    };
    setTimerState(updatedTimer);
    await updateTimer(updatedTimer);
    if (onUpdate) onUpdate();
  };

  const handlePause = async () => {
    const updatedTimer = {
      ...timerState,
      status: 'paused',
    };
    setTimerState(updatedTimer);
    await updateTimer(updatedTimer);
    if (onUpdate) onUpdate();
  };

  const handleReset = async () => {
    const updatedTimer = {
      ...timerState,
      remaining: timerState.duration,
      status: 'idle',
    };
    setTimerState(updatedTimer);
    await updateTimer(updatedTimer);
    if (onUpdate) onUpdate();
  };

  const progress = timerState.duration > 0 
    ? (timerState.duration - timerState.remaining) / timerState.duration 
    : 0;

  let statusColor = '#94A3B8';
  if (timerState.status === 'running') statusColor = '#3B82F6';
  else if (timerState.status === 'paused') statusColor = '#F97316';
  else if (timerState.status === 'completed') statusColor = '#10B981';

  return (
    <Animated.View 
      style={[
        styles.container, 
        { transform: [{ scale: timerState.status === 'running' ? pulseAnim : 1 }] }
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{timerState.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>
            {timerState.status === 'idle' ? 'Ready' 
             : timerState.status === 'running' ? 'Running' 
             : timerState.status === 'paused' ? 'Paused' 
             : 'Completed'}
          </Text>
        </View>
      </View>

      <Text style={styles.timeDisplay}>
        {formatTimeDisplay(timerState.remaining)}
      </Text>

      <ProgressBar 
        progress={progress} 
        status={timerState.status}
        isHalfway={timerState.remaining <= timerState.duration / 2 && timerState.remaining > 0}
      />

      <View style={styles.controls}>
        {timerState.status !== 'completed' && (
          <>
            {(timerState.status === 'idle' || timerState.status === 'paused') && (
              <TouchableOpacity 
                style={[styles.button, styles.startButton]} 
                onPress={handleStart}
              >
                <Play color="#FFFFFF" size={18} />
                <Text style={styles.buttonText}>Start</Text>
              </TouchableOpacity>
            )}

            {timerState.status === 'running' && (
              <TouchableOpacity 
                style={[styles.button, styles.pauseButton]} 
                onPress={handlePause}
              >
                <Pause color="#FFFFFF" size={18} />
                <Text style={styles.buttonText}>Pause</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.button, styles.resetButton]} 
              onPress={handleReset}
            >
              <RotateCcw color="#FFFFFF" size={18} />
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </>
        )}

        {timerState.status === 'completed' && (
          <TouchableOpacity 
            style={[styles.button, styles.resetButton]} 
            onPress={handleReset}
          >
            <Text style={styles.buttonText}>Start Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.05)',
    style: {
      pointerEvents: 'auto'
    }
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  timeDisplay: {
    fontSize: 28,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
    marginVertical: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  startButton: {
    backgroundColor: '#3B82F6',
  },
  pauseButton: {
    backgroundColor: '#F97316',
  },
  resetButton: {
    backgroundColor: '#64748B',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default TimerItem;