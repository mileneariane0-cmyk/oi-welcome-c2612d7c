CREATE TABLE public.product_categories (product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE, category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE, PRIMARY KEY(product_id,category_id));
GRANT SELECT,INSERT,UPDATE,DELETE ON public.product_categories TO authenticated;
GRANT SELECT ON public.product_categories TO anon;
GRANT ALL ON public.product_categories TO service_role;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY admin_product_categories ON public.product_categories FOR ALL TO authenticated USING(public.has_role(auth.uid(),'admin')) WITH CHECK(public.has_role(auth.uid(),'admin'));
CREATE POLICY public_product_categories ON public.product_categories FOR SELECT TO anon,authenticated USING(EXISTS(SELECT 1 FROM public.products p WHERE p.id=product_id AND p.published) AND EXISTS(SELECT 1 FROM public.categories c WHERE c.id=category_id AND c.published));
INSERT INTO public.product_categories(product_id,category_id) SELECT id,category_id FROM public.products WHERE category_id IS NOT NULL ON CONFLICT DO NOTHING;