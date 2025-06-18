import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { userAPI } from '@/utils/api';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UpdateUsernameScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [username, setUsername] = useState(user?.username || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const validateUsername = () => {
    if (!username.trim()) {
      setError('Username is required');
      return false;
    } else if (username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    return true;
  };
  
  const handleUpdateUsername = async () => {
    setError('');
    
    if (validateUsername()) {
      setIsLoading(true);
      
      try {
        await userAPI.updateProfile({ username });
        Alert.alert(
          'Success',
          'Username updated successfully',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to update username');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Update Username</Text>
          <Text style={styles.subtitle}>
            Choose a new username for your account
          </Text>
          
          <View style={styles.form}>
            <Input
              label="Username"
              placeholder="Enter new username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              error={error}
            />
            
            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={() => router.back()}
                variant="outline"
                style={styles.cancelButton}
              />
              
              <Button
                title="Update"
                onPress={handleUpdateUsername}
                loading={isLoading}
                style={styles.updateButton}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 24,
  },
  form: {
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
  },
  updateButton: {
    flex: 2,
  },
});