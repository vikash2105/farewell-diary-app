import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import session from 'express-session';
import passport from 'passport';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';

// ✅ Render-safe CommonJS imports
const connectPgSimple = require('connect-pg-simple');
const { Pool } = require('pg');

import { configurePassport } from './config/passport';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

const PgSession = connectPgSimple(session);

export const createApp = (): Application => {
  const app = express();

  // Trust proxy (REQUIRED for Render / cookies)
  app.set('trust proxy', 1);

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  // ==============================
  // CORS (AUTH CRITICAL)
  // ==============================
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(compression());

  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    })
  );

  const limiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 100),
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api/', limiter);

  // ==============================
  // SESSION (SUPABASE READY)
  // ==============================
  const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  app.use(
    session({
      name: 'farewell.sid',
      store: new PgSession({
        pool: pgPool,
        tableName: 'sessions',
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: true, // Render + Vercel = HTTPS
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );

  // ==============================
  // PASSPORT
  // ==============================
  configurePassport();
  app.use(passport.initialize());
  app.use(passport.session());

  // ==============================
  // ROUTES
  // ==============================
  const API_VERSION = process.env.API_VERSION || 'v1';
  app.use(`/api/${API_VERSION}`, routes);

  app.get('/', (_req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Welcome to Farewell Diary API',
      version: API_VERSION,
    });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
