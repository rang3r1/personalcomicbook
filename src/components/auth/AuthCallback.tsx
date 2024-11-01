'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/services/auth';
import { useUserStore } from '@/store/userStore';

export const AuthCallback = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUserStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const user = await auth.handleAuthCallback();
        if (user) {
          setUser(user);
          router.push('/dashboard');
        } else {
          setError('Authentication failed. Please try again.');
          setTimeout(() => router.push('/auth/signin'), 3000);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Authentication failed. Please try again.');
        setTimeout(() => router.push('/auth/signin'), 3000);
      }
    };

    handleCallback();
  }, [router, setUser]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600">
              Authentication Error
            </h2>
            <p className="mt-2 text-gray-600">
              {error}
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Redirecting you back to sign in...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">
            Completing Sign In
          </h2>
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Please wait while we complete your sign in...
          </p>
        </div>
      </div>
    </div>
  );
};
