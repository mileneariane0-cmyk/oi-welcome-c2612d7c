-- Seed idempotente: não altera produtos que já tenham sido editados.
INSERT INTO public.categories (name,slug,published) VALUES
('Convites digitais','convites-digitais',true),
('Aniversário','aniversario',true),
('Casamento','casamento',true),
('Chá de bebê','cha-de-bebe',true),
('Personalizados','personalizados',true),
('Papelaria','papelaria',true)
ON CONFLICT (slug) DO NOTHING;

WITH examples (name,slug,category_slug,price,product_type) AS (
 VALUES
 ('Convite digital interativo floral','convite-digital-interativo-floral','convites-digitais',49.90,'digital'),
 ('Kit festa personalizado','kit-festa-personalizado','personalizados',89.90,'physical'),
 ('Convite de casamento elegante','convite-de-casamento-elegante','casamento',59.90,'digital'),
 ('Topo de bolo personalizado','topo-de-bolo-personalizado','aniversario',24.90,'physical'),
 ('Convite chá de bebê delicado','convite-cha-de-bebe-delicado','cha-de-bebe',44.90,'digital'),
 ('Tags e adesivos personalizados','tags-e-adesivos-personalizados','papelaria',19.90,'physical'),
 ('Convite digital de aniversário','convite-digital-de-aniversario','convites-digitais',39.90,'digital'),
 ('Lembrancinha personalizada','lembrancinha-personalizada','personalizados',34.90,'physical')
)
INSERT INTO public.products(name,slug,category_id,price,product_type,published,description)
SELECT e.name,e.slug,c.id,e.price,e.product_type,true,'Produto demonstrativo. Personalize a descrição, as mídias e as variações no administrador.'
FROM examples e JOIN public.categories c ON c.slug=e.category_slug
ON CONFLICT (slug) DO NOTHING;

-- A vitrine pode consultar apenas itens publicados; a edição continua restrita ao administrador.
GRANT SELECT ON public.categories,public.products,public.product_media TO anon;
DROP POLICY IF EXISTS storefront_categories_read ON public.categories;
CREATE POLICY storefront_categories_read ON public.categories FOR SELECT TO anon,authenticated USING(published=true);
DROP POLICY IF EXISTS storefront_products_read ON public.products;
CREATE POLICY storefront_products_read ON public.products FOR SELECT TO anon,authenticated USING(published=true);
DROP POLICY IF EXISTS storefront_product_media_read ON public.product_media;
CREATE POLICY storefront_product_media_read ON public.product_media FOR SELECT TO anon,authenticated USING(EXISTS(SELECT 1 FROM public.products p WHERE p.id=product_id AND p.published=true));
