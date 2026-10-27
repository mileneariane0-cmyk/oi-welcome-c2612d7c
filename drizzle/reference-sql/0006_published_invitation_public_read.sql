-- Permite leitura pública somente de informações do evento publicadas.
-- Dados pessoais do cliente e mídias privadas permanecem protegidos.
GRANT SELECT ON public.invitation_pages TO anon;
DROP POLICY IF EXISTS public_published_invitation_pages_read ON public.invitation_pages;
CREATE POLICY public_published_invitation_pages_read ON public.invitation_pages
 FOR SELECT TO anon,authenticated USING (status = 'published');
-- Não permitir leitura pública da tabela de clientes, respostas RSVP ou arquivos privados.
