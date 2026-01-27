import dotenv from 'dotenv';

// ⚠️ CRITICAL: Load .env FIRST, before any other imports that use process.env
dotenv.config();

import { createApp } from './app';
import { testConnection, closeConnection } from './db';
import { runMigrations } from './db/migrate';
import { logger } from './utils/logger';
import { validateEnv } from './config/env';

// NOW validate env (after loading)
validateEnv();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // 1. Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // 2. Run migrations BEFORE starting server
    logger.info('🔄 Checking database schema...');
    try {
      await runMigrations();
    } catch (migrationError) {
      logger.error('❌ Failed to run migrations. Exiting...', migrationError);
      process.exit(1);
    }

    // 3. Create Express app
    const app = createApp();

    // 4. Start listening
    const server = app.listen(PORT, () => {
      logger.info(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║           🌹 FAREWELL DIARY API SERVER 🌹                ║
║                                                           ║
║   Environment: ${NODE_ENV.padEnd(44)}║
║   Port:        ${String(PORT).padEnd(44)}║
║   API Version: ${(process.env.API_VERSION || 'v1').padEnd(44)}║
║                                                           ║
║   Status:      ✅ Server is running                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        await closeConnection();
        logger.info('Database connection closed');

        logger.info('Graceful shutdown completed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    // Handle unhandled rejections
    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Rejection:', reason);
      gracefulShutdown('unhandledRejection');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();