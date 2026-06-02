-- Leden mogen prikbordberichten plaatsen; beheerder/moderators mogen modereren
-- (vastzetten/verwijderen) en auteurs mogen hun eigen bericht verwijderen.
-- De app schrijft via de service-role; deze policies houden het model ook
-- kloppend voor directe (user-scoped) toegang.

drop policy if exists "managers can write pool messages" on public.pool_messages;
create policy "members can write pool messages"
on public.pool_messages for insert to authenticated
with check (author_id = auth.uid() and app.is_pool_member(pool_id));

drop policy if exists "managers can delete pool messages" on public.pool_messages;
create policy "authors or managers can delete pool messages"
on public.pool_messages for delete to authenticated
using (author_id = auth.uid() or app.can_manage_pool(pool_id));
