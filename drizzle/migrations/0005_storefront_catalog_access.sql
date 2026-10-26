ALTER TABLE public.products ADD COLUMN IF NOT EXISTS promotional_price numeric;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS personalization_instructions text NOT NULL DEFAULT '';
GRANT SELECT ON public.categories,public.products,public.product_media,public.product_variants TO anon;
CREATE POLICY storefront_categories_read ON public.categories FOR SELECT TO anon,authenticated USING(published=true);
CREATE POLICY storefront_products_read ON public.products FOR SELECT TO anon,authenticated USING(published=true);
CREATE POLICY storefront_product_media_read ON public.product_media FOR SELECT TO anon,authenticated USING(EXISTS(SELECT 1 FROM public.products p WHERE p.id=product_id AND p.published=true));
CREATE POLICY storefront_product_variants_read ON public.product_variants FOR SELECT TO anon,authenticated USING(EXISTS(SELECT 1 FROM public.products p WHERE p.id=product_id AND p.published=true));