-- Create a table for storing AI-generated content
create table public.blog_posts (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null, -- HTML content
  author text default 'Texas Total Loss Team',
  published_at timestamp with time zone default timezone('utc'::text, now()),
  tags text[] default '{}',
  read_time text,
  seo_score int default 0,
  
  -- Metadata for internal tracking
  source_type text, -- 'competitor_scrape', 'trend_jack', 'evergreen'
  persona_used text, -- 'Aggressive', 'Empathetic', etc.
  
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.blog_posts enable row level security;

-- Create policy to allow public read access (for the blog pages)
create policy "Allow public read access"
  on public.blog_posts for select
  using (true);

-- Create policy to allow service role/admin write access
create policy "Allow admin write access"
  on public.blog_posts for insert
  with check (true);
