import { createClient } from '@supabase/supabase-js';
import { ENV } from '@/config/env';
import { Panel, SubscriptionTier, User } from '@/types';

if (!ENV.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

if (!ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  ENV.NEXT_PUBLIC_SUPABASE_URL,
  ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);

// Database service functions
export const db = {
  // User operations
  async getUserById(userId: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUserSubscription(userId: string, status: SubscriptionTier): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({ subscription_level: status })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Project operations
  async getProjects(userId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createProject(userId: string, description: string) {
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          user_id: userId,
          description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Character operations
  async getProjectCharacters(projectId: string) {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('project_id', projectId);
    
    if (error) throw error;
    return data;
  },

  async createCharacter(projectId: string, name: string, traits: any) {
    const { data, error } = await supabase
      .from('characters')
      .insert([
        {
          project_id: projectId,
          name,
          traits,
        },
      ])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Panel operations
  async getProjectPanels(projectId: string) {
    const { data, error } = await supabase
      .from('panels')
      .select('*')
      .eq('project_id', projectId)
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async createPanel(
    projectId: string,
    characterId: string | undefined,
    styleId: string,
    imageUrl: string,
    order: number
  ) {
    const { data, error } = await supabase
      .from('panels')
      .insert([
        {
          project_id: projectId,
          character_id: characterId,
          style_id: styleId,
          image_url: imageUrl,
          order,
        },
      ])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updatePanel(panelId: string, updates: Partial<Panel>) {
    const { data, error } = await supabase
      .from('panels')
      .update(updates)
      .eq('panel_id', panelId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Comic style operations
  async getComicStyles() {
    const { data, error } = await supabase
      .from('comic_styles')
      .select('*');
    
    if (error) throw error;
    return data;
  },

  // Payment operations
  async createPayment(
    userId: string,
    amount: number,
    currency: string,
    status: string
  ) {
    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          user_id: userId,
          amount,
          currency,
          status,
          payment_date: new Date().toISOString(),
        },
      ])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};
