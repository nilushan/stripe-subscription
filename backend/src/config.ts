import dotenv from 'dotenv';
dotenv.config();

export class Configs{
    public static stripeApiKey: string = process.env.STRIPE_API_KEY ? process.env.STRIPE_API_KEY:  '';

    public static stripeBackendUrl: string = process.env.STRIPE_BACKEND_URL ? process.env.STRIPE_BACKEND_URL:  '';

}