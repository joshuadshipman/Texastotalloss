-- SAFE REPAIR SCRIPT
-- This script only fixes permissions (RLS) and does not try to recreate the table.
-- Run this to fix the "Chat not showing" issue.

-- 1. Ensure RLS is enabled
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 2. Reset Insert Policy (Allows users to send messages)
DROP POLICY IF EXISTS "Allow public insert" ON public.chat_messages;
CREATE POLICY "Allow public insert" ON public.chat_messages FOR INSERT WITH CHECK (true);

-- 3. Reset Select Policy (Allows Admin Dashboard to read messages)
DROP POLICY IF EXISTS "Allow public select" ON public.chat_messages;
CREATE POLICY "Allow public select" ON public.chat_messages FOR SELECT USING (true);

-- 4. Reset Update Policy (Allows Admin to mark as read)
DROP POLICY IF EXISTS "Allow public update" ON public.chat_messages;
CREATE POLICY "Allow public update" ON public.chat_messages FOR UPDATE USING (true);
