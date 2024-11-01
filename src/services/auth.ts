import { supabase } from './supabase';
import { User } from '@/types';
import { User as SupabaseUser } from '@supabase/supabase-js';

const transformSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User> => {
  // Get additional user data from our users table
  const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', supabaseUser.id)
    .single();

  if (error) throw error;

  return {
    user_id: supabaseUser.id,
    email: supabaseUser.email || '',
    subscription_level: userData?.subscription_level || 'free',
    created_at: new Date(supabaseUser.created_at),
  };
};

export const auth = {
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) return null;

      return await transformSupabaseUser(user);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async handleAuthCallback(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) throw error || new Error('No user found');

      // Check if user exists in our users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!existingUser) {
        // Create new user record
        const { error: createError } = await supabase
          .from('users')
          .insert([
            {
              user_id: user.id,
              email: user.email,
              subscription_level: 'free',
              created_at: new Date().toISOString(),
            },
          ]);

        if (createError) throw createError;
      }

      return await transformSupabaseUser(user);
    } catch (error) {
      console.error('Error handling auth callback:', error);
      throw error;
    }
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const user = await transformSupabaseUser(session.user);
        callback(user);
      } else if (event === 'SIGNED_OUT') {
        callback(null);
      }
    });
  },
};
