import express from 'express'
import { basicAuth, AuthenticatedRequest } from '../auth'
import { changeUserPassword, findUserByUuid } from '../dataService'

const router = express.Router()

// GET /user - Returns user id for authenticated user
router.get('/', basicAuth, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  res.json({ uuid: req.user.uuid })
})

// POST /user/<id>/resetpassword - Authenticated user can change their password
router.post('/:id/resetpassword', basicAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params
    const { newPassword } = req.body

    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    // User can only change their own password
    if (req.user.uuid !== id) {
      return res.status(403).json({ error: 'You can only change your own password' })
    }

    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required' })
    }

    const success = await changeUserPassword(id, newPassword)
    if (!success) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ message: 'Password changed successfully' })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

export default router
