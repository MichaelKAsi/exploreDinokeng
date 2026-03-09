/*
  # Make banner title optional

  1. Changes
    - `banners.title` changed from NOT NULL to nullable
    - Admins can now create banners with just a background image
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'banners' AND column_name = 'title' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE banners ALTER COLUMN title DROP NOT NULL;
  END IF;
END $$;
