ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS show_on_home boolean NOT NULL DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS preview_url text;
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_preview_url_https;
ALTER TABLE public.products ADD CONSTRAINT products_preview_url_https CHECK (preview_url IS NULL OR (length(preview_url)<=2048 AND preview_url ~* '^https://[^[:space:]]+$'));