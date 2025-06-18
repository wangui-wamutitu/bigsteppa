import { useAuthStore } from "@/store/authStore";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

export const unstable_settings = {
  initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  
  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <RootLayoutNav />
    </>
  );
}

function RootLayoutNav() {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="challenge/[id]" 
            options={{ 
              headerShown: true,
              title: "Challenge Details",
              headerBackTitle: "Back",
            }} 
          />
          <Stack.Screen 
            name="challenge/create" 
            options={{ 
              headerShown: true,
              title: "Create Challenge",
              headerBackTitle: "Back",
              presentation: "modal",
            }} 
          />
          <Stack.Screen 
            name="challenge/edit/[id]" 
            options={{ 
              headerShown: true,
              title: "Edit Challenge",
              headerBackTitle: "Back",
              presentation: "modal",
            }} 
          />
        </>
      ) : (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}