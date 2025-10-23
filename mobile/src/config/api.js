// API Configuration
// Replace with your computer's IP address when testing on physical devices
// Use 'localhost' only when testing on emulator/simulator on the same machine

export const API_BASE_URL = 'http://192.168.8.38:5000';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
};
