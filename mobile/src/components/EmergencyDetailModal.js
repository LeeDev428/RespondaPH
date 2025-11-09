import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet
} from 'react-native';

const EmergencyDetailModal = ({ 
  visible, 
  onClose, 
  emergency,
  getStatusColor 
}) => {
  if (!emergency) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.detailModalContent}>
          <View style={styles.detailModalHeader}>
            <Text style={styles.detailModalTitle}>Emergency Details</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={true}
          >

            <View style={styles.detailSection}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Type:</Text>
                <Text style={styles.detailValue}>{emergency.type.toUpperCase()}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(emergency.status) }]}>
                  <Text style={styles.statusText}>{emergency.status}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Priority:</Text>
                <Text style={[styles.detailValue, styles.priorityText]}>{emergency.priority.toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Description</Text>
              <Text style={styles.detailText}>{emergency.description}</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Location</Text>
              <Text style={styles.detailText}>📍 {emergency.location.address}</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Contact</Text>
              <Text style={styles.detailText}>📞 {emergency.contactNumber}</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Timeline</Text>
              <Text style={styles.detailText}>⏰ Reported: {new Date(emergency.createdAt).toLocaleString()}</Text>
              {emergency.resolvedAt && (
                <Text style={styles.detailText}>✅ Resolved: {new Date(emergency.resolvedAt).toLocaleString()}</Text>
              )}
            </View>

            {emergency.assignedResponders?.length > 0 && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Assigned Responders</Text>
                {emergency.assignedResponders.map((responder, index) => (
                  <Text key={index} style={styles.detailText}>
                    👨‍🚒 {responder.name} - {responder.phoneNumber}
                  </Text>
                ))}
              </View>
            )}

            {emergency.updates && emergency.updates.length > 0 && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Updates & Notes</Text>
                {emergency.updates.map((update, index) => (
                  <View key={index} style={styles.updateItem}>
                    <Text style={styles.updateBy}>
                      {update.updatedBy?.name || 'Responder'} ({update.updatedBy?.role || 'responder'})
                    </Text>
                    <Text style={styles.updateTime}>
                      {new Date(update.timestamp).toLocaleString()}
                    </Text>
                    <Text style={styles.updateStatus}>Status: {update.status}</Text>
                    {update.notes && (
                      <Text style={styles.updateNotes}>📝 {update.notes}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

          </ScrollView>

          <TouchableOpacity
            style={styles.closeDetailButton}
            onPress={onClose}
          >
            <Text style={styles.closeDetailButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  detailModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: '96%',
    maxHeight: '92%',
  },
  detailModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  detailModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    fontSize: 28,
    color: '#9ca3af',
    fontWeight: 'bold',
  },
  detailSection: {
    marginBottom: 20,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  priorityText: {
    color: '#ef4444',
  },
  detailText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  updateItem: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  updateBy: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  updateTime: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 4,
  },
  updateStatus: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  updateNotes: {
    fontSize: 13,
    color: '#4b5563',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  closeDetailButton: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  closeDetailButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmergencyDetailModal;
