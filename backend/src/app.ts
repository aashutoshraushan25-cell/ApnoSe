import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { apiLimiter } from './middleware/rateLimit.middleware';
import { sendError } from './utils/response';

export const createApp = (): Express => {
  const app = express();

  // 1. Security Headers via Helmet
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    })
  );

  // 2. CORS Whitelisting
  app.use(
    cors({
      origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // 3. Request Logging
  if (env.NODE_ENV !== 'test') {
    app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  }

  // 4. Body Parsers with safe size limits
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // 5. Static uploads directory
  const uploadsPath = path.join(process.cwd(), env.UPLOAD_DIR);
  app.use('/uploads', express.static(uploadsPath));

  // 6. Global API Rate Limiting
  app.use('/api/', apiLimiter);

  // 7. Mount Core API Version 1
  app.use('/api/v1', routes);

  // 8. 404 Route Handler
  app.use('*', (req: Request, res: Response) => {
    return sendError(res, `Route ${req.originalUrl} not found`, 404, 'NOT_FOUND');
  });

  // 9. Centralized Error Handler
  app.use(errorHandler);

  return app;
};
