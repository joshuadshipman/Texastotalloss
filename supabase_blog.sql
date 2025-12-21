-- Create 'posts' table for the automated blog
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT NOT NULL, -- Markdown content
    excerpt TEXT,
    featured_image TEXT,
    tags TEXT[], -- Array of strings e.g. ['diminished value', 'safety']
    status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    author TEXT DEFAULT 'Legal Team'
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access for Published Posts
DROP POLICY IF EXISTS "Allow public read published posts" ON public.posts;
CREATE POLICY "Allow public read published posts" ON public.posts
FOR SELECT USING (status = 'published');

-- Allow Admin/Service Role full access
-- (Using anon key for now with 'true' for insert/update in this dev environment, 
-- but in prod this should be restricted to service_role or authenticated admin)
DROP POLICY IF EXISTS "Allow public insert (for dev automation)" ON public.posts;
CREATE POLICY "Allow public insert (for dev automation)" ON public.posts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update (for dev automation)" ON public.posts;
CREATE POLICY "Allow public update (for dev automation)" ON public.posts FOR UPDATE USING (true);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at DESC);
