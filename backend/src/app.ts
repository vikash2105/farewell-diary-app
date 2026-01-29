import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import session from "express-session";
import passport from "passport";
import morgan from "morgan";
import "express-async-errors";

// CommonJS-safe imports
const connectPgSimple = require("connect-pg-simple");
const { Pool } = require("pg");

import { configurePassport } from "./config/passport";
import routes from "./routes";
import publicRoutes from "./routes/publicRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { logger } from "./utils/logger";
import { generalLimiter } from "./middleware/rateLimit";
import { env } from "./config/env";

const PgSession = connectPgSimple(session);

export const createApp = (): Application => {
  const app = express();

  // REQUIRED for Render / proxies
  app.set("trust proxy", 1);

  // ==============================
  // SECURITY HEADERS
  // ==============================
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  // ==============================
  // CORS (AUTH-CRITICAL)
  // ==============================
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // ==============================
  // BODY & PERFORMANCE
  // ==============================
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(compression());

  // ==============================
  // LOGGING
  // ==============================
  app.use(
    morgan("combined", {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    })
  );

  // ==============================
  // SESSION STORE (PostgreSQL)
  // ==============================
  const pgPool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  });

  app.use(
    session({
      name: "farewell.sid",
      store: new PgSession({
        pool: pgPool,
        tableName: "sessions",
        createTableIfMissing: true,
      }),
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      proxy: true,
      cookie: {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );

  // ==============================
  // GLOBAL RATE LIMIT
  // ==============================
  app.use(generalLimiter);

  // ==============================
  // PASSPORT
  // ==============================
  configurePassport();
  app.use(passport.initialize());
  app.use(passport.session());

  // ==============================
  // ROUTES (ORDER MATTERS)
  // ==============================
  app.use("/api/public", publicRoutes);
  app.use("/api/user", userRoutes);
  app.use(`/api/${env.API_VERSION}`, routes);

  app.get("/", (_req: Request, res: Response) => {
    res.json({
      success: true,
      message: "Welcome to Farewell Diary API",
      version: env.API_VERSION,
    });
  });

  // ==============================
  // ERROR HANDLING
  // ==============================
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
