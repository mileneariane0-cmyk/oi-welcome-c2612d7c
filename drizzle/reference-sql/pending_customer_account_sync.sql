-- PENDENTE DE APLICAÇÃO NO LOVABLE CLOUD. Executar após revisão do schema real.
-- Sincroniza contas do site com o cadastro administrativo, sem expor clientes ao público.
CREATE OR REPLACE FUNCTION public.sync_registered_customer()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE customer_name text;
BEGIN
  customer_name := left(coalesce(nullif(trim(NEW.raw_user_meta_data->>'display_name'), ''), split_part(coalesce(NEW.email,''),'@',1), 'Cliente'),100);
  INSERT INTO public.customers(profile_id,name,email,phone,birth_date)
  VALUES (
    NEW.id, customer_name, NEW.email,
    nullif(left(coalesce(NEW.raw_user_meta_data->>'whatsapp',''),30),''),
    CASE WHEN (NEW.raw_user_meta_data->>'birthday') ~ '^\\d{4}-\\d{2}-\\d{2}$'
      THEN (NEW.raw_user_meta_data->>'birthday')::date ELSE NULL END
  )
  ON CONFLICT (profile_id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    phone = COALESCE(EXCLUDED.phone,public.customers.phone),
    birth_date = COALESCE(EXCLUDED.birth_date,public.customers.birth_date);
  RETURN NEW;
END $$;
-- Revisar contas existentes e duplicatas de e-mail antes de criar a unicidade.
CREATE UNIQUE INDEX IF NOT EXISTS customers_profile_id_unique ON public.customers(profile_id);
DROP TRIGGER IF EXISTS personalize_customer_created ON auth.users;
CREATE TRIGGER personalize_customer_created AFTER INSERT ON auth.users
 FOR EACH ROW EXECUTE FUNCTION public.sync_registered_customer();
DROP TRIGGER IF EXISTS personalize_customer_updated ON auth.users;
CREATE TRIGGER personalize_customer_updated AFTER UPDATE OF raw_user_meta_data,email ON auth.users
 FOR EACH ROW EXECUTE FUNCTION public.sync_registered_customer();
-- Após revisar eventuais duplicatas e associações existentes, sincronizar contas antigas
-- com um backfill supervisionado; não executar cegamente para não duplicar clientes.
