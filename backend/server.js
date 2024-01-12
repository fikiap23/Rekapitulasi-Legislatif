import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db/connectDB.js'
import cookieParser from 'cookie-parser'
import adminRoutes from './routes/adminRoutes.js'
import userRoutes from './routes/userRoutes.js'
import cors from 'cors'

dotenv.config()

connectDB()

const app = express()

app.use(cors())

const PORT = process.env.PORT || 5000

// Tambahkan konfigurasi limit untuk express.json()
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded data in the request body
app.use(cookieParser())

// Routes
app.use('/api/v1/admins', adminRoutes)
app.use('/api/v1/users', userRoutes)

app.listen(PORT, () => {
  console.log(`Server started at  http://localhost:${PORT}`)
})
