import { createFileRoute } from '@tanstack/react-router';
import { AdminAuthForm } from '@/components/admin-auth-form';

export const Route = createFileRoute('/auth')({
  validateSearch: (search: Record<string, unknown>): { denied?: boolean } => search['denied'] === true || search['denied'] === 'true' ? { denied: true } : {},
  head: () => ({ meta: [
    { title: 'Acesso administrativo | Personalizê' },
    { name: 'description', content: 'Acesso seguro ao painel administrativo da Personalizê.' },
    { property: 'og:title', content: 'Acesso administrativo | Personalizê' },
    { property: 'og:description', content: 'Acesso seguro ao painel administrativo da Personalizê.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'robots', content: 'noindex, nofollow' },
  ] }),
  component: () => <AdminAuthForm denied={Route.useSearch().denied ?? false} />,
});