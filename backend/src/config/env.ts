import { z } from 'zod';

/**
 * Environment variable validation schema
 * Ensures all required configuration is present at startup
 */
const envSchema = z.object({
  // Runtime environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  
  // Server configuration
  PORT: z.string().default('5000'),
  
  // Database
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required')
    .refine(
      (url) => url.startsWith('postgres://') || url.startsWith('postgresql://'),
      'DATABASE_URL must be a valid PostgreSQL connection string'
    ),
  
  // Security secrets
  SESSION_SECRET: z
    .string()
    .min(32, 'SESSION_SECRET must be at least 32 characters for security'),
  
  ENCRYPTION_KEY: z
    .string()
    .length(32, 'ENCRYPTION_KEY must be exactly 32 characters'),
  
  // Google OAuth
  GOOGLE_CLIENT_ID: z
    .string()
    .min(1, 'GOOGLE_CLIENT_ID is required'),
  
  GOOGLE_CLIENT_SECRET: z
    .string()
    .min(1, 'GOOGLE_CLIENT_SECRET is required'),
  
  GOOGLE_CALLBACK_URL: z
    .string()
    .url('GOOGLE_CALLBACK_URL must be a valid URL')
    .refine(
      (url) => url.includes('/auth/google/callback'),
      'GOOGLE_CALLBACK_URL must end with /auth/google/callback'
    ),
  
  // Frontend configuration
  FRONTEND_URL: z
    .string()
    .url('FRONTEND_URL must be a valid URL'),
  
  // Optional configuration
  JWT_SECRET: z.string().optional(), // Not used but kept for backwards compatibility
  RATE_LIMIT_WINDOW_MS: z.string().optional(),
  RATE_LIMIT_MAX_REQUESTS: z.string().optional(),
  API_VERSION: z.string().optional(),
});

/**
 * Validates environment variables at application startup
 * Exits with error code 1 if validation fails
 * 
 * @throws {Error} If environment variables are missing or invalid
 */
export const validateEnv = (): void => {
  try {
    envSchema.parse(process.env);
    
    // Log success in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Environment variables validated successfully');
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      console.error('');
      
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        console.error(`  • ${path}: ${err.message}`);
      });
      
      console.error('');
      console.error('Please check your .env file and ensure all required variables are set.');
      console.error('Refer to .env.example for the expected configuration.');
      
      process.exit(1);
    }
    throw error;
  }
};

/**
 * Type-safe access to environment variables
 * Use this instead of process.env for type safety
 */
export type Env = z.infer<typeof envSchema>;
