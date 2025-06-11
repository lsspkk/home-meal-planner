import express from 'express'
import { basicAuth, rateLimitMiddleware, AuthenticatedRequest } from '../auth'
import { loadUserRecipes, saveUserRecipes } from '../dataService'

const router = express.Router()

// GET /recipes - Returns recipes for authenticated user (rate limited)
router.get('/', basicAuth, rateLimitMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const recipes = loadUserRecipes(req.user.uuid)
    res.json(recipes)
  } catch (error) {
    res.status(500).json({ error: 'Failed to load recipes' })
  }
})

// POST /recipes - Saves recipes for authenticated user (rate limited, file size checked)
router.post('/', basicAuth, rateLimitMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const recipes = req.body
    if (!Array.isArray(recipes)) {
      return res.status(400).json({ error: 'Recipes must be an array' })
    }

    saveUserRecipes(req.user.uuid, recipes)
    res.json({ message: 'Recipes saved successfully' })
  } catch (error: any) {
    if (error.message.includes('File size exceeds')) {
      res.status(413).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Failed to save recipes' })
    }
  }
})

export default router
