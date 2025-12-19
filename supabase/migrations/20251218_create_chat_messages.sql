-- Create the chat_messages table
CREATE TABLE public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    sender TEXT NOT NULL, -- 'user', 'bot', 'agent'
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Create Index
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);

-- RLS Policies (Public can insert, but only access their own session? For now, we keep it simple for MVP)
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON public.chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON public.chat_messages FOR SELECT USING (true); -- Ideally restrict to own session
