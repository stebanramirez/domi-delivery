-- 02 · Funciones de Domi

-- Crea el perfil automáticamente cuando alguien se registra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$function$;

-- ¿El usuario actual es administrador?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $function$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$function$;

-- Crea el pedido en UNA transacción. Los precios y el envío los calcula la
-- base de datos el navegador no puede manipularlos. El envío usa la
-- distancia más corta desde el restaurante con una consulta recursiva.
create or replace function public.create_order(
  p_zone_id text, p_address text, p_notes text, p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_user uuid := auth.uid();
  v_km numeric;
  v_shipping integer;
  v_order_id uuid;
  v_subtotal integer := 0;
  v_item jsonb;
  v_dish public.dishes%rowtype;
  v_qty integer;
begin
  if v_user is null then
    raise exception 'Debes iniciar sesión para hacer un pedido';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'El carrito está vacío';
  end if;

  if p_address is null or length(trim(p_address)) < 5 then
    raise exception 'Escribe una dirección válida';
  end if;

  -- Distancia más corta desde el restaurante, calculada en la base de datos
  with recursive rutas as (
    select z.id as nodo, 0::numeric as dist, array[z.id] as visitados
    from zones z
    where z.is_origin
    union all
    select n.siguiente, r.dist + n.d, r.visitados || n.siguiente
    from rutas r
    cross join lateral (
      select
        case when e.zone_a = r.nodo then e.zone_b else e.zone_a end as siguiente,
        e.distance_km as d
      from zone_edges e
      where e.zone_a = r.nodo or e.zone_b = r.nodo
    ) n
    where not n.siguiente = any (r.visitados)
  )
  select min(dist) into v_km from rutas where nodo = p_zone_id;

  if v_km is null or v_km = 0 then
    raise exception 'Zona de entrega no válida';
  end if;

  v_shipping := (ceil((3000 + v_km * 1000) / 500) * 500)::integer;

  insert into orders (user_id, zone_id, address, notes, subtotal, shipping, total, distance_km)
  values (v_user, p_zone_id, trim(p_address), nullif(trim(p_notes), ''), 0, v_shipping, 0, v_km)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := (v_item->>'quantity')::integer;
    if v_qty is null or v_qty < 1 or v_qty > 50 then
      raise exception 'Cantidad no válida';
    end if;

    select * into v_dish from dishes where id = (v_item->>'dish_id')::uuid;
    if not found or not v_dish.available then
      raise exception 'Un plato del carrito ya no está disponible';
    end if;

    insert into order_items (order_id, dish_id, dish_name, unit_price, quantity)
    values (v_order_id, v_dish.id, v_dish.name, v_dish.price, v_qty);

    update dishes set times_ordered = times_ordered + v_qty where id = v_dish.id;

    v_subtotal := v_subtotal + v_dish.price * v_qty;
  end loop;

  update orders
  set subtotal = v_subtotal, total = v_subtotal + v_shipping
  where id = v_order_id;

  return v_order_id;
end;
$function$;

-- Decide quién es el autor de cada mensaje del chat. El cliente no puede
-- fingir ser personal ni bot: solo el servidor activa app.bot_insert.
create or replace function public.set_message_sender()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  if coalesce(current_setting('app.bot_insert', true), '') = 'on' then
    new.sender_id := null;
    new.is_staff := true;
    new.is_bot := true;
    return new;
  end if;

  new.sender_id := auth.uid();
  new.is_bot := false;
  new.is_staff := public.is_admin()
    and new.sender_id <> (select user_id from public.orders where id = new.order_id);
  return new;
end;
$function$;

-- Asistente con reglas: responde según palabras clave del mensaje del cliente
create or replace function public.bot_reply()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_order public.orders%rowtype;
  t text := translate(lower(new.body), 'áéíóúüñ', 'aeiouun');
  v_estado text;
  v_eta integer;
  v_restante integer;
  v_reply text;
begin
  select * into v_order from orders where id = new.order_id;
  if not found then
    return null;
  end if;

  v_estado := case v_order.status
    when 'recibido' then 'Tu pedido fue recibido y pronto empezará a prepararse.'
    when 'preparando' then 'Estamos preparando tu pedido.'
    when 'en_camino' then 'Tu pedido va en camino.'
    when 'entregado' then 'Tu pedido ya fue entregado. ¡Buen provecho!'
    else 'Este pedido fue cancelado.'
  end;

  -- Tiempo estimado total (15 min + 2,5 min por km) menos lo que ya pasó
  v_eta := round(15 + v_order.distance_km * 2.5)::integer;
  v_restante := greatest(
    v_eta - floor(extract(epoch from (now() - v_order.created_at)) / 60)::integer,
    0
  );

  if t ~ 'cancel' then
    v_reply := 'Para cancelar, un administrador debe revisar tu pedido. Tu pedido está en estado "'
      || v_order.status || '". Escríbenos aquí el motivo y te respondemos.';

  elsif t ~ '(direccion|domicilio)' then
    v_reply := 'La dirección registrada es: ' || v_order.address
      || '. Si necesitas cambiarla, escribe aquí la nueva y el restaurante la confirmará.';

  elsif t ~ '(total|cuanto cuesta|cuanto es|precio|costo|pagar|envio)' then
    v_reply := 'El total de tu pedido es $ '
      || replace(to_char(v_order.total, 'FM999,999,999'), ',', '.')
      || ' (incluye envío de $ '
      || replace(to_char(v_order.shipping, 'FM999,999,999'), ',', '.') || ').';

  elsif t ~ '(donde|estado|cuanto falta|demora|tarda|tiempo|llega|falta|va mi pedido)' then
    v_reply := v_estado;
    if v_order.status in ('recibido', 'preparando', 'en_camino') and v_restante > 0 then
      v_reply := v_reply || ' Tiempo estimado restante: aprox. ' || v_restante || ' min.';
    end if;

  elsif t ~ 'gracias' then
    v_reply := '¡Con gusto! Estamos atentos a tu pedido.';

  elsif t ~ '\m(hola|buenas|buenos|hey)\M' then
    v_reply := '¡Hola! Soy el asistente de Domi. Puedo contarte el estado de tu pedido, el tiempo estimado, el total o la dirección de entrega.';

  else
    v_reply := 'Soy el asistente de Domi. Pregúntame por el estado, el tiempo, el total o la dirección de tu pedido. Si necesitas algo más, un administrador te responderá aquí.';
  end if;

  perform set_config('app.bot_insert', 'on', true);
  insert into order_messages (order_id, body) values (new.order_id, v_reply);
  perform set_config('app.bot_insert', 'off', true);

  return null;
end;
$function$;