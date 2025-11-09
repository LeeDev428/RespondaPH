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
            <Text style={styles.detailModalTitle}>Announcement</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={true}
          >
            {!announcement ? (
              <View style={styles.detailSection}>
                <Text style={styles.detailText}>Loading announcement...</Text>
              </View>
            ) : (
              <>
                <View style={styles.announcementDetailHeader}>
                  <Text style={styles.announcementDetailTitle}>{announcement.title || 'No Title'}</Text>
                  <View style={styles.announcementTypeBadge}>
                    <Text style={styles.announcementTypeBadgeText}>{announcement.type || 'general'}</Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.announcementDetailMessage}>{announcement.message || 'No message content'}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailText}>
                    📅 Posted: {announcement.createdAt ? new Date(announcement.createdAt).toLocaleString() : 'N/A'}
                  </Text>
                  {announcement.createdBy && (
                    <Text style={styles.detailText}>
                      👤 By: {announcement.createdBy.name || 'Admin'}
                    </Text>
                  )}
                </View>
              </>
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
    paddingHorizontal: 12,
    paddingVertical: 40,
  },
  detailModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxHeight: '90%',
    padding: 20,
  },
  scrollView: {
    maxHeight: 500,
    marginBottom: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 10,
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
