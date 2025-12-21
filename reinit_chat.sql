-- 1. Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    sender TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);

-- 2. Enable Realtime
-- This is critical for the Admin Dashboard to receive live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- 3. Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 5. Create Permissive Policies
-- Since we are using a client-side Admin panel with a PIN (and shared Anon key), 
-- we must allow public access. Ideally, this should be creating a specific role, 
-- but for this MVP architecture, we allow public I/O.

-- Allow anyone to Insert (Chat Widget users)
DROP POLICY IF EXISTS "Allow public insert" ON public.chat_messages;
CREATE POLICY "Allow public insert" ON public.chat_messages FOR INSERT WITH CHECK (true);

-- Allow anyone to Select (Admin Dashboard)
DROP POLICY IF EXISTS "Allow public select" ON public.chat_messages;
CREATE POLICY "Allow public select" ON public.chat_messages FOR SELECT USING (true);

-- Allow anyone to Update (Admin Dashboard marking read)
DROP POLICY IF EXISTS "Allow public update" ON public.chat_messages;
CREATE POLICY "Allow public update" ON public.chat_messages FOR UPDATE USING (true);
