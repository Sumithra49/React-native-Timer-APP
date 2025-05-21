import AsyncStorage from '@react-native-async-storage/async-storage';

const TIMERS_STORAGE_KEY = '@timers';
const HISTORY_STORAGE_KEY = '@timer_history';

// Load all timers
export const loadTimers = async () => {
  try {
    const timersJson = await AsyncStorage.getItem(TIMERS_STORAGE_KEY);
    return timersJson ? JSON.parse(timersJson) : {};
  } catch (error) {
    console.error('Error loading timers:', error);
    return {};
  }
};

// Save a new timer
export const saveTimer = async (timer) => {
  try {
    const timers = await loadTimers();
    
    // Add new timer with its ID as the key
    timers[timer.id] = timer;
    
    await AsyncStorage.setItem(TIMERS_STORAGE_KEY, JSON.stringify(timers));
    return true;
  } catch (error) {
    console.error('Error saving timer:', error);
    return false;
  }
};

// Update an existing timer
export const updateTimer = async (timer) => {
  try {
    const timers = await loadTimers();
    
    // Update the timer
    timers[timer.id] = timer;
    
    await AsyncStorage.setItem(TIMERS_STORAGE_KEY, JSON.stringify(timers));
    return true;
  } catch (error) {
    console.error('Error updating timer:', error);
    return false;
  }
};

// Delete a timer
export const deleteTimer = async (timerId) => {
  try {
    const timers = await loadTimers();
    
    // Delete the timer
    delete timers[timerId];
    
    await AsyncStorage.setItem(TIMERS_STORAGE_KEY, JSON.stringify(timers));
    return true;
  } catch (error) {
    console.error('Error deleting timer:', error);
    return false;
  }
};

// Get timer history
export const getHistory = async () => {
  try {
    const historyJson = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Error loading timer history:', error);
    return [];
  }
};

// Add a completed timer to history
export const addToHistory = async (completedTimer) => {
  try {
    const history = await getHistory();
    
    // Add completed timer to history
    history.push(completedTimer);
    
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Error adding timer to history:', error);
    return false;
  }
};

// Clear all history
export const clearHistory = async () => {
  try {
    await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing timer history:', error);
    return false;
  }
};