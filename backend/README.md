# KUB Portal Backend

Express.js + TypeScript backend API for the KUB Portal mobile application.

## Quick Start

### 1. Pull the Backend Branch

```bash
git fetch origin
git checkout zeb
git pull origin zeb
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Create Environment File

```bash
touch .env
echo "PORT=3000" > .env
echo "NODE_ENV=development" > .env
```

### 4. Start Development Server

```bash
npm run dev
```

Server will start on `http://192.168.1.198:3000`

### 5. Verify It's Running

In a seperate terminal instance:

```bash
curl http://192.168.1.198:3000/health
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
