import { createClient } from '@supabase/supabase-js';
import { User } from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const auth = {
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  },

  async handleAuthCallback() {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user ?? null;
      callback(user);
    });
  },

  async signOut() {
    return await supabase.auth.signOut();
  }
};
