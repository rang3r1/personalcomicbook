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
    const { customerId } = body;

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    const session = await stripeApi.createPortalSession(customerId);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
