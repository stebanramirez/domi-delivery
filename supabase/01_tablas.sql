-- 01 · Tablas y restricciones de Domi
-- Orden de ejecución: 01 tablas -> 02 funciones -> 03 triggers -> 04 seguridad -> 05 storage -> 06 avisos del bot

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id text primary key,
  name text not null,
  parent_id text references public.categories(id)
);

create table if not exists public.dishes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price integer not null check (price > 0),
  category_id text not null references public.categories(id),
  image_url text,
  available boolean not null default true,
  times_ordered integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.zones (
  id text primary key,
  name text not null,
  lat double precision not null,
  lng double precision not null,
  is_origin boolean not null default false
);

create table if not exists public.zone_edges (
  zone_a text not null references public.zones(id) on delete cascade,
  zone_b text not null references public.zones(id) on delete cascade,
  distance_km numeric not null check (distance_km > 0),
  primary key (zone_a, zone_b)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id),
  zone_id text not null references public.zones(id),
  address text not null,
  notes text,
  subtotal integer not null,
  shipping integer not null,
  total integer not null,
  distance_km numeric not null,
  status text not null default 'recibido'
    check (status in ('recibido', 'preparando', 'en_camino', 'entregado', 'cancelado')),
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  dish_id uuid references public.dishes(id) on delete set null,
  dish_name text not null,
  unit_price integer not null,
  quantity integer not null check (quantity > 0)
);

create table if not exists public.order_messages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  sender_id uuid default auth.uid() references auth.users(id),
  is_staff boolean not null default false,
  is_bot boolean not null default false,
  body text not null
    check (char_length(trim(both from body)) between 1 and 500),
  created_at timestamptz not null default now()
);

-- Los mensajes y pedidos llegan al navegador en tiempo real
alter publication supabase_realtime add table public.orders, public.order_messages;