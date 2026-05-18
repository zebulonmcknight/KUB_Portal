# KUB Portal - Stripe API Documentation

The server runs on `https://kubportal-production.up.railway.app`. Confirm it's up by hitting the health check:

```bash
curl https://kubportal-production.up.railway.app/health
```
If the health check fails, see [`backend/README.md`](./README.md) for local setup.

All billing endpoints require a valid JWT Bearer token in the `Authorization` header. See [`auth_documentation.md`](./auth_documentation.md) for how to obtain a token.

```javascript
headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${access_token}`,
}
```

---

## Endpoints

### POST `/api/billing/newCustomerSubscription`

Creates a new Stripe customer and subscription for a registered user based on their utility services.

**Request Body**

| Field      | Type     | Required |
| ---------- | -------- | -------- |
| `priceIds` | string[] | yes      |

**Example**

```javascript
const response = await fetch('https://kubportal-production.up.railway.app/api/billing/newCustomerSubscription', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`
  },
  body: JSON.stringify({ priceIds: ['price_electric_id', 'price_water_id'] })
});
```

**Success Response (200)**

```json
{ "success": true }
```

**Error Responses**

| Status | Cause                             |
| ------ | --------------------------------- |
| 400    | Missing or empty priceIds         |
| 404    | User not found in database        |
| 500    | Stripe or database error          |

---

### GET `/api/billing/getCurrentBill`

Returns the customer's most recent open or paid invoice for display on the billing screen.

**Request Body**

None.

**Example**

```javascript
const response = await fetch('https://kubportal-production.up.railway.app/api/billing/getCurrentBill', {
  method: 'GET',
  headers: { Authorization: `Bearer ${access_token}` }
});
const data = await response.json();
```

**Success Response (200)**

```json
{
  "totalAmountDue": 87.42,
  "dueDate": "2025-04-15T00:00:00.000Z",
  "isAutoPay": false,
  "isPaperless": true,
  "status": "open",
  "lineItems": [
    { "service": "Electric", "units": 450, "amount": 55.00 },
    { "service": "Water", "units": 3200, "amount": 32.42 }
  ],
  "invoicePdf": "https://invoice.stripe.com/..."
}
```

> `status` is `"open"`, `"paid"`, or `"none"` (new customer with no invoice yet).

**Error Responses**

| Status | Cause                      |
| ------ | -------------------------- |
| 404    | User not found in database |
| 500    | Stripe or database error   |

---

### GET `/api/billing/invoiceHistory`

Returns the full invoice and payment history for the current user. Each paid invoice produces both an invoice row and a payment row in the combined list.

**Request Body**

None.

**Example**

```javascript
const response = await fetch('https://kubportal-production.up.railway.app/api/billing/invoiceHistory', {
  method: 'GET',
  headers: { Authorization: `Bearer ${access_token}` }
});
const { items } = await response.json();
```

**Success Response (200)**

```json
{
  "items": [
    {
      "type": "payment",
      "id": "pay_in_ABC123",
      "paymentDate": "2025-03-15T12:00:00.000Z",
      "paymentAmount": 87.42,
      "paymentType": "Card Payment",
      "paymentStatus": "Completed",
      "invoiceId": "in_ABC123"
    },
    {
      "type": "invoice",
      "id": "in_ABC123",
      "invoiceDate": "2025-03-01T00:00:00.000Z",
      "amountDue": 87.42,
      "dueDate": "2025-03-19T00:00:00.000Z",
      "invoicePdf": "https://invoice.stripe.com/..."
    }
  ]
}
```

**Error Responses**

| Status | Cause                      |
| ------ | -------------------------- |
| 404    | User not found in database |
| 500    | Stripe or database error   |

---

### GET `/api/billing/paymentMethods`

Returns all saved payment methods for the current user, including which is set as default.

**Request Body**

None.

**Example**

```javascript
const response = await fetch('https://kubportal-production.up.railway.app/api/billing/paymentMethods', {
  method: 'GET',
  headers: { Authorization: `Bearer ${access_token}` }
});
const { methods } = await response.json();
```

**Success Response (200)**

```json
{
  "methods": [
    {
      "id": "pm_ABC123",
      "brand": "visa",
      "last4": "4242",
      "expMonth": 12,
      "expYear": 2027,
      "isDefault": true
    }
  ]
}
```

**Error Responses**

| Status | Cause                      |
| ------ | -------------------------- |
| 404    | User not found in database |
| 500    | Stripe or database error   |

---

### POST `/api/billing/paymentMethods/add`

Saves a new payment method via a completed Stripe SetupIntent. The frontend presents the Stripe SetupSheet, then sends the `setupIntentId` here to attach the card.

**Request Body**

| Field           | Type   | Required |
| --------------- | ------ | -------- |
| `setupIntentId` | string | yes      |

**Example**

```javascript
const response = await fetch('https://kubportal-production.up.railway.app/api/billing/paymentMethods/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`
  },
  body: JSON.stringify({ setupIntentId: 'seti_ABC123' })
});
```

**Success Response (200)**

```json
{ "success": true }
```

**Error Responses**

| Status | Cause                               |
| ------ | ----------------------------------- |
| 400    | Missing setupIntentId or no payment method on intent |
| 404    | User not found in database          |
| 500    | Stripe or database error            |

---

### POST `/api/billing/paymentMethods/remove`

Detaches a payment method from the customer's Stripe account.

**Request Body**

| Field             | Type   | Required |
| ----------------- | ------ | -------- |
| `paymentMethodId` | string | yes      |

**Example**

```javascript
const response = await fetch('https://kubportal-production.up.railway.app/api/billing/paymentMethods/remove', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`
  },
  body: JSON.stringify({ paymentMethodId: 'pm_ABC123' })
});
```

**Success Response (200)**

```json
{ "success": true }
```

**Error Responses**

| Status | Cause                    |
| ------ | ------------------------ |
| 400    | Missing paymentMethodId  |
| 500    | Stripe error             |

---

### POST `/api/billing/paymentMethods/setDefault`

Sets a payment method as the customer's default for future invoices.

**Request Body**

| Field             | Type   | Required |
| ----------------- | ------ | -------- |
| `paymentMethodId` | string | yes      |

**Example**

```javascript
const response = await fetch('https://kubportal-production.up.railway.app/api/billing/paymentMethods/setDefault', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`
  },
  body: JSON.stringify({ paymentMethodId: 'pm_ABC123' })
});
```

**Success Response (200)**

```json
{ "success": true }
```

**Error Responses**

| Status | Cause                      |
| ------ | -------------------------- |
| 400    | Missing paymentMethodId    |
| 404    | User not found in database |
| 500    | Stripe or database error   |

---

### POST `/api/billing/autopay/setup`

Creates a Stripe SetupIntent so the frontend can present the SetupSheet for AutoPay enrollment.

**Request Body**

None.

**Example**

```javascript
const response = await fetch('https://kubportal-production.up.railway.app/api/billing/autopay/setup', {
  method: 'POST',
  headers: { Authorization: `Bearer ${access_token}` }
});
const { clientSecret } = await response.json();
// Pass clientSecret to the Stripe SetupSheet
```

**Success Response (200)**

```json
{ "clientSecret": "seti_ABC123_secret_XYZ" }
```

**Error Responses**

| Status | Cause                      |
| ------ | -------------------------- |
| 404    | User not found in database |
| 500    | Stripe or database error   |

---

### POST `/api/billing/autopay/enroll`

Enrolls the customer in AutoPay using either a new card (via `setupIntentId` from the SetupSheet) or an existing saved card (via `paymentMethodId`). Exactly one of the two parameters is required.

**Request Body**

| Field               | Type   | Required              |
| ------------------- | ------ | --------------------- |
| `setupIntentId`     | string | yes (if new card)     |
| `paymentMethodId`   | string | yes (if existing card)|

**Example**

```javascript
// Using a new card
const response = await fetch('https://kubportal-production.up.railway.app/api/billing/autopay/enroll', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`
  },
  body: JSON.stringify({ setupIntentId: 'seti_ABC123' })
});

// Using an existing card
const response = await fetch('https://kubportal-production.up.railway.app/api/billing/autopay/enroll', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`
  },
  body: JSON.stringify({ paymentMethodId: 'pm_ABC123' })
});
```

**Success Response (200)**

```json
{ "success": true }
```

**Error Responses**

| Status | Cause                                          |
| ------ | ---------------------------------------------- |
| 400    | Neither setupIntentId nor paymentMethodId provided |
| 404    | User not found in database                     |
| 500    | Stripe or database error                       |

---

### POST `/api/billing/autopay/cancel`

Cancels AutoPay and switches the subscription back to manual invoice collection.

**Request Body**

None.

**Example**

```javascript
const response = await fetch('https://kubportal-production.up.railway.app/api/billing/autopay/cancel', {
  method: 'POST',
  headers: { Authorization: `Bearer ${access_token}` }
});
```

**Success Response (200)**

```json
{ "success": true }
```

**Error Responses**

| Status | Cause                      |
| ------ | -------------------------- |
| 404    | User not found in database |
| 500    | Stripe or database error   |

---

### POST `/api/billing/submitUsage`

Reports utility usage to Stripe for the next invoice cycle. Only include units for services the customer has.

**Request Body**

| Field              | Type   | Required                       |
| ------------------ | ------ | ------------------------------ |
| `electricUnits`    | number | yes (if customer has electric) |
| `waterUnits`       | number | yes (if customer has water)    |
| `wastewaterUnits`  | number | yes (if customer has wastewater)|

**Example**

```javascript
const response = await fetch('https://kubportal-production.up.railway.app/api/billing/submitUsage', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${access_token}` },
  body: JSON.stringify({ electricUnits: 450, waterUnits: 3200 })
});
```

**Success Response (200)**

```json
{ "success": true }
```

**Error Responses**

| Status | Cause                      |
| ------ | -------------------------- |
| 404    | User not found in database |
| 500    | Stripe or database error   |

---

### POST `/api/billing/payInvoice`

Pays the customer's current open invoice. If a `paymentMethodId` is provided, the backend confirms the payment directly. If omitted, returns a `clientSecret` for the frontend to present the Stripe PaymentSheet.

**Request Body**

| Field             | Type   | Required |
| ----------------- | ------ | -------- |
| `paymentMethodId` | string | no       |

**Example**

```javascript
// Pay with a saved card (backend confirms)
const response = await fetch('https://kubportal-production.up.railway.app/api/billing/payInvoice', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`
  },
  body: JSON.stringify({ paymentMethodId: 'pm_ABC123' })
});

// Pay with a new card (frontend presents PaymentSheet)
const response = await fetch('https://kubportal-production.up.railway.app/api/billing/payInvoice', {
  method: 'POST',
  headers: { Authorization: `Bearer ${access_token}` }
});
const { clientSecret } = await response.json();
```

**Success Response (200)**

```json
{ "success": true }
// or, when clientSecret is returned for PaymentSheet:
{ "clientSecret": "pi_ABC123_secret_XYZ" }
```

**Error Responses**

| Status | Cause                              |
| ------ | ---------------------------------- |
| 400    | No open invoice or payment failed  |
| 404    | User not found in database         |
| 500    | Stripe or database error           |

---

### POST `/api/billing/paperless/toggle`

Toggles paperless billing on or off for the current user.

**Request Body**

None.

**Example**

```javascript
const response = await fetch('https://kubportal-production.up.railway.app/api/billing/paperless/toggle', {
  method: 'POST',
  headers: { Authorization: `Bearer ${access_token}` }
});
const { isPaperless } = await response.json();
```

**Success Response (200)**

```json
{ "success": true, "isPaperless": true }
```

**Error Responses**

| Status | Cause                      |
| ------ | -------------------------- |
| 404    | User not found in database |
| 500    | Database error             |