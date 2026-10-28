-- PENDENTE: aplicar somente no Lovable Cloud após conferir estrutura, backups e duplicidades.
-- O trigger usa profile_id para identificar uma conta; NÃO associa automaticamente
-- um cadastro manual a uma conta apenas por e-mail, evitando vinculação indevida.
-- Conferir se public.customers.birth_date e public.profiles já existem.
CREATE UNIQUE INDEX IF NOT EXISTS customers_profile_id_unique
  ON public.customers(profile_id) WHERE profile_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.sync_registered_customer()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_name text;
  v_birth date;
  v_raw_birth text;
BEGIN
  v_name := left(coalesce(
    nullif(btrim(NEW.raw_user_meta_data->>'display_name'), ''),
    nullif(split_part(coalesce(NEW.email,''),'@',1),''),
    'Cliente'
  ), 100);
  v_raw_birth := NEW.raw_user_meta_data->>'birthday';
  v_birth := NULL;
  IF v_raw_birth ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' THEN
    BEGIN
      v_birth := v_raw_birth::date;
    EXCEPTION WHEN datetime_field_overflow OR invalid_datetime_format THEN
      v_birth := NULL;
    END;
  END IF;

  INSERT INTO public.customers(profile_id,name,email,phone,birth_date)
  VALUES (
    NEW.id,
    v_name,
    left(NEW.email,255),
    nullif(left(regexp_replace(coalesce(NEW.raw_user_meta_data->>'whatsapp',''),'[^0-9]','','g'),30),''),
    v_birth
  )
  ON CONFLICT (profile_id) WHERE profile_id IS NOT NULL DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    birth_date = EXCLUDED.birth_date;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_registered_customer() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS personalize_customer_created ON auth.users;
CREATE TRIGGER personalize_customer_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_registered_customer();

DROP TRIGGER IF EXISTS personalize_customer_updated ON auth.users;
CREATE TRIGGER personalize_customer_updated
  AFTER UPDATE OF raw_user_meta_data, email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_registered_customer();

-- AÇÕES MANUAIS ANTES DE ATIVAR:
-- 1. Conferir se há cadastros administrativos com o mesmo e-mail de contas existentes.
-- 2. Para cada conta antiga, vincular o registro correto a profile_id (se houver),
--    após validação de identidade, sem criar duplicatas.
-- 3. Fazer backfill supervisionado das contas não vinculadas.
-- 4. Testar cadastro, confirmação de e-mail, edição do perfil, exclusão de conta e RLS.
-- 5. Verificar que um erro de trigger não bloqueia novos cadastros.
-- 6. Revisar privacidade e exclusão de dados conforme LGPD.
