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
  return (
    // Wrap the entire app in the ThemeProvider to apply the global theme
    <ThemeProvider value={globalTheme}>
      <Stack>
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
