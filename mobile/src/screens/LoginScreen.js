import React, { useState, useContext } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Center,
  FormControl,
  Alert,
  Collapse,
  IconButton,
  CloseIcon
} from 'native-base';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://10.0.2.2:5000/api/auth/login', {
        email,
        password,
      });

      await login(response.data.token, response.data.user);
      
      if (response.data.user.role === 'resident') {
        navigation.replace('ResidentDashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flex={1} bg="emerald.50" safeArea>
      <Center flex={1} px={4}>
        <VStack space={6} width="100%" maxW="400px">
          {/* Logo */}
          <Center>
            <Box
              bg="emerald.600"
              width={80}
              height={80}
              rounded="full"
              alignItems="center"
              justifyContent="center"
              shadow={3}
              mb={4}
            >
              <Text fontSize="4xl" color="white" fontWeight="bold">
                T
              </Text>
            </Box>
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
              Login
            </Text>
            <Text fontSize="md" color="gray.600">
              Access your Tugon account
            </Text>
          </Center>

          {/* Error Alert */}
          <Collapse isOpen={!!error}>
            <Alert status="error" variant="left-accent">
              <HStack space={2} flexShrink={1} alignItems="center">
                <Alert.Icon />
                <Text flex={1} color="error.600" fontSize="sm">
                  {error}
                </Text>
                <IconButton
                  variant="unstyled"
                  icon={<CloseIcon size="3" color="error.600" />}
                  onPress={() => setError('')}
                />
              </HStack>
            </Alert>
          </Collapse>

          {/* Form */}
          <VStack space={4}>
            <FormControl>
              <FormControl.Label>Email</FormControl.Label>
              <Input
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                size="lg"
                bg="white"
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>Password</FormControl.Label>
              <Input
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                type="password"
                size="lg"
                bg="white"
              />
            </FormControl>

            <Button
              bg="emerald.600"
              size="lg"
              rounded="lg"
              isLoading={loading}
              isLoadingText="Logging in..."
              _pressed={{ bg: 'emerald.700' }}
              onPress={handleLogin}
              mt={2}
            >
              <Text fontSize="lg" fontWeight="bold" color="white">
                Login
              </Text>
            </Button>
          </VStack>

          {/* Register Link */}
          <Center>
            <HStack space={2}>
              <Text color="gray.600">Don't have an account?</Text>
              <Text
                color="emerald.600"
                fontWeight="bold"
                onPress={() => navigation.navigate('Register')}
              >
                Register here
              </Text>
            </HStack>
          </Center>
        </VStack>
      </Center>
    </Box>
  );
};

export default LoginScreen;
