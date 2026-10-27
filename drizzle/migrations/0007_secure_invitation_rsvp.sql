CREATE TABLE public.invitation_request_limits (request_key text PRIMARY KEY, window_start timestamptz NOT NULL DEFAULT now(), requests integer NOT NULL DEFAULT 0);
GRANT ALL ON public.invitation_request_limits TO service_role;
ALTER TABLE public.invitation_request_limits ENABLE ROW LEVEL SECURITY;
CREATE FUNCTION public.submit_invitation_rsvp(p_slug text,p_name text,p_attendance text,p_party_size integer,p_request_key text) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE event_id uuid; request_count integer;
BEGIN
IF length(trim(p_name)) NOT BETWEEN 1 AND 100 OR p_attendance NOT IN ('yes','no','maybe') OR p_party_size NOT BETWEEN 1 AND 100 OR length(p_request_key)<>64 THEN RAISE EXCEPTION 'Invalid response'; END IF;
SELECT id INTO event_id FROM public.invitation_pages WHERE slug=p_slug AND status='published' AND content->>'rsvp_enabled'='true' FOR SHARE;
IF event_id IS NULL THEN RAISE EXCEPTION 'Invitation unavailable'; END IF;
INSERT INTO public.invitation_request_limits(request_key,window_start,requests) VALUES(p_request_key,now(),1) ON CONFLICT(request_key) DO UPDATE SET requests=CASE WHEN invitation_request_limits.window_start<now()-interval '10 minutes' THEN 1 ELSE invitation_request_limits.requests+1 END,window_start=CASE WHEN invitation_request_limits.window_start<now()-interval '10 minutes' THEN now() ELSE invitation_request_limits.window_start END RETURNING requests INTO request_count;
IF request_count>5 THEN RETURN false; END IF;
INSERT INTO public.rsvp_responses(invitation_id,guest_name,attendance,party_size) VALUES(event_id,trim(p_name),p_attendance,CASE WHEN p_attendance='no' THEN 1 ELSE p_party_size END);
RETURN true;
END $$;
REVOKE ALL ON FUNCTION public.submit_invitation_rsvp(text,text,text,integer,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.submit_invitation_rsvp(text,text,text,integer,text) TO service_role;