-- =====================================================
-- Storage DELETE Policy Migration
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- =====================================================

-- Add DELETE policy for avatars bucket
-- Allows users to delete their own uploaded avatar files
CREATE POLICY "Users can delete their own avatar."
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'avatars' AND auth.uid() = owner );
