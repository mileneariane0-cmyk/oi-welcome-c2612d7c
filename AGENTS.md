<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Infrastructure never seeds fictitious business data; explicitly requested demo catalog imports use idempotent slug-based inserts without overwriting existing products.
- Put the admin panel under the authenticated layout; verify administrator roles in its gate, server functions and database/storage policies because UI protection alone is insufficient.
- Keep profile fields in profiles and permissions in user_roles; the Auth lifecycle trigger grants administrator only to the confirmed authorized mailbox, keeping authorization out of editable client metadata.
- Capture invitation/recovery intent before Auth clears URL fragments and use the root Auth subscriber for password recovery navigation; never persist link tokens or add competing recovery listeners.
- Test database authorization triggers in isolated PGlite PostgreSQL so security checks never create fictitious hosted accounts.
- Use the shared BrandLogo with the immutable original asset pointer, resizing proportionally and using a light footer backing for legibility.
- Keep future platform tables admin-only until their public/customer workflows are implemented with narrow access policies.
- Published catalog reads use a shared public server function and narrow publication-scoped policies, while product/category/media mutations remain protected by administrator RLS.
- Product variants store group and required metadata in attributes; bag entries retain selected option IDs and personalizations per user, and prices never represent payment confirmation.
