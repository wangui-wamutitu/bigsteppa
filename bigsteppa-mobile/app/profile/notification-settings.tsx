import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { Bell, BellOff, Calendar, Clock } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    enableNotifications: true,
    dailyReminders: true,
    weeklyRecap: true,
    challengeUpdates: true,
    systemAnnouncements: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  
  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, you would call an API to update notification settings
      // await userAPI.updateNotificationSettings(settings);
      
      // For demo purposes, we'll just show a success message after a delay
      setTimeout(() => {
        setIsLoading(false);
        router.back();
      }, 1000);
    } catch (error) {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Notification Settings</Text>
        <Text style={styles.subtitle}>
          Customize how and when you receive notifications
        </Text>
        
        <View style={styles.section}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                {settings.enableNotifications ? (
                  <Bell size={24} color={colors.primary} />
                ) : (
                  <BellOff size={24} color={colors.text.tertiary} />
                )}
              </View>
              <View>
                <Text style={styles.settingTitle}>Enable Notifications</Text>
                <Text style={styles.settingDescription}>
                  Turn on/off all notifications from the app
                </Text>
              </View>
            </View>
            <Switch
              value={settings.enableNotifications}
              onValueChange={() => toggleSetting('enableNotifications')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>
        
        {settings.enableNotifications && (
          <>
            <Text style={styles.sectionTitle}>Notification Types</Text>
            
            <View style={styles.section}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <View style={styles.iconContainer}>
                    <Clock size={24} color={colors.text.secondary} />
                  </View>
                  <View>
                    <Text style={styles.settingTitle}>Daily Reminders</Text>
                    <Text style={styles.settingDescription}>
                      Receive reminders for your daily challenges
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.dailyReminders}
                  onValueChange={() => toggleSetting('dailyReminders')}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <View style={styles.iconContainer}>
                    <Calendar size={24} color={colors.text.secondary} />
                  </View>
                  <View>
                    <Text style={styles.settingTitle}>Weekly Recap</Text>
                    <Text style={styles.settingDescription}>
                      Get a summary of your progress each week
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.weeklyRecap}
                  onValueChange={() => toggleSetting('weeklyRecap')}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <View style={styles.iconContainer}>
                    <Bell size={24} color={colors.text.secondary} />
                  </View>
                  <View>
                    <Text style={styles.settingTitle}>Challenge Updates</Text>
                    <Text style={styles.settingDescription}>
                      Notifications about challenge milestones
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.challengeUpdates}
                  onValueChange={() => toggleSetting('challengeUpdates')}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <View style={styles.iconContainer}>
                    <Bell size={24} color={colors.text.secondary} />
                  </View>
                  <View>
                    <Text style={styles.settingTitle}>System Announcements</Text>
                    <Text style={styles.settingDescription}>
                      Updates, new features, and important announcements
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings.systemAnnouncements}
                  onValueChange={() => toggleSetting('systemAnnouncements')}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>
            </View>
          </>
        )}
        
        <Button
          title="Save Settings"
          onPress={handleSaveSettings}
          loading={isLoading}
          style={styles.saveButton}
        />
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
    paddingBottom: 40,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 24,
    marginBottom: 16,
  },
  section: {
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  saveButton: {
    marginTop: 24,
  },
});