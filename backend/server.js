import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db/connectDB.js'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import partyRoutes from './routes/party.routes.js'
import districtRoutes from './routes/district.routes.js'
import villageRoutes from './routes/village.routes.js'
import userRoutes from './routes/user.routes.js'
import votesResultRoutes from './routes/votesResult.routes.js'

import cors from 'cors'

dotenv.config()

connectDB()

const app = express()

app.use(
  cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: 'http://localhost:3030',
    credentials: true,
  })
)

const PORT = process.env.PORT || 5000

// Tambahkan konfigurasi limit untuk express.json()
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded data in the request body
app.use(cookieParser())

// Routes
app.use('/api/v2/auth', authRoutes)
app.use('/api/v2/parties', partyRoutes)
app.use('/api/v2/districts', districtRoutes)
app.use('/api/v2/villages', villageRoutes)
app.use('/api/v2/users', userRoutes)
app.use('/api/v2/result', votesResultRoutes)

app.listen(PORT, () => {
  console.log(`Server started at  http://localhost:${PORT}`)
})
