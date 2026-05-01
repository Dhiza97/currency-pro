import express from 'express'
import cors from 'cors'
import { errorHandler } from './middleware/errorMiddleware.js'
import { connectDB } from './config/db.js'
import { initRedis } from './config/redis.js';
import exchangeRoutes from './routes/exchangeRoutes.js'
import convertRoutes from './routes/convertRoute.js'
import authRoutes from './routes/authRoutes.js'

const app = express()
connectDB()
await initRedis();

app.use(cors())
app.use(express.json())

app.use('/api/exchange', exchangeRoutes)
app.use('/api/convert', convertRoutes)
app.use('/api/auth', authRoutes)

app.use(errorHandler)
app.get('/', (req, res) => {
    res.send('Converter app API is running...')
})

const PORT = 5000 || process.env.PORT

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})