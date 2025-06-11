import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { ensureDataDir, loadUsers } from './dataService'
import userRoutes from './routes/user'
import recipeRoutes from './routes/recipes'
import weekMenuRoutes from './routes/weekmenus'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Initialize data storage
ensureDataDir()
loadUsers()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/user', userRoutes)
app.use('/recipes', recipeRoutes)
app.use('/weekmenus', weekMenuRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Data directory: ${process.env.DATA_DIR || './data'}`)
})

export default app
