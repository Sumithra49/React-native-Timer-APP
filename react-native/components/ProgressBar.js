import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const ProgressBar = ({ progress, status, isHalfway }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, widthAnim]);

  useEffect(() => {
    if (isHalfway && status === 'running') {
      const pulseSequence = Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]);
      
      Animated.loop(
        pulseSequence,
        { iterations: 3 }
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isHalfway, status, pulseAnim]);

  // Determine bar color based on status and progress
  let barColor = '#3B82F6'; // default blue
  
  if (status === 'completed') {
    barColor = '#10B981'; // green
  } else if (status === 'paused') {
    barColor = '#F97316'; // orange
  } else if (isHalfway) {
    barColor = '#FBBF24'; // yellow for halfway alert
  }

  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const animatedScale = pulseAnim.interpolate({
    inputRange: [1, 1.1],
    outputRange: [1, 1.1],
  });

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <Animated.View 
          style={[
            styles.fill, 
            { 
              width: animatedWidth, 
              backgroundColor: barColor,
              transform: [{ scaleX: animatedScale }, { scaleY: animatedScale }]
            }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    height: 16,
  },
  background: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 4,
  },
});

export default ProgressBar;