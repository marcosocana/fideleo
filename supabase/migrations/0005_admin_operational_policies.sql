create policy "admins_can_insert_rewards"
on public.rewards for insert
with check (
  public.is_superadmin(auth.uid())
  or public.is_business_admin_for(auth.uid(), business_id)
);

create policy "admins_can_update_rewards"
on public.rewards for update
using (
  public.is_superadmin(auth.uid())
  or public.is_business_admin_for(auth.uid(), business_id)
)
with check (
  public.is_superadmin(auth.uid())
  or public.is_business_admin_for(auth.uid(), business_id)
);

create policy "admins_can_delete_rewards"
on public.rewards for delete
using (
  public.is_superadmin(auth.uid())
  or public.is_business_admin_for(auth.uid(), business_id)
);

create policy "admins_can_manage_profiles"
on public.profiles for update
using (
  public.is_superadmin(auth.uid()) or auth.uid() = id
)
with check (
  public.is_superadmin(auth.uid()) or auth.uid() = id
);

create policy "admins_can_insert_roles"
on public.user_roles for insert
with check (public.is_superadmin(auth.uid()));

create policy "admins_can_delete_roles"
on public.user_roles for delete
using (public.is_superadmin(auth.uid()));

create policy "admins_can_manage_memberships"
on public.business_memberships for insert
with check (
  public.is_superadmin(auth.uid())
  or public.is_business_admin_for(auth.uid(), business_id)
);

create policy "admins_can_update_memberships"
on public.business_memberships for update
using (
  public.is_superadmin(auth.uid())
  or public.is_business_admin_for(auth.uid(), business_id)
)
with check (
  public.is_superadmin(auth.uid())
  or public.is_business_admin_for(auth.uid(), business_id)
);

create policy "admins_can_delete_memberships"
on public.business_memberships for delete
using (
  public.is_superadmin(auth.uid())
  or public.is_business_admin_for(auth.uid(), business_id)
);

create policy "admins_can_manage_assignments"
on public.business_admin_assignments for insert
with check (public.is_superadmin(auth.uid()));

create policy "admins_can_delete_assignments"
on public.business_admin_assignments for delete
using (public.is_superadmin(auth.uid()));

create policy "admins_can_insert_transactions"
on public.point_transactions for insert
with check (
  public.is_superadmin(auth.uid())
  or public.is_business_admin_for(auth.uid(), business_id)
);

create policy "admins_can_insert_audit_logs"
on public.audit_logs for insert
with check (
  public.is_superadmin(auth.uid())
  or public.is_business_admin_for(auth.uid(), business_id)
);
