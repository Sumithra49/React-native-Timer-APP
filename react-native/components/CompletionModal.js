import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Animated,
  Dimensions
} from 'react-native';
import { CircleCheck as CheckCircle2 } from 'lucide-react-native';
import { formatTimeDisplay } from '../utils/helpers';

const CompletionModal = ({ visible, timer, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      
      // Start new animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  if (!timer) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.modalContent,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <CheckCircle2 color="#10B981" size={64} />
          </View>
          
          <Text style={styles.congratsText}>Timer Completed!</Text>
          
          <View style={styles.timerInfoContainer}>
            <Text style={styles.timerName}>{timer.name}</Text>
            <Text style={styles.timerCategory}>{timer.category}</Text>
            <Text style={styles.timerDuration}>
              Duration: {formatTimeDisplay(timer.duration)}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: width * 0.85,
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  congratsText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 16,
  },
  timerInfoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  timerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  timerCategory: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  timerDuration: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
  },
  closeButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CompletionModal;