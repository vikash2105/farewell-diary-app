import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { logger } from '../utils/logger';

// Load environment variables FIRST
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set');
  process.exit(1);
}

/**
 * Run database migrations
 * This should be run BEFORE starting the server
 */
export const runMigrations = async (): Promise<void> => {
  const migrationClient = postgres(DATABASE_URL, { max: 1 });
  const db = drizzle(migrationClient);

  try {
    logger.info('🔄 Running database migrations...');
    
    await migrate(db, { 
      migrationsFolder: './src/db/migrations',
    });
    
    logger.info('✅ Database migrations completed successfully');
    
    await migrationClient.end();
  } catch (error) {
    logger.error('❌ Migration failed:', error);
    await migrationClient.end();
    throw error;
  }
};

// Allow running directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('✅ Migrations complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}