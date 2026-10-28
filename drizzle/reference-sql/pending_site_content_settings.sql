-- PENDENTE DE REVISÃO/APLICAÇÃO NO LOVABLE CLOUD.
-- Fonte única de conteúdo editável da loja. Não executar em produção sem validar políticas e backups.
CREATE TABLE IF NOT EXISTS public.store_content (
  key text PRIMARY KEY CHECK (key IN ('terms','home','contact')),
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  published boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.store_content ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.store_content TO anon,authenticated;
GRANT INSERT,UPDATE,DELETE ON public.store_content TO authenticated;
DROP POLICY IF EXISTS store_content_public_read ON public.store_content;
CREATE POLICY store_content_public_read ON public.store_content
 FOR SELECT TO anon,authenticated USING (published=true);
DROP POLICY IF EXISTS store_content_admin_manage ON public.store_content;
CREATE POLICY store_content_admin_manage ON public.store_content
 FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin'))
 WITH CHECK (public.has_role(auth.uid(),'admin'));
-- Sem publicação automática: termos e textos precisam ser aprovados pelo administrador.
