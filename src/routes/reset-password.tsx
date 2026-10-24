import { createFileRoute } from '@tanstack/react-router';
import { AdminAuthForm } from '@/components/admin-auth-form';

export const Route = createFileRoute('/reset-password')({
  head: () => ({ meta: [
    { title: 'Redefinir senha | Personalizê' },
    { name: 'description', content: 'Defina uma nova senha para sua conta na Personalizê.' },
    { property: 'og:title', content: 'Redefinir senha | Personalizê' },
    { property: 'og:description', content: 'Defina uma nova senha para sua conta na Personalizê.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'robots', content: 'noindex, nofollow' },
  ] }),
  component: () => <AdminAuthForm recovery />,
});