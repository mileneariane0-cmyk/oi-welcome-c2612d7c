import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { isAdministrator } from './admin-access';

export const getAdminOverview = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: role, error } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
    if (error || !isAdministrator(role)) throw new Error('Acesso restrito a administradores.');
    const [orders, pending, invitations, payments] = await Promise.all([
      context.supabase.from('orders').select('id', { count: 'exact', head: true }),
      context.supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'awaiting_payment'),
      context.supabase.from('invitation_pages').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      context.supabase.from('payments').select('amount').eq('status', 'confirmed'),
    ]);
    for (const result of [orders, pending, invitations, payments]) if (result.error) throw new Error('Não foi possível carregar os indicadores.');
    return { orders: orders.count ?? 0, pending: pending.count ?? 0, invitations: invitations.count ?? 0, revenue: (payments.data ?? []).reduce((sum, payment) => sum + Number(payment.amount), 0) };
  });