# Personalizê — entrega da etapa 2

## Recursos ativados e verificados
- Lovable Cloud conectado: banco de dados, autenticação por e-mail e senha e armazenamento.
- Logomarca original aplicada nos cabeçalhos da loja e produtos, nos dois rodapés, no painel e no login, preservando transparência e proporções.
- Loja pública, pesquisa de produtos e sacola demonstrativa verificadas no navegador; comparação visual realizada em computador e celular.
- `/administrador` redireciona visitantes para o login. O acesso exige sessão válida e permissão administrativa consultada no banco. Operações do painel e arquivos também exigem essa permissão.
- Nenhum cliente, pedido, pagamento ou administrador fictício criado.
- Testes de autorização e roteamento: 4 aprovados. Verificação de compilação: sem erros.

## Estrutura criada — 19 tabelas
Perfis (`profiles`), permissões (`user_roles`), clientes (`customers`), categorias (`categories`), produtos (`products`), mídias (`product_media`), variações (`product_variants`), pedidos (`orders`), itens (`order_items`), pagamentos (`payments`), comprovantes (`payment_proofs`), orçamentos (`quotes`), cupons (`coupons`), banners (`banners`), configurações (`store_settings`), páginas de convites (`invitation_pages`), mídias de convites (`invitation_media`), confirmações de presença (`rsvp_responses`) e arquivos de clientes (`customer_files`).

Todas têm identificadores, datas de criação e atualização e controle de acesso por linha. Relações ligam produtos, pedidos, clientes e convites. Perfis são criados automaticamente ao adicionar uma conta. Nenhuma conta pode atribuir a si própria a permissão de administrador. As tabelas futuras permanecem restritas ao administrador até implementar seus fluxos públicos.

## Áreas de arquivos
| Área | Visibilidade | Limite por arquivo | Formatos |
|---|---|---|---|
| store-public | Pública | 10 MB | PNG, JPEG, WebP, GIF, AVIF |
| banners-public | Pública | 50 MB | Imagens acima, MP4, WebM |
| products-public | Pública | 50 MB | Imagens acima, MP4, WebM |
| invitations-private | Privada | 50 MB | Imagens, MP4, WebM, MP3, WAV, OGG, PDF |
| customer-files-private | Privada | 20 MB | PNG, JPEG, WebP, PDF |
| payment-proofs-private | Privada | 10 MB | PNG, JPEG, WebP, PDF |

Limites de tamanho configurados nas áreas. Formatos são restringidos por extensão e tipo de mídia declarado nas regras de envio. SVG e arquivos executáveis não são aceitos. Somente administradores podem enviar, alterar e apagar; arquivos privados só podem ser consultados por administradores nesta etapa. O envio por clientes será preparado em uma etapa futura com permissões específicas.

## Configuração necessária do primeiro administrador
1. Em **Mais → Usuários → Configurações de autenticação**, ative **Desativar cadastro**. O cadastro geral ainda estava permitido na consulta realizada; não existe formulário de cadastro no site e nenhum cadastro atribui permissão administrativa.
2. Em **Mais → Usuários → Adicionar usuário → Criar novo usuário**, crie sua conta usando seu e-mail real e uma senha exclusiva. Não envie a senha pelo chat.
3. Informe no chat somente o e-mail da conta criada para atribuir a permissão administrativa por uma operação controlada. Nenhum e-mail foi presumido e nenhum acesso padrão foi criado.
4. Confira em **Configurações de autenticação → Avançado** se a lista de destinos permitidos inclui o endereço público da página `/reset-password` do site que será usado.
5. Depois da conta e da permissão, verificar entrada, indicadores e saída usando essa conta. A recuperação completa também precisa de um link recebido no e-mail real.

## Limites da verificação
- Entrada administrativa autenticada: **NÃO VERIFICADA**, pois ainda não existe conta administrativa.
- Bloqueio de visitantes: **VERIFICADO** no navegador.
- Permissão de contas comuns: regras e testes locais verificados; tentativa com conta real ainda pendente.
- Recuperação: formulário e bloqueio de link inválido verificados; entrega do e-mail e atualização com link real ainda pendentes.
- Cadastro geral desativado: **PENDENTE** da configuração acima.
- A análise de segurança do banco deixou apenas o aviso intencional da consulta de permissões acessível a usuários autenticados; ela só consulta as permissões da própria sessão.
- Backups automáticos e restauração: **não verificados**, sem afirmação de ativação.
- Não foram implementados checkout, integração de pagamentos, editores ou gerenciamento completo, conforme solicitado.