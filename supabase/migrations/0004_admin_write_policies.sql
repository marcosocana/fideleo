create policy "superadmin_can_insert_businesses"
on public.businesses for insert
with check (public.is_superadmin(auth.uid()));

create policy "superadmin_can_update_businesses"
on public.businesses for update
using (public.is_superadmin(auth.uid()))
with check (public.is_superadmin(auth.uid()));

create policy "superadmin_can_delete_businesses"
on public.businesses for delete
using (public.is_superadmin(auth.uid()));
