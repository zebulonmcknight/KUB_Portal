# KUB Portal Backend

Express.js + TypeScript backend API for the KUB Portal mobile application. 

## Quick Start on Local Host

### 1. Pull the Backend Branch

```bash
git fetch origin
git checkout backend
git pull origin backend
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### Configure Environment Variables

Create a `.env` file in the backend directory with the following:

```env
PORT=3000
NODE_ENV=development
SUPABASE_URL=your_project_url
SUPABASE_SECRET_KEY=your_supabase_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_ELECTRIC_ID=electric_price_id
STRIPE_WATER_ID=water_price_id
STRIPE_WASTE_WATER_ID=waste_water_price_id
AUTH0_DOMAIN=your_auth_domain
AUTH0_AUDIENCE=your_auth_audience
AUTH0_CLIENT_ID=your_auth_id
AUTH0_CLIENT_SECRET=your_auth_secret
```

Environment variables should be retrieved from relevant dashboards. 

### 4. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

### 5. Verify It's Running

In a seperate terminal instance:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2025-02-06T...",
  "service": "KUB Portal API"
}
```

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build
