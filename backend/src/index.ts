import dotenv from "dotenv";

// ⚠️ CRITICAL: Load .env FIRST
dotenv.config();

import { createApp } from "./app";
import { testConnection, closeConnection } from "./db";
import { runMigrations } from "./db/migrate";
import { logger } from "./utils/logger";
import { env } from "./config/env"; // ✅ USE PARSED ENV

/**
 * Start the server
 */
const startServer = async () => {
  let shuttingDown = false;

  try {
    // 1. Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.error("❌ Failed to connect to database. Exiting...");
      process.exit(1);
    }

    // 2. Run migrations BEFORE starting server
    logger.info("🔄 Checking database schema...");
    try {
      await runMigrations();
    } catch (migrationError) {
      logger.error("❌ Failed to run migrations. Exiting...", migrationError);
      process.exit(1);
    }

    // 3. Create Express app
    const app = createApp();

    // 4. Start listening
    const server = app.listen(env.PORT, () => {
      logger.info(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║           🌹 FAREWELL DIARY API SERVER 🌹                ║
║                                                           ║
║   Environment: ${env.NODE_ENV.padEnd(44)}║
║   Port:        ${String(env.PORT).padEnd(44)}║
║   API Version: ${env.API_VERSION.padEnd(44)}║
║                                                           ║
║   Status:      ✅ Server is running                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });

    /**
     * Graceful shutdown handler
     */
    const gracefulShutdown = async (signal: string) => {
      if (shuttingDown) return;
      shuttingDown = true;

      logger.info(`${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info("HTTP server closed");

        try {
          await closeConnection();
          logger.info("Database connection closed");
        } catch (dbError) {
          logger.error("Error closing database connection", dbError);
        }

        logger.info("Graceful shutdown completed");
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error("⏱ Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    // OS signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Crash safety
    process.on("uncaughtException", (error) => {
      logger.error("Uncaught Exception:", error);
      gracefulShutdown("uncaughtException");
    });

    process.on("unhandledRejection", (reason) => {
      logger.error("Unhandled Rejection:", reason);
      gracefulShutdown("unhandledRejection");
    });
  } catch (error) {
    logger.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// 🚀 Start the server
startServer();
