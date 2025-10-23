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
  CloseIcon,
  Select,
  CheckIcon,
  ScrollView
} from 'native-base';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('resident');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleRegister = async () => {
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://10.0.2.2:5000/api/auth/register', {
        name,
        email,
        password,
        role,
      });

      await login(response.data.token, response.data.user);
      
      if (response.data.user.role === 'resident') {
        navigation.replace('ResidentDashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flex={1} bg="emerald.50" safeArea>
      <ScrollView>
        <Center flex={1} px={4} py={8}>
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
                Register
              </Text>
              <Text fontSize="md" color="gray.600">
                Create your Tugon account
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
                <FormControl.Label>Full Name</FormControl.Label>
                <Input
                  placeholder="Juan Dela Cruz"
                  value={name}
                  onChangeText={setName}
                  size="lg"
                  bg="white"
                />
              </FormControl>

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

              <FormControl>
                <FormControl.Label>Confirm Password</FormControl.Label>
                <Input
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  type="password"
                  size="lg"
                  bg="white"
                />
              </FormControl>

              <FormControl>
                <FormControl.Label>Register As</FormControl.Label>
                <Select
                  selectedValue={role}
                  minWidth="200"
                  accessibilityLabel="Choose Role"
                  placeholder="Choose Role"
                  _selectedItem={{
                    bg: 'emerald.600',
                    endIcon: <CheckIcon size="5" />
                  }}
                  mt={1}
                  onValueChange={itemValue => setRole(itemValue)}
                  bg="white"
                  size="lg"
                >
                  <Select.Item label="Resident" value="resident" />
                  <Select.Item label="Admin (Official ID Required)" value="admin" />
                </Select>
              </FormControl>

              <Button
                bg="emerald.600"
                size="lg"
                rounded="lg"
                isLoading={loading}
                isLoadingText="Creating account..."
                _pressed={{ bg: 'emerald.700' }}
                onPress={handleRegister}
                mt={2}
              >
                <Text fontSize="lg" fontWeight="bold" color="white">
                  Register
                </Text>
              </Button>
            </VStack>

            {/* Login Link */}
            <Center pb={4}>
              <HStack space={2}>
                <Text color="gray.600">Already have an account?</Text>
                <Text
                  color="emerald.600"
                  fontWeight="bold"
                  onPress={() => navigation.navigate('Login')}
                >
                  Login here
                </Text>
              </HStack>
            </Center>
          </VStack>
        </Center>
      </ScrollView>
    </Box>
  );
};

export default RegisterScreen;
