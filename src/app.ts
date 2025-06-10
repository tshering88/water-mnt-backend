import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import userRoutes from './routes/userRoutes'
import cors from 'cors'
import dzongkhagRoutes from './routes/dzongkhagRoutes'
import gewogRoutes from './routes/gewogRoutes'

const app = express();

app.use(express.json())
app.use(
    cors({
        origin: '*', // fronted origin
        credentials: false
    })
)
// Server Upload

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/dzongkhag', dzongkhagRoutes)
app.use('/api/v1/gewog', gewogRoutes)

// 🏠 Root route
app.get('/', (req, res) => {
  res.send(`
    🚀 API is running...
    🌐 Status: Online
    
  `)
})

export default app
