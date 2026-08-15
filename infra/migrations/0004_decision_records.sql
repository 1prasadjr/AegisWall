do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'ss8_writer') then
    create role ss8_writer nologin;
  end if;
end
$$;

create table decision_records (
  decision_id       uuid primary key,
  identity_id       uuid null references identities(identity_id),
  resolved_action   jsonb not null,
  authority_context jsonb not null,
  policy_judgment   jsonb not null,
  outcome           text not null check (outcome in ('permit','deny','modify')),
  complete          boolean not null,
  decided_at        timestamptz not null default now()
);
grant insert, select on table decision_records to ss8_writer;
revoke update, delete on table decision_records from ss8_writer;
