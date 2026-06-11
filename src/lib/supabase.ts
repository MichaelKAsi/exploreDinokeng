import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Banner = {
  id: string;
  title: string;
  button_text: string | null;
  background_image: string;
  order: number;
  created_at: string;
  updated_at: string;
};

export type AdditionalLink = {
  text: string;
  url: string;
};

export type ExperienceCard = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  icon: string;
  icon_color: string;
  button_text: string | null;
  button_url: string | null;
  button_action: string;
  modal_type: string | null;
  is_featured: boolean;
  featured_badge_text: string | null;
  featured_gradient_from: string | null;
  featured_gradient_to: string | null;
  is_coming_soon: boolean;
  additional_links: AdditionalLink[] | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
