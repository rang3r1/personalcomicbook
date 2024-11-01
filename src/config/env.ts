export const ENV = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  NEXT_PUBLIC_MIDJOURNEY_API_URL: process.env.NEXT_PUBLIC_MIDJOURNEY_API_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
} as const;

// Feature limits based on subscription tiers
export const LIMITS = {
  FREE_TIER: {
    MAX_PROJECTS: 3,
    MAX_PANELS_PER_PROJECT: 10,
  },
  BASIC_TIER: {
    MAX_PROJECTS: 10,
    MAX_PANELS_PER_PROJECT: 30,
  },
  PRO_TIER: {
    MAX_PROJECTS: -1, // unlimited
    MAX_PANELS_PER_PROJECT: -1, // unlimited
  },
} as const;

export type SubscriptionTier = keyof typeof LIMITS;
