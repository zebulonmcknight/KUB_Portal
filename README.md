# KUB Portal

A cross-platform mobile application built with React Native and Expo that consolidates KUB's separate iOS and Android apps into a single unified codebase.

## Project Background

KUB currently maintains separate native mobile apps for iOS (Swift) and Android (Kotlin), requiring features and bug fixes to be implemented twice across two different platforms. This project consolidates both into a single React Native codebase, reducing maintenance overhead while preserving the existing user experience.

## Tech Stack

**Frontend:** React Native with Expo, Expo Router, NativeWind, TypeScript

**Backend:** Node.js, Express, TypeScript, Python

**Services:** Auth0 (Authentication), Stripe (Billing and Payments), Supabase (Database)

## App Overview

The app has four main tabs:
 
- **Billing** - view current bill, pay invoices, manage payment methods, enroll in AutoPay and billing programs (Levelized Billing, Paperless Billing, Round It Up), and browse offers and promotions
- **Profile** - account and contact information management
- **Outages** - outage map and reporting
- **Q&A** - RAG-based chatbot for customer support questions

The initial load screen is where user authentication is handled. Authentication supports account registration verified against predefined KUB account numbers, as well as login functionality and password reset via Auth0.

## Running the App

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- Expo Go application installed on mobile device
- The following environment variable in a ```.env``` file in the root directory:
```EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key```. Must have a Stripe developer dashboard to obtain this.

See [`backend/README.md`](./backend/README.md) for setup, [`backend/auth_documentation.md`](./backend/auth_documentation.md) for the Auth0 API reference, [`backend/stripe_documentation.md`](./backend/stripe_documentation.md) for the Stripe API reference, and [`customer_service/chatbot_documentation.md`](./customer_service/chatbot_documentation.md) for the Energi chatbot setup and API reference.

### Setup

```
npm install
npx expo start
```

Scan the QR code with Expo Go to launch application instance.


## Publishing (Steps for Production Release)
 
The app was not published to the Apple App Store or Google Play Store due to the costs involved. Apple's Developer Program requires a $99/year enrollment and Google Play requires a $25 one-time fee. Below are the steps that would be taken to publish the app if this were to move into production.
 
### Building for Production Prerequisites
 
```bash
npm install -g eas-cli
eas login
eas build:configure
```
 
### iOS - Apple App Store
 
1. Enroll in the Apple Developer Program
2. Create an App ID and profile in App Store Connect
3. Build: `eas build --platform ios`
4. Submit: `eas submit --platform ios`
5. Complete the App Store listing and submit for review

### Android - Google Play Store
 
1. Create a Google Play Developer account
2. Build: `eas build --platform android`
3. Submit: `eas submit --platform android`
4. Complete the Play Store listing and submit for review
