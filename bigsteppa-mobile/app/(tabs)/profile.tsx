import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { userAPI } from '@/utils/api';
import { useRouter } from 'expo-router';
import { Bell, ChevronRight, Edit, HelpCircle, LogOut, Shield, Trash2, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: confirmDeleteAccount
        }
      ]
    );
  };
  
  const confirmDeleteAccount = async () => {
    try {
      setIsLoading(true);
      await userAPI.deleteAccount();
      await logout();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const navigateToUpdateUsername = () => {
    router.push('/profile/update-username');
  };
  
  const navigateToResetPassword = () => {
    router.push('/profile/reset-password');
  };
  
  const navigateToNotificationSettings = () => {
    router.push('/profile/notification-settings');
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <User size={40} color={colors.white} />
          </View>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.joinDate}>Member since {new Date(user.createdAt).toLocaleDateString()}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Challenges</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToUpdateUsername}
          >
            <View style={styles.menuItemLeft}>
              <Edit size={20} color={colors.text.secondary} />
              <Text style={styles.menuItemText}>Update Username</Text>
            </View>
            <ChevronRight size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToResetPassword}
          >
            <View style={styles.menuItemLeft}>
              <Shield size={20} color={colors.text.secondary} />
              <Text style={styles.menuItemText}>Reset Password</Text>
            </View>
            <ChevronRight size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToNotificationSettings}
          >
            <View style={styles.menuItemLeft}>
              <Bell size={20} color={colors.text.secondary} />
              <Text style={styles.menuItemText}>Notification Settings</Text>
            </View>
            <ChevronRight size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => Alert.alert('Help & Support', 'This feature is not implemented in the demo.')}
          >
            <View style={styles.menuItemLeft}>
              <HelpCircle size={20} color={colors.text.secondary} />
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => Alert.alert('Privacy Policy', 'This feature is not implemented in the demo.')}
          >
            <View style={styles.menuItemLeft}>
              <Shield size={20} color={colors.text.secondary} />
              <Text style={styles.menuItemText}>Privacy Policy</Text>
            </View>
            <ChevronRight size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          
          <TouchableOpacity 
            style={[styles.menuItem, styles.dangerItem]}
            onPress={handleDeleteAccount}
          >
            <View style={styles.menuItemLeft}>
              <Trash2 size={20} color={colors.status.error} />
              <Text style={[styles.menuItemText, styles.dangerText]}>Delete Account</Text>
            </View>
            <ChevronRight size={20} color={colors.status.error} />
          </TouchableOpacity>
        </View>
        
        <Button
          title="Log Out"
          onPress={handleLogout}
          loading={isLoading}
          variant="outline"
          icon={<LogOut size={20} color={colors.primary} style={{ marginRight: 8 }} />}
          style={styles.logoutButton}
        />
        
        <Text style={styles.versionText}>BigSteppa v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 12,
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: colors.status.error,
  },
  logoutButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.text.tertiary,
  },
});