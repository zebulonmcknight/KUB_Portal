import { RegistrationProvider } from "@/components/registrationContext";
import { Stack } from "expo-router";

export default function AuthLayout() {
   return (
      <RegistrationProvider>
         <Stack />
      </RegistrationProvider>
   )
}

