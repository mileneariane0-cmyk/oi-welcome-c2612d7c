import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { ArrowLeft, Eye, EyeOff, LockKeyhole, LogIn, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { BrandLogo } from './brand-logo';
import { isAdministrator } from '@/lib/admin-access';

const emailSchema = z.string().trim().email().max(255);
const loginSchema = z.object({ email: emailSchema, password: z.string().min(1).max(256) });

export function AdminAuthForm({ denied = false, recovery = false }: { denied?: boolean; recovery?: boolean }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [visible, setVisible] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(denied ? 'Esta conta não possui permissão administrativa.' : '');
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (!recovery) return;
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const type = hash.get('type');
    async function validateLink() {
      const { data } = await supabase.auth.getUser();
      setRecoveryReady(Boolean(data.user) && (type === 'recovery' || type === 'invite'));
      if (!data.user || (type !== 'recovery' && type !== 'invite')) setMessage('O link é inválido ou expirou. Solicite um novo link de recuperação.');
    }
    void validateLink();
  }, [recovery]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    if (recovery) {
      if (!recoveryReady) return;
      if (password.length < 8 || password.length > 256) { setMessage('Use uma senha de 8 a 256 caracteres.'); return; }
      if (password !== confirmation) { setMessage('As senhas não coincidem.'); return; }
    } else if (!(forgot ? emailSchema.safeParse(email) : loginSchema.safeParse({ email, password })).success) {
      setMessage('Informe um e-mail válido e preencha a senha.'); return;
    }
    setBusy(true);
    try {
      if (recovery) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw new Error('Não foi possível atualizar a senha. Verifique os requisitos ou solicite outro link.');
        await supabase.auth.signOut();
        setComplete(true);
        setMessage('Senha atualizada. Entre novamente com sua nova senha.');
      } else if (forgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw new Error('Não foi possível enviar agora. Aguarde e tente novamente.');
        setMessage('Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw new Error('E-mail ou senha incorretos.');
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) throw new Error('Não foi possível confirmar o acesso.');
        const { data: role, error: roleError } = await supabase.rpc('has_role', { _user_id: userData.user.id, _role: 'admin' });
        if (roleError || !isAdministrator(role)) {
          await supabase.auth.signOut();
          throw new Error('Esta conta não possui permissão administrativa.');
        }
        await navigate({ to: '/administrador', replace: true });
      }
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível concluir. Tente novamente.'); }
    finally { setBusy(false); }
  }

  return <main className="auth-screen min-h-screen bg-background px-5 py-10 text-foreground">
    <div className="mx-auto w-full max-w-sm">
      <a href="/" className="mb-10 flex justify-center"><BrandLogo className="auth-logo" /></a>
      <div className="mb-7 text-center"><LockKeyhole className="mx-auto mb-3 text-primary" size={24} /><h1 className="font-serif text-3xl text-primary">{recovery ? 'Definir nova senha' : forgot ? 'Recuperar senha' : 'Acesso administrativo'}</h1></div>
      {complete ? <Button className="w-full" onClick={() => navigate({ to: '/auth', replace: true })}>Ir para o login</Button> : <form onSubmit={submit} className="space-y-5">
        {!recovery && <div><label htmlFor="admin-email" className="mb-2 block text-sm font-semibold">E-mail</label><input id="admin-email" type="email" autoComplete="email" required maxLength={255} value={email} onChange={e => setEmail(e.target.value)} className="auth-input" /></div>}
        {(!forgot || recovery) && <div><label htmlFor="admin-password" className="mb-2 block text-sm font-semibold">{recovery ? 'Nova senha' : 'Senha'}</label><div className="relative"><input id="admin-password" type={visible ? 'text' : 'password'} autoComplete={recovery ? 'new-password' : 'current-password'} required minLength={recovery ? 8 : 1} maxLength={256} value={password} onChange={e => setPassword(e.target.value)} className="auth-input pr-12" /><Button type="button" variant="ghost" size="icon" title={visible ? 'Ocultar senha' : 'Mostrar senha'} aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setVisible(!visible)} className="absolute right-1 top-1">{visible ? <EyeOff /> : <Eye />}</Button></div></div>}
        {recovery && <div><label htmlFor="admin-confirmation" className="mb-2 block text-sm font-semibold">Confirmar senha</label><input id="admin-confirmation" type="password" autoComplete="new-password" required maxLength={256} value={confirmation} onChange={e => setConfirmation(e.target.value)} className="auth-input" /></div>}
        <Button type="submit" disabled={busy || (recovery && !recoveryReady)} className="h-11 w-full">{forgot ? <Mail /> : <LogIn />}{busy ? 'Aguarde...' : recovery ? 'Salvar senha' : forgot ? 'Enviar link' : 'Entrar'}</Button>
        {!recovery && <Button type="button" variant="link" className="w-full" onClick={() => { setForgot(!forgot); setMessage(''); }}>{forgot ? 'Voltar ao login' : 'Esqueci minha senha'}</Button>}
      </form>}
      {message && <p role="status" className="mt-5 text-center text-sm leading-6 text-primary">{message}</p>}
      <a href="/" className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground"><ArrowLeft size={16} />Voltar à loja</a>
    </div>
  </main>;
}