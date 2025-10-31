import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView
} from 'react-native';

const ResidentDashboardScreen = ({ onLogout }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Resident Dashboard</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Cards */}
        <View style={styles.cardsContainer}>
          <TouchableOpacity style={[styles.card, styles.cardRed]}>
            <Text style={styles.cardIcon}>🆘</Text>
            <Text style={styles.cardTitle}>Request Help</Text>
            <Text style={styles.cardSubtitle}>Report an emergency</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, styles.cardBlue]}>
            <Text style={styles.cardIcon}>📋</Text>
            <Text style={styles.cardTitle}>My Reports</Text>
            <Text style={styles.cardSubtitle}>View your submissions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, styles.cardYellow]}>
            <Text style={styles.cardIcon}>🔔</Text>
            <Text style={styles.cardTitle}>View Alerts</Text>
            <Text style={styles.cardSubtitle}>Check announcements</Text>
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Welcome to DREAM!</Text>
          <Text style={styles.infoText}>
            You can now report emergencies, view your submissions, and receive real-time alerts from Barangay San Isidro Labrador I.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ef4444',
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  cardsContainer: {
    marginBottom: 30,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardRed: {
    backgroundColor: '#fee2e2',
  },
  cardBlue: {
    backgroundColor: '#dbeafe',
  },
  cardYellow: {
    backgroundColor: '#fef3c7',
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoBox: {
    backgroundColor: '#d1fae5',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
});

export default ResidentDashboardScreen;
