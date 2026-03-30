/* This file creates a context that will accessible on all screens. 
   This is so that we can store the authorization while the app is open, so that it can be used throughout the app.
   Otherwise, by the time the user leaves the credential screen, the token will be lost
*/

import { createContext, useContext, useState } from "react";

// Create the context with null default
const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {

   const [accessToken, setAccessToken] = useState("");

   return(
      <AuthContext.Provider value={{accessToken, setAccessToken}}>
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => useContext(AuthContext);