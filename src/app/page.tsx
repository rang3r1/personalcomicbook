'use client';

import { useAuth } from '@/hooks/useAuth';
import { SignInButton } from '@/components/auth/SignInButton';
import Link from 'next/link';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="relative isolate">
      {/* Hero section */}
      <div className="relative pt-14">
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Create Amazing Comics with AI
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Transform your stories into stunning visual narratives using the power of AI.
                Create consistent characters, dynamic scenes, and professional-quality comics
                in minutes.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {user ? (
                  <Link
                    href="/dashboard"
                    className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <SignInButton />
                )}
                <Link
                  href="#features"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">
              Create Faster
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to create comics
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our AI-powered platform provides all the tools you need to bring your comic
              ideas to life, from character creation to panel generation.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  AI-Powered Generation
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Generate professional-quality comic panels using advanced AI models.
                    Maintain consistent character appearances and art styles across your
                    entire comic.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  Multiple Art Styles
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Choose from various comic styles including manga, superhero, cartoon,
                    and classic comic book styles. Customize the look and feel of your
                    comics.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  Easy Export
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Export your comics in multiple formats including PNG, JPEG, and PDF.
                    Share your creations with the world or use them in your projects.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="relative isolate mt-32 px-6 py-32 sm:mt-56 sm:py-40 lg:px-8">
        <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-100 to-blue-50 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Start Creating Today
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Join thousands of creators who are already using AI Comic Creator to bring
            their stories to life.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {!user && <SignInButton />}
          </div>
        </div>
      </div>
    </div>
  );
}
