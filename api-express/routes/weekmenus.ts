import express from 'express'
import { basicAuth, rateLimitMiddleware, AuthenticatedRequest } from '../auth'
import { loadUserWeeklyMenus, saveUserWeeklyMenus } from '../dataService'
import { UpdateWeeklyMenusRequest, StaleDataError } from '../types'

const router = express.Router()

// GET /weekmenus - Returns weekly menus for authenticated user (rate limited)
router.get('/', basicAuth, rateLimitMiddleware, (req: AuthenticatedRequest, res) => {
  console.log('GET /weekmenus - Request received')
  try {
    if (!req.user) {
      console.log('GET /weekmenus - No user in request')
      return res.status(401).json({ error: 'Authentication required' })
    }

    console.log(`GET /weekmenus - Loading menus for user ${req.user.uuid}`)
    const timestampedWeeklyMenus = loadUserWeeklyMenus(req.user.uuid)
    console.log(`GET /weekmenus - Successfully loaded menus for user ${req.user.uuid}:`, timestampedWeeklyMenus)
    res.json(timestampedWeeklyMenus)
  } catch (error) {
    console.error('GET /weekmenus - Error:', error)
    res.status(500).json({ error: 'Failed to load weekly menus' })
  }
})

// POST /weekmenus - Saves weekly menus for authenticated user (rate limited, file size checked)
router.post('/', basicAuth, rateLimitMiddleware, (req: AuthenticatedRequest, res) => {
  console.log('POST /weekmenus - Request received')
  try {
    if (!req.user) {
      console.log('POST /weekmenus - No user in request')
      return res.status(401).json({ error: 'Authentication required' })
    }

    console.log(`POST /weekmenus - Request body:`, req.body)
    const requestData = req.body as UpdateWeeklyMenusRequest

    // Validate request structure
    if (
      !requestData ||
      typeof requestData !== 'object' ||
      !requestData.data ||
      typeof requestData.lastModified !== 'number'
    ) {
      console.log('POST /weekmenus - Invalid request format:', requestData)
      return res.status(400).json({
        error: 'Invalid request format',
        message: 'Request must include data and lastModified fields',
      })
    }

    console.log(`POST /weekmenus - Saving menus for user ${req.user.uuid} with lastModified ${requestData.lastModified}`)
    const updatedData = saveUserWeeklyMenus(req.user.uuid, requestData.data, requestData.lastModified)
    console.log(`POST /weekmenus - Successfully saved menus for user ${req.user.uuid}:`, updatedData)
    res.json(updatedData)
  } catch (error: any) {
    console.error('POST /weekmenus - Error:', error)
    if (error.message === 'STALE_DATA') {
      console.log('POST /weekmenus - Stale data detected')
      const staleError: StaleDataError = {
        error: 'Data has been modified by another client',
        message: 'Please reload the data before saving to avoid overwriting recent changes',
        code: 'STALE_DATA',
      }
      return res.status(409).json(staleError)
    }

    if (error.message.includes('File size exceeds')) {
      console.log('POST /weekmenus - File size limit exceeded')
      res.status(413).json({ error: error.message })
    } else {
      console.log('POST /weekmenus - Internal server error')
      res.status(500).json({ error: 'Failed to save weekly menus' })
    }
  }
})

export default router
