import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface News {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url?: string;
  published_date: string;
  created_at: string;
}

export interface Research {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  category: string;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  journal?: string;
  year: number;
  doi?: string;
  url?: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  email?: string;
  order_position: number;
  created_at: string;
}
