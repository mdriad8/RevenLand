import React, { useEffect, useState } from 'react';
import { SplashScreen, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Platform, ActivityIndicator, View, Text, StyleSheet, Image } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(true);

  // Prevent splash screen from auto-hiding until onboarding finishes
  SplashScreen.preventAutoHideAsync();

  useEffect(() => {
    const showOnboarding = async () => {
      setTimeout(() => {
        setIsOnboardingVisible(false); // Hide onboarding screen
        SplashScreen.hideAsync(); // Hide the splash screen
        router.push('/(tabs)/profile'); // Navigate to profile screen
      }, 5000); // 5-second delay
    };

    showOnboarding();
  }, [router]);

  // Render the onboarding screen if visible
  if (isOnboardingVisible) {
    return (
      <View style={styles.onboardingContainer}>
        <Image
          source={{ uri: 'https://reactjs.org/logo-og.png' }} // Replace with your desired image URL
          style={styles.image}
        />
        <Text style={styles.title}>Welcome to the RevenLand!</Text>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
      </View>
    );
  }

  // Render the main app layout (Tabs) after onboarding is hidden
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarStyle: Platform.select({
            ios: { position: 'absolute' },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="program"
          options={{
            title: 'Program',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={26} name="calendar.circle.fill" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Company Profile',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="person.fill" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="contact"
          options={{
            title: 'Contact Us',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="person.fill" color={color} />
            ),
          }}
        />
         
      
      </Tabs> 
      
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  onboardingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef9ef',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
});
