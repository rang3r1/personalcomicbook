import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { stripe } from '@/services/stripe';
import { SubscriptionTier } from '@/types';

export function useSubscription() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser } = useUserStore();

  const upgradeTier = async (tier: Exclude<SubscriptionTier, 'free'>) => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    setError(null);
    try {
      await stripe.createCheckoutSession(user.user_id, tier);
      // Redirect happens in the stripe service
    } catch (err) {
      setError('Failed to start upgrade process');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const manageSubscription = async () => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    setError(null);
    try {
      await stripe.createPortalSession(user.user_id);
      // Redirect happens in the stripe service
    } catch (err) {
      setError('Failed to open subscription portal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkSubscriptionStatus = async () => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    setError(null);
    try {
      const status = await stripe.getSubscriptionStatus(user.user_id);
      setUser({
        ...user,
        subscription_level: status,
      });
      return status;
    } catch (err) {
      setError('Failed to check subscription status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getFeatures = () => {
    if (!user) return stripe.getFeatures('free');
    return stripe.getFeatures(user.subscription_level);
  };

  const canUpgrade = () => {
    if (!user) return true;
    return user.subscription_level === 'free' || user.subscription_level === 'basic';
  };

  const hasFeature = (feature: keyof ReturnType<typeof stripe.getFeatures>) => {
    const features = getFeatures();
    return !!features[feature];
  };

  const isWithinLimits = (
    type: 'maxProjects' | 'maxPanelsPerProject',
    current: number
  ) => {
    const features = getFeatures();
    const limit = features[type];
    if (limit === 'unlimited') return true;
    return current < (limit as number);
  };

  return {
    loading,
    error,
    upgradeTier,
    manageSubscription,
    checkSubscriptionStatus,
    getFeatures,
    canUpgrade,
    hasFeature,
    isWithinLimits,
    currentTier: user?.subscription_level || 'free',
  };
}
