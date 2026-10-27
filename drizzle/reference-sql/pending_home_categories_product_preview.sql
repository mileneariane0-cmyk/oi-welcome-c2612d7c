-- APLICAR NO LOVABLE CLOUD APÓS CONFERIR O HISTÓRICO DE MIGRAÇÕES.
-- Não criar numeração conflitante no journal sem verificar o banco real.
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS show_on_home boolean NOT NULL DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS preview_url text;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_preview_url_https;
ALTER TABLE public.products ADD CONSTRAINT products_preview_url_https CHECK (preview_url IS NULL OR (length(preview_url)<=2048 AND preview_url ~* '^https://[^[:space:]]+$'));
COMMENT ON COLUMN public.categories.show_on_home IS 'Exibir categoria na seção Compre por categoria da página inicial';
COMMENT ON COLUMN public.products.preview_url IS 'Link HTTPS opcional para demonstração do modelo de site';
