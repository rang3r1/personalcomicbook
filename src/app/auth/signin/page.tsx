'use client';

import { SignInButton } from '@/components/auth/SignInButton';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignInPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to AI Comic Creator
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to start creating your AI-powered comics
          </p>
        </div>

        <div className="mt-8">
          <div className="flex flex-col items-center">
            <SignInButton />
            
            <div className="mt-8 text-sm">
              <p className="text-gray-600 text-center">
                By signing in, you agree to our{' '}
                <a
                  href="/terms"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="/privacy"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                Features
              </span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400">
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">
                  AI-Powered Generation
                </p>
                <p className="text-sm text-gray-500 truncate">
                  Create stunning comics with AI assistance
                </p>
              </div>
            </div>

            <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400">
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">
                  Multiple Styles
                </p>
                <p className="text-sm text-gray-500 truncate">
                  Choose from various comic art styles
                </p>
              </div>
            </div>

            <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400">
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">
                  Character Consistency
                </p>
                <p className="text-sm text-gray-500 truncate">
                  Maintain character appearance across panels
                </p>
              </div>
            </div>

            <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400">
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">
                  Easy Export
                </p>
                <p className="text-sm text-gray-500 truncate">
                  Download your comics in multiple formats
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
