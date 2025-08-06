import React, { useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, BackHandler } from 'react-native';

interface GlobalAICoachProps {
  visible: boolean;
  onClose: () => void;
}

export const GlobalAICoach: React.FC<GlobalAICoachProps> = ({ visible, onClose }) => {
  // Handle Android back button
  useEffect(() => {
    if (!visible) return;
    
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible) {
        onClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [visible, onClose]);

  // Memoize the close handler to prevent recreation
  const handleClose = useCallback(() => {
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  }, [onClose]);

  // Use Modal component for better handling
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={handleClose}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.title}>AI Coach</Text>
            <Text style={styles.message}>How can I help you today?</Text>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={handleClose}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#000',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  closeButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

// Parent Component Example - IMPORTANT: This shows how to use it correctly
/*
import React, { useState, useCallback } from 'react';
import { GlobalAICoach } from './GlobalAICoach';

export const ParentComponent = () => {
  const [showAICoach, setShowAICoach] = useState(false);

  // IMPORTANT: Use useCallback to prevent function recreation
  const handleOpenAICoach = useCallback(() => {
    setShowAICoach(true);
  }, []);

  const handleCloseAICoach = useCallback(() => {
    setShowAICoach(false);
  }, []);

  return (
    <View>
      <TouchableOpacity onPress={handleOpenAICoach}>
        <Text>Open AI Coach</Text>
      </TouchableOpacity>
      
      <GlobalAICoach 
        visible={showAICoach} 
        onClose={handleCloseAICoach}
      />
    </View>
  );
};
*/