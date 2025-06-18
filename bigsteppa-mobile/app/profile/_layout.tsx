import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="update-username" 
        options={{ 
          headerTitle: "Update Username",
          presentation: "modal",
        }} 
      />
      <Stack.Screen 
        name="reset-password" 
        options={{ 
          headerTitle: "Reset Password",
          presentation: "modal",
        }} 
      />
      <Stack.Screen 
        name="notification-settings" 
        options={{ 
          headerTitle: "Notification Settings",
        }} 
      />
    </Stack>
  );
}