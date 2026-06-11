/*
  # Create experience_cards table for cards management

  1. New Tables
    - `experience_cards`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text)
      - `image_url` (text, required)
      - `icon` (text, lucide icon name)
      - `icon_color` (text, e.g., "emerald-600")
      - `button_text` (text)
      - `button_url` (text, optional link)
      - `button_action` (text: "link", "modal", "fullscreen", "disabled")
      - `modal_type` (text, optional: "firewood", "date_night", "picnic")
      - `is_featured` (boolean)
      - `featured_badge_text` (text, e.g., "Featured")
      - `featured_gradient_from` (text, e.g., "rose-600")
      - `featured_gradient_to` (text, e.g., "pink-600")
      - `is_coming_soon` (boolean)
      - `additional_links` (jsonb, for cards with multiple links like Shops Nearby)
      - `items>[
          {"text": "Shop 1", "url": "..."},
          {"text": "Shop 2", "url": "..."}
        ]
      - `order` (integer, for sorting)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `experience_cards` table
    - Public read access
    - Authenticated admin write access
*/

CREATE TABLE IF NOT EXISTS experience_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  icon text DEFAULT 'Mountain',
  icon_color text DEFAULT 'emerald-600',
  button_text text,
  button_url text,
  button_action text DEFAULT 'link',
  modal_type text,
  is_featured boolean DEFAULT false,
  featured_badge_text text,
  featured_gradient_from text,
  featured_gradient_to text,
  is_coming_soon boolean DEFAULT false,
  additional_links jsonb,
  "order" integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE experience_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active experience cards"
  ON experience_cards FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated admins can view all experience cards"
  ON experience_cards FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated admins can insert experience cards"
  ON experience_cards FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can update experience cards"
  ON experience_cards FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can delete experience cards"
  ON experience_cards FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view all experience cards"
  ON experience_cards FOR SELECT
  TO public
  USING (true);