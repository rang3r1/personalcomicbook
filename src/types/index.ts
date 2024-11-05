import { User as SupabaseUser } from '@supabase/supabase-js';

// Extend the Supabase User type with additional properties
export interface User extends SupabaseUser {
  user_id?: string;
  subscription_level?: 'free' | 'pro' | 'enterprise';
  // Add any other custom properties specific to your application
}

export interface Project {
  id: string;
  name: string;
  // Add other project-related fields
}

export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise';

export type ComicStyle = 'manga' | 'superhero' | 'cartoon' | 'classic';

export interface Character {
  character_id: string;
  name: string;
  traits?: {
    description?: string;
    appearance?: string;
    personality?: string;
  };
}

export interface Panel {
  panel_id: string;
  order: number;
  image_url: string;
  description?: string;
}
