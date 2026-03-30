/* This file creates a context that will accessible on all screens. 
   This is so that we can store the authorization while the app is open, so that it can be used throughout the app.
   Otherwise, by the time the user leaves the credential screen, the token will be lost
*/

import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useState } from "react";

// Create the context with null default
const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {

   const [accessToken, setAccessToken] = useState("");

   const getToken = async (): Promise<string | null> => {
      const storedToken = await SecureStore.getItemAsync('access_token');
      const expiry = await SecureStore.getItemAsync('token_expiry');

      // If we have a storedToken then use it
      if( storedToken && expiry && Date.now() < parseInt(expiry) ){
         return storedToken;
      }

      // Fall back to temp token
      if( accessToken ){
            return accessToken;
      }

      return null;
   }

   return(
      <AuthContext.Provider value={{accessToken, setAccessToken, getToken}}>
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => useContext(AuthContext);