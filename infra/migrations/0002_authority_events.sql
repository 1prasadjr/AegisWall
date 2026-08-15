do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'ss4_writer') then
    create role ss4_writer nologin;
  end if;
end
$$;

create table authority_events (
  event_id     uuid primary key default gen_random_uuid(),
  identity_id  uuid not null references identities(identity_id),
  event_type   text not null check (event_type in ('issue','withdraw')),
  scope        jsonb not null,
  occurred_at  timestamptz not null default now()
);
create index authority_events_identity_idx on authority_events(identity_id, occurred_at);
grant insert, select on table authority_events to ss4_writer;
revoke update, delete on table authority_events from ss4_writer;
