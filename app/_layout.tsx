import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import './globals.css';

const globalTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#091C3C',
    text: '#F7FDFD',
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={globalTheme}>
      <Stack screenOptions={{
        contentStyle:{backgroundColor: '#091C3C'}
      }}>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
          
        />
      </Stack>
    </ThemeProvider>
  );
}
