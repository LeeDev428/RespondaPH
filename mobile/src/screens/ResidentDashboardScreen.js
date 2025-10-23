import React, { useContext } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ScrollView,
  Pressable,
  Center
} from 'native-base';
import { AuthContext } from '../context/AuthContext';

const ResidentDashboardScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    navigation.replace('Welcome');
  };

  return (
    <Box flex={1} bg="emerald.50" safeArea>
      <ScrollView>
        <VStack space={6} p={4}>
          {/* Welcome Header */}
          <Box bg="emerald.600" p={6} rounded="lg" shadow={3}>
            <Text fontSize="2xl" fontWeight="bold" color="white">
              Welcome, {user?.name}!
            </Text>
            <Text fontSize="md" color="emerald.100" mt={1}>
              Resident Dashboard
            </Text>
          </Box>

          {/* Action Cards */}
          <VStack space={4}>
            <Pressable onPress={() => {}}>
              <Box bg="white" p={6} rounded="lg" shadow={2}>
                <HStack space={4} alignItems="center">
                  <Center bg="red.100" width={60} height={60} rounded="lg">
                    <Text fontSize="3xl">🚨</Text>
                  </Center>
                  <VStack flex={1}>
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                      Report Emergency
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Submit incident report
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </Pressable>

            <Pressable onPress={() => {}}>
              <Box bg="white" p={6} rounded="lg" shadow={2}>
                <HStack space={4} alignItems="center">
                  <Center bg="blue.100" width={60} height={60} rounded="lg">
                    <Text fontSize="3xl">📋</Text>
                  </Center>
                  <VStack flex={1}>
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                      My Reports
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      View your submissions
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </Pressable>

            <Pressable onPress={() => {}}>
              <Box bg="white" p={6} rounded="lg" shadow={2}>
                <HStack space={4} alignItems="center">
                  <Center bg="amber.100" width={60} height={60} rounded="lg">
                    <Text fontSize="3xl">📢</Text>
                  </Center>
                  <VStack flex={1}>
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                      View Alerts
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Emergency announcements
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </Pressable>
          </VStack>

          {/* Recent Activity */}
          <Box bg="white" p={6} rounded="lg" shadow={2}>
            <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={4}>
              Recent Activity
            </Text>
            <Center py={8}>
              <Text fontSize="4xl" mb={2}>📭</Text>
              <Text color="gray.500" textAlign="center">
                No activity yet
              </Text>
              <Text color="gray.400" textAlign="center" fontSize="sm">
                Your reports will appear here
              </Text>
            </Center>
          </Box>

          {/* Emergency Contact */}
          <Box bg="red.50" p={6} rounded="lg" borderWidth={2} borderColor="red.200">
            <Text fontSize="lg" fontWeight="bold" color="red.800" mb={3}>
              Emergency Hotlines
            </Text>
            <VStack space={2}>
              <HStack justifyContent="space-between">
                <Text color="gray.700" fontWeight="medium">National Emergency:</Text>
                <Text fontSize="xl" fontWeight="bold" color="red.600">911</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="gray.700" fontWeight="medium">Barangay Office:</Text>
                <Text fontSize="xl" fontWeight="bold" color="red.600">(123) 456-7890</Text>
              </HStack>
            </VStack>
          </Box>

          {/* Logout Button */}
          <Button
            variant="outline"
            borderColor="red.500"
            _text={{ color: 'red.500', fontWeight: 'bold' }}
            size="lg"
            rounded="lg"
            onPress={handleLogout}
          >
            Logout
          </Button>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default ResidentDashboardScreen;
