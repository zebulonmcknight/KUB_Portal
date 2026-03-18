import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native";
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import './globals.css';

// Define a global theme for the app
// Allows for consistent styling even in screens that are layered on top
const globalTheme = {
  ...DefaultTheme, // This ensures React uses default theme as a base
  colors: {
    ...DefaultTheme.colors,
    background: "#091C3C", // We overwrite the values we have our own theme for
    text: "#F7FDFD",
  },
};

// Prevent the splash screen from hiding until we tell it to
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  // Attempt to load the fonts for the app
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Watch the status of the fonts. Once loaded or if it fails drop the splash screen so user can use the application
  useEffect(() => {
    if( fontsLoaded || fontError ){
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // If fonts aren't loaded yet then dont display anything. Prevents login screen from rendering too early.
  if( !fontsLoaded && !fontError ){
    return null;
  }

  return (
    // Wrap the entire app with the StripeProvider for billing purposes
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
    >
      {/* Wrap the entire app in the ThemeProvider to apply the global theme */}
      <ThemeProvider value={globalTheme}>
        <Stack>
          {/* Authentication user flow*/}
          {/* <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false, // Hide the header for the auth layout as well
            }}
          /> */}

          {/* Main app flow */}
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false, // Hide the header for the main tab layout
            }}
          />
        </Stack>
      </ThemeProvider>
    </StripeProvider>
  );
}
