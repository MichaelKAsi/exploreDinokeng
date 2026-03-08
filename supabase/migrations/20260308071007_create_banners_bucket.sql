/*
  # Create banners storage bucket

  Creates a public storage bucket for banner image uploads.
  Users can upload images and access them via public URLs.
*/

DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('banners', 'banners', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

CREATE POLICY "Authenticated users can upload banner images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'banners');

CREATE POLICY "Anyone can view banner images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'banners');

CREATE POLICY "Authenticated users can delete banner images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'banners');
