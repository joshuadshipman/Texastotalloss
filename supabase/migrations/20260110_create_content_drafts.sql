-- Create content_drafts table for Phase 4 of Content Growth Engine

create table if not exists content_drafts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  status text not null check (status in ('draft', 'reviewed', 'published', 'rejected')),
  concept jsonb not null, -- Stores the ContentConcept from Gemini
  generated_content jsonb, -- Stores the full BlogPost + Video Script
  source_url text, -- The competitor URL that triggered this concept
  published_url text -- URL where we published it (if applicable)
);

-- Enable RLS
alter table content_drafts enable row level security;

-- Policies (Open for now as this is an internal tool, refine later for specific admin roles)
create policy "Enable all access for authenticated users" on content_drafts
  for all using (true) with check (true);

-- Create index for status to speed up the admin dashboard
create index content_drafts_status_idx on content_drafts (status);
