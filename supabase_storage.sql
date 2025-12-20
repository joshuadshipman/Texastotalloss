-- Create a storage bucket for vehicle photos and documents
insert into storage.buckets (id, name, public)
values ('vehicle-photos', 'vehicle-photos', true)
on conflict (id) do nothing;

-- 1. Public Read Access
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'vehicle-photos' );

-- 2. Public Upload Access
drop policy if exists "Public Upload" on storage.objects;
create policy "Public Upload"
  on storage.objects for insert
  with check ( bucket_id = 'vehicle-photos' );
