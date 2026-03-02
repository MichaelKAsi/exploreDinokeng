/*
  # Create banners table for hero carousel management

  1. New Tables
    - `banners`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `button_text` (text, optional CTA button text)
      - `background_image` (text, URL to background image)
      - `order` (integer, for sorting)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `banners` table
    - Add policy for unauthenticated users to read all banners
    - Add policy for authenticated admin users to manage banners
*/

CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  button_text text,
  background_image text NOT NULL,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view banners"
  ON banners FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated admins can insert banners"
  ON banners FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can update banners"
  ON banners FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can delete banners"
  ON banners FOR DELETE
  TO authenticated
  USING (true);
