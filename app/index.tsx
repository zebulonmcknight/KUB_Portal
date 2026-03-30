import { Redirect } from "expo-router";

export default function App() {
   // Redirect to the login screen by default
   return <Redirect href="/(auth)/login" />;
   
   // For working on non auth pages only remove later. Also uncomment the stack screen in app _layout.tsx
   // return <Redirect href="/(tabs)/billing" />;
}