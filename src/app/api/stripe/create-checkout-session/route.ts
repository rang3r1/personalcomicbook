import { NextRequest, NextResponse } from 'next/server';
import { stripeApi } from '@/services/stripe';
import { auth } from '@/services/auth';

export async function POST(request: NextRequest) {
  try {
    // Get current user
    const user = await auth.getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { priceId } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    const session = await stripeApi.createCheckoutSession({
      user,
      priceId,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
