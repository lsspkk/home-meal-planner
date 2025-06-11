import express from 'express'
import { basicAuth, rateLimitMiddleware, AuthenticatedRequest } from '../auth'
import { loadUserWeeklyMenus, saveUserWeeklyMenus } from '../dataService'

const router = express.Router()

// GET /weekmenus - Returns weekly menus for authenticated user (rate limited)
router.get('/', basicAuth, rateLimitMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const weeklyMenus = loadUserWeeklyMenus(req.user.uuid)
    res.json(weeklyMenus)
  } catch (error) {
    res.status(500).json({ error: 'Failed to load weekly menus' })
  }
})

// POST /weekmenus - Saves weekly menus for authenticated user (rate limited, file size checked)
router.post('/', basicAuth, rateLimitMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const weeklyMenus = req.body
    if (typeof weeklyMenus !== 'object' || weeklyMenus === null) {
      return res.status(400).json({ error: 'Weekly menus must be an object' })
    }

    saveUserWeeklyMenus(req.user.uuid, weeklyMenus)
    res.json({ message: 'Weekly menus saved successfully' })
  } catch (error: any) {
    if (error.message.includes('File size exceeds')) {
      res.status(413).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Failed to save weekly menus' })
    }
  }
})

export default router
