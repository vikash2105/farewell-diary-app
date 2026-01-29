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
import publicRoutes from "./routes/publicRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { logger } from "./utils/logger";
import { generalLimiter } from "./middleware/rateLimit";
import { env } from "./config/env";

const PgSession = connectPgSimple(session);

export const createApp = (): Application => {
  const app = express();

  // 🔥 REQUIRED for Render
  app.set("trust proxy", 1);

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  // 🔥 CORS MUST MATCH FRONTEND EXACTLY
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
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

  const pgPool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  // 🔥 SESSION FIX (THIS WAS YOUR BUG)
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
        secure: true,     // ✅ MUST BE TRUE
        sameSite: "none", // ✅ MUST BE NONE
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );

  app.use(generalLimiter);

  configurePassport();
  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/api/public", publicRoutes);
  app.use("/api/user", userRoutes);
  app.use(`/api/${env.API_VERSION}`, routes);

  app.get("/", (_req: Request, res: Response) => {
    res.json({ success: true });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
