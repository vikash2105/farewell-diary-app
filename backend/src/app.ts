import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import session from 'express-session';
import passport from 'passport';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import connectPgSimple from 'connect-pg-simple';
import pg from 'pg';

import { configurePassport } from './config/passport';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

const PgSession = connectPgSimple(session);

/**
 * Create and configure Express application
 */
export const createApp = (): Application => {
  const app = express();

  // Trust proxy (important for cookies behind proxy)
  app.set('trust proxy', 1);

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  // ==============================
  // CORS (VERY IMPORTANT FOR AUTH)
  // ==============================
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    })
  );

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Compression
  app.use(compression());

  // HTTP logger
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    })
  );

  // Rate limiting
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', limiter);

  // ==============================
  // SESSION CONFIGURATION (CRITICAL)
  // ==============================
  const pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
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
        secure: process.env.NODE_ENV === 'production', // true only in prod (https)
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
    })
  );

  // ==============================
  // PASSPORT SETUP
  // ==============================
  configurePassport();
  app.use(passport.initialize());
  app.use(passport.session());

  // ==============================
  // ROUTES
  // ==============================
  const API_VERSION = process.env.API_VERSION || 'v1';
  app.use(`/api/${API_VERSION}`, routes);

  // Root endpoint
  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: 'Welcome to Farewell Diary API',
      version: API_VERSION,
    });
  });

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
};
