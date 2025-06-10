import { z } from 'zod';

/**
 * Helper function to check if we're in development mode
 */
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Environment variable schema for runtime validation
 */
const envSchema = z.object({
  // FotoWare Configuration
  FOTOWARE_API_URL: isDevelopment
    ? z.string().url('FOTOWARE_API_URL must be a valid URL').optional()
    : z.string().url('FOTOWARE_API_URL must be a valid URL'),
  FOTOWARE_API_TOKEN: z.string().optional(),

  // Application Configuration
  NEXT_PUBLIC_APP_URL: isDevelopment
    ? z.string().url('NEXT_PUBLIC_APP_URL must be a valid URL').optional()
    : z.string().url('NEXT_PUBLIC_APP_URL must be a valid URL'),
  NEXT_PUBLIC_API_URL: isDevelopment
    ? z.string().url('NEXT_PUBLIC_API_URL must be a valid URL').optional()
    : z.string().url('NEXT_PUBLIC_API_URL must be a valid URL'),
  NEXT_PUBLIC_BASE_URL: isDevelopment
    ? z.string().url('NEXT_PUBLIC_BASE_URL must be a valid URL').optional()
    : z.string().url('NEXT_PUBLIC_BASE_URL must be a valid URL'),

  // Optional Configuration
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  REVALIDATE_SECRET: z.string().optional(),
});

/**
 * Validate environment variables at runtime
 * @throws {Error} If environment variables are invalid
 */
function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const errors = parsed.error.format();
    console.error('❌ Invalid environment variables:', JSON.stringify(errors, null, 2));

    if (isDevelopment) {
      console.warn('⚠️ Running in development mode with missing environment variables');
      // Return default values for development
      return {
        FOTOWARE_API_URL: 'http://localhost:3000',
        FOTOWARE_API_TOKEN: undefined,
        NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
        NEXT_PUBLIC_API_URL: 'http://localhost:3000/api',
        NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
        NEXT_PUBLIC_GA_MEASUREMENT_ID: undefined,
        REVALIDATE_SECRET: undefined,
      };
    }

    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}

// Validate environment variables
export const env = validateEnv();

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>;

/**
 * Helper function to check if we're in production mode
 */
export const isProduction = process.env.NODE_ENV === 'production';

/**
 * Helper function to check if we're in test mode
 */
export const isTest = process.env.NODE_ENV === 'test';