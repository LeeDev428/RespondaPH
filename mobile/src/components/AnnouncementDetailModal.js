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

const AnnouncementDetailModal = ({ 
  visible, 
  onClose, 
  announcement 
}) => {
  if (!announcement) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
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
          <View style={styles.detailModalContent}>
            <View style={styles.detailModalHeader}>
              <Text style={styles.detailModalTitle}>Announcement</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.announcementDetailHeader}>
              <Text style={styles.announcementDetailTitle}>{announcement.title}</Text>
              <View style={styles.announcementTypeBadge}>
                <Text style={styles.announcementTypeBadgeText}>{announcement.type}</Text>
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.announcementDetailMessage}>{announcement.message}</Text>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailText}>
                📅 Posted: {new Date(announcement.createdAt).toLocaleString()}
              </Text>
              {announcement.createdBy && (
                <Text style={styles.detailText}>
                  👤 By: {announcement.createdBy.name || 'Admin'}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.closeDetailButton}
              onPress={onClose}
            >
              <Text style={styles.closeDetailButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  detailText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
    marginBottom: 6,
  },
  announcementDetailHeader: {
    marginBottom: 20,
  },
  announcementDetailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  announcementTypeBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  announcementTypeBadgeText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  announcementDetailMessage: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
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

export default AnnouncementDetailModal;
