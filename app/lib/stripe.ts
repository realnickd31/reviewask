import Stripe from "stripe";
export const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
export const baseUrl = (origin?: string) => process.env.NEXTAUTH_URL || origin || "http://localhost:3000";
