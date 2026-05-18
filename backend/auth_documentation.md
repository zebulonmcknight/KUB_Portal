# KUB Portal — Auth API Documentation

The server runs on `https://kubportal-production.up.railway.app`. Confirm it's up by hitting the health check:

```bash
curl https://kubportal-production.up.railway.app/health
```

---

## Endpoints

### POST `/api/auth/signup`

Creates a new user account and returns an access token.

**Request Body**

| Field            | Type   | Required |
| ---------------- | ------ | -------- |
| `email`          | string | yes      |
| `password`       | string | yes      |
| `account_number` | string | yes      |
| `first_name`     | string | no       |
| `last_name`      | string | no       |
| `phone`          | string | no       |

**Example**

```javascript
const response = await fetch('https://kubportal-production.up.railway.app/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'Password123!',
    account_number: '1234567890',
    first_name: 'John',
    last_name: 'Doe',
    phone: '4231231234'
  })
});
const data = await response.json();
// data.access_token — store this for authenticated requests
// data.expires_in   — token lifetime in seconds (86400 = 24hrs)
```

**Success Response (201)**

```json
{
  "message": "Signup Successful",
  "access_token": "<jwt>",
  "expires_in": 86400
}
```

**Error Responses**

| Status | Cause                                                    |
| ------ | -------------------------------------------------------- |
| 400    | Missing email or password                                |
| 401    | Signup failed (e.g. email already exists, weak password) |

---

### POST `/api/auth/login`

Authenticates an existing user and returns an access token.

**Request Body**

| Field      | Type   | Required |
| ---------- | ------ | -------- |
| `email`    | string | yes      |
| `password` | string | yes      |

**Example**

```javascript
const response = await fetch("https://kubportal-production.up.railway.app/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    password: "Password123!",
  }),
});
const data = await response.json();
// data.access_token — store this for authenticated requests
```

**Success Response (200)**

```json
{
  "access_token": "<jwt>",
  "expires_in": 86400
}
```

**Error Responses**

| Status | Cause                     |
| ------ | ------------------------- |
| 400    | Missing email or password |
| 401    | Invalid credentials       |

---

### POST `/api/auth/resetPassword`

Sends a password reset link to the provided email address. For security reasons, the response is the same whether or not the email exists in the system.

**Request Body**

| Field   | Type   | Required |
| ------- | ------ | -------- |
| `email` | string | yes      |

**Example**

```javascript
const response = await fetch("https://kubportal-production.up.railway.app/api/auth/resetPassword", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
  }),
});
const data = await response.json();
// data.message — confirmation string (same regardless of whether the email exists)
```

**Success Response (200)**

```json
{
  "message": "If an account exists for that email, a reset link has been sent."
}
```

**Error Responses**

| Status | Cause                              |
| ------ | ---------------------------------- |
| 400    | Missing email                      |
| 500    | Password reset failed (server error) |

> **Note:** This endpoint does not require authentication. The reset link is delivered via email and handled by Auth0.

---

### POST `/api/auth/verifyKubAccount`

Verifies that a KUB service account exists and has not already been registered. Called during the registration flow before collecting email and password. Used to confirm the user is an existing KUB customer.

**Request Body**

| Field            | Type   | Required |
| ---------------- | ------ | -------- |
| `account_number` | string | yes      |
| `ssn_last4`      | string | yes      |
| `zip`            | string | yes      |

**Example**

```javascript
const response = await fetch("https://kubportal-production.up.railway.app/api/auth/verifyKubAccount", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    account_number: "1234567890",
    ssn_last4: "1234",
    zip: "12345",
  }),
});
```

**Success Response (200)**

```json
{
  "account_number": "1234567890"
}
```

**Error Responses**

| Status | Cause                                                        |
| ------ | ------------------------------------------------------------ |
| 400    | Missing account_number, ssn_last4, or zip                    |
| 404    | No matching KUB service account found                        |
| 409    | A portal account already exists for this service account     |
| 500    | Server or database error                                     |

> **Note:** This endpoint does not require authentication. It only checks that the KUB service account exists and is not yet registered — it does not create any account.

---

## Using the Access Token

Store the access token after login/signup and attach it to subsequent authenticated requests as a Bearer token. Otherwise middleware may block your request.

```javascript
const response = await fetch("https://kubportal-production.up.railway.app/api/some/endpoint", {
  headers: {
    Authorization: `Bearer ${access_token}`,
  },
});
```
