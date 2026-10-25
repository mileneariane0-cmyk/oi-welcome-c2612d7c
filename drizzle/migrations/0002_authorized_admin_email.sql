-- Admin access is granted only to the verified owner of the designated mailbox.
-- Password creation/reset is handled by Supabase Auth's email recovery flow.
CREATE OR REPLACE FUNCTION public.sync_personalize_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(coalesce(NEW.email, '')) = 'arianeararagaocomercial@gmail.com'
     AND NEW.email_confirmed_at IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    DELETE FROM public.user_roles WHERE user_id = NEW.id AND role = 'admin';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.sync_personalize_admin_role() FROM PUBLIC;
DROP TRIGGER IF EXISTS personalize_admin_role_sync ON auth.users;
CREATE TRIGGER personalize_admin_role_sync
AFTER INSERT OR UPDATE OF email, email_confirmed_at ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.sync_personalize_admin_role();

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE lower(email) = 'arianeararagaocomercial@gmail.com'
  AND email_confirmed_at IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;
