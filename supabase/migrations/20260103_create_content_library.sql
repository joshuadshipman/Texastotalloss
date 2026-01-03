-- Create 'content_library' table for video/blog content
CREATE TABLE IF NOT EXISTS public.content_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    video_url TEXT, -- YouTube or external URL
    category TEXT DEFAULT 'general',
    description TEXT,
    transcript TEXT, -- Full text for SEO/AI
    is_trending BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.content_library ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access
DROP POLICY IF EXISTS "Allow public read content_library" ON public.content_library;
CREATE POLICY "Allow public read content_library" ON public.content_library
FOR SELECT USING (true);

-- Allow Admin/Service Role full access (dev mode: allow all insert/update)
DROP POLICY IF EXISTS "Allow public insert content_library" ON public.content_library;
CREATE POLICY "Allow public insert content_library" ON public.content_library FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update content_library" ON public.content_library;
CREATE POLICY "Allow public update content_library" ON public.content_library FOR UPDATE USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_content_library_slug ON public.content_library(slug);
CREATE INDEX IF NOT EXISTS idx_content_library_category ON public.content_library(category);
