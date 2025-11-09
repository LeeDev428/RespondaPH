import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ResidentDashboardScreenNew from './src/screens/ResidentDashboardScreenNew';
import ResponderDashboardScreen from './src/screens/ResponderDashboardScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');
      if (token && userData) {
        const user = JSON.parse(userData);
        setUserRole(user.role);
        setCurrentScreen(user.role === 'responder' ? 'responder-dashboard' : 'resident-dashboard');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  const handleLogin = () => {
    setCurrentScreen('login');
  };

  const handleRegister = () => {
    setCurrentScreen('register');
  };

  const handleBack = () => {
    setCurrentScreen('welcome');
  };

  const handleLoginSuccess = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserRole(user.role);
        if (user.role === 'responder') {
          setCurrentScreen('responder-dashboard');
        } else {
          setCurrentScreen('resident-dashboard');
        }
      }
    } catch (error) {
      console.error('Error handling login success:', error);
      setCurrentScreen('resident-dashboard');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setUserRole(null);
      setCurrentScreen('welcome');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Welcome Screen
  if (currentScreen === 'welcome') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>D</Text>
            </View>
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>DREAM</Text>
            <Text style={styles.subtitle}>Disaster Response and Emergency Action Management</Text>
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

  // Resident Dashboard Screen
  if (currentScreen === 'resident-dashboard') {
    return <ResidentDashboardScreenNew onLogout={handleLogout} />;
  }

  // Responder Dashboard Screen
  if (currentScreen === 'responder-dashboard') {
    return <ResponderDashboardScreen onLogout={handleLogout} />;
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
