/*
  # Create experience_cards storage bucket
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('experience_cards', 'experience_cards', true)
ON CONFLICT (id) DO NOTHING;