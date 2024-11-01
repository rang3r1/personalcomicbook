import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/services/auth';
import { useUserStore } from '@/store/userStore';
import { User } from '@/types';

export function useAuth() {
  const router = useRouter();
  const { user, setUser, clearUser } = useUserStore();

  useEffect(() => {
    // Check for current user on mount
    const checkUser = async () => {
      try {
        const currentUser = await auth.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking user:', error);
        clearUser();
      }
    };

    checkUser();

    // Subscribe to auth state changes
    const { data: authListener } = auth.onAuthStateChange((user: User | null) => {
      if (user) {
        setUser(user);
      } else {
        clearUser();
      }
    });

    // Cleanup subscription
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setUser, clearUser]);

  const signIn = async () => {
    try {
      await auth.signInWithGoogle();
      // Redirect is handled by the OAuth provider
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      clearUser();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return {
    user,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
}
