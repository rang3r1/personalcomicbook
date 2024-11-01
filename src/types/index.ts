// User related types
export interface User {
  user_id: string;
  email: string;
  subscription_level: SubscriptionTier;
  created_at: Date;
}

// Project related types
export interface Project {
  project_id: string;
  user_id: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

// Character related types
export interface Character {
  character_id: string;
  project_id: string;
  name: string;
  traits: CharacterTraits;
}

export interface CharacterTraits {
  description: string;
  appearance: string;
  personality: string;
  color_scheme?: string;
  additional_details?: string;
}

// Comic style types
export type ComicStyle = 'manga' | 'superhero' | 'cartoon' | 'classic';

export interface ComicStyleDefinition {
  style_id: string;
  name: ComicStyle;
  description: string;
}

// Panel related types
export interface Panel {
  panel_id: string;
  project_id: string;
  character_id?: string;
  style_id: string;
  image_url: string;
  order: number;
}

// Payment related types
export interface Payment {
  payment_id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_date: Date;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed';

// Subscription types
export type SubscriptionTier = 'free' | 'basic' | 'pro';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Form types
export interface ProjectFormData {
  description: string;
}

export interface CharacterFormData {
  name: string;
  traits: CharacterTraits;
}

export interface PanelGenerationData {
  project_id: string;
  character_id?: string;
  style_id: string;
  prompt?: string;
}

// Store types
export interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export interface ProjectStore {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  clearCurrentProject: () => void;
}
