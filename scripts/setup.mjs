#!/usr/bin/env node
// Texas Total Loss — One-Command Supabase Setup
// Usage: npm run setup

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Load env file
const envFile = existsSync(`${root}/.env.local`) ? `${root}/.env.local` : `${root}/.env`;
if (!existsSync(envFile)) {
  console.error('❌ No .env.local file found.');
  console.error('   Copy .env.template to .env.local and add your Supabase keys.');
  process.exit(1);
}

const env = {};
for (const line of readFileSync(envFile, 'utf8').split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('=');
  if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim().replace(/^"|"$/g, '');
}

const URL = env['NEXT_PUBLIC_SUPABASE_URL'];
const KEY = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!URL || !KEY || URL.includes('placeholder') || KEY.includes('placeholder')) {
  console.error('❌ Supabase keys missing or still set to placeholder values in .env.local');
  console.error(`   NEXT_PUBLIC_SUPABASE_URL = ${URL || 'MISSING'}`);
  console.error(`   SUPABASE_SERVICE_ROLE_KEY = ${KEY ? KEY.slice(0,20) + '...' : 'MISSING'}`);
  process.exit(1);
}

console.log('\n🚀 Texas Total Loss — Database Setup');
console.log(`📡 Project: ${URL}\n`);

const db = createClient(URL, KEY, { auth: { persistSession: false } });

// All migrations as individual executable statements
const migrations = [
  {
    name: 'total_loss_leads table',
    sql: `create table if not exists public.total_loss_leads (
      id uuid primary key default gen_random_uuid(),
      created_at timestamptz not null default now(),
      dialogflow_session_id text,
      source text default 'chatbot',
      status text default 'new',
      lead_type text,
      full_name text, email text, phone text,
      can_text boolean, preferred_contact_time text,
      crash_date date, state text, role text,
      other_driver_insured text, police_report boolean,
      vehicle_year integer, vehicle_make text, vehicle_model text,
      vehicle_trim text, vehicle_mileage integer, vehicle_zip text,
      vehicle_condition text, insurer_name text,
      total_loss_offer_amount numeric, total_loss_declared boolean,
      total_loss_date date, has_rental boolean, storage_fees_accruing boolean,
      has_injury boolean, treatment_started boolean,
      treatment_types text[], photos text[], injury_areas text[],
      lost_wages boolean, missed_work_days integer, er_visit boolean,
      imaging_done boolean, surgery_recommended boolean, attorney_already boolean,
      vehicle_photos_urls text[], injury_photos_urls text[],
      police_report_urls text[], other_docs_urls text[],
      priority_score integer, score integer,
      language text default 'en', pain_level integer default 0,
      accident_date date, city text,
      injury_summary text, liability_summary text,
      files_count integer default 0,
      description text, user_data jsonb, notes text
    )`
  },
  {
    name: 'total_loss_leads indexes',
    sql: `create index if not exists idx_leads_created_at on public.total_loss_leads (created_at);
          create index if not exists idx_leads_status on public.total_loss_leads (status);
          create index if not exists idx_leads_session on public.total_loss_leads (dialogflow_session_id)`
  },
  {
    name: 'chat_transcripts table',
    sql: `create table if not exists public.chat_transcripts (
      id bigserial primary key,
      created_at timestamptz not null default now(),
      lead_id uuid references public.total_loss_leads(id) on delete set null,
      dialogflow_session_id text not null,
      sender text not null, message text, raw_payload jsonb, step text
    )`
  },
  {
    name: 'chat_messages table',
    sql: `create table if not exists public.chat_messages (
      id uuid default gen_random_uuid() primary key,
      session_id text not null, sender text not null,
      content text not null, is_read boolean default false,
      created_at timestamptz default now(), metadata jsonb
    )`
  },
  {
    name: 'content_library table',
    sql: `create table if not exists public.content_library (
      id uuid default gen_random_uuid() primary key,
      slug text not null unique, title text not null,
      video_url text, category text default 'general',
      description text, transcript text,
      is_trending boolean default false,
      created_at timestamptz default now(),
      updated_at timestamptz default now(),
      published_at timestamptz
    )`
  },
  {
    name: 'content_drafts table',
    sql: `create table if not exists public.content_drafts (
      id uuid default gen_random_uuid() primary key,
      created_at timestamptz default now() not null,
      status text not null check (status in ('draft','reviewed','published','rejected')),
      concept jsonb not null, generated_content jsonb,
      source_url text, published_url text
    )`
  },
  {
    name: 'blog_posts table (The Scout)',
    sql: `create table if not exists public.blog_posts (
      id uuid default gen_random_uuid() primary key,
      slug text not null unique, title text not null,
      excerpt text, content text not null,
      author text default 'Texas Total Loss Team',
      published_at timestamptz default timezone('utc'::text, now()),
      tags text[] default '{}', read_time text,
      seo_score int default 0, source_type text,
      persona_used text,
      created_at timestamptz default timezone('utc'::text, now())
    )`
  },
  {
    name: 'chat_sessions table',
    sql: `
      create table if not exists public.chat_sessions (
        id uuid default gen_random_uuid() primary key,
        session_id text not null unique,
        user_data jsonb default '{}',
        status text default 'bot',
        created_at timestamptz default now(),
        updated_at timestamptz default now()
      );
      
      -- Guard to ensure columns exist if table was created partially
      do $$ 
      begin 
        if not exists (select 1 from information_schema.columns where table_name='chat_sessions' and column_name='status') then
          alter table public.chat_sessions add column status text default 'bot';
        end if;
        if not exists (select 1 from information_schema.columns where table_name='chat_sessions' and column_name='user_data') then
          alter table public.chat_sessions add column user_data jsonb default '{}';
        end if;
      end $$;
      
      -- Force PostgREST to reload schema cache
      NOTIFY pgrst, 'reload schema';
    `
  },
  {
    name: 'vehicle-photos storage bucket',
    sql: `insert into storage.buckets (id, name, public)
          values ('vehicle-photos', 'vehicle-photos', true)
          on conflict (id) do nothing`
  }
];

let passed = 0;
let failed = 0;
const manualItems = [];

for (const m of migrations) {
  process.stdout.write(`  ⏳ ${m.name}...`);
  try {
    // Use from().select() as a ping, then run raw via rpc if available
    // Supabase JS client doesn't support raw DDL — we use the REST SQL endpoint
    const res = await fetch(`${URL}/rest/v1/rpc/`, {
      method: 'POST',
      headers: {
        'apikey': KEY,
        'Authorization': `Bearer ${KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: m.sql })
    });

    // Try the management API SQL endpoint
    const sqlRes = await fetch(`${URL}/sql`, {
      method: 'POST', 
      headers: {
        'apikey': KEY,
        'Authorization': `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ query: m.sql })
    });

    if (sqlRes.ok || sqlRes.status === 204) {
      console.log(` ✅`);
      passed++;
    } else {
      const body = await sqlRes.text();
      if (body.includes('already exists') || body.includes('duplicate')) {
        console.log(` ✅ (already exists)`);
        passed++;
      } else {
        console.log(` ⚠️  needs manual run`);
        manualItems.push(m.name);
        failed++;
      }
    }
  } catch(e) {
    console.log(` ⚠️  needs manual run`);
    manualItems.push(m.name);
    failed++;
  }
}

console.log(`\n📊 Results: ${passed} created, ${failed} need manual SQL`);

if (manualItems.length > 0) {
  console.log('\n⚠️  The following need to be run manually in Supabase SQL Editor:');
  console.log('   👉 https://supabase.com/dashboard/project/apfdwkttzidzusvrjxur/sql/new');
  manualItems.forEach(n => console.log(`   - ${n}`));
  console.log('\n   Paste the full SQL block from your Perplexity chat and click Run.');
} else {
  console.log('\n🎉 All tables created! Database is fully set up.');
  console.log('   Add your Vercel env vars and redeploy to go live.\n');
}

// Final connection test
console.log('\n🔌 Testing connection...');
const { data, error } = await db.from('total_loss_leads').select('count').limit(1);
if (error) {
  console.log(`❌ Connection test failed: ${error.message}`);
  console.log('   Run the SQL manually at: https://supabase.com/dashboard/project/apfdwkttzidzusvrjxur/sql/new');
} else {
  console.log('✅ Connection confirmed! total_loss_leads table is live.\n');
}
