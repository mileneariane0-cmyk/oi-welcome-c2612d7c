-- APLICAR NO LOVABLE CLOUD após revisão do esquema, políticas e backup.
-- Solicitações públicas SEM login, com validação e limitação por telefone.
CREATE TABLE IF NOT EXISTS public.quote_request_contacts (
 quote_id uuid PRIMARY KEY REFERENCES public.quotes(id) ON DELETE CASCADE,
 name text NOT NULL CHECK(length(name) BETWEEN 2 AND 100),
 phone text NOT NULL CHECK(phone ~ '^[0-9]{10,13}$'),
 created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.quote_request_contacts ENABLE ROW LEVEL SECURITY;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.quote_request_contacts TO authenticated;
DROP POLICY IF EXISTS quote_contacts_admin_only ON public.quote_request_contacts;
CREATE POLICY quote_contacts_admin_only ON public.quote_request_contacts
 FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin'))
 WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.request_public_quote(p_name text,p_phone text,p_details text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
 v_name text;
 v_phone text;
 v_customer_id uuid;
 v_quote_id uuid;
BEGIN
 IF length(btrim(coalesce(p_details,''))) < 20 OR length(p_details)>10000 THEN
  RAISE EXCEPTION 'Descrição inválida';
 END IF;
 IF auth.uid() IS NOT NULL THEN
  SELECT id INTO v_customer_id FROM public.customers WHERE profile_id=auth.uid() ORDER BY created_at LIMIT 1;
  SELECT left(coalesce(nullif(btrim(raw_user_meta_data->>'display_name'),''),split_part(email,'@',1)),100),
         regexp_replace(coalesce(raw_user_meta_data->>'whatsapp',''),'[^0-9]','','g')
   INTO v_name,v_phone FROM auth.users WHERE id=auth.uid();
  IF v_name IS NULL OR length(v_name)<2 OR v_phone IS NULL OR v_phone !~ '^[0-9]{10,13}$' THEN
   RAISE EXCEPTION 'Atualize seu nome e WhatsApp no perfil antes de solicitar';
  END IF;
 ELSE
  v_name:=left(btrim(coalesce(p_name,'')),100);
  v_phone:=regexp_replace(coalesce(p_phone,''),'[^0-9]','','g');
  IF length(v_name)<2 OR v_phone !~ '^[0-9]{10,13}$' THEN
   RAISE EXCEPTION 'Nome e telefone válidos são obrigatórios';
  END IF;
 END IF;
 -- Serializa solicitações concorrentes para o mesmo telefone.
 PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(v_phone));
 IF (SELECT count(*) FROM public.quote_request_contacts
     WHERE phone=v_phone AND created_at>now()-interval '1 hour')>=3 THEN
  RAISE EXCEPTION 'Limite de solicitações atingido. Aguarde uma hora';
 END IF;
 INSERT INTO public.quotes(customer_id,details,status)
 VALUES(v_customer_id,btrim(p_details),'pending') RETURNING id INTO v_quote_id;
 INSERT INTO public.quote_request_contacts(quote_id,name,phone)
 VALUES(v_quote_id,v_name,v_phone);
 RETURN v_quote_id;
END;
$$;
REVOKE ALL ON FUNCTION public.request_public_quote(text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.request_public_quote(text,text,text) TO anon,authenticated;
-- TESTAR: visitante, autenticado, perfil sem WhatsApp, limite de 3/h,
-- acesso público negado às tabelas, visibilidade no admin e concorrência.
