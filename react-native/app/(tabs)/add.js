import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { saveTimer } from '../../utils/storage';
import { generateUniqueId } from '../../utils/helpers';

const CATEGORIES = ['Work', 'Study', 'Workout', 'Meditation', 'Break', 'Other'];

export default function AddTimerScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');
  const [category, setCategory] = useState('');

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a timer name');
      return;
    }

    const hoursInt = parseInt(hours) || 0;
    const minutesInt = parseInt(minutes) || 0;
    const secondsInt = parseInt(seconds) || 0;
    const totalSeconds = hoursInt * 3600 + minutesInt * 60 + secondsInt;

    if (totalSeconds <= 0) {
      Alert.alert('Error', 'Please set a valid duration');
      return;
    }

    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    const newTimer = {
      id: generateUniqueId(),
      name,
      duration: totalSeconds,
      category,
      remaining: totalSeconds,
      status: 'idle',
      createdAt: new Date().toISOString(),
    };

    try {
      await saveTimer(newTimer);
      Alert.alert('Success', 'Timer created successfully', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    } catch (error) {
      console.error('Error saving timer:', error);
      Alert.alert('Error', 'Failed to save timer');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Timer Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter timer name"
              value={name}
              onChangeText={setName}
              maxLength={30}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Duration</Text>
            <View style={styles.durationContainer}>
              <View style={styles.durationInput}>
                <TextInput
                  style={styles.timeInput}
                  placeholder="0"
                  keyboardType="number-pad"
                  value={hours}
                  onChangeText={setHours}
                  maxLength={2}
                />
                <Text style={styles.timeLabel}>hours</Text>
              </View>
              <View style={styles.durationInput}>
                <TextInput
                  style={styles.timeInput}
                  placeholder="0"
                  keyboardType="number-pad"
                  value={minutes}
                  onChangeText={setMinutes}
                  maxLength={2}
                />
                <Text style={styles.timeLabel}>minutes</Text>
              </View>
              <View style={styles.durationInput}>
                <TextInput
                  style={styles.timeInput}
                  placeholder="0"
                  keyboardType="number-pad"
                  value={seconds}
                  onChangeText={setSeconds}
                  maxLength={2}
                />
                <Text style={styles.timeLabel}>seconds</Text>
              </View>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryContainer}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.categoryButtonSelected,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      category === cat && styles.categoryButtonTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Create Timer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
    maxWidth: 400,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#334155',
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationInput: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    maxWidth: 100,
  },
  timeInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 20,
    color: '#334155',
    textAlign: 'center',
    width: '100%',
  },
  timeLabel: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
  },
  categoryButtonSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryButtonText: {
    color: '#64748B',
    fontSize: 14,
  },
  categoryButtonTextSelected: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
