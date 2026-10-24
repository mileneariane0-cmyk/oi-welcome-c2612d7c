REVOKE EXECUTE ON FUNCTION public.create_user_profile() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid,public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid,public.app_role) TO authenticated,service_role;
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT _user_id = auth.uid() AND EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role=_role) $$;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC,anon,authenticated;
REVOKE EXECUTE ON FUNCTION public.allowed_platform_file(text,text,text) FROM anon;
GRANT EXECUTE ON FUNCTION public.allowed_platform_file(text,text,text) TO authenticated,service_role;