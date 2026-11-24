-- 04 · Seguridad a nivel de fila Row Level Security
-- Nadie puede leer ni escribir nada sin una política que lo permita.

alter table public.profiles       enable row level security;
alter table public.categories     enable row level security;
alter table public.dishes         enable row level security;
alter table public.zones          enable row level security;
alter table public.zone_edges     enable row level security;
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;
alter table public.order_messages enable row level security;

-- Perfiles
create policy "Cada usuario ve su propio perfil" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "Admin ve todos los perfiles" on public.profiles
  for select to authenticated using (is_admin());

-- Categorías, platos, zonas y conexiones: lectura pública, gestión del admin
create policy "Todos ven las categorias" on public.categories
  for select to anon, authenticated using (true);
create policy "Admin gestiona categorias" on public.categories
  for all to authenticated using (is_admin()) with check (is_admin());

create policy "Todos ven los platos" on public.dishes
  for select to anon, authenticated using (true);
create policy "Admin gestiona platos" on public.dishes
  for all to authenticated using (is_admin()) with check (is_admin());

create policy "Todos ven las zonas" on public.zones
  for select to anon, authenticated using (true);
create policy "Admin gestiona zonas" on public.zones
  for all to authenticated using (is_admin()) with check (is_admin());

create policy "Todos ven las conexiones" on public.zone_edges
  for select to anon, authenticated using (true);
create policy "Admin gestiona conexiones" on public.zone_edges
  for all to authenticated using (is_admin()) with check (is_admin());

-- Pedidos: cada cliente ve los suyos y el admin todos.
-- No hay política de INSERT: los pedidos solo se crean con create_order().
create policy "Ver mis pedidos" on public.orders
  for select to authenticated using (user_id = auth.uid() or is_admin());
create policy "Admin actualiza pedidos" on public.orders
  for update to authenticated using (is_admin()) with check (is_admin());

create policy "Ver items de mis pedidos" on public.order_items
  for select to authenticated using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or is_admin())
    )
  );

-- Chat: solo participantes del pedido
create policy "Ver mensajes de mis pedidos" on public.order_messages
  for select to authenticated using (
    exists (
      select 1 from public.orders o
      where o.id = order_messages.order_id
        and (o.user_id = auth.uid() or is_admin())
    )
  );
create policy "Escribir en mis pedidos" on public.order_messages
  for insert to authenticated with check (
    exists (
      select 1 from public.orders o
      where o.id = order_messages.order_id
        and (o.user_id = auth.uid() or is_admin())
    )
  );