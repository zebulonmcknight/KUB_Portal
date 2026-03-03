# Auth API Documentation

# Login

## Endpoint

    POST /api/auth/login

## Request Body (JSON)

``` json
{
  "email": "user@example.com",
  "password": "userPassword"
}
```

## Success Response (200)

``` json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 86400
}
```

## Error Responses

### 400 -- Missing fields

``` json
{
  "error": "Email and password are required"
}
```

### 401 -- Invalid credentials / Auth failure

``` json
{
  "error": "Invalid email or password"
}
```

# Signup

## Endpoint

    POST /api/auth/signup

## Request Body (JSON)

``` json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "1234567890"
}
```

## Success Response (201)

``` json
{
  "message": "Signup Successful"
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 86400
}
```

## Error Responses

### 400 -- Missing fields

``` json
{
  "error": "Email and password are required"
}
```

### 401 -- Signup failed

``` json
{
  "error": "Signup Failed"
}
```

------------------------------------------------------------------------

# Using the Access Token

After login, store:

-   `access_token`
-   `expires_in`

Include the token in future API requests:

    Authorization: Bearer <access_token>
