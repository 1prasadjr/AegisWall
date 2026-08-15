create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'ss2_writer') then
    create role ss2_writer nologin;
  end if;
end
$$;

create table identities (
  identity_id      uuid primary key default gen_random_uuid(),
  origin_reference jsonb not null,
  issued_at        timestamptz not null default now()
);
grant insert, select on table identities to ss2_writer;
revoke update, delete on table identities from ss2_writer;
