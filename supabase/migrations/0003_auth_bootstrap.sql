create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_business_id uuid;
  requested_role text;
begin
  insert into public.profiles (
    id,
    first_name,
    last_name,
    email,
    phone
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', 'Nuevo'),
    coalesce(new.raw_user_meta_data ->> 'last_name', 'Usuario'),
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do update
  set
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    email = excluded.email,
    phone = excluded.phone,
    updated_at = now();

  requested_role := coalesce(new.raw_user_meta_data ->> 'role', 'customer');

  insert into public.user_roles (user_id, role)
  values (
    new.id,
    case when requested_role in ('superadmin', 'business_admin', 'customer') then requested_role else 'customer' end
  )
  on conflict (user_id, role) do nothing;

  if requested_role = 'customer' and new.raw_user_meta_data ? 'business_slug' then
    select id
    into target_business_id
    from public.businesses
    where slug = new.raw_user_meta_data ->> 'business_slug'
    limit 1;

    if target_business_id is not null then
      insert into public.business_memberships (business_id, user_id, joined_at, last_activity_at)
      values (target_business_id, new.id, now(), now())
      on conflict (business_id, user_id) do nothing;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create policy "public_can_read_active_businesses"
on public.businesses for select
using (is_active = true);

create policy "customers_can_view_own_assignments"
on public.business_admin_assignments for select
using (
  public.is_superadmin(auth.uid())
  or auth.uid() = user_id
);

create policy "customers_can_view_own_missions"
on public.user_mission_progress for select
using (
  auth.uid() = user_id
  or public.is_superadmin(auth.uid())
  or public.is_business_admin_for(auth.uid(), business_id)
);

create policy "customers_can_view_own_achievements"
on public.user_achievements for select
using (
  auth.uid() = user_id
  or public.is_superadmin(auth.uid())
  or public.is_business_admin_for(auth.uid(), business_id)
);
