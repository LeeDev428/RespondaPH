import React from 'react';
import { Box, VStack, HStack, Text, Button, Center, Image } from 'native-base';

const WelcomeScreen = ({ navigation }) => {
  return (
    <Box flex={1} bg="emerald.50" safeArea>
      <Center flex={1} px={4}>
        <VStack space={8} alignItems="center" width="100%">
          {/* Logo */}
          <Box
            bg="emerald.600"
            width={120}
            height={120}
            rounded="full"
            alignItems="center"
            justifyContent="center"
            shadow={5}
          >
            <Text fontSize="6xl" color="white" fontWeight="bold">
              T
            </Text>
          </Box>

          {/* Title */}
          <VStack space={2} alignItems="center">
            <Text fontSize="4xl" fontWeight="bold" color="gray.800">
              Tugon
            </Text>
            <Text fontSize="xl" color="emerald.700" textAlign="center">
              Barangay Disaster Response System
            </Text>
            <Text fontSize="md" color="gray.600" textAlign="center">
              San Isidro Labrador I
            </Text>
          </VStack>

          {/* Description */}
          <Text fontSize="md" color="gray.700" textAlign="center" px={6}>
            Connect with local authorities during disasters and emergencies.
            Report incidents and receive real-time alerts.
          </Text>

          {/* Buttons */}
          <VStack space={3} width="100%" px={6}>
            <Button
              bg="emerald.600"
              size="lg"
              rounded="lg"
              _pressed={{ bg: 'emerald.700' }}
              onPress={() => navigation.navigate('Login')}
            >
              <Text fontSize="lg" fontWeight="bold" color="white">
                Login
              </Text>
            </Button>

            <Button
              variant="outline"
              borderColor="emerald.600"
              size="lg"
              rounded="lg"
              _pressed={{ bg: 'emerald.50' }}
              onPress={() => navigation.navigate('Register')}
            >
              <Text fontSize="lg" fontWeight="bold" color="emerald.600">
                Register
              </Text>
            </Button>
          </VStack>

          {/* Emergency Note */}
          <Box bg="red.100" p={4} rounded="lg" width="90%">
            <Text fontSize="sm" color="red.800" textAlign="center" fontWeight="semibold">
              🚨 Emergency Hotline: 911
            </Text>
          </Box>
        </VStack>
      </Center>
    </Box>
  );
};

export default WelcomeScreen;
