import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ResidentDashboardScreen from './src/screens/ResidentDashboardScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');

  const handleLogin = () => {
    setCurrentScreen('login');
  };

  const handleRegister = () => {
    setCurrentScreen('register');
  };

  const handleBack = () => {
    setCurrentScreen('welcome');
  };

  const handleLoginSuccess = () => {
    setCurrentScreen('dashboard');
  };

  // Welcome Screen
  if (currentScreen === 'welcome') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>T</Text>
            </View>
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Tugon</Text>
            <Text style={styles.subtitle}>Barangay Disaster Response System</Text>
            <Text style={styles.location}>San Isidro Labrador I</Text>
          </View>

          {/* Description */}
          <Text style={styles.description}>
            Connect with local authorities during disasters and emergencies.
            Report incidents and receive real-time alerts.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            Powered by Barangay San Isidro Labrador I
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Login Screen
  if (currentScreen === 'login') {
    return <LoginScreen onBack={handleBack} onLoginSuccess={handleLoginSuccess} />;
  }

  // Register Screen
  if (currentScreen === 'register') {
    return <RegisterScreen onBack={handleBack} />;
  }

  // Dashboard Screen
  if (currentScreen === 'dashboard') {
    return <ResidentDashboardScreen onLogout={handleBack} />;
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  logoText: {
    fontSize: 60,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#059669',
    textAlign: 'center',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  registerButtonText: {
    color: '#10b981',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 40,
  },
});
