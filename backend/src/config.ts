import dotenv from 'dotenv';
dotenv.config();

/**
 * Configuration parameters loaded from .env file or environment variables.
 */
export class Configs {
  public static stripeApiKey: string = process.env.STRIPE_API_KEY || '';
  public static stripeBackendUrl: string = process.env.STRIPE_BACKEND_URL || '';
}

