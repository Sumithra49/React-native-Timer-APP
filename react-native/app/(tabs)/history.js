import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { getHistory } from '../../utils/storage';
import { formatTimeDisplay, formatDate } from '../../utils/helpers';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' or 'asc'

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await getHistory();
      if (historyData) {
        setHistory(historyData);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  const sortedHistory = [...history].sort((a, b) => {
    const dateA = new Date(a.completedAt);
    const dateB = new Date(b.completedAt);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  if (!history || history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No timer history yet</Text>
        <Text style={styles.emptySubText}>
          Completed timers will appear here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Completed Timers</Text>
        <TouchableOpacity onPress={toggleSortOrder} style={styles.sortButton}>
          <Text style={styles.sortButtonText}>
            Sort: {sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <View style={styles.historyItemHeader}>
              <Text style={styles.historyItemName}>{item.name}</Text>
              <View style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>{item.category}</Text>
              </View>
            </View>
            <View style={styles.historyItemDetails}>
              <Text style={styles.historyItemDuration}>
                ⏱ {formatTimeDisplay(item.duration)}
              </Text>
              <Text style={styles.historyItemDate}>
                📅 {formatDate(item.completedAt)}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  sortButton: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  sortButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
  },
  historyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  categoryTag: {
    backgroundColor: '#E0F2FE',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  categoryTagText: {
    fontSize: 12,
    color: '#0284C7',
    fontWeight: '500',
  },
  historyItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyItemDuration: {
    fontSize: 14,
    color: '#475569',
  },
  historyItemDate: {
    fontSize: 14,
    color: '#475569',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  emptySubText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
});
