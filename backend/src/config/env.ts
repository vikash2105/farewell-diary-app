import { z } from "zod";

/**
 * Environment variable validation schema
 * Ensures all required configuration is present at startup
 */
const envSchema = z.object({
  // Runtime environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Server configuration
  PORT: z
    .string()
    .default("5000")
    .transform((val) => Number(val)),

  // Database
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .refine(
      (url) =>
        url.startsWith("postgres://") ||
        url.startsWith("postgresql://"),
      "DATABASE_URL must be a valid PostgreSQL connection string"
    ),

  // Security secrets
  SESSION_SECRET: z
    .string()
    .min(32, "SESSION_SECRET must be at least 32 characters"),

  ENCRYPTION_KEY: z
    .string()
    .length(32, "ENCRYPTION_KEY must be exactly 32 characters"),

  // JWT (USED by auth middleware)
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters"),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),

  GOOGLE_CLIENT_SECRET: z
    .string()
    .min(1, "GOOGLE_CLIENT_SECRET is required"),

  GOOGLE_CALLBACK_URL: z
    .string()
    .url("GOOGLE_CALLBACK_URL must be a valid URL")
    .refine(
      (url) => url.endsWith("/auth/google/callback"),
      "GOOGLE_CALLBACK_URL must end with /auth/google/callback"
    ),

  // Frontend
  FRONTEND_URL: z
    .string()
    .url("FRONTEND_URL must be a valid URL"),

  // Rate limiting (optional but parsed safely)
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 15 * 60 * 1000)),

  RATE_LIMIT_MAX_REQUESTS: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 100)),

  // API versioning
  API_VERSION: z.string().default("v1"),
});

/**
 * Parsed & validated environment variables
 * THIS is what the app should use instead of process.env
 */
export const env = (() => {
  try {
    const parsed = envSchema.parse(process.env);

    if (parsed.NODE_ENV !== "production") {
      console.log("✅ Environment variables validated successfully");
    }

    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Environment validation failed:\n");

      error.errors.forEach((err) => {
        const path = err.path.join(".");
        console.error(`  • ${path}: ${err.message}`);
      });

      console.error("\nFix the above issues in your .env file.");
      console.error("Refer to .env.example for correct values.\n");

      process.exit(1);
    }

    throw error;
  }
})();

/**
 * Backwards-compatible validation call
 * (kept so existing imports do not break)
 */
export const validateEnv = (): void => {
  // env is already validated on import
  void env;
};

/**
 * Type-safe Env type
 */
export type Env = typeof env;
