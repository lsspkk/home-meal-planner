import express from 'express'
import { basicAuth, rateLimitMiddleware, AuthenticatedRequest } from '../auth'
import { loadUserWeeklyMenus, saveUserWeeklyMenus } from '../dataService'
import { UpdateWeeklyMenusRequest, StaleDataError } from '../types'

const router = express.Router()

// GET /weekmenus - Returns weekly menus for authenticated user (rate limited)
router.get('/', basicAuth, rateLimitMiddleware, (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const timestampedWeeklyMenus = loadUserWeeklyMenus(req.user.uuid)
    res.json(timestampedWeeklyMenus)
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

    const requestData = req.body as UpdateWeeklyMenusRequest

    // Validate request structure
    if (
      !requestData ||
      typeof requestData !== 'object' ||
      !requestData.data ||
      typeof requestData.lastModified !== 'number'
    ) {
      return res.status(400).json({
        error: 'Invalid request format',
        message: 'Request must include data and lastModified fields',
      })
    }

    const updatedData = saveUserWeeklyMenus(req.user.uuid, requestData.data, requestData.lastModified)
    res.json(updatedData)
  } catch (error: any) {
    if (error.message === 'STALE_DATA') {
      const staleError: StaleDataError = {
        error: 'Data has been modified by another client',
        message: 'Please reload the data before saving to avoid overwriting recent changes',
        code: 'STALE_DATA',
      }
      return res.status(409).json(staleError)
    }

    if (error.message.includes('File size exceeds')) {
      res.status(413).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Failed to save weekly menus' })
    }
  }
})

export default router
