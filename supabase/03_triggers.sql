-- 03 · Triggers de Domi
-- (Los triggers de avisos del pedido están en 06_avisos_bot.sql)

-- Al registrarse un usuario se crea su perfil
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Antes de guardar un mensaje se decide quién lo escribió
drop trigger if exists order_messages_set_sender on public.order_messages;
create trigger order_messages_set_sender
  before insert on public.order_messages
  for each row
  execute function public.set_message_sender();

-- Después de un mensaje del cliente, el asistente responde.
-- Solo se dispara con mensajes que no son del personal ni del bot,
-- así los avisos automáticos no provocan respuestas en cadena.
drop trigger if exists order_messages_bot on public.order_messages;
create trigger order_messages_bot
  after insert on public.order_messages
  for each row
  when (new.is_staff = false and new.is_bot = false)
  execute function public.bot_reply();