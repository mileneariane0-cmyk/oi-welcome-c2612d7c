# Atualização geral — resultados verificados

## Alterações executadas
- `customers.birth_date` foi acrescentado como data opcional. A causa do erro era a ausência dessa coluna no banco ativo e nos tipos gerados.
- As permissões existentes de administrador foram mantidas. Clientes e aniversários continuam protegidos por RLS, sem política pública de leitura.
- A loja, páginas individuais e sacola passam a usar os produtos publicados no Lovable Cloud. Oito exemplos foram importados por slug sem sobrescrever dados: há nove produtos, incluindo o Convite Chá Revelação preexistente, e nenhum slug duplicado.
- Produto administrativo recebeu preço promocional e informações de personalização; galeria usa mídias ordenadas; seletores respeitam grupos e obrigatoriedade. Sacola guarda IDs das opções, personalização e quantidade por usuário neste dispositivo; não confirma nem paga pedidos.
- Banners publicados e vigentes são consultáveis pela loja; cadastro sincronizado foi reutilizado. Na ausência de banners reais, a peça existente permanece.
- Ferramentas de pedidos, banners e convites recebidas do repositório foram preservadas; incompatibilidades de tipagem que impediam compilação foram corrigidas. A implementação pública de convites não foi ampliada.

## Migrações efetivamente aplicadas
- `0004_customer_birthday.sql`: conteúdo exato da migração de nascimento existente, aplicado pelo gerenciador com o próximo número disponível.
- `0005_storefront_catalog_access.sql`: preço promocional, instruções de personalização e leitura pública restrita aos produtos/categorias publicados e suas mídias/variações.
- `0006_published_banner_read.sql`: leitura de banners publicados dentro da vigência.
- `0004_seed_editable_demo_catalog.sql` não foi aplicada como uma migração única: misturava inserções com permissões. As inserções idempotentes solicitadas foram executadas pela ferramenta de dados e as permissões por migração própria. `0005_customer_birthday.sql` permanece como referência original, não como uma segunda aplicação.

## Testes e observações
- Quinze testes aprovados: autorização administrativa, data Bahia, grupos opcionais, preços, personalizações, cadastro/edição/consulta de clientes em PostgreSQL isolado e bloqueio de não administradores.
- Navegador autenticado: cliente existente consultado e salvo sem mudar seus dados; produto e categoria existentes salvos sem mudar conteúdo; nove produtos no painel; telas de pedidos e banners consultadas sem erros.
- Navegador: visitante recebe convite para entrar antes de adicionar; usuário autenticado adiciona, vê confirmação, segue à sacola, encontra personalização, aumenta quantidade e exclui. Não houve erros de execução nos fluxos observados.
- Sino administrativo aberto no estado sem aniversariantes. Layout do catálogo em 563 × 595 sem rolagem horizontal da página.
- Não foram criadas contas, clientes, pedidos ou pagamentos fictícios no Lovable Cloud; senha e autorização administrativa não foram alteradas.

## Ainda não verificado ou concluído
- Upload e reprodução de imagens/vídeos reais: nenhum produto tinha mídias cadastradas. A ligação está implementada, mas não deve ser anunciada como testada de ponta a ponta.
- Alerta com aniversário real e abertura do WhatsApp: regra de data foi testada; não se alterou o aniversário do cliente existente só para gerar notificação.
- Histórico auditável de mudanças dos pedidos e confirmação de pagamentos: não implementados; a ferramenta sincronizada permite consulta e alteração de situação, mas não há pedidos para teste real.
- Páginas públicas completas de convites e suas mídias/RSVP permanecem etapa posterior; sem abertura pública das tabelas privadas.
- Sacola não é pedido persistido e não sincroniza entre dispositivos. O checkout e pagamento continuam desativados.