import React from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

const contact = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Contact Us</Text>
            <TextInput style={styles.input} placeholder="Your Name" />
            <TextInput style={styles.input} placeholder="Your Email" keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Your Message" multiline />
            <Button title="Send" onPress={() => { /* Handle send action */ }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});

export default contact;