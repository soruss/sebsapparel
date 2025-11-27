-- 1. Create the Storage Bucket
insert into storage.buckets (id, name, public)
values ('meeting-uploads', 'meeting-uploads', true);

-- 2. Allow Public to UPLOAD files
create policy "Public can upload meeting files"
on storage.objects for insert
to anon
with check ( bucket_id = 'meeting-uploads' );

-- 3. Allow Public to VIEW files (so Admin can see them)
create policy "Public can view meeting files"
on storage.objects for select
to anon
using ( bucket_id = 'meeting-uploads' );

-- 4. Add file_url column to meetings table
alter table meetings add column file_url text;
