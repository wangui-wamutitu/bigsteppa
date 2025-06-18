import { useAuthStore } from '@/store/authStore';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isAuthenticated } = useAuthStore();
  
  return isAuthenticated ? <Redirect href="/(tabs)" /> : <Redirect href="/login" />;
}