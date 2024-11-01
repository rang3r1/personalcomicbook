'use client';

import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { CheckIcon } from '@heroicons/react/20/solid';
import { SubscriptionTier } from '@/types';

const tiers = [
  {
    name: 'Free',
    id: 'free' as SubscriptionTier,
    priceMonthly: '$0',
    description: 'Perfect for trying out AI comic creation',
    features: [
      '3 projects',
      '10 panels per project',
      'Basic art styles (manga, cartoon)',
      'Community support',
      'Standard generation speed',
    ],
  },
  {
    name: 'Basic',
    id: 'basic' as SubscriptionTier,
    priceMonthly: '$9.99',
    description: 'Great for hobbyists and casual creators',
    features: [
      '10 projects',
      '30 panels per project',
      'Additional art style (superhero)',
      'Email support',
      'Faster generation speed',
      'Priority queue access',
    ],
  },
  {
    name: 'Pro',
    id: 'pro' as SubscriptionTier,
    priceMonthly: '$29.99',
    description: 'Best for professional creators',
    features: [
      'Unlimited projects',
      'Unlimited panels per project',
      'All art styles',
      '24/7 priority support',
      'Fastest generation speed',
      'Highest priority queue',
      'Custom style training',
    ],
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const { upgradeTier, currentTier, loading, error } = useSubscription();

  const handleUpgrade = async (tier: SubscriptionTier) => {
    if (tier === 'free') return;
    
    try {
      await upgradeTier(tier);
    } catch (err) {
      console.error('Error upgrading subscription:', err);
    }
  };

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for&nbsp;you
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Start creating amazing comics with AI. Choose a plan that matches your needs.
        </p>

        {error && (
          <div className="mt-6 text-center text-red-600">
            {error}
          </div>
        )}

        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={`flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 ${
                tier.id === 'basic' ? 'lg:z-10 lg:rounded-b-none' : ''
              } ${tierIdx === 0 ? 'lg:rounded-r-none' : ''} ${
                tierIdx === 2 ? 'lg:rounded-l-none' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    className={`text-lg font-semibold leading-8 ${
                      tier.id === currentTier ? 'text-blue-600' : 'text-gray-900'
                    }`}
                  >
                    {tier.name}
                  </h3>
                  {tier.id === currentTier && (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      Current Plan
                    </span>
                  )}
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {tier.priceMonthly}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">
                    /month
                  </span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-blue-600"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {tier.id !== 'free' && (
                <button
                  onClick={() => handleUpgrade(tier.id)}
                  disabled={loading || tier.id === currentTier}
                  className={`
                    mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold
                    shadow-sm focus-visible:outline focus-visible:outline-2
                    focus-visible:outline-offset-2 focus-visible:outline-blue-600
                    ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : tier.id === currentTier
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-500'
                    }
                  `}
                >
                  {loading
                    ? 'Processing...'
                    : tier.id === currentTier
                    ? 'Current Plan'
                    : 'Upgrade'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-24">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            <div className="pt-6">
              <dt className="text-lg font-semibold leading-7 text-gray-900">
                What happens if I reach my project limit?
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                You'll need to upgrade to a higher tier to create more projects. Your existing
                projects will remain accessible.
              </dd>
            </div>
            <div className="pt-6">
              <dt className="text-lg font-semibold leading-7 text-gray-900">
                Can I downgrade my subscription?
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                Yes, you can downgrade at any time. Your existing projects will be preserved,
                but you won't be able to create new ones if you're over the limit of your new tier.
              </dd>
            </div>
            <div className="pt-6">
              <dt className="text-lg font-semibold leading-7 text-gray-900">
                What payment methods do you accept?
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                We accept all major credit cards through our secure payment processor, Stripe.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
