create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null unique,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('superadmin', 'business_admin', 'customer')),
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  owner_name text,
  owner_email text,
  owner_phone text,
  primary_color text not null default '#163B33',
  secondary_color text not null default '#F7F2E8',
  accent_color text not null default '#C8873F',
  font_family text not null default 'Inter',
  welcome_text text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_admin_assignments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (business_id, user_id)
);

create table if not exists public.business_memberships (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  last_activity_at timestamptz,
  current_points integer not null default 0,
  current_tier text not null default 'Bronze',
  total_points_earned integer not null default 0,
  total_points_redeemed integer not null default 0,
  unique (business_id, user_id)
);

create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  title text not null,
  description text,
  reward_type text not null check (reward_type in ('standard', 'special', 'bonus')),
  points_required integer not null,
  duration_type text default 'fixed_window',
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  reward_id uuid not null references public.rewards (id) on delete cascade,
  business_id uuid not null references public.businesses (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  delivered_by_user_id uuid references public.profiles (id),
  points_spent integer not null,
  status text not null default 'requested'
);

create table if not exists public.point_transactions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  performed_by_user_id uuid references public.profiles (id),
  type text not null check (type in ('earn', 'redeem', 'adjustment', 'bonus')),
  points_delta integer not null,
  source text,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.loyalty_rules (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  rule_type text not null,
  config_json jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz
);

create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  title text not null,
  description text,
  mission_type text not null,
  config_json jsonb not null default '{}'::jsonb,
  reward_points integer not null default 0,
  is_active boolean not null default true
);

create table if not exists public.user_mission_progress (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions (id) on delete cascade,
  business_id uuid not null references public.businesses (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  progress_value integer not null default 0,
  completed_at timestamptz,
  status text not null default 'in_progress'
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  title text not null,
  description text,
  achievement_type text not null,
  config_json jsonb not null default '{}'::jsonb,
  icon text,
  is_active boolean not null default true
);

create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  achievement_id uuid not null references public.achievements (id) on delete cascade,
  business_id uuid not null references public.businesses (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  unlocked_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles (id),
  business_id uuid references public.businesses (id) on delete cascade,
  target_user_id uuid references public.profiles (id),
  entity_type text not null,
  entity_id uuid,
  action_type text not null,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table if exists public.profiles
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists avatar_url text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table if exists public.user_roles
  add column if not exists user_id uuid,
  add column if not exists role text,
  add column if not exists created_at timestamptz not null default now();

alter table if exists public.businesses
  add column if not exists name text,
  add column if not exists slug text,
  add column if not exists logo_url text,
  add column if not exists owner_name text,
  add column if not exists owner_email text,
  add column if not exists owner_phone text,
  add column if not exists primary_color text not null default '#163B33',
  add column if not exists secondary_color text not null default '#F7F2E8',
  add column if not exists accent_color text not null default '#C8873F',
  add column if not exists font_family text not null default 'Inter',
  add column if not exists welcome_text text,
  add column if not exists is_active boolean not null default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table if exists public.business_admin_assignments
  add column if not exists business_id uuid,
  add column if not exists user_id uuid,
  add column if not exists created_at timestamptz not null default now();

alter table if exists public.business_memberships
  add column if not exists business_id uuid,
  add column if not exists user_id uuid,
  add column if not exists joined_at timestamptz not null default now(),
  add column if not exists last_activity_at timestamptz,
  add column if not exists current_points integer not null default 0,
  add column if not exists current_tier text not null default 'Bronze',
  add column if not exists total_points_earned integer not null default 0,
  add column if not exists total_points_redeemed integer not null default 0;

alter table if exists public.rewards
  add column if not exists business_id uuid,
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists reward_type text,
  add column if not exists points_required integer,
  add column if not exists duration_type text default 'fixed_window',
  add column if not exists starts_at timestamptz,
  add column if not exists ends_at timestamptz,
  add column if not exists is_active boolean not null default true,
  add column if not exists image_url text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table if exists public.reward_redemptions
  add column if not exists reward_id uuid,
  add column if not exists business_id uuid,
  add column if not exists user_id uuid,
  add column if not exists redeemed_at timestamptz not null default now(),
  add column if not exists delivered_by_user_id uuid,
  add column if not exists points_spent integer,
  add column if not exists status text not null default 'requested';

alter table if exists public.point_transactions
  add column if not exists business_id uuid,
  add column if not exists user_id uuid,
  add column if not exists performed_by_user_id uuid,
  add column if not exists type text,
  add column if not exists points_delta integer,
  add column if not exists source text,
  add column if not exists note text,
  add column if not exists created_at timestamptz not null default now();

alter table if exists public.loyalty_rules
  add column if not exists business_id uuid,
  add column if not exists rule_type text,
  add column if not exists config_json jsonb not null default '{}'::jsonb,
  add column if not exists is_active boolean not null default true,
  add column if not exists starts_at timestamptz,
  add column if not exists ends_at timestamptz;

alter table if exists public.missions
  add column if not exists business_id uuid,
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists mission_type text,
  add column if not exists config_json jsonb not null default '{}'::jsonb,
  add column if not exists reward_points integer not null default 0,
  add column if not exists is_active boolean not null default true;

alter table if exists public.user_mission_progress
  add column if not exists mission_id uuid,
  add column if not exists business_id uuid,
  add column if not exists user_id uuid,
  add column if not exists progress_value integer not null default 0,
  add column if not exists completed_at timestamptz,
  add column if not exists status text not null default 'in_progress';

alter table if exists public.achievements
  add column if not exists business_id uuid,
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists achievement_type text,
  add column if not exists config_json jsonb not null default '{}'::jsonb,
  add column if not exists icon text,
  add column if not exists is_active boolean not null default true;

alter table if exists public.user_achievements
  add column if not exists achievement_id uuid,
  add column if not exists business_id uuid,
  add column if not exists user_id uuid,
  add column if not exists unlocked_at timestamptz not null default now();

alter table if exists public.audit_logs
  add column if not exists actor_user_id uuid,
  add column if not exists business_id uuid,
  add column if not exists target_user_id uuid,
  add column if not exists entity_type text,
  add column if not exists entity_id uuid,
  add column if not exists action_type text,
  add column if not exists metadata_json jsonb not null default '{}'::jsonb,
  add column if not exists created_at timestamptz not null default now();

create or replace function public.is_superadmin(check_user_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = check_user_id and role = 'superadmin'
  );
$$;

create or replace function public.is_business_admin_for(check_user_id uuid, check_business_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.business_admin_assignments
    where user_id = check_user_id and business_id = check_business_id
  );
$$;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.businesses enable row level security;
alter table public.business_admin_assignments enable row level security;
alter table public.business_memberships enable row level security;
alter table public.rewards enable row level security;
alter table public.reward_redemptions enable row level security;
alter table public.point_transactions enable row level security;
alter table public.loyalty_rules enable row level security;
alter table public.missions enable row level security;
alter table public.user_mission_progress enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles_self_or_superadmin"
on public.profiles for select
using (auth.uid() = id or public.is_superadmin(auth.uid()));

create policy "user_roles_self_or_superadmin"
on public.user_roles for select
using (auth.uid() = user_id or public.is_superadmin(auth.uid()));

create policy "businesses_superadmin_or_assigned_admin"
on public.businesses for select
using (
  public.is_superadmin(auth.uid())
  or public.is_business_admin_for(auth.uid(), id)
);

create policy "memberships_visible_to_owner_or_business_admin"
on public.business_memberships for select
using (
  auth.uid() = user_id
  or public.is_superadmin(auth.uid())
  or public.is_business_admin_for(auth.uid(), business_id)
);

create policy "rewards_visible_by_tenant"
on public.rewards for select
using (
  public.is_superadmin(auth.uid())
  or public.is_business_admin_for(auth.uid(), business_id)
  or exists (
    select 1
    from public.business_memberships
    where business_memberships.business_id = rewards.business_id
      and business_memberships.user_id = auth.uid()
  )
);

create policy "reward_redemptions_owner_or_admin"
on public.reward_redemptions for select
using (
  auth.uid() = user_id
  or public.is_superadmin(auth.uid())
  or public.is_business_admin_for(auth.uid(), business_id)
);

create policy "point_transactions_owner_or_admin"
on public.point_transactions for select
using (
  auth.uid() = user_id
  or public.is_superadmin(auth.uid())
  or public.is_business_admin_for(auth.uid(), business_id)
);

create policy "audit_logs_admin_only"
on public.audit_logs for select
using (
  public.is_superadmin(auth.uid())
  or public.is_business_admin_for(auth.uid(), business_id)
);
