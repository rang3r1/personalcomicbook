import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../services/auth';
import { useUserStore } from '../store/userStore';
import { User } from '../types';

export function useAuth() {
  const router = useRouter();
  const { user, setUser, clearUser } = useUserStore();

  useEffect(() => {
    // Check for current user on mount
    const checkUser = async () => {
      try {
        const currentUser = await auth.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          // Redirect to dashboard if user is already authenticated
          router.push('/dashboard');
        }
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
        // Redirect to dashboard on successful authentication
        router.push('/dashboard');
      } else {
        clearUser();
      }
    });

    // Cleanup subscription
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setUser, clearUser, router]);

  const signIn = async () => {
    try {
      const result = await auth.signInWithGoogle();
      
      // Supabase signInWithOAuth might throw an error or return an error
      if (result instanceof Error) {
        console.error('Sign in error:', result);
        throw result;
      }
      
      // Explicitly handle redirect after sign-in
      // The onAuthStateChange listener will handle the dashboard redirect
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
