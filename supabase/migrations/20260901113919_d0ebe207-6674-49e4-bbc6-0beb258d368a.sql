create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('driver', 'partner')),
  user_id uuid not null references auth.users(id) on delete cascade,
  partner_id uuid references public.partners(id) on delete set null,
  template_version text not null,
  status text not null default 'pending' check (status in ('pending', 'signed', 'void')),
  variables jsonb not null default '{}'::jsonb,
  rendered_body text,
  body_sha256 text,
  signer_name text,
  signed_at timestamptz,
  signed_ip text,
  signed_user_agent text,
  company_signer_name text not null default 'Transfer Around Ο.Ε.',
  issued_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index contracts_user_idx on public.contracts (user_id, kind, status);
create index contracts_status_idx on public.contracts (status, created_at desc);

grant select, insert, update on public.contracts to authenticated;
grant all on public.contracts to service_role;

alter table public.contracts enable row level security;

create policy "contracts_select_own_or_admin"
  on public.contracts for select to authenticated
  using (user_id = (select auth.uid()) or public.is_admin());

create policy "contracts_insert_own_or_admin"
  on public.contracts for insert to authenticated
  with check (
    (user_id = (select auth.uid()) and status = 'pending') or public.is_admin()
  );

create policy "contracts_update_admin_pending"
  on public.contracts for update to authenticated
  using (public.is_admin() and status = 'pending')
  with check (public.is_admin());

create trigger contracts_touch_updated_at
  before update on public.contracts
  for each row execute function public.touch_updated_at();

-- Sign a pending contract: freezes the rendered text + hash and records the audit trail.
create or replace function public.sign_contract(
  p_contract_id uuid,
  p_signer_name text,
  p_rendered_body text,
  p_body_sha256 text,
  p_ip text default null,
  p_user_agent text default null
)
returns public.contracts
language plpgsql
security definer
set search_path = ''
as $$
declare
  row public.contracts;
begin
  if nullif(trim(coalesce(p_signer_name, '')), '') is null then
    raise exception 'signer_name_required';
  end if;
  if nullif(trim(coalesce(p_rendered_body, '')), '') is null then
    raise exception 'contract_body_required';
  end if;

  select * into row
  from public.contracts
  where id = p_contract_id
  for update;

  if row.id is null then
    raise exception 'contract_not_found';
  end if;
  if row.user_id <> (select auth.uid()) then
    raise exception 'not_contract_owner';
  end if;
  if row.status <> 'pending' then
    raise exception 'contract_not_pending';
  end if;

  update public.contracts
  set
    status = 'signed',
    rendered_body = p_rendered_body,
    body_sha256 = p_body_sha256,
    signer_name = trim(p_signer_name),
    signed_at = now(),
    signed_ip = nullif(trim(coalesce(p_ip, '')), ''),
    signed_user_agent = left(nullif(trim(coalesce(p_user_agent, '')), ''), 500)
  where id = p_contract_id
  returning * into row;

  return row;
end;
$$;

-- Get or create the caller's pending contract of a given kind.
create or replace function public.ensure_my_contract(
  p_kind text,
  p_template_version text,
  p_variables jsonb default '{}'::jsonb,
  p_partner_id uuid default null
)
returns public.contracts
language plpgsql
security definer
set search_path = ''
as $$
declare
  row public.contracts;
  uid uuid := (select auth.uid());
begin
  if uid is null then
    raise exception 'not_authenticated';
  end if;
  if p_kind not in ('driver', 'partner') then
    raise exception 'invalid_kind';
  end if;

  select * into row
  from public.contracts
  where user_id = uid and kind = p_kind and status = 'signed'
  order by signed_at desc
  limit 1;

  if row.id is not null then
    return row;
  end if;

  select * into row
  from public.contracts
  where user_id = uid and kind = p_kind and status = 'pending'
  order by created_at desc
  limit 1;

  if row.id is not null then
    update public.contracts
    set
      variables = coalesce(row.variables, '{}'::jsonb) || coalesce(p_variables, '{}'::jsonb),
      template_version = p_template_version,
      partner_id = coalesce(p_partner_id, row.partner_id)
    where id = row.id
    returning * into row;
    return row;
  end if;

  insert into public.contracts (kind, user_id, partner_id, template_version, variables)
  values (p_kind, uid, p_partner_id, p_template_version, coalesce(p_variables, '{}'::jsonb))
  returning * into row;

  return row;
end;
$$;

-- Admin issues (or re-issues) a contract with custom annex values.
create or replace function public.admin_issue_contract(
  p_user_id uuid,
  p_kind text,
  p_template_version text,
  p_variables jsonb default '{}'::jsonb,
  p_partner_id uuid default null
)
returns public.contracts
language plpgsql
security definer
set search_path = ''
as $$
declare
  row public.contracts;
begin
  if not public.is_admin() then
    raise exception 'not_admin';
  end if;
  if p_kind not in ('driver', 'partner') then
    raise exception 'invalid_kind';
  end if;

  update public.contracts
  set status = 'void'
  where user_id = p_user_id and kind = p_kind and status = 'pending';

  insert into public.contracts (kind, user_id, partner_id, template_version, variables, issued_by)
  values (
    p_kind,
    p_user_id,
    p_partner_id,
    p_template_version,
    coalesce(p_variables, '{}'::jsonb),
    (select auth.uid())
  )
  returning * into row;

  return row;
end;
$$;

-- Admin listing with signer identity.
create or replace view public.contract_overview
with (security_invoker = true)
as
select
  c.id,
  c.kind,
  c.user_id,
  c.partner_id,
  c.status,
  c.template_version,
  c.variables,
  c.signer_name,
  c.signed_at,
  c.created_at,
  p.full_name,
  p.phone,
  p.role
from public.contracts c
left join public.profiles p on p.id = c.user_id;

grant select on public.contract_overview to authenticated;
grant all on public.contract_overview to service_role;

-- A driver cannot be approved without a signed driver agreement.
create or replace function public.require_signed_driver_contract()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'approved' and coalesce(old.status, '') <> 'approved' then
    if not exists (
      select 1 from public.contracts
      where user_id = new.driver_id and kind = 'driver' and status = 'signed'
    ) then
      raise exception 'driver_contract_not_signed';
    end if;
  end if;
  return new;
end;
$$;

create trigger driver_onboarding_requires_contract
  before update on public.driver_onboarding_submissions
  for each row execute function public.require_signed_driver_contract();