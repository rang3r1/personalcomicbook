import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link 
                href="/"
                className="flex items-center px-2 py-2 text-gray-900 hover:text-gray-600"
              >
                <span className="text-xl font-bold">AI Comic Creator</span>
              </Link>
            </div>

            <div className="flex items-center">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-gray-600"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/projects"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-gray-600"
                  >
                    Projects
                  </Link>
                  <div className="ml-4 flex items-center">
                    <span className="text-sm text-gray-700 mr-4">
                      {user.email}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} AI Comic Creator. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
