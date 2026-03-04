# KUB Portal — Auth API Documentation

## Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm

### Install & Run

```bash
cd backend
npm install
npm run dev
```

The server runs on `http://localhost:3000`. Confirm it's up by hitting the health check:

```bash
curl http://localhost:3000/health
```

### Environment Variables

You will need a `.env` file in the `backend/` directory. 
It will need to contain: 

```
PORT=3000

NODE_ENV=development

SUPABASE_URL=

SUPABASE_SECRET_KEY=

STRIPE_SECRET_KEY=

STRIPE_PRICE_ID=

AUTH0_DOMAIN=

AUTH0_AUDIENCE=

AUTH0_CLIENT_ID=

AUTH0_CLIENT_SECRET= 
```

All of these values should be retrievable from their respective providers platforms, but some are hard to find through all the menus. Reach out if you need assistance finding any environment variables.

---

## Endpoints

### POST `/api/auth/signup`

Creates a new user account and returns an access token.

**Request Body**

| Field | Type | Required |
|---|---|---|
| `email` | string | yes |
| `password` | string | yes |
| `first_name` | string | no |
| `last_name` | string | no |
| `phone` | string | no |

**Example**

```javascript
const response = await fetch('http://localhost:3000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'Password123!',
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

| Status | Cause |
|---|---|
| 400 | Missing email or password |
| 401 | Signup failed (e.g. email already exists, weak password) |

---

### POST `/api/auth/login`

Authenticates an existing user and returns an access token.

**Request Body**

| Field | Type | Required |
|---|---|---|
| `email` | string | yes |
| `password` | string | yes |

**Example**

```javascript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'Password123!'
  })
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

| Status | Cause |
|---|---|
| 400 | Missing email or password |
| 401 | Invalid credentials |

---

## Using the Access Token

Store the access token after login/signup and attach it to subsequent authenticated requests as a Bearer token. Otherwise middleware may block your request.

```javascript
const response = await fetch('http://localhost:3000/api/some/endpoint', {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});
```

