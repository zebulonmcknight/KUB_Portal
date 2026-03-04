import { Redirect } from "expo-router";

export default function App() {
   // Redirect to the login screen by default
   return <Redirect href="/(auth)/login" />;
}