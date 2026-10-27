-- RSVP público apenas para convites publicados com confirmação habilitada.
-- A leitura das respostas permanece exclusiva do administrador.
GRANT INSERT ON public.rsvp_responses TO anon, authenticated;
DROP POLICY IF EXISTS public_invitation_rsvp_insert ON public.rsvp_responses;
CREATE POLICY public_invitation_rsvp_insert ON public.rsvp_responses
 FOR INSERT TO anon, authenticated
 WITH CHECK (
   EXISTS (
     SELECT 1 FROM public.invitation_pages p
     WHERE p.id = invitation_id
       AND p.status = 'published'
       AND p.content->>'rsvp_enabled' = 'true'
   )
 );
-- Antes da publicação definitiva, configurar limitação de requisições/CAPTCHA
-- no endpoint de confirmação para reduzir envios automatizados.
