import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import session from "express-session";
import passport from "passport";
import morgan from "morgan";
import "express-async-errors";

const connectPgSimple = require("connect-pg-simple");
const { Pool } = require("pg");

import { configurePassport } from "./config/passport";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { logger } from "./utils/logger";
import { generalLimiter } from "./middleware/rateLimit";
import { env } from "./config/env";

const PgSession = connectPgSimple(session);

export const createApp = (): Application => {
  const app = express();

  // REQUIRED FOR RENDER
  app.set("trust proxy", 1);

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS
  const allowedOrigins = [
    "https://farewelldiary.in",
    "https://www.farewelldiary.in",
    "http://localhost:5173",
    "http://localhost:3000",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          logger.warn(`Blocked CORS request from origin: ${origin}`);
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());

  app.use(
    morgan("combined", {
      stream: {
        write: (msg: string) => logger.info(msg.trim()),
      },
    })
  );

  // DATABASE POOL
  const pgPool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl:
      env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  });

  const isProduction = env.NODE_ENV === "production";

  // SESSION
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
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );

  // RATE LIMITER
  app.use(generalLimiter);

  // PASSPORT
  configurePassport();

  app.use(passport.initialize());
  app.use(passport.session());

  // =========================
  // KEEP ALIVE ROUTE
  // =========================
  app.get("/ping", (_req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: "Server is awake",
      timestamp: new Date().toISOString(),
    });
  });

  // ROOT ROUTE
  app.get("/", (_req: Request, res: Response) => {
    res.json({
      success: true,
      message: "Farewell Diary API is running",
    });
  });

  // API ROUTES
  app.use(`/api/${env.API_VERSION}`, routes);

  // ERROR HANDLERS
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};