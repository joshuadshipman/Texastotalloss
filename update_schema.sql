-- Add new columns to total_loss_leads table for structured data
ALTER TABLE public.total_loss_leads
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pain_level INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS accident_date DATE,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS injury_summary TEXT, -- e.g. "Neck, Back"
ADD COLUMN IF NOT EXISTS liability_summary TEXT, -- e.g. "Clear (Other Driver)"
ADD COLUMN IF NOT EXISTS files_count INTEGER DEFAULT 0;

-- Create an index on score and created_at for sorting
CREATE INDEX IF NOT EXISTS idx_leads_score ON public.total_loss_leads(score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.total_loss_leads(created_at DESC);

-- Ensure RLS allows reading by anyone? Or maybe restrict to service role / admin?
-- For this "Local Admin" setup with just a PIN, we are using the client-side supabase client 
-- which uses the ANON key. So we need to ensure "Select" is allowed.
-- NOTE: In a real production app, you would use authenticated users. 
-- For now, we assume existing policies allow public select or we add one.
DROP POLICY IF EXISTS "Allow public select" ON public.total_loss_leads;
CREATE POLICY "Allow public select" ON public.total_loss_leads FOR SELECT USING (true);
