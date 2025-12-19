-- Create the bucket if it doesn't exist (Supabase Storage)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vehicle-photos', 'vehicle-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for public upload/read
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'vehicle-photos' );

CREATE POLICY "Public Insert"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'vehicle-photos' );
