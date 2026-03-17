
-- Clawbot Tasks: To store edit requests and instructions from mobile/web
CREATE TABLE IF NOT EXISTS clawbot_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    prompt TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'edit', -- 'edit', 'research', 'file_pull', 'command'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'drafted', 'applied', 'failed'
    payload JSONB DEFAULT '{}', -- Store drafted code, file paths, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS (Row Level Security) - Basic Setup
ALTER TABLE clawbot_tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can see their own tasks
CREATE POLICY "Users can view their own tasks" ON clawbot_tasks 
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Service Role (Admin) can do everything
CREATE POLICY "Admin full access" ON clawbot_tasks 
    USING (true);
