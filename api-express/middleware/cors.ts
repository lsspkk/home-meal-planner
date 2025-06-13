import cors from 'cors';
import { Request, Response, NextFunction } from 'express';

// Parse allowed origins from environment variable
const getAllowedOrigins = (): string[] => {
  const corsOrigin = process.env.CORS_ORIGIN;
  if (!corsOrigin) {
    console.warn('CORS_ORIGIN not set in environment variables. Defaulting to no CORS.');
    return [];
  }
  return corsOrigin.split(',').map((origin: string) => origin.trim());
};

// CORS configuration middleware
const corsOptions: cors.CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = getAllowedOrigins();
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true, // Allow credentials (cookies, authorization headers, etc)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // Cache preflight requests for 24 hours
};

// Export configured CORS middleware
export const corsMiddleware = cors(corsOptions);

// Error handler for CORS errors
export const corsErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  if (err.message.includes('CORS')) {
    res.status(403).json({
      error: 'CORS Error',
      message: err.message
    });
    return;
  }
  next(err);
}; 