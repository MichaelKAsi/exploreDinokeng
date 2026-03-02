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
