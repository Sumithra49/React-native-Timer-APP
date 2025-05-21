import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { loadTimers } from '../../utils/storage';
import CategoryGroup from '../../components/CategoryGroup';
import CompletionModal from '../../components/CompletionModal';

export default function HomeScreen() {
  const [timers, setTimers] = useState({});
  const [categories, setCategories] = useState([]);
  const [completedTimer, setCompletedTimer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    loadTimerData();
  }, []);

  const loadTimerData = async () => {
    try {
      const loadedTimers = await loadTimers();
      if (loadedTimers) {
        setTimers(loadedTimers);

        const uniqueCategories = Object.values(loadedTimers).reduce((cats, timer) => {
          if (!cats.includes(timer.category)) {
            cats.push(timer.category);
          }
          return cats;
        }, []);

        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error loading timers:', error);
    }
  };

  const handleTimerComplete = (timer) => {
    setCompletedTimer(timer);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setCompletedTimer(null);
    loadTimerData();
  };

  const getTimersForCategory = (category) => {
    return Object.entries(timers)
      .filter(([_, timer]) => timer.category === category)
      .map(([id, timer]) => ({ id, ...timer }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {categories.length > 0 ? (
          categories.map((category) => (
            <View key={category} style={styles.categoryWrapper}>
              <CategoryGroup
                category={category}
                timers={getTimersForCategory(category)}
                onTimerComplete={handleTimerComplete}
                onDataChange={loadTimerData}
              />
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No timers yet</Text>
            <Text style={styles.emptySubText}>
              Create a new timer by tapping the + tab below
            </Text>
          </View>
        )}
      </ScrollView>

      <CompletionModal
        visible={isModalVisible}
        timer={completedTimer}
        onClose={closeModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    alignItems: 'center', // Center all child elements
  },
  categoryWrapper: {
    width: '100%',
    maxWidth: 900,
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: '80%',
  },
});
