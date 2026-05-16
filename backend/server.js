import "dotenv/config"
import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser";
import { errorHandler } from './middleware/errorMiddleware.js'
import { connectDB } from './config/db.js'
import { initRedis } from './config/redis.js';
import "./config/passport.js";
import exchangeRoutes from './routes/exchangeRoutes.js'
import convertRoutes from './routes/convertRoute.js'
import authRoutes from './routes/authRoutes.js'

const app = express()
connectDB()
await initRedis();

const allowedOrigins = [
  "http://localhost:5173",
  "https://currencypro-app.vercel.app",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json())
app.use(cookieParser());

app.use('/api/exchange', exchangeRoutes)
app.use('/api/convert', convertRoutes)
app.use('/api/auth', authRoutes)

app.use(errorHandler)
app.get('/', (req, res) => {
    res.send('Converter app API is running...')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})