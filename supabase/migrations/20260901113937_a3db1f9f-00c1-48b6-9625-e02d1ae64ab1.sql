revoke all on function public.sign_contract(uuid, text, text, text, text, text) from public, anon;
revoke all on function public.ensure_my_contract(text, text, jsonb, uuid) from public, anon;
revoke all on function public.admin_issue_contract(uuid, text, text, jsonb, uuid) from public, anon;
revoke all on function public.require_signed_driver_contract() from public, anon, authenticated;

grant execute on function public.sign_contract(uuid, text, text, text, text, text) to authenticated;
grant execute on function public.ensure_my_contract(text, text, jsonb, uuid) to authenticated;
grant execute on function public.admin_issue_contract(uuid, text, text, jsonb, uuid) to authenticated;