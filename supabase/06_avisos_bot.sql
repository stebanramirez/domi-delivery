-- Avisos automáticos del asistente cuando cambia el estado de un pedido.
-- Se ejecuta en la misma transacción que el cambio, así que el cliente
-- recibe el aviso aunque no haya escrito nada en el chat.

create or replace function public.bot_aviso_estado()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_msg text;
  v_eta integer;
  v_restante integer;
begin
  if tg_op = 'INSERT' then
    v_msg := 'Recibimos tu pedido. Te avisaremos por aquí cuando el restaurante lo acepte.';

  elsif new.status is distinct from old.status then
    -- Tiempo estimado total (15 min + 2,5 min por km) menos lo que ya pasó
    v_eta := round(15 + new.distance_km * 2.5)::integer;
    v_restante := greatest(
      v_eta - floor(extract(epoch from (now() - new.created_at)) / 60)::integer,
      0
    );

    v_msg := case new.status
      when 'preparando' then
        'Tu pedido fue aceptado. Ya lo estamos preparando.'
      when 'en_camino' then
        'Tu pedido va en camino.'
        || case when v_restante > 0
             then ' Llegará en aproximadamente ' || v_restante || ' min.'
             else '' end
      when 'entregado' then
        'Tu pedido fue entregado. ¡Buen provecho!'
      when 'cancelado' then
        'El restaurante canceló tu pedido. Si tienes dudas, escríbenos por aquí.'
      else null
    end;
  end if;

  if v_msg is null then
    return null;
  end if;

  -- Misma marca que usa bot_reply: solo el servidor puede crear mensajes del bot
  perform set_config('app.bot_insert', 'on', true);
  insert into order_messages (order_id, body) values (new.id, v_msg);
  perform set_config('app.bot_insert', 'off', true);

  return null;
end;
$function$;

-- Aviso al crear el pedido
drop trigger if exists orders_aviso_creado on public.orders;
create trigger orders_aviso_creado
  after insert on public.orders
  for each row
  execute function public.bot_aviso_estado();

-- Aviso cada vez que el administrador cambia el estado
drop trigger if exists orders_aviso_estado on public.orders;
create trigger orders_aviso_estado
  after update of status on public.orders
  for each row
  when (old.status is distinct from new.status)
  execute function public.bot_aviso_estado();