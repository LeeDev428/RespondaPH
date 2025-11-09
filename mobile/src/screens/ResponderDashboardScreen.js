import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const ResponderDashboardScreen = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [emergencies, setEmergencies] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');

  useEffect(() => {
    loadUserData();
    fetchData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        console.error('No token found in storage');
        Alert.alert('Session Expired', 'Please login again');
        onLogout();
        return;
      }
      
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [emergenciesRes, announcementsRes] = await Promise.all([
        axios.get(API_ENDPOINTS.EMERGENCIES, config),
        axios.get(API_ENDPOINTS.ANNOUNCEMENTS, config)
      ]);
      
      setEmergencies(emergenciesRes.data);
      setAnnouncements(announcementsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again');
        onLogout();
      } else {
        Alert.alert('Error', error.response?.data?.message || 'Failed to fetch data');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedStatus) {
      Alert.alert('Error', 'Please select a status');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `${API_ENDPOINTS.EMERGENCIES}/${selectedEmergency._id}`,
        { status: selectedStatus, notes: updateNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Emergency status updated');
      setShowUpdateModal(false);
      setSelectedEmergency(null);
      setSelectedStatus('');
      setUpdateNotes('');
      fetchData();
    } catch (error) {
      console.error('Error updating emergency:', error);
      Alert.alert('Error', 'Failed to update emergency status');
    }
  };

  const openUpdateModal = (emergency) => {
    setSelectedEmergency(emergency);
    setSelectedStatus('');
    setUpdateNotes('');
    setShowUpdateModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FCD34D',
      dispatched: '#60A5FA',
      responding: '#A78BFA',
      resolved: '#34D399',
      cancelled: '#9CA3AF'
    };
    return colors[status] || '#9CA3AF';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#D1D5DB',
      medium: '#FCD34D',
      high: '#FBBF24',
      critical: '#EF4444'
    };
    return colors[priority] || '#D1D5DB';
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: onLogout
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Responder Dashboard</Text>
            <Text style={styles.headerSubtitle}>Welcome, {user?.name}!</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {activeView === 'dashboard' && (
          <>
            {/* Action Cards */}
            <View style={styles.cardsContainer}>
              <TouchableOpacity 
                style={[styles.card, styles.cardRed]}
                onPress={() => setActiveView('emergencies')}
              >
                <Text style={styles.cardIcon}>🚨</Text>
                <Text style={styles.cardTitle}>Active Emergencies</Text>
                <Text style={styles.cardSubtitle}>{emergencies.filter(e => e.status !== 'resolved').length} assignments</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.card, styles.cardGreen]}
                onPress={() => setActiveView('history')}
              >
                <Text style={styles.cardIcon}>📖</Text>
                <Text style={styles.cardTitle}>History</Text>
                <Text style={styles.cardSubtitle}>{emergencies.filter(e => e.status === 'resolved').length} resolved</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.card, styles.cardBlue]}
                onPress={() => setActiveView('announcements')}
              >
                <Text style={styles.cardIcon}>📢</Text>
                <Text style={styles.cardTitle}>Announcements</Text>
                <Text style={styles.cardSubtitle}>{announcements.length} updates</Text>
              </TouchableOpacity>
            </View>

            {/* Recent Critical Activity */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>� Critical Emergencies</Text>
              {emergencies
                .filter(e => e.priority === 'critical' && e.status !== 'resolved')
                .slice(0, 3)
                .length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No critical emergencies</Text>
                </View>
              ) : (
                emergencies
                  .filter(e => e.priority === 'critical' && e.status !== 'resolved')
                  .slice(0, 3)
                  .map((emergency) => (
                    <View key={emergency._id} style={styles.activityCard}>
                      <View style={styles.activityHeader}>
                        <Text style={styles.activityType}>{emergency.type.toUpperCase()}</Text>
                        <View style={[styles.activityStatus, { backgroundColor: getStatusColor(emergency.status) }]}>
                          <Text style={styles.activityStatusText}>{emergency.status}</Text>
                        </View>
                      </View>
                      <Text style={styles.activityDescription}>{emergency.description}</Text>
                      <Text style={styles.activityTime}>
                        ⏰ {new Date(emergency.createdAt).toLocaleString()}
                      </Text>
                      <Text style={styles.activityLocation}>📍 {emergency.location.address}</Text>
                      <TouchableOpacity
                        style={styles.viewButton}
                        onPress={() => {
                          setActiveView('emergencies');
                        }}
                      >
                        <Text style={styles.viewButtonText}>View All Emergencies →</Text>
                      </TouchableOpacity>
                    </View>
                  ))
              )}
            </View>
          </>
        )}

        {activeView === 'emergencies' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Emergencies</Text>
              <TouchableOpacity onPress={() => setActiveView('dashboard')}>
                <Text style={styles.backLink}>← Back</Text>
              </TouchableOpacity>
            </View>
            
            {loading ? (
              <Text style={styles.loadingText}>Loading emergencies...</Text>
            ) : emergencies.filter(e => e.status !== 'resolved').length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No active emergencies</Text>
              </View>
            ) : (
              emergencies.filter(e => e.status !== 'resolved').map((emergency) => (
                <View key={emergency._id} style={styles.emergencyCard}>
                  <View style={styles.emergencyHeader}>
                    <Text style={styles.emergencyType}>{emergency.type.toUpperCase()}</Text>
                    <View style={styles.badgeContainer}>
                      <View style={[styles.badge, { backgroundColor: getStatusColor(emergency.status) }]}>
                        <Text style={styles.badgeText}>{emergency.status}</Text>
                      </View>
                      <View style={[styles.badge, { backgroundColor: getPriorityColor(emergency.priority) }]}>
                        <Text style={styles.badgeText}>{emergency.priority}</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.emergencyDescription}>{emergency.description}</Text>

                  <View style={styles.emergencyDetails}>
                    <Text style={styles.detailText}>
                      📍 Location: {emergency.location.address}
                    </Text>
                    <Text style={styles.detailText}>
                      📞 Contact: {emergency.contactNumber}
                    </Text>
                    <Text style={styles.detailText}>
                      👤 Reported by: {emergency.reportedBy?.name}
                    </Text>
                    <Text style={styles.detailText}>
                      ⏰ Time: {new Date(emergency.createdAt).toLocaleString()}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.updateButton}
                    onPress={() => openUpdateModal(emergency)}
                  >
                    <Text style={styles.updateButtonText}>Update Status</Text>
                  </TouchableOpacity>

                  {emergency.updates && emergency.updates.length > 0 && (
                    <View style={styles.updatesSection}>
                      <Text style={styles.updatesTitle}>Updates:</Text>
                      {emergency.updates.slice(-3).map((update, index) => (
                        <View key={index} style={styles.updateItem}>
                          <Text style={styles.updateText}>
                            {update.updatedBy?.name || 'Responder'}: {update.status}
                          </Text>
                          {update.notes && (
                            <Text style={styles.updateNotes}>📝 {update.notes}</Text>
                          )}
                          <Text style={styles.updateTime}>
                            {new Date(update.timestamp).toLocaleString()}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        )}

        {activeView === 'history' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Emergency History</Text>
              <TouchableOpacity onPress={() => setActiveView('dashboard')}>
                <Text style={styles.backLink}>← Back</Text>
              </TouchableOpacity>
            </View>
            
            {emergencies.filter(e => e.status === 'resolved').length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No resolved emergencies</Text>
              </View>
            ) : (
              emergencies.filter(e => e.status === 'resolved').map((emergency) => (
                <View key={emergency._id} style={styles.emergencyCard}>
                  <View style={styles.emergencyHeader}>
                    <Text style={styles.emergencyType}>{emergency.type.toUpperCase()}</Text>
                    <View style={[styles.badge, { backgroundColor: getStatusColor(emergency.status) }]}>
                      <Text style={styles.badgeText}>{emergency.status}</Text>
                    </View>
                  </View>

                  <Text style={styles.emergencyDescription}>{emergency.description}</Text>

                  <View style={styles.emergencyDetails}>
                    <Text style={styles.detailText}>
                      📍 Location: {emergency.location.address}
                    </Text>
                    <Text style={styles.detailText}>
                      ⏰ Reported: {new Date(emergency.createdAt).toLocaleString()}
                    </Text>
                    {emergency.resolvedAt && (
                      <Text style={styles.detailText}>
                        ✅ Resolved: {new Date(emergency.resolvedAt).toLocaleString()}
                      </Text>
                    )}
                  </View>

                  {emergency.updates && emergency.updates.length > 0 && (
                    <View style={styles.updatesSection}>
                      <Text style={styles.updatesTitle}>Updates:</Text>
                      {emergency.updates.map((update, index) => (
                        <View key={index} style={styles.updateItem}>
                          <Text style={styles.updateText}>
                            {update.updatedBy?.name || 'Responder'}: {update.status}
                          </Text>
                          {update.notes && (
                            <Text style={styles.updateNotes}>📝 {update.notes}</Text>
                          )}
                          <Text style={styles.updateTime}>
                            {new Date(update.timestamp).toLocaleString()}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        )}

        {activeView === 'announcements' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Announcements</Text>
              <TouchableOpacity onPress={() => setActiveView('dashboard')}>
                <Text style={styles.backLink}>← Back</Text>
              </TouchableOpacity>
            </View>
            
            {announcements.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No announcements yet</Text>
              </View>
            ) : (
              announcements.map((announcement) => (
                <View key={announcement._id} style={styles.announcementCard}>
                  <View style={styles.announcementHeader}>
                    <Text style={styles.announcementTitle}>{announcement.title}</Text>
                    <View style={styles.announcementTypeBadge}>
                      <Text style={styles.announcementTypeBadgeText}>{announcement.type}</Text>
                    </View>
                  </View>
                  <Text style={styles.announcementMessage}>{announcement.message}</Text>
                  <Text style={styles.announcementTime}>
                    📅 {new Date(announcement.createdAt).toLocaleString()}
                  </Text>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Update Status Modal */}
      <Modal
        visible={showUpdateModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUpdateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Emergency Status</Text>
            
            {selectedEmergency && (
              <View style={styles.emergencyInfo}>
                <Text style={styles.emergencyInfoText}>
                  📍 {selectedEmergency.type}
                </Text>
                <Text style={styles.emergencyInfoText}>
                  {selectedEmergency.description}
                </Text>
              </View>
            )}

            <Text style={styles.label}>Select Status:</Text>
            <View style={styles.statusButtons}>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  selectedStatus === 'responding' && styles.statusButtonActive
                ]}
                onPress={() => setSelectedStatus('responding')}
              >
                <Text style={[
                  styles.statusButtonText,
                  selectedStatus === 'responding' && styles.statusButtonTextActive
                ]}>
                  Responding
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  selectedStatus === 'resolved' && styles.statusButtonActive
                ]}
                onPress={() => setSelectedStatus('resolved')}
              >
                <Text style={[
                  styles.statusButtonText,
                  selectedStatus === 'resolved' && styles.statusButtonTextActive
                ]}>
                  Resolved
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Notes (optional):</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add update notes..."
              multiline
              numberOfLines={4}
              value={updateNotes}
              onChangeText={setUpdateNotes}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowUpdateModal(false);
                  setSelectedEmergency(null);
                  setSelectedStatus('');
                  setUpdateNotes('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleUpdateStatus}
              >
                <Text style={styles.submitButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  header: {
    backgroundColor: '#10b981',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'white',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardRed: {
    backgroundColor: '#FEE2E2',
  },
  cardGreen: {
    backgroundColor: '#D1FAE5',
  },
  cardBlue: {
    backgroundColor: '#DBEAFE',
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  backLink: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '600',
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  activityStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityStatusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  activityDescription: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 8,
    lineHeight: 18,
  },
  activityTime: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 4,
  },
  activityLocation: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 8,
  },
  viewButton: {
    backgroundColor: '#10b981',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  viewButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  infoBox: {
    backgroundColor: '#DBEAFE',
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  loadingText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  emergencyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  emergencyDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
  },
  emergencyDetails: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  updateButton: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  updatesSection: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  updatesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 8,
  },
  updateItem: {
    marginBottom: 8,
  },
  updateText: {
    fontSize: 11,
    color: '#4b5563',
    marginBottom: 2,
  },
  updateNotes: {
    fontSize: 11,
    color: '#10b981',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  updateTime: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 2,
  },
  announcementCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  announcementTypeBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  announcementTypeBadgeText: {
    fontSize: 10,
    color: '#1e40af',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  announcementMessage: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  announcementTime: {
    fontSize: 11,
    color: '#9ca3af',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  emergencyInfo: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  emergencyInfoText: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 8,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  statusButtonActive: {
    borderColor: '#10b981',
    backgroundColor: '#d1fae5',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  statusButtonTextActive: {
    color: '#10b981',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#10b981',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default ResponderDashboardScreen;
