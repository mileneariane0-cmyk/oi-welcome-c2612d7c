import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ChevronDown, Gift, Heart, Instagram, Menu, MessageCircle, Package, PartyPopper, Search, ShoppingBag, Sparkles, Truck, X } from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

const categories = [
  { name: "Convites digitais", emoji: "💌", tone: "bg-[#f8e2e6]", note: "Experiências especiais" },
  { name: "Aniversários", emoji: "🎂", tone: "bg-[#edf0e7]", note: "Para celebrar" },
  { name: "Casamentos", emoji: "💍", tone: "bg-[#f5e8df]", note: "Amor em detalhes" },
  { name: "Chás e revelações", emoji: "🧸", tone: "bg-[#f6e8f0]", note: "Momentos únicos" },
  { name: "Personalizados", emoji: "🎁", tone: "bg-[#e8eee8]", note: "Feitos para você" },
  { name: "Papelaria", emoji: "🎀", tone: "bg-[#f7e7e1]", note: "Cada detalhe conta" },
];

const showcases = [
  { name: "Convite interativo floral", category: "Convites digitais", emoji: "💐", bg: "from-[#f8d9df] to-[#f4ede8]" },
  { name: "Kit festa personalizado", category: "Personalizados", emoji: "🎉", bg: "from-[#e6eee3] to-[#f7e9dd]" },
  { name: "Convite especial de casamento", category: "Convites digitais", emoji: "💍", bg: "from-[#f5e7dd] to-[#f7f0e9]" },
  { name: "Papelaria para comemorações", category: "Papelaria", emoji: "🎀", bg: "from-[#f3dfe6] to-[#f9efe7]" },
];

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#30272B]">
      <div className="bg-[#75152F] px-4 py-2 text-center text-xs font-medium tracking-wide text-white sm:text-sm">
        Cada detalhe é único. E cada celebração merece ser inesquecível. ✨
      </div>
      <header className="sticky top-0 z-30 border-b border-[#eadbdc] bg-[#fffaf8]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <a href="#inicio" aria-label="Personalizê - início" className="shrink-0 text-2xl font-extrabold tracking-[-0.06em] text-[#75152F] sm:text-3xl">
            Personaliz<span className="text-[#819B87]">ê</span><span className="ml-1 align-top text-xs text-[#F29BAA]">✦</span>
          </a>
          <nav aria-label="Navegação principal" className="hidden items-center gap-7 text-sm font-semibold lg:flex">
            <a className="hover:text-[#75152F]" href="#inicio">Início</a>
            <a className="hover:text-[#75152F]" href="#categorias">Categorias</a>
            <a className="hover:text-[#75152F]" href="#vitrine">Produtos</a>
            <a className="hover:text-[#75152F]" href="#como-funciona">Como funciona</a>
            <a className="hover:text-[#75152F]" href="#sobre">Sobre nós</a>
          </nav>
          <div className="flex items-center gap-1 sm:gap-3">
            <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Abrir busca" aria-expanded={searchOpen} className="rounded-full p-2 hover:bg-[#f7e7e9]"><Search size={20}/></button>
            <a href="#vitrine" aria-label="Explorar produtos" className="rounded-full p-2 hover:bg-[#f7e7e9]"><ShoppingBag size={20}/></a>
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} className="rounded-full p-2 hover:bg-[#f7e7e9] lg:hidden">{menuOpen ? <X size={23}/> : <Menu size={23}/>}</button>
          </div>
        </div>
        {searchOpen && <div className="mx-auto max-w-7xl px-5 pb-4 lg:px-8"><label htmlFor="site-search" className="sr-only">Buscar produtos</label><input id="site-search" type="search" placeholder="Em breve: encontre o seu personalizado..." disabled className="w-full rounded-xl border border-[#e6d3d8] bg-white px-4 py-3 text-sm disabled:opacity-75"/><p className="mt-1 text-xs text-[#78696d]">A busca será ativada quando o catálogo estiver conectado.</p></div>}
        {menuOpen && <nav aria-label="Menu móvel" className="flex flex-col gap-1 border-t border-[#eadbdc] px-5 py-3 lg:hidden">{[["Início","#inicio"],["Categorias","#categorias"],["Produtos","#vitrine"],["Como funciona","#como-funciona"],["Sobre nós","#sobre"]].map(([name,href])=><a key={href} href={href} onClick={()=>setMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-[#f8e7ea]">{name}</a>)}</nav>}
      </header>

      <main id="inicio">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#f9e6e9] via-[#FFF8F6] to-[#e9f0e8]">
          <div className="pointer-events-none absolute -right-24 -top-28 h-96 w-96 rounded-full bg-[#f4c9d1]/40 blur-3xl"/>
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24 lg:px-8">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#e5bdc7] bg-white/75 px-4 py-2 text-xs font-semibold tracking-wide text-[#75152F]"><Sparkles size={15}/> Personalização com carinho</span>
              <h1 className="mt-7 max-w-xl font-serif text-5xl leading-[1.08] tracking-tight text-[#75152F] sm:text-6xl lg:text-7xl">Momentos únicos merecem <em className="font-normal text-[#819B87]">detalhes únicos.</em></h1>
              <p className="mt-6 max-w-lg text-base leading-8 text-[#68565c] sm:text-lg">Convites digitais e personalizados feitos para transformar suas ideias em lembranças inesquecíveis.</p>
              <div className="mt-8 flex flex-wrap gap-3"><a href="#categorias" className="inline-flex items-center gap-2 rounded-full bg-[#75152F] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#75152F]/15 transition hover:bg-[#5e1026]">Conheça nossas criações <ArrowRight size={17}/></a><a href="#como-funciona" className="inline-flex items-center gap-2 rounded-full border border-[#75152F]/25 bg-white/80 px-7 py-3.5 text-sm font-semibold text-[#75152F] transition hover:bg-white">Como funciona</a></div>
              <p className="mt-8 flex items-center gap-2 text-sm text-[#78666c]"><Heart size={16} className="text-[#b96d7c]"/> Feito com cuidado, pensado para você.</p>
            </div>
            <div className="relative mx-auto flex aspect-square w-full max-w-[500px] items-center justify-center">
              <div className="absolute inset-8 rotate-6 rounded-[3rem] bg-[#819B87]/20"/>
              <div className="absolute inset-12 -rotate-6 rounded-[3rem] bg-[#f2bac5]/50"/>
              <div className="relative flex h-[78%] w-[76%] flex-col items-center justify-center rounded-[2.5rem] border border-white/80 bg-gradient-to-br from-[#fffdf9] to-[#f5dce1] p-8 text-center shadow-2xl shadow-[#75152F]/10">
                <span className="text-6xl sm:text-8xl" role="img" aria-label="Envelope com coração">💌</span>
                <div className="mt-6 font-serif text-3xl italic text-[#75152F] sm:text-4xl">Um convite<br/>especial</div>
                <div className="my-5 h-px w-24 bg-[#b88896]"/><p className="text-xs uppercase tracking-[0.3em] text-[#819B87]">para celebrar a vida</p>
              </div>
              <div className="absolute bottom-5 left-0 rounded-2xl bg-white px-5 py-4 shadow-xl shadow-[#75152F]/10"><span className="text-xl">🎀</span><span className="ml-2 text-sm font-semibold text-[#75152F]">Feito para encantar</span></div>
              <div className="absolute right-0 top-10 rounded-2xl bg-[#819B87] px-4 py-3 text-sm font-semibold text-white shadow-lg">Cada detalhe é único ✨</div>
            </div>
          </div>
        </section>

        <section id="categorias" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="mb-10 text-center"><span className="text-xs font-bold uppercase tracking-[0.24em] text-[#819B87]">Feito para cada ocasião</span><h2 className="mt-3 font-serif text-4xl text-[#75152F] sm:text-5xl">Encontre seu momento especial</h2><p className="mt-3 text-[#78666c]">Um universo de possibilidades para celebrar do seu jeito.</p></div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">{categories.map((item)=><a key={item.name} href="#vitrine" className="group rounded-3xl border border-[#f0e2e3] bg-white p-3 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className={`flex aspect-square items-center justify-center rounded-2xl text-5xl transition group-hover:scale-[1.02] ${item.tone}`}>{item.emoji}</div><h3 className="mt-4 text-sm font-bold text-[#75152F]">{item.name}</h3><p className="mb-2 mt-1 text-xs text-[#8b7b7e]">{item.note}</p></a>)}</div>
        </section>

        <section id="vitrine" className="bg-white/75 py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="mb-9 flex flex-wrap items-end justify-between gap-4"><div><span className="text-xs font-bold uppercase tracking-[0.24em] text-[#819B87]">Inspirações</span><h2 className="mt-3 font-serif text-4xl text-[#75152F] sm:text-5xl">Criações para se apaixonar</h2><p className="mt-3 text-sm text-[#78666c]">Prévia ilustrativa da vitrine. Produtos e preços reais serão cadastrados no painel.</p></div><a href="#como-funciona" className="inline-flex items-center gap-2 text-sm font-bold text-[#75152F]">Saiba mais <ArrowRight size={17}/></a></div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{showcases.map((item)=><article key={item.name} className="overflow-hidden rounded-3xl border border-[#eee2e3] bg-[#fffaf9]"><div className={`flex aspect-[4/4.5] items-center justify-center bg-gradient-to-br text-7xl ${item.bg}`}><span role="img" aria-label={item.name}>{item.emoji}</span></div><div className="p-4"><span className="text-xs font-semibold text-[#819B87]">{item.category}</span><h3 className="mt-1 text-sm font-bold text-[#4c343d] sm:text-base">{item.name}</h3><p className="mt-3 text-xs text-[#8b7b7e]">Exemplo de categoria</p></div></article>)}</div></div>
        </section>

        <section id="como-funciona" className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="text-center"><span className="text-xs font-bold uppercase tracking-[0.24em] text-[#819B87]">Simples e especial</span><h2 className="mt-3 font-serif text-4xl text-[#75152F]">Como funciona?</h2></div><div className="mt-12 grid gap-6 md:grid-cols-3">{[{icon:<Search size={26}/>,title:"Escolha seu favorito",text:"Explore nossas categorias e encontre a ideia perfeita para a sua ocasião."},{icon:<MessageCircle size={26}/>,title:"Conte seus detalhes",text:"Compartilhe as informações para personalizarmos tudo com o seu estilo."},{icon:<Gift size={26}/>,title:"Celebre do seu jeito",text:"Receba seu convite digital ou combine a retirada do seu produto físico em Salvador."}].map((step,i)=><div key={step.title} className="relative rounded-3xl border border-[#f0e0e3] bg-white p-8 text-center shadow-sm"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f8e5e9] text-[#75152F]">{step.icon}</div><span className="mt-5 block text-xs font-bold tracking-widest text-[#819B87]">PASSO 0{i+1}</span><h3 className="mt-2 font-serif text-2xl text-[#75152F]">{step.title}</h3><p className="mt-3 text-sm leading-7 text-[#78666c]">{step.text}</p></div>)}</div></section>

        <section id="sobre" className="bg-[#819B87] px-5 py-16 text-center text-white"><div className="mx-auto max-w-3xl"><Sparkles size={30} className="mx-auto text-[#fce2e8]"/><h2 className="mt-5 font-serif text-4xl sm:text-5xl">Mais que produtos, memórias.</h2><p className="mt-5 text-base leading-8 text-white/90">Na Personalizê, acreditamos que cada celebração tem uma história. Nosso carinho está em transformar os pequenos detalhes em grandes lembranças.</p><p className="mt-6 font-serif text-2xl italic">Cada detalhe é único.</p></div></section>
      </main>

      <footer className="bg-[#461222] px-5 py-12 text-white"><div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3 lg:px-3"><div><p className="text-3xl font-extrabold tracking-tight">Personalizê<span className="text-[#F29BAA]">✦</span></p><p className="mt-3 max-w-xs text-sm leading-7 text-white/70">Convites digitais e personalizados feitos com amor para celebrar sua história.</p></div><div><h3 className="font-bold">Explore</h3><div className="mt-4 flex flex-col gap-3 text-sm text-white/75"><a href="#categorias">Categorias</a><a href="#vitrine">Produtos</a><a href="#como-funciona">Como funciona</a></div></div><div><h3 className="font-bold">Informações</h3><p className="mt-4 flex items-center gap-2 text-sm text-white/75"><Package size={16}/> Produtos físicos: retirada em Salvador — BA</p><p className="mt-3 text-sm text-white/60">Contato, redes sociais e políticas serão configurados no painel administrativo.</p></div></div><div className="mx-auto mt-10 max-w-7xl border-t border-white/15 pt-6 text-center text-xs text-white/60">© {new Date().getFullYear()} Personalizê · Cada detalhe é único.</div></footer>
    </div>
  );
}
