-- Enable Row Level Security
alter table public.total_loss_leads enable row level security;
alter table public.chat_transcripts enable row level security;

-- Create Leads Table
create table public.total_loss_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  dialogflow_session_id text,
  source text default 'chatbot',
  status text default 'new',              -- new, contacted, retained, etc.
  lead_type text,                         -- total_loss_only, total_loss_plus_injury

  -- Contact
  full_name text,
  email text,
  phone text,
  can_text boolean,
  preferred_contact_time text,

  -- Crash / liability
  crash_date date,
  state text,
  role text,                              -- driver, passenger, pedestrian, other
  other_driver_insured text,              -- yes/no/unknown
  police_report boolean,

  -- Total loss
  vehicle_year integer,
  vehicle_make text,
  vehicle_model text,
  vehicle_trim text,
  vehicle_mileage integer,
  vehicle_zip text,
  vehicle_condition text,                 -- excellent/good/fair
  insurer_name text,
  total_loss_offer_amount numeric,
  total_loss_declared boolean,
  total_loss_date date,
  has_rental boolean,
  storage_fees_accruing boolean,

  -- Injury
  has_injury boolean,
  treatment_started boolean,
  treatment_types text[],                 -- ER, urgent care, chiro, PT, etc.
  photos text[],                          -- Array of photo URLs
  injury_areas text[],                    -- neck, back, head, etc.
  lost_wages boolean,
  missed_work_days integer,
  er_visit boolean,
  imaging_done boolean,
  surgery_recommended boolean,
  attorney_already boolean,

  -- Attachments
  vehicle_photos_urls text[],
  injury_photos_urls text[],
  police_report_urls text[],
  other_docs_urls text[],

  -- Scoring / notes
  priority_score integer,
  notes text
);

create index on public.total_loss_leads (created_at);
create index on public.total_loss_leads (lead_type);
create index on public.total_loss_leads (status);
create index on public.total_loss_leads (dialogflow_session_id);

-- Create Chat Transcripts Table
create table public.chat_transcripts (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  lead_id uuid references public.total_loss_leads(id) on delete set null,
  dialogflow_session_id text not null,
  sender text not null,        -- 'user' or 'bot'
  message text,
  raw_payload jsonb,
  step text                    -- vehicle, offer, injury, contact, etc.
);

create index on public.chat_transcripts (dialogflow_session_id);
create index on public.chat_transcripts (lead_id);
create index on public.chat_transcripts (created_at);

-- RLS Policies
create policy "service-role-full-access-leads"
on public.total_loss_leads
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "service-role-full-access-transcripts"
on public.chat_transcripts
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
