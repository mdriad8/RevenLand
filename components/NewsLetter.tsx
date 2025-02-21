import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { Client, Databases } from 'react-native-appwrite';

const NewsLetter = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Appwrite setup
  const client = new Client();
  const database = new Databases(client);

  client
    .setEndpoint('https://cloud.appwrite.io/v1') // Appwrite endpoint
    .setProject('676d8544001a9daa9b07'); // Appwrite project ID

  console.log('Appwrite Client Config:', client.config);

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = async () => {
    console.log('Submitting:', { name, email });

    if (!name || !email) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    try {
      const response = await database.createDocument(
        '676d864e0013f5321b88', // Database ID
        '564', // Collection ID
        'unique()', // Auto-generate unique ID
        { name, email } // Document data
      );
      console.log('Document created successfully:', response);
      Alert.alert('Success', 'Thank you for subscribing!');
      onClose();
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Error creating document:', JSON.stringify(error));
      Alert.alert('Error', `Failed to subscribe. Details: ${(error as any).message || JSON.stringify(error)}`);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Subscribe to our Newsletter</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubscribe}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#E6C79C',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NewsLetter;
