create or replace function public.delete_user()
returns void
language sql
security definer
as $$
  select public.delete_my_account();
$$;
