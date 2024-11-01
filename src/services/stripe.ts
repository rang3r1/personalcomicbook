import { loadStripe } from '@stripe/stripe-js';
import { ENV } from '@/config/env';
import { SubscriptionTier, User } from '@/types';

if (!ENV.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
}

const stripePromise = loadStripe(ENV.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const SUBSCRIPTION_PRICES: Record<Exclude<SubscriptionTier, 'free'>, string> = {
  basic: 'price_basic_monthly', // Replace with actual Stripe price IDs
  pro: 'price_pro_monthly',
};

interface SubscriptionFeatures {
  maxProjects: number | 'unlimited';
  maxPanelsPerProject: number | 'unlimited';
  styles: string[];
  priority: string;
  support: string;
}

const SUBSCRIPTION_FEATURES: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    maxProjects: 3,
    maxPanelsPerProject: 10,
    styles: ['manga', 'cartoon'],
    priority: 'normal',
    support: 'community',
  },
  basic: {
    maxProjects: 10,
    maxPanelsPerProject: 30,
    styles: ['manga', 'cartoon', 'superhero'],
    priority: 'high',
    support: 'email',
  },
  pro: {
    maxProjects: 'unlimited',
    maxPanelsPerProject: 'unlimited',
    styles: ['manga', 'cartoon', 'superhero', 'classic'],
    priority: 'highest',
    support: '24/7 priority',
  },
};

interface CheckoutSessionParams {
  user: User;
  priceId: string;
}

interface StripeSession {
  id: string;
  url?: string;
}

export const stripe = {
  async createCheckoutSession(
    userId: string,
    tier: Exclude<SubscriptionTier, 'free'>
  ) {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          priceId: SUBSCRIPTION_PRICES[tier],
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw new Error('Failed to create checkout session');
    }
  },

  async createPortalSession(customerId: string) {
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
        }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating portal session:', error);
      throw new Error('Failed to create portal session');
    }
  },

  async getSubscriptionStatus(userId: string) {
    try {
      const response = await fetch(`/api/stripe/subscription-status?userId=${userId}`);
      const data = await response.json();
      return data.status as SubscriptionTier;
    } catch (error) {
      console.error('Error getting subscription status:', error);
      throw new Error('Failed to get subscription status');
    }
  },

  getPriceForTier(tier: Exclude<SubscriptionTier, 'free'>): string {
    return SUBSCRIPTION_PRICES[tier];
  },

  getFeatures(tier: SubscriptionTier): SubscriptionFeatures {
    return SUBSCRIPTION_FEATURES[tier];
  },
};

// API route handlers
export const stripeApi = {
  async createCheckoutSession(params: CheckoutSessionParams): Promise<StripeSession> {
    if (!ENV.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY');
    }

    const stripe = require('stripe')(ENV.STRIPE_SECRET_KEY);

    try {
      const session = await stripe.checkout.sessions.create({
        customer_email: params.user.email,
        client_reference_id: params.user.user_id,
        payment_method_types: ['card'],
        line_items: [
          {
            price: params.priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      });

      return {
        id: session.id,
        url: session.url,
      };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  },

  async createPortalSession(customerId: string): Promise<StripeSession> {
    if (!ENV.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY');
    }

    const stripe = require('stripe')(ENV.STRIPE_SECRET_KEY);

    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
      });

      return {
        id: session.id,
        url: session.url,
      };
    } catch (error) {
      console.error('Error creating portal session:', error);
      throw error;
    }
  },

  async handleWebhook(request: Request, signature: string) {
    if (!ENV.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY');
    }

    const stripe = require('stripe')(ENV.STRIPE_SECRET_KEY);

    try {
      const event = stripe.webhooks.constructEvent(
        await request.text(),
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          // Update user subscription status
          break;
        case 'customer.subscription.deleted':
          // Handle subscription cancellation
          break;
      }

      return event;
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  },
};
