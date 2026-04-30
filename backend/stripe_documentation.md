# KUB Portal - Stripe API Documentation

### ALL API ENDPOINTS REQUIRE AN AUTHORIZATION BEARER TOKEN IN THE HEADER FOR AUTHENTICATION PURPOSES
### THE PARAMETERS FOR EACH ENDPOINT LISTED BELOW ARE THE ADDITIONAL INFORMATION NEEDED FROM THE BODY OF THE REQUEST

### Example Endpoint Call
```javasccript
const response = await fetch(ENDPOINT, {
  method: "POST/GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer $(access_token)`,
  },
  body: JSON.stringify({ PARAMETERS }),
});
```

### Create a new customer subscription
Endpoint: https://kubportal-production.up.railway.app/api/billing/newCustomerSubscription  
Purpose: Creates a new customer in the Stripe dashboard based on the userId from Auth0. Also creates a new subscription for the customer based on the utility services they own (electric, wastewater, and/or water).  
Parameters: Utility priceIds (electric, wastewater, and water)  
Type: POST  

### Get the customer's current bill
Endpoint: https://kubportal-production.up.railway.app/api/billing/getCurrentBill  
Purpose: Retrieve the customer's most recent bill and return the information as a JSON object to the frontend for display purposes.  
Parameters: None  
Type: GET

### Get the customer's invoice history
Endpoint: https://kubportal-production.up.railway.app/api/billing/invoiceHistory  
Purpose: Return the full invoice and payment history for the current customer back to the front-end for display purposes.  
Note: Each paid invoice produces both an invoice and a payment row in the combined list  
Parameters: None  
Type: GET  

### Get the customer's saved payment methods
Endpoint: https://kubportal-production.up.railway.app/api/billing/paymentMethods  
Purpose: Return all saved payment methods for the current user.  
Parameters: None  
Type: GET  

### Remove a customer's payment method
Endpoint: https://kubportal-production.up.railway.app/api/billing/paymentMethods/remove  
Purpose: Detaches a payment method from the customer's Stripe account  
Parameters: paymentMethodId  
Type: POST  

### Add a payment method to a customer's account
Endpoint: https://kubportal-production.up.railway.app/api/billing/paymentMethods/add  
Purpose: Adds a new payment method via a completed SetupIntent. Frontend presents SetupSheet, completes it, then sends the setupIntentId here.  
Parameters: setupIntentId  
Type: POST  

### Change/Setup a default payment method for a customer
Endpoint: https://kubportal-production.up.railway.app/api/billing/paymentMethods/setDefault  
Purpose: Sets a payment method as the customer's default for invoices.  
Parameters: paymentMethodId  
Type: POST  

### Create the setupIntent for a customer wishing to enroll in autopay
Endpoint: https://kubportal-production.up.railway.app/api/billing/autopay/setup  
Purpose: Create the setupIntent necessary for actually enrolling a customer in autopay.  
Parameters: None  
Type: POST  

### Enroll a customer in autopay
Endpoint: https://kubportal-production.up.railway.app/api/billing/autopay/enroll  
Purpose: Enroll a customer in autopay.  
Parameters: setupIntentId, paymentMethodId (the one they want to use for autopay)  
Type: POST

### Cancel autopay
Endpoint: https://kubportal-production.up.railway.app/api/billing/autopay/cancel  
Purpose: Cancel a customer's autopay.  
Parameters: None  
Type: POST

### Submit utility usage
Endpoint: https://kubportal-production.up.railway.app/api/billing/submitUsage  
Purpose: Report all of the customer's utility usage to Stripe for the calculation of the next month/pay period invoice.  
Parameters: electricUnits, waterUnits, wastewaterUnits (only need the Units for the services the customer actually owns)  
Type: POST

### Pay invoice
Endpoint: https://kubportal-production.up.railway.app/api/billing/payInvoice  
Purpose: Allow the customer to pay their current invoice.  
Parameters: paymentMethodId  
Type: POST  

### Toggle paperless
Endpoint: https://kubportal-production.up.railway.app/api/billing/paperless/toggle  
Purpose: Toggles the paperless billing on or off for the current user.  
Parameters: None  
Type: POST  



