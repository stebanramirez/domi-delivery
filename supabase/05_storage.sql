-- 05 · Bucket público para las fotos de los platos
insert into storage.buckets (id, name, public)
values ('dishes', 'dishes', true)
on conflict (id) do nothing;

create policy "Fotos de platos visibles" on storage.objects
  for select to public using (bucket_id = 'dishes');

create policy "Admin sube fotos de platos" on storage.objects
  for insert to authenticated with check (bucket_id = 'dishes' and is_admin());

create policy "Admin actualiza fotos de platos" on storage.objects
  for update to authenticated using (bucket_id = 'dishes' and is_admin());

create policy "Admin borra fotos de platos" on storage.objects
  for delete to authenticated using (bucket_id = 'dishes' and is_admin());