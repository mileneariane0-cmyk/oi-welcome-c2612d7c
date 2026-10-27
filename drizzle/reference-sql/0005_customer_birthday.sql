-- Data de nascimento opcional para lembretes de aniversário no painel.
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS birth_date date;
COMMENT ON COLUMN public.customers.birth_date IS 'Data de nascimento opcional, utilizada apenas para lembretes administrativos de aniversário.';
