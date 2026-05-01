# Currency Converter

A full-stack currency converter application with real-time exchange rates, live charts, conversion history, and user authentication.

## Features

- 🔄 Real-time currency conversion
- 📈 Live rate charts with historical data (1D, 7D, 1M views)
- 💾 Save favorite currency pairs
- 📜 Conversion history tracking
- 🔐 User authentication (register/login)
- ⚡ Redis caching for improved performance
- 🌙 Dark mode support

## Tech Stack

### Backend
- Node.js + Express
- MongoDB (Mongoose ODM)
- Redis (caching)
- Frankfurter API (exchange rates)

### Frontend
- React + Vite
- Recharts (charts)
- React Router
- Context API (state management)

## Prerequisites

- Node.js (v18+)
- MongoDB
- Redis (optional - falls back to in-memory cache)

## Installation

### 1. Clone the repository

```bash
cd currency-converter
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/currency-converter
EXCHANGE_API_KEY=your_exchangerate_api_key
JWT_SECRET=your_jwt_secret_key
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update user profile | Yes |
| POST | `/api/auth/pairs` | Save currency pair | Yes |
| GET | `/api/auth/pairs` | Get saved pairs | Yes |
| DELETE | `/api/auth/pairs` | Delete saved pair | Yes |

### Conversion

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/convert?from=USD&to=NGN&amount=100` | Convert currency | Optional |
| GET | `/api/convert/rates/history?from=USD&to=NGN&range=1d` | Get rate history | Optional |
| GET | `/api/convert/history` | Get user conversion history | Yes |
| GET | `/api/convert/pair?pairId=xxx&amount=100` | Convert using saved pair | Yes |

## Project Structure

```
currency-converter/
├── backend/
│   ├── config/
│   │   ├── db.js          # MongoDB connection
│   │   └── redis.js       # Redis client
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── convertcontrollers.js
│   │   └── historyController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Conversion.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── convertRoute.js
│   │   └── exchangeRoutes.js
│   ├── services/
│   │   └── exchangeService.js
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   ├── cache.js
│   │   └── currencies.js
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   └── pages/
    └── index.html
```

## Environment Variables

### Backend (.env)

| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 5000) |
| MONGO_URI | MongoDB connection string |
| EXCHANGE_API_KEY | API key from ExchangeRate-API |
| JWT_SECRET | Secret key for JWT tokens |

## Usage

1. **Register/Login**: Create an account or login to save favorite pairs
2. **Convert**: Select currencies and enter amount to convert
3. **Charts**: View live rate trends with 1D/7D/1M options
4. **History**: See your past conversions
5. **Favorites**: Save frequently used currency pairs

## License

MIT

---

## Deployment Guide

### Quick Deploy with Render + Vercel

#### 1. Prepare MongoDB (MongoDB Atlas)
1. Create free account at [mongodb.com/cloud](https://www.mongodb.com/cloud)
2. Create free cluster (M0)
3. Create database user with password
4. Get connection string (replace password)

#### 2. Deploy Backend (Render)

**Option A: GitHub Integration**
1. Push code to GitHub
2. Create account at [render.com](https://render.com)
3. New Web Service → Connect your repo
4. Settings:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `node server.js`
5. Add Environment Variables:
   ```
   MONGO_URI=mongodb+srv://...
   EXCHANGE_API_KEY=your_key
   JWT_SECRET=random_string_32_chars
   ```

**Option B: CLI**
```bash
npm i -g @renderhq/service-create
render deploy backend
```

#### 3. Deploy Frontend (Vercel)

1. Create account at [vercel.com](https://vercel.com)
2. New Project → Import your repo
3. Settings:
   - Framework Preset: Vite
   - Root directory: `frontend`
4. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

#### 4. Update Frontend API URL

The app is already configured to use `VITE_API_URL` env variable. Just set it in Vercel!

---

### Alternative: All-in-One on Railway

1. Create account at [railway.app](https://railway.app)
2. Add MongoDB plugin
3. Deploy both services via GitHub integration

---

### Environment Variables Reference

| Variable | Where | Description |
|----------|-------|-------------|
| `MONGO_URI` | Backend | MongoDB Atlas connection string |
| `EXCHANGE_API_KEY` | Backend | Get from [ExchangeRate-API](https://www.exchangerate-api.com/) |
| `JWT_SECRET` | Backend | Random 32+ char string |
| `VITE_API_URL` | Frontend | Your backend URL (e.g., `https://backend.onrender.com/api`) |# currency-pro
