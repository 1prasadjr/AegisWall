do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'ss5_writer') then
    create role ss5_writer nologin;
  end if;
end
$$;

create table policy_rules (
  rule_id      uuid primary key default gen_random_uuid(),
  category     text not null,
  version      int not null,
  rego_source  text not null,
  authored_at  timestamptz not null default now(),
  unique (category, version)
);
grant insert, select on table policy_rules to ss5_writer;
revoke update, delete on table policy_rules from ss5_writer;
