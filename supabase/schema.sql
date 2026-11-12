-- =============================================================================
--  Fielito · Esquema de base de datos para Supabase (PostgreSQL)
--  Ejecutar en el SQL Editor de Supabase o con: supabase db push
--
--  Modelo B2B2C:
--    auth.users 1—1 profiles
--    profiles (merchant) 1—N businesses
--    profiles (customer) N—M businesses a través de loyalty_cards
--    loyalty_cards 1—N transactions
--
--  Notas de seguridad:
--    · RLS habilitado en todas las tablas públicas.
--    · El comercio solo ve sus clientes y transacciones.
--    · El cliente solo ve sus tarjetas y movimientos.
--    · Los sellos y canjes se escriben mediante RPC security definer,
--      nunca con UPDATE directo del cliente.
-- =============================================================================

begin;

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

-- -----------------------------------------------------------------------------
-- 1. Tipos
-- -----------------------------------------------------------------------------
do $$
begin
  create type public.user_role as enum ('merchant', 'customer');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.business_category as enum ('cafe', 'comida', 'servicios');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.plan_tier as enum ('free', 'pro');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.brand_color as enum ('amber', 'indigo', 'rose', 'sky', 'violet', 'emerald');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.transaction_type as enum ('stamp_added', 'reward_claimed');
exception when duplicate_object then null;
end $$;

-- -----------------------------------------------------------------------------
-- 2. Tablas
-- -----------------------------------------------------------------------------

-- Perfil público vinculado a la cuenta de Supabase Auth.
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  role          public.user_role not null default 'customer',
  full_name     text not null check (char_length(full_name) between 2 and 80),
  email         text not null check (position('@' in email) > 1),
  phone         text check (phone is null or char_length(phone) <= 25),
  avatar_emoji  text not null default '🙂' check (char_length(avatar_emoji) <= 8),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.profiles is
  'Perfil de comercio o cliente. Se crea automáticamente al registrarse en Supabase Auth.';

-- Comercio afiliado y configuración de su tarjeta de sellos.
create table if not exists public.businesses (
  id                   uuid primary key default gen_random_uuid(),
  owner_id             uuid not null references public.profiles (id) on delete cascade,
  name                 text not null check (char_length(name) between 2 and 60),
  category             public.business_category not null default 'cafe',
  latitude             double precision not null check (latitude between -90 and 90),
  longitude            double precision not null check (longitude between -180 and 180),
  required_stamps      integer not null default 5 check (required_stamps between 3 and 20),
  reward_description   text not null check (char_length(reward_description) between 3 and 120),
  address              text not null check (char_length(address) between 5 and 160),
  phone                text check (phone is null or char_length(phone) <= 25),
  logo_emoji           text not null default '🏪' check (char_length(logo_emoji) <= 8),
  brand_color          public.brand_color not null default 'amber',
  plan                 public.plan_tier not null default 'free',
  stripe_customer_id   text,
  stripe_subscription_id text,
  is_active            boolean not null default true,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists businesses_owner_idx on public.businesses (owner_id);
create index if not exists businesses_category_idx on public.businesses (category) where is_active;
create index if not exists businesses_location_idx on public.businesses (latitude, longitude) where is_active;

comment on table public.businesses is
  'Comercio afiliado. El plan y los IDs de Stripe solo pueden modificarlos service_role/postgres.';

-- Tarjeta de lealtad de un cliente en un comercio. Única por par cliente/comercio.
create table if not exists public.loyalty_cards (
  id                uuid primary key default gen_random_uuid(),
  customer_id       uuid not null references public.profiles (id) on delete cascade,
  business_id       uuid not null references public.businesses (id) on delete cascade,
  current_stamps    integer not null default 0 check (current_stamps >= 0),
  is_completed      boolean not null default false,
  rewards_redeemed  integer not null default 0 check (rewards_redeemed >= 0),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint loyalty_cards_unique_customer_business unique (customer_id, business_id)
);

create index if not exists loyalty_cards_business_idx on public.loyalty_cards (business_id);
create index if not exists loyalty_cards_customer_idx on public.loyalty_cards (customer_id);
create index if not exists loyalty_cards_ready_idx on public.loyalty_cards (business_id, is_completed);

comment on table public.loyalty_cards is
  'Progreso del cliente. Se modifica únicamente mediante redeem_scan_token() y claim_reward().';

-- Registro inmutable de sellos y canjes (auditoría / antifraude).
create table if not exists public.transactions (
  id           uuid primary key default gen_random_uuid(),
  card_id      uuid not null references public.loyalty_cards (id) on delete cascade,
  business_id  uuid not null references public.businesses (id) on delete cascade,
  customer_id  uuid not null references public.profiles (id) on delete cascade,
  type         public.transaction_type not null,
  scan_date    timestamptz not null default now(),
  scan_nonce   text,
  metadata     jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

create index if not exists transactions_business_date_idx
  on public.transactions (business_id, scan_date desc);
create index if not exists transactions_customer_date_idx
  on public.transactions (customer_id, scan_date desc);
create index if not exists transactions_card_idx
  on public.transactions (card_id, scan_date desc);
create unique index if not exists transactions_scan_nonce_unique_idx
  on public.transactions (scan_nonce) where scan_nonce is not null;

comment on table public.transactions is
  'Libro mayor de sellos y canjes. Sin políticas de UPDATE/DELETE: es un registro de auditoría.';

-- Nonces de un solo uso asociados a los tokens QR firmados.
-- Esta tabla es server-only: RLS sin políticas y sin grants para anon/authenticated.
create table if not exists public.scan_nonces (
  nonce        text primary key,
  business_id  uuid not null references public.businesses (id) on delete cascade,
  expires_at   timestamptz not null,
  used_at      timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists scan_nonces_expires_idx on public.scan_nonces (expires_at);
create index if not exists scan_nonces_business_idx on public.scan_nonces (business_id, used_at);

comment on table public.scan_nonces is
  'Nonces de QR de un solo uso. La emisión y el consumo ocurren en el servidor con service_role o RPC.';

-- -----------------------------------------------------------------------------
-- 3. Funciones auxiliares
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_business_owner(p_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.businesses
    where id = p_business_id
      and owner_id = auth.uid()
  );
$$;

-- Permite al comercio ver el perfil de los clientes que tienen tarjeta en su negocio.
create or replace function public.merchant_can_view_profile(p_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.loyalty_cards c
    join public.businesses b on b.id = c.business_id
    where c.customer_id = p_profile_id
      and b.owner_id = auth.uid()
  );
$$;

-- -----------------------------------------------------------------------------
-- 4. Triggers
-- -----------------------------------------------------------------------------

-- Perfil automático al crear un usuario en Supabase Auth.
-- El rol se toma de raw_user_meta_data.role ('merchant' | 'customer').
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role public.user_role;
begin
  v_role := case
    when coalesce(new.raw_user_meta_data ->> 'role', 'customer') = 'merchant'
      then 'merchant'::public.user_role
    else 'customer'::public.user_role
  end;

  insert into public.profiles (id, role, full_name, email, phone, avatar_emoji)
  values (
    new.id,
    v_role,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
      split_part(coalesce(new.email, 'cliente@fielito.sv'), '@', 1)
    ),
    lower(coalesce(new.email, '')),
    nullif(trim(new.raw_user_meta_data ->> 'phone'), ''),
    case when v_role = 'merchant' then '🏪' else '🙂' end
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- El rol del perfil no puede cambiarse desde el cliente.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role
     and coalesce(auth.role(), '') <> 'service_role'
     and current_user not in ('postgres', 'supabase_admin') then
    raise exception 'PROFILE_ROLE_IMMUTABLE'
      using hint = 'El rol solo puede cambiarlo el backend con service_role.';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_role on public.profiles;
create trigger profiles_protect_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists businesses_set_updated_at on public.businesses;
create trigger businesses_set_updated_at
  before update on public.businesses
  for each row execute function public.set_updated_at();

drop trigger if exists loyalty_cards_set_updated_at on public.loyalty_cards;
create trigger loyalty_cards_set_updated_at
  before update on public.loyalty_cards
  for each row execute function public.set_updated_at();

-- Un negocio nuevo siempre nace en plan Gratis y con los campos de Stripe vacíos.
create or replace function public.normalize_new_business()
returns trigger
language plpgsql
as $$
begin
  if coalesce(auth.role(), '') <> 'service_role'
     and current_user not in ('postgres', 'supabase_admin') then
    new.plan := 'free';
    new.stripe_customer_id := null;
    new.stripe_subscription_id := null;
    new.is_active := true;
    new.created_at := now();
    new.updated_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists businesses_normalize_insert on public.businesses;
create trigger businesses_normalize_insert
  before insert on public.businesses
  for each row execute function public.normalize_new_business();

-- El dueño y el plan no se pueden cambiar desde el SDK del navegador.
create or replace function public.protect_business_billing_fields()
returns trigger
language plpgsql
as $$
begin
  if coalesce(auth.role(), '') <> 'service_role'
     and current_user not in ('postgres', 'supabase_admin') then
    if new.owner_id is distinct from old.owner_id then
      raise exception 'BUSINESS_OWNER_IMMUTABLE';
    end if;
    if new.plan is distinct from old.plan then
      raise exception 'PLAN_CHANGE_REQUIRES_BACKEND'
        using hint = 'El plan se actualiza desde el webhook de Stripe con service_role.';
    end if;
    if new.stripe_customer_id is distinct from old.stripe_customer_id
       or new.stripe_subscription_id is distinct from old.stripe_subscription_id then
      raise exception 'STRIPE_FIELDS_BACKEND_ONLY';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists businesses_protect_billing on public.businesses;
create trigger businesses_protect_billing
  before update on public.businesses
  for each row execute function public.protect_business_billing_fields();

-- Una tarjeta nueva siempre empieza en cero y no puede falsear su estado.
create or replace function public.normalize_new_card()
returns trigger
language plpgsql
as $$
begin
  if coalesce(auth.role(), '') <> 'service_role'
     and current_user not in ('postgres', 'supabase_admin') then
    new.current_stamps := 0;
    new.is_completed := false;
    new.rewards_redeemed := 0;
    new.created_at := now();
    new.updated_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists loyalty_cards_normalize_insert on public.loyalty_cards;
create trigger loyalty_cards_normalize_insert
  before insert on public.loyalty_cards
  for each row execute function public.normalize_new_card();

-- Límite del plan Gratis: 50 clientes únicos por comercio.
create or replace function public.enforce_free_plan_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_plan public.plan_tier;
  v_customers integer;
begin
  select plan into v_plan from public.businesses where id = new.business_id;

  if v_plan = 'free' then
    select count(distinct customer_id)
      into v_customers
      from public.loyalty_cards
      where business_id = new.business_id;

    if v_customers >= 50 then
      raise exception 'FREE_PLAN_LIMIT_REACHED'
        using hint = 'Mejora al Plan Pro para registrar más de 50 clientes.';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists loyalty_cards_free_plan_limit on public.loyalty_cards;
create trigger loyalty_cards_free_plan_limit
  before insert on public.loyalty_cards
  for each row execute function public.enforce_free_plan_limit();

-- Evita que un sello supere el objetivo o que se altere una tarjeta ya completada.
create or replace function public.validate_card_stamps()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_required integer;
begin
  select required_stamps into v_required
  from public.businesses
  where id = new.business_id;

  if new.current_stamps > v_required then
    raise exception 'STAMPS_EXCEED_REQUIRED'
      using hint = 'La tarjeta no puede tener más sellos que los configurados.';
  end if;

  new.is_completed := new.current_stamps >= v_required;
  return new;
end;
$$;

drop trigger if exists loyalty_cards_validate_stamps on public.loyalty_cards;
create trigger loyalty_cards_validate_stamps
  before insert or update on public.loyalty_cards
  for each row execute function public.validate_card_stamps();

-- -----------------------------------------------------------------------------
-- 5. RPC: unirse a un comercio
-- -----------------------------------------------------------------------------
create or replace function public.join_business(p_business_id uuid)
returns public.loyalty_cards
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_card public.loyalty_cards;
  v_active boolean;
begin
  if v_uid is null then
    raise exception 'AUTH_REQUIRED' using errcode = '28000';
  end if;

  select is_active into v_active from public.businesses where id = p_business_id;
  if v_active is not true then
    raise exception 'BUSINESS_NOT_FOUND';
  end if;

  insert into public.loyalty_cards (customer_id, business_id)
  values (v_uid, p_business_id)
  on conflict (customer_id, business_id) do nothing;

  select * into v_card
  from public.loyalty_cards
  where customer_id = v_uid and business_id = p_business_id;

  return v_card;
end;
$$;

-- -----------------------------------------------------------------------------
-- 6. RPC: emitir nonce para el QR dinámico (comercio autenticado)
-- -----------------------------------------------------------------------------
-- El API firma el token con HMAC-SHA256. El nonce se guarda aquí para
-- garantizar un solo uso y caducidad corta (por defecto 60 s, máximo 5 min).
create or replace function public.create_scan_nonce(
  p_business_id uuid,
  p_ttl_seconds integer default 60
)
returns table (nonce text, expires_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_nonce text;
  v_expires timestamptz;
  v_ttl integer;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED' using errcode = '28000';
  end if;

  if not public.is_business_owner(p_business_id) then
    raise exception 'NOT_BUSINESS_OWNER' using errcode = '42501';
  end if;

  v_ttl := least(greatest(coalesce(p_ttl_seconds, 60), 30), 300);
  v_nonce := encode(extensions.gen_random_bytes(18), 'hex');
  v_expires := now() + make_interval(secs => v_ttl);

  insert into public.scan_nonces (nonce, business_id, expires_at)
  values (v_nonce, p_business_id, v_expires);

  return query select v_nonce, v_expires;
end;
$$;

-- -----------------------------------------------------------------------------
-- 7. RPC: canjear token QR y sumar sello (cliente autenticado)
-- -----------------------------------------------------------------------------
-- Debe llamarse SOLO después de verificar la firma HMAC del token en el servidor.
-- La función valida: comercio, nonce, caducidad, uso único y límite de plan.
create or replace function public.redeem_scan_token(
  p_business_id uuid,
  p_nonce text
)
returns table (
  card_id uuid,
  current_stamps integer,
  required_stamps integer,
  is_completed boolean,
  reward_description text,
  stamps_added integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_nonce public.scan_nonces;
  v_business public.businesses;
  v_card public.loyalty_cards;
  v_next integer;
begin
  if v_uid is null then
    raise exception 'AUTH_REQUIRED' using errcode = '28000';
  end if;

  -- Bloqueo del nonce: dos escaneos simultáneos no pueden usar el mismo QR.
  select * into v_nonce
  from public.scan_nonces
  where nonce = p_nonce
  for update;

  if not found then
    raise exception 'INVALID_NONCE';
  end if;
  if v_nonce.business_id <> p_business_id then
    raise exception 'NONCE_BUSINESS_MISMATCH';
  end if;
  if v_nonce.used_at is not null then
    raise exception 'NONCE_ALREADY_USED';
  end if;
  if v_nonce.expires_at <= now() then
    raise exception 'NONCE_EXPIRED';
  end if;

  select * into v_business
  from public.businesses
  where id = p_business_id and is_active;

  if not found then
    raise exception 'BUSINESS_NOT_FOUND';
  end if;

  update public.scan_nonces
  set used_at = now()
  where nonce = p_nonce;

  select * into v_card
  from public.loyalty_cards
  where customer_id = v_uid and business_id = p_business_id
  for update;

  if not found then
    insert into public.loyalty_cards (customer_id, business_id)
    values (v_uid, p_business_id)
    returning * into v_card;
  end if;

  if v_card.is_completed then
    raise exception 'CARD_ALREADY_COMPLETED'
      using hint = 'Canjea tu premio antes de seguir sumando sellos.';
  end if;

  v_next := least(v_card.current_stamps + 1, v_business.required_stamps);

  update public.loyalty_cards
  set current_stamps = v_next,
      is_completed = v_next >= v_business.required_stamps,
      updated_at = now()
  where id = v_card.id
  returning * into v_card;

  insert into public.transactions (card_id, business_id, customer_id, type, scan_nonce)
  values (v_card.id, p_business_id, v_uid, 'stamp_added', p_nonce);

  return query
    select v_card.id,
           v_card.current_stamps,
           v_business.required_stamps,
           v_card.is_completed,
           v_business.reward_description,
           1;
end;
$$;

-- -----------------------------------------------------------------------------
-- 8. RPC: canjear recompensa (cliente autenticado)
-- -----------------------------------------------------------------------------
create or replace function public.claim_reward(p_card_id uuid)
returns public.loyalty_cards
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_card public.loyalty_cards;
begin
  if v_uid is null then
    raise exception 'AUTH_REQUIRED' using errcode = '28000';
  end if;

  select * into v_card
  from public.loyalty_cards
  where id = p_card_id
  for update;

  if not found then
    raise exception 'CARD_NOT_FOUND';
  end if;
  if v_card.customer_id <> v_uid then
    raise exception 'NOT_CARD_OWNER' using errcode = '42501';
  end if;
  if not v_card.is_completed then
    raise exception 'CARD_NOT_COMPLETED';
  end if;

  update public.loyalty_cards
  set current_stamps = 0,
      is_completed = false,
      rewards_redeemed = rewards_redeemed + 1,
      updated_at = now()
  where id = p_card_id
  returning * into v_card;

  insert into public.transactions (card_id, business_id, customer_id, type, metadata)
  values (
    v_card.id,
    v_card.business_id,
    v_uid,
    'reward_claimed',
    jsonb_build_object('reward', 'claimed_by_customer')
  );

  return v_card;
end;
$$;

-- -----------------------------------------------------------------------------
-- 9. Row Level Security
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.loyalty_cards enable row level security;
alter table public.transactions enable row level security;
alter table public.scan_nonces enable row level security;

-- profiles --------------------------------------------------------------------
drop policy if exists "profiles_select_self_or_merchant" on public.profiles;
create policy "profiles_select_self_or_merchant"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.merchant_can_view_profile(id));

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- No hay política de INSERT: el alta ocurre mediante el trigger de auth.users.

-- businesses ------------------------------------------------------------------
drop policy if exists "businesses_select_public_or_owner" on public.businesses;
create policy "businesses_select_public_or_owner"
  on public.businesses for select
  to anon, authenticated
  using (is_active or owner_id = auth.uid());

drop policy if exists "businesses_insert_own_merchant" on public.businesses;
create policy "businesses_insert_own_merchant"
  on public.businesses for insert
  to authenticated
  with check (
    owner_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'merchant'
    )
  );

drop policy if exists "businesses_update_owner" on public.businesses;
create policy "businesses_update_owner"
  on public.businesses for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "businesses_delete_owner" on public.businesses;
create policy "businesses_delete_owner"
  on public.businesses for delete
  to authenticated
  using (owner_id = auth.uid());

-- loyalty_cards ---------------------------------------------------------------
drop policy if exists "cards_select_customer_or_merchant" on public.loyalty_cards;
create policy "cards_select_customer_or_merchant"
  on public.loyalty_cards for select
  to authenticated
  using (customer_id = auth.uid() or public.is_business_owner(business_id));

-- El cliente puede salir del programa (borra su tarjeta).
drop policy if exists "cards_delete_customer" on public.loyalty_cards;
create policy "cards_delete_customer"
  on public.loyalty_cards for delete
  to authenticated
  using (customer_id = auth.uid());

-- INSERT/UPDATE solo mediante join_business(), redeem_scan_token() y claim_reward().

-- transactions ----------------------------------------------------------------
drop policy if exists "transactions_select_party" on public.transactions;
create policy "transactions_select_party"
  on public.transactions for select
  to authenticated
  using (customer_id = auth.uid() or public.is_business_owner(business_id));

-- Sin INSERT/UPDATE/DELETE directos: los escribe las RPC de forma atómica.

-- scan_nonces -----------------------------------------------------------------
-- RLS habilitado y sin políticas: anon/authenticated no pueden leer ni escribir.
-- service_role y las funciones security definer omiten RLS.

-- -----------------------------------------------------------------------------
-- 10. Permisos (grants)
-- -----------------------------------------------------------------------------
revoke all on public.profiles, public.businesses, public.loyalty_cards,
  public.transactions, public.scan_nonces from anon, authenticated;

grant select, update on public.profiles to authenticated;
grant select on public.businesses to anon, authenticated;
grant insert, update, delete on public.businesses to authenticated;
grant select, delete on public.loyalty_cards to authenticated;
grant select on public.transactions to authenticated;

grant all on public.profiles, public.businesses, public.loyalty_cards,
  public.transactions, public.scan_nonces to service_role;

revoke all on function public.handle_new_user() from public;
revoke all on function public.protect_profile_role() from public;
revoke all on function public.protect_business_billing_fields() from public;
revoke all on function public.normalize_new_card() from public;
revoke all on function public.normalize_new_business() from public;
revoke all on function public.enforce_free_plan_limit() from public;
revoke all on function public.validate_card_stamps() from public;
revoke all on function public.set_updated_at() from public;

grant execute on function public.current_user_role() to authenticated;
grant execute on function public.is_business_owner(uuid) to authenticated;
grant execute on function public.merchant_can_view_profile(uuid) to authenticated;
grant execute on function public.join_business(uuid) to authenticated;
grant execute on function public.create_scan_nonce(uuid, integer) to authenticated;
grant execute on function public.redeem_scan_token(uuid, text) to authenticated;
grant execute on function public.claim_reward(uuid) to authenticated;

-- -----------------------------------------------------------------------------
-- 11. Vistas de apoyo (opcionales)
-- -----------------------------------------------------------------------------
create or replace view public.business_metrics
with (security_invoker = true)
as
with card_stats as (
  select
    business_id,
    count(distinct customer_id)::int as total_customers,
    count(distinct customer_id) filter (where is_completed)::int as customers_with_reward,
    coalesce(sum(current_stamps), 0)::int as active_stamps
  from public.loyalty_cards
  group by business_id
),
tx_stats as (
  select
    business_id,
    count(*) filter (where type = 'stamp_added')::int as stamps_total,
    count(*) filter (where type = 'reward_claimed')::int as rewards_claimed,
    count(*) filter (
      where type = 'stamp_added' and scan_date >= date_trunc('day', now())
    )::int as stamps_today
  from public.transactions
  group by business_id
)
select
  b.id as business_id,
  b.name,
  b.plan,
  coalesce(cs.total_customers, 0) as total_customers,
  coalesce(cs.customers_with_reward, 0) as customers_with_reward,
  coalesce(cs.active_stamps, 0) as active_stamps,
  coalesce(ts.stamps_total, 0) as stamps_total,
  coalesce(ts.rewards_claimed, 0) as rewards_claimed,
  coalesce(ts.stamps_today, 0) as stamps_today
from public.businesses b
left join card_stats cs on cs.business_id = b.id
left join tx_stats ts on ts.business_id = b.id
where b.owner_id = auth.uid();

comment on view public.business_metrics is
  'Métricas agregadas por comercio. Usa security_invoker para respetar RLS del usuario.';

grant select on public.business_metrics to authenticated;

commit;

-- =============================================================================
--  Siguientes pasos en Supabase:
--   1. Authentication → Providers: activar Google y Email (magic link).
--   2. Authentication → URL Configuration: agregar http://localhost:3000 y tu dominio.
--   3. Configurar las variables de .env.local (ver .env.example).
--   4. Configurar el webhook de Stripe hacia /api/stripe/webhook con service_role.
--   5. Programar una limpieza periódica de scan_nonces caducados, por ejemplo:
--        select cron.schedule(
--          'cleanup-scan-nonces', '0 3 * * *',
--          $$ delete from public.scan_nonces where expires_at < now() - interval '1 day' $$
--        );
-- =============================================================================
