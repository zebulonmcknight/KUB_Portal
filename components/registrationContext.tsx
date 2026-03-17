/* This file creates a context that will accessible on the createLogin screens. 
   This is so that we can store what the user enters and send one api call to the server after they go through the entire process.
   Otherwise, by the time the user gets the the password screen, all prior info entered is basically lost
*/

import { createContext, useContext, useState } from "react";

// Create the context with null default
const RegistrationContext = createContext<any>(null);

export const RegistrationProvider = ({ children }: any) => {

   const [accountNumber, setAccountNumber] = useState("");
   const [zipCode, setZipCode] = useState("");
   const [ssn, setSSN] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");

   return(
      <RegistrationContext.Provider value={{
         accountNumber, setAccountNumber,
         zipCode, setZipCode,
         ssn, setSSN,
         email, setEmail,
         password, setPassword
      }}>
         {children}
      </RegistrationContext.Provider>
   );
};

export const useRegistration = () => useContext(RegistrationContext);