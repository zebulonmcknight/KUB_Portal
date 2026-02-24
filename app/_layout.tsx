import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import './globals.css';

// Define a global theme for the app
// Allows for consistent styling even in screens that are layered on top
const globalTheme = {
  ...DefaultTheme, // This ensures React uses default theme as a base
  colors: {
    ...DefaultTheme.colors,
    background: '#091C3C', // We overwrite the values we have our own theme for
    text: '#F7FDFD',
  },
};

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  return (
    // Wrap the entire app in the ThemeProvider to apply the global theme
    <ThemeProvider value={globalTheme}>
      <Stack>
        {/* Authentication user flow*/}
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false, // Hide the header for the auth layout as well
          }}
        />

        {/* Main app flow */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false, // Hide the header for the main tab layout
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
