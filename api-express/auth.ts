import { Request, Response, NextFunction } from 'express'
import { verifyPassword, checkRateLimit } from './dataService'

export interface AuthenticatedRequest extends Request {
  user?: {
    uuid: string
    username: string
  }
}

export async function basicAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res
      .status(401)
      .set('WWW-Authenticate', 'Basic realm="Home Meal Planner"')
      .json({ error: 'Authentication required' })
    return
  }

  try {
    const base64Credentials = authHeader.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')

    if (!username || !password) {
      res.status(401).json({ error: 'Invalid credentials format' })
      return
    }

    const user = await verifyPassword(username, password)
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    req.user = {
      uuid: user.uuid,
      username: user.username,
    }

    next()
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' })
  }
}

export function rateLimitMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' })
    return
  }

  if (!checkRateLimit(req.user.uuid)) {
    res.status(429).json({ error: 'Rate limit exceeded' })
    return
  }

  next()
}
