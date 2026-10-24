import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BarChart3, Bell, CalendarDays, ChevronRight, ClipboardList, CreditCard, FileText, Gift, Image, LayoutDashboard, LockKeyhole, Menu, Package, Palette, Settings, ShoppingBag, Tag, Users, Wallet, X } from "lucide-react";

export const Route = createFileRoute("/administrador")({ component: AdminEntry });

const sections = [
  {id:"dashboard",label:"Dashboard",icon:LayoutDashboard,description:"Visão geral dos pedidos, pagamentos e atividades da loja."},
  {id:"pedidos",label:"Pedidos",icon:ShoppingBag,description:"Gerenciamento dos pedidos, pagamentos, prazos e produção."},
  {id:"produtos",label:"Produtos",icon:Package,description:"Cadastro de produtos, fotos, vídeos, categorias e variações."},
  {id:"clientes",label:"Clientes",icon:Users,description:"Cadastro, histórico de compras e clientes atendidos pelo WhatsApp."},
  {id:"convites",label:"Páginas de Convites",icon:Gift,description:"Landing pages exclusivas dos eventos, com mídia, música, RSVP e links individuais."},
  {id:"site",label:"Personalizar Site",icon:Palette,description:"Aparência e seções da loja pública. Não altera os convites dos clientes."},
  {id:"banners",label:"Banners",icon:Image,description:"Campanhas da página inicial com imagens, vídeos, links e ordem de exibição."},
  {id:"orcamentos",label:"Orçamentos",icon:ClipboardList,description:"Solicitações de orçamento e conversão em pedidos."},
  {id:"cupons",label:"Cupons",icon:Tag,description:"Descontos, validade e regras de utilização."},
  {id:"financeiro",label:"Financeiro",icon:Wallet,description:"Pagamentos Pix, valores recebidos e pendências."},
  {id:"relatorios",label:"Relatórios",icon:BarChart3,description:"Relatórios de vendas, pedidos e clientes."},
  {id:"configuracoes",label:"Configurações",icon:Settings,description:"Dados da marca, retirada, contato, pagamentos e acessos."},
] as const;
type SectionId = (typeof sections)[number]["id"];
const metrics = [
  {label:"Pedidos recebidos",value:"—",icon:ShoppingBag,detail:"Aguardando conexão"},
  {label:"Aguardando pagamento",value:"—",icon:CreditCard,detail:"Aguardando conexão"},
  {label:"Convites publicados",value:"—",icon:Gift,detail:"Aguardando conexão"},
  {label:"Faturamento",value:"—",icon:Wallet,detail:"Aguardando conexão"},
];
function AdminEntry() {
  const [active,setActive] = useState<SectionId>("dashboard");
  const [menuOpen,setMenuOpen] = useState(false);
  const selected = sections.find(section=>section.id===active)!;
  const select = (id:SectionId)=>{setActive(id);setMenuOpen(false);};
  return <div className="min-h-screen bg-[#FFF8F6] text-[#30272B]">
    <div className="border-b border-[#e7d7dc] bg-[#fff1f3] px-4 py-2 text-center text-xs font-semibold text-[#75152F]"><LockKeyhole size={13} className="mr-1 inline"/> Prévia da estrutura administrativa — acesso ainda não protegido por login. Não insira dados reais.</div>
    <div className="flex min-h-[calc(100vh-35px)]">
      {menuOpen&&<button className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={()=>setMenuOpen(false)} aria-label="Fechar menu"/>}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto border-r border-[#eadce0] bg-white px-4 py-6 transition-transform lg:static lg:translate-x-0 ${menuOpen?"translate-x-0":"-translate-x-full"}`}>
        <div className="mb-8 flex items-center justify-between px-2"><div><p className="text-2xl font-black tracking-tight text-[#75152F]">Personaliz<span className="text-[#819B87]">ê</span><span className="text-[#F29BAA]"> ✦</span></p><p className="mt-1 text-xs font-semibold uppercase tracking-[.16em] text-[#8a7b7f]">Painel administrativo</p></div><button onClick={()=>setMenuOpen(false)} className="lg:hidden" aria-label="Fechar menu"><X/></button></div>
        <nav aria-label="Seções do administrador" className="space-y-1">{sections.map(section=>{const Icon=section.icon;return <button key={section.id} onClick={()=>select(section.id)} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${active===section.id?"bg-[#75152F] text-white":"text-[#6c5960] hover:bg-[#faedf0] hover:text-[#75152F]"}`}><Icon size={18}/>{section.label}</button>})}</nav>
        <a href="/" className="mt-8 flex items-center gap-2 border-t border-[#efdee2] px-4 pt-6 text-sm font-semibold text-[#75152F]"><ArrowLeft size={17}/> Voltar à loja</a>
      </aside>
      <main className="min-w-0 flex-1">
        <header className="flex items-center justify-between gap-4 border-b border-[#e9dce0] bg-white px-5 py-4 lg:px-8"><div className="flex items-center gap-3"><button onClick={()=>setMenuOpen(true)} aria-label="Abrir menu administrativo" className="rounded-lg p-2 text-[#75152F] lg:hidden"><Menu/></button><div><p className="text-xs text-[#8b7a80]">Administração / {selected.label}</p><h1 className="font-serif text-2xl text-[#75152F] sm:text-3xl">{selected.label}</h1></div></div><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7e6ea] text-[#75152F]" aria-label="Notificações futuras"><Bell size={19}/></div></header>
        <div className="mx-auto max-w-6xl p-5 lg:p-8">
          {active==="dashboard"?<><div className="mb-7"><h2 className="font-serif text-3xl text-[#75152F]">Visão geral da Personalizê</h2><p className="mt-2 text-sm leading-6 text-[#7e6d73]">Acompanhe sua loja em um só lugar. Os indicadores serão ativados quando conectarmos o banco de dados.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(metric=>{const Icon=metric.icon;return <div key={metric.label} className="rounded-2xl border border-[#ebdce0] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-[#6d5d63]">{metric.label}</span><Icon size={19} className="text-[#819B87]"/></div><p className="mt-5 text-3xl font-bold text-[#75152F]">{metric.value}</p><p className="mt-2 text-xs text-[#8e7e82]">{metric.detail}</p></div>})}</div><div className="mt-7 grid gap-5 lg:grid-cols-2"><section className="rounded-2xl border border-[#ebdce0] bg-white p-6"><h3 className="font-serif text-2xl text-[#75152F]">Acesso rápido</h3><div className="mt-4 space-y-2">{(["pedidos","produtos","convites","banners"] as SectionId[]).map(id=>{const section=sections.find(item=>item.id===id)!;return <button key={id} onClick={()=>select(id)} className="flex w-full items-center justify-between rounded-xl bg-[#FFF8F6] px-4 py-3 text-sm font-semibold text-[#604b53] hover:bg-[#f8e9ed]">{section.label}<ChevronRight size={17}/></button>})}</div></section><section className="rounded-2xl border border-[#ebdce0] bg-white p-6"><h3 className="font-serif text-2xl text-[#75152F]">Próximas etapas</h3><div className="mt-4 space-y-4 text-sm leading-6 text-[#77676d]"><p className="flex gap-3"><LockKeyhole className="mt-1 shrink-0 text-[#819B87]" size={18}/> Autenticação administrativa e permissões de acesso.</p><p className="flex gap-3"><Package className="mt-1 shrink-0 text-[#819B87]" size={18}/> Cadastro de produtos, categorias e pedidos.</p><p className="flex gap-3"><Image className="mt-1 shrink-0 text-[#819B87]" size={18}/> Upload de imagens e vídeos dos banners.</p><p className="flex gap-3"><CalendarDays className="mt-1 shrink-0 text-[#819B87]" size={18}/> Publicação de convites e controle de prazos.</p></div></section></div></>:<><div className="rounded-3xl border border-[#ebdce0] bg-white p-7 shadow-sm sm:p-10"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f8e7eb] text-[#75152F]">{(() => {const Icon=selected.icon;return <Icon size={27}/>})()}</div><h2 className="mt-6 font-serif text-3xl text-[#75152F]">{selected.label}</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#74636a]">{selected.description}</p><div className="mt-7 rounded-xl border border-dashed border-[#d8bfc6] bg-[#FFF8F6] px-5 py-4 text-sm text-[#745b64]"><strong>Estrutura reservada.</strong> As ferramentas de cadastro, edição, exclusão e publicação serão implementadas nas próximas etapas, depois da configuração de autenticação e armazenamento.</div>{active==="convites"&&<p className="mt-4 text-sm leading-6 text-[#75666b]">As artes dos convites serão criadas fora do site. Aqui você montará apenas as páginas interativas individuais de cada cliente.</p>}{active==="site"&&<p className="mt-4 text-sm leading-6 text-[#75666b]">Esta área será exclusiva para personalizar o site público, sem modificar páginas de convites dos clientes.</p>}</div></>}
        </div>
      </main>
    </div>
  </div>;
}
