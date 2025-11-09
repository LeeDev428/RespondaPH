import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import EmergencyDetailModal from '../components/EmergencyDetailModal';
import AnnouncementDetailModal from '../components/AnnouncementDetailModal';

const ResidentDashboardScreen = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('home');
  const [emergencies, setEmergencies] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showEmergencyDetail, setShowEmergencyDetail] = useState(false);
  const [showAnnouncementDetail, setShowAnnouncementDetail] = useState(false);
  
  const [reportForm, setReportForm] = useState({
    type: '',
    description: '',
    location: '',
    contactNumber: '',
    priority: 'medium'
  });

  useEffect(() => {
    loadUserData();
    fetchData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setReportForm(prev => ({ ...prev, contactNumber: parsedUser.phoneNumber || '' }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const fetchData = async () => {
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
      setRefreshing(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!reportForm.type || !reportForm.description || !reportForm.location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        API_ENDPOINTS.EMERGENCIES,
        {
          type: reportForm.type,
          description: reportForm.description,
          location: { address: reportForm.location },
          contactNumber: reportForm.contactNumber,
          priority: reportForm.priority
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      Alert.alert('Success', 'Emergency reported successfully!');
      setShowReportModal(false);
      setReportForm({
        type: '',
        description: '',
        location: '',
        contactNumber: user?.phoneNumber || '',
        priority: 'medium'
      });
      fetchData();
    } catch (error) {
      console.error('Error reporting emergency:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to report emergency');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
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
            <Text style={styles.headerTitle}>Resident Dashboard</Text>
            <Text style={styles.headerSubtitle}>Welcome, {user?.name}!</Text>
          </View>
          <TouchableOpacity style={styles.logoutIconButton} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
          </TouchableOpacity>
        </View>

        {activeView === 'home' && (
          <>
            {/* Action Cards */}
            <View style={styles.cardsContainer}>
              <TouchableOpacity 
                style={[styles.card, styles.cardRed]}
                onPress={() => setShowReportModal(true)}
              >
                <Text style={styles.cardIcon}>🆘</Text>
                <Text style={styles.cardTitle}>Report Emergency</Text>
                <Text style={styles.cardSubtitle}>Request immediate help</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.card, styles.cardBlue]}
                onPress={() => setActiveView('reports')}
              >
                <Text style={styles.cardIcon}>📋</Text>
                <Text style={styles.cardTitle}>My Reports</Text>
                <Text style={styles.cardSubtitle}>Active reports ({emergencies.filter(e => e.status !== 'resolved').length})</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.card, styles.cardYellow]}
                onPress={() => setActiveView('announcements')}
              >
                <Text style={styles.cardIcon}>📢</Text>
                <Text style={styles.cardTitle}>Announcements</Text>
                <Text style={styles.cardSubtitle}>Check updates ({announcements.length})</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.card, styles.cardGreen]}
                onPress={() => setActiveView('history')}
              >
                <Text style={styles.cardIcon}>📖</Text>
                <Text style={styles.cardTitle}>Emergency History</Text>
                <Text style={styles.cardSubtitle}>Resolved reports ({emergencies.filter(e => e.status === 'resolved').length})</Text>
              </TouchableOpacity>
            </View>

            {/* Recent Activity */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              {emergencies
                .filter(e => e.status === 'dispatched' || e.status === 'responding')
                .sort((a, b) => {
                  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                  return priorityOrder[a.priority] - priorityOrder[b.priority];
                })
                .slice(0, 3)
                .map((emergency) => (
                  <View key={emergency._id} style={styles.activityCard}>
                    <View style={styles.activityHeader}>
                      <Text style={styles.activityType}>{emergency.type.toUpperCase()}</Text>
                      <View style={[styles.activityStatus, { backgroundColor: getStatusColor(emergency.status) }]}>
                        <Text style={styles.activityStatusText}>{emergency.status}</Text>
                      </View>
                    </View>
                    <Text style={styles.activityDescription} numberOfLines={2}>
                      {emergency.description}
                    </Text>
                    <Text style={styles.activityTime}>
                      ⏰ {new Date(emergency.createdAt).toLocaleString()}
                    </Text>
                    {emergency.assignedResponders?.length > 0 && (
                      <Text style={styles.activityResponders}>
                        👨‍🚒 {emergency.assignedResponders.length} responder(s) assigned
                      </Text>
                    )}
                  </View>
                ))}
              {emergencies.filter(e => e.status === 'dispatched' || e.status === 'responding').length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No active emergencies</Text>
                </View>
              )}
            </View>
          </>
        )}

        {activeView === 'reports' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Emergency Reports (Active)</Text>
              <TouchableOpacity onPress={() => setActiveView('home')}>
                <Text style={styles.backLink}>← Back</Text>
              </TouchableOpacity>
            </View>
            
            {emergencies.filter(e => e.status !== 'resolved').length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No active reports</Text>
              </View>
            ) : (
              emergencies.filter(e => e.status !== 'resolved').map((emergency) => (
                <TouchableOpacity 
                  key={emergency._id} 
                  style={styles.reportCard}
                  onPress={() => {
                    setSelectedEmergency(emergency);
                    setShowEmergencyDetail(true);
                  }}
                >
                  <View style={styles.reportHeader}>
                    <Text style={styles.reportType}>{emergency.type.toUpperCase()}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(emergency.status) }]}>
                      <Text style={styles.statusText}>{emergency.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.reportDescription}>{emergency.description}</Text>
                  <Text style={styles.reportDetail}>📍 {emergency.location.address}</Text>
                  <Text style={styles.reportDetail}>
                    ⏰ {new Date(emergency.createdAt).toLocaleString()}
                  </Text>
                  {emergency.assignedResponders?.length > 0 && (
                    <Text style={styles.reportDetail}>
                      👨‍🚒 Responders: {emergency.assignedResponders.map(r => r.name).join(', ')}
                    </Text>
                  )}
                  <Text style={styles.viewDetailsLink}>Tap to view details →</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {activeView === 'history' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Emergency History</Text>
              <TouchableOpacity onPress={() => setActiveView('home')}>
                <Text style={styles.backLink}>← Back</Text>
              </TouchableOpacity>
            </View>
            
            {emergencies.filter(e => e.status === 'resolved').length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No resolved emergencies</Text>
              </View>
            ) : (
              emergencies.filter(e => e.status === 'resolved').map((emergency) => (
                <TouchableOpacity 
                  key={emergency._id} 
                  style={styles.reportCard}
                  onPress={() => {
                    setSelectedEmergency(emergency);
                    setShowEmergencyDetail(true);
                  }}
                >
                  <View style={styles.reportHeader}>
                    <Text style={styles.reportType}>{emergency.type.toUpperCase()}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(emergency.status) }]}>
                      <Text style={styles.statusText}>{emergency.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.reportDescription}>{emergency.description}</Text>
                  <Text style={styles.reportDetail}>📍 {emergency.location.address}</Text>
                  <Text style={styles.reportDetail}>
                    ⏰ Reported: {new Date(emergency.createdAt).toLocaleString()}
                  </Text>
                  {emergency.resolvedAt && (
                    <Text style={styles.reportDetail}>
                      ✅ Resolved: {new Date(emergency.resolvedAt).toLocaleString()}
                    </Text>
                  )}
                  <Text style={styles.viewDetailsLink}>Tap to view details →</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {activeView === 'announcements' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Announcements</Text>
              <TouchableOpacity onPress={() => setActiveView('home')}>
                <Text style={styles.backLink}>← Back</Text>
              </TouchableOpacity>
            </View>
            
            {announcements.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No announcements yet</Text>
              </View>
            ) : (
              announcements.map((announcement) => (
                <TouchableOpacity 
                  key={announcement._id} 
                  style={styles.announcementCard}
                  onPress={() => {
                    setSelectedAnnouncement(announcement);
                    setShowAnnouncementDetail(true);
                  }}
                >
                  <View style={styles.announcementHeader}>
                    <Text style={styles.announcementTitle}>{announcement.title}</Text>
                    <Text style={styles.announcementType}>{announcement.type}</Text>
                  </View>
                  <Text style={styles.announcementMessage} numberOfLines={2}>{announcement.message}</Text>
                  <Text style={styles.announcementTime}>
                    {new Date(announcement.createdAt).toLocaleString()}
                  </Text>
                  <Text style={styles.viewDetailsLink}>Tap to view full message →</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Report Emergency Modal */}
      <Modal
        visible={showReportModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReportModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <ScrollView 
            contentContainerStyle={styles.modalScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Report Emergency</Text>
            
            <Text style={styles.label}>Emergency Type *</Text>
            <View style={styles.typeButtonsContainer}>
              {['fire', 'flood', 'medical', 'accident', 'crime', 'other'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    reportForm.type === type && styles.typeButtonActive
                  ]}
                  onPress={() => setReportForm({ ...reportForm, type })}
                >
                  <Text style={[
                    styles.typeButtonText,
                    reportForm.type === type && styles.typeButtonTextActive
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the emergency..."
              value={reportForm.description}
              onChangeText={(text) => setReportForm({ ...reportForm, description: text })}
              multiline
            />

            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter location/address"
              value={reportForm.location}
              onChangeText={(text) => setReportForm({ ...reportForm, location: text })}
            />

            <Text style={styles.label}>Contact Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Contact number"
              value={reportForm.contactNumber}
              onChangeText={(text) => setReportForm({ ...reportForm, contactNumber: text })}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
              {['low', 'medium', 'high', 'critical'].map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    reportForm.priority === priority && styles.priorityButtonActive
                  ]}
                  onPress={() => setReportForm({ ...reportForm, priority })}
                >
                  <Text style={[
                    styles.priorityButtonText,
                    reportForm.priority === priority && styles.priorityButtonTextActive
                  ]}>
                    {priority}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowReportModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmitReport}
              >
                <Text style={styles.submitButtonText}>Submit Report</Text>
              </TouchableOpacity>
            </View>
          </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* Emergency Detail Modal */}
      <EmergencyDetailModal 
        visible={showEmergencyDetail}
        onClose={() => setShowEmergencyDetail(false)}
        emergency={selectedEmergency}
        getStatusColor={getStatusColor}
      />

      {/* Announcement Detail Modal */}
      <AnnouncementDetailModal 
        visible={showAnnouncementDetail}
        onClose={() => setShowAnnouncementDetail(false)}
        announcement={selectedAnnouncement}
      />
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
  logoutIconButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  logoutIcon: {
    fontSize: 24,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'center',
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
  cardBlue: {
    backgroundColor: '#DBEAFE',
  },
  cardYellow: {
    backgroundColor: '#FEF3C7',
  },
  cardGreen: {
    backgroundColor: '#D1FAE5',
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
    borderLeftColor: '#10b981',
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
  activityResponders: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '600',
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  reportCard: {
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
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  reportDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  reportDetail: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  announcementCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
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
  },
  announcementType: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '600',
    textTransform: 'uppercase',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  announcementMessage: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
    lineHeight: 20,
  },
  announcementTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  typeButtonActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  typeButtonText: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  typeButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: '#FCD34D',
    borderColor: '#FCD34D',
  },
  priorityButtonText: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  priorityButtonTextActive: {
    color: '#92400E',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#10b981',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  viewDetailsLink: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'right',
  },

});

export default ResidentDashboardScreen;
