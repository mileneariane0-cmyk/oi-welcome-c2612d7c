import { createFileRoute } from "@tanstack/react-router";
import {useSuspenseQuery} from "@tanstack/react-query";
import {catalogQuery} from "@/lib/catalog.functions";
import {StoreBannerCarousel} from "@/components/store-banner-carousel";
import {ProductMedia} from "@/components/product-media";
import { BrandLogo } from "@/components/brand-logo";
import { useEffect, useMemo, useState } from "react";
import {readBag} from "@/lib/bag";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, ChevronRight, Heart, MapPin, Menu, Minus, Plus, Search, ShoppingBag, SlidersHorizontal, Sparkles, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/")({ loader: ({context})=>context.queryClient.ensureQueryData(catalogQuery), head: () => ({ meta: [{ title: "Personalizê | Convites e personalizados" }, { name: "description", content: "Convites digitais, papelaria e personalizados da Personalizê para momentos especiais." }, { property: "og:title", content: "Personalizê | Convites e personalizados" }, { property: "og:description", content: "Convites digitais, papelaria e personalizados da Personalizê para momentos especiais." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: Home });

const money = (value: number) => value.toLocaleString("pt-BR", {style:"currency",currency:"BRL"});

function Home() {
  const {data:catalog}=useSuspenseQuery(catalogQuery);
  const items=catalog.products;
  const categories=["Todos",...catalog.categories.map(c=>c.name)];
  const [menuOpen,setMenuOpen] = useState(false);
  const [query,setQuery] = useState("");
  const [category,setCategory] = useState("Todos");
  const [cart,setCart] = useState<Record<string,number>>({});
  const [cartOpen,setCartOpen] = useState(false);
  const [termsAccepted,setTermsAccepted] = useState(false);
  const [cartUserId,setCartUserId] = useState<string|null>(null);
  const [loginPromptOpen,setLoginPromptOpen] = useState(false);
  const [customerLoggedIn,setCustomerLoggedIn] = useState(false);
  useEffect(()=>{
    let active=true;
    supabase.auth.getUser().then(({data})=>{if(active){setCustomerLoggedIn(Boolean(data.user));setCartUserId(data.user?.id??null);if(data.user){try{const saved=readBag(data.user.id);setCart(Object.fromEntries(saved.map(e=>[e.key,e.quantity])));}catch{setCart({});}}}});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{if(active){setCustomerLoggedIn(Boolean(session?.user));setCartUserId(session?.user?.id??null);if(!session?.user)setCart({});}});
    return ()=>{active=false;subscription.unsubscribe();};
  },[]);
  const requireLogin = (action:()=>void) => {
    supabase.auth.getUser().then(({data,error})=>{
      if(!error && data.user){setCustomerLoggedIn(true);action();}
      else {setCustomerLoggedIn(false);setLoginPromptOpen(true);}
    });
  };
  const [favorites,setFavorites] = useState<string[]>([]);
  const filtered = useMemo(()=>items.filter(item => (category === "Todos" || item.categories.includes(category)) && (item.name+" "+item.category).toLowerCase().includes(query.toLowerCase())),[category,query]);

  const count = Object.values(cart).reduce((sum,n)=>sum+n,0);
  const total = items.reduce((sum,item)=>sum+item.price*(cart[item.id] || 0),0);
  const add = (id:string) => setCart(current=>({...current,[id]:(current[id]||0)+1}));
  const remove = (id:string) => setCart(current=>{const next={...current}; if((next[id]||0)<=1)delete next[id]; else next[id]=(next[id] ?? 1)-1;return next;});
  return <div className="min-h-screen bg-[#FFF8F6] text-[#30272B]">

    <header className="sticky top-0 z-40 border-b border-[#eddee1] bg-[#fffaf8]/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-2 py-3 sm:gap-3 sm:px-4 lg:gap-8 lg:px-8 lg:py-4">
        <a href="/" className="min-w-0 shrink-1 lg:shrink-0" aria-label="Personalizê — página inicial"><div className="w-[112px] min-[390px]:w-[135px] sm:w-[170px] lg:w-auto"><BrandLogo /></div></a>
        <div className="hidden flex-1 lg:block"><label className="flex items-center gap-2 rounded-full border border-[#e8d6db] bg-white px-5 py-3 focus-within:border-[#75152F]"><Search size={19} className="text-[#75152F]"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="O que você está procurando?" aria-label="Buscar produtos" className="w-full bg-transparent text-sm outline-none"/></label></div>
        <nav className="ml-auto hidden items-center gap-5 text-sm font-semibold lg:flex"><a href="/produtos" className="hover:text-[#75152F]">Produtos</a><a href="/produtos" className="hover:text-[#75152F]">Categorias</a><a href="#sobre" className="hover:text-[#75152F]">Sobre</a></nav>
        <a href="/minha-conta" className="ml-auto shrink-0 whitespace-nowrap rounded-full border border-[#ead9dc] bg-white px-2 py-2 text-[10px] font-bold text-[#75152F] hover:bg-[#f9ebee] min-[390px]:px-3 min-[390px]:text-xs sm:text-sm lg:ml-0 lg:py-3">Minha Conta</a>
        <button onClick={()=>requireLogin(()=>window.location.assign("/sacola"))} className="relative flex shrink-0 items-center gap-2 rounded-full border border-[#ead9dc] bg-white p-2 text-[#75152F] hover:bg-[#f9ebee] sm:p-3" aria-label={`Abrir sacola com ${count} itens`}><ShoppingBag size={19}/><span className="hidden text-sm font-semibold lg:inline">Sacola</span>{count>0&&<span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#75152F] px-1 text-xs text-white">{count}</span>}</button>
        <label className="flex min-w-0 max-w-[155px] flex-1 items-center gap-1 rounded-full border border-[#ead8dc] bg-white px-2 py-2 lg:hidden"><Search size={16} className="shrink-0 text-[#75152F]"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar" aria-label="Buscar produtos" className="min-w-0 w-full bg-transparent text-[11px] outline-none"/></label>
        <button onClick={()=>setMenuOpen(!menuOpen)} aria-label="Abrir menu" aria-expanded={menuOpen} className="shrink-0 rounded-full p-1.5 lg:hidden">{menuOpen?<X size={22}/>:<Menu size={22}/>}</button>
      </div>
      {menuOpen&&<nav className="flex flex-col border-t border-[#f1e1e5] bg-white px-5 py-2 lg:hidden">{[["Produtos","/produtos"],["Categorias","/produtos"],["Como funciona","#como-funciona"],["Sobre","#sobre"]].map(([label,href])=><a key={href} onClick={()=>setMenuOpen(false)} href={href} className="py-3 text-sm font-semibold">{label}</a>)}</nav>}
    </header>
    <main>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-5 lg:grid-cols-[1.7fr_1fr] lg:px-8">
        {/* Área publicitária: futuramente administrada em Administrador > Banners.
            Aceitará imagem ou vídeo, link de destino, ordem e status de publicação.
            Até a integração com o banco de dados, exibe somente uma peça demonstrativa. */}
        {catalog.banners.length>0?<StoreBannerCarousel banners={catalog.banners}/>:<div aria-label="Banner promocional demonstrativo" className="relative flex min-h-[310px] flex-col justify-center overflow-hidden rounded-[28px] bg-gradient-to-r from-[#75152F] via-[#8e3450] to-[#ba7085] px-7 py-10 text-white sm:min-h-[370px] sm:px-12">
          <div className="pointer-events-none absolute -right-12 -top-14 h-72 w-72 rounded-full border-[35px] border-white/10"/><div className="pointer-events-none absolute bottom-[-90px] right-10 h-56 w-56 rounded-full bg-[#f2aabb]/25 blur-2xl"/>
          <div className="relative max-w-md"><span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider"><Sparkles size={15}/> Espaço para anúncios da loja</span><h1 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">Ofertas e novidades da Personalizê</h1><p className="mt-4 text-sm leading-7 text-white/90 sm:text-base">Aqui você poderá divulgar promoções, lançamentos e campanhas com imagem ou vídeo cadastrado pelo administrador.</p><a href="/produtos" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#75152F] shadow-lg">Ver produtos <ArrowRight size={18}/></a></div>
          <span className="pointer-events-none absolute bottom-6 right-6 hidden rotate-[-12deg] text-8xl drop-shadow-xl sm:block" aria-hidden="true">🎁</span>
        </div>}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          <a href="/produtos" onClick={()=>setCategory("Convites digitais")} className="flex min-h-[150px] items-center justify-between overflow-hidden rounded-[25px] bg-[#e8eee4] p-5 sm:p-7"><div><span className="text-xs font-bold uppercase tracking-wide text-[#647d6c]">Novidade</span><h2 className="mt-2 font-serif text-xl font-bold text-[#496452] sm:text-3xl">Convites digitais</h2><span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#496452]">Ver opções <ChevronRight size={15}/></span></div><span className="text-5xl sm:text-7xl">💌</span></a>
          <a href="/produtos" onClick={()=>setCategory("Personalizados")} className="flex min-h-[150px] items-center justify-between overflow-hidden rounded-[25px] bg-[#f8e0e5] p-5 sm:p-7"><div><span className="text-xs font-bold uppercase tracking-wide text-[#9d5266]">Feito para você</span><h2 className="mt-2 font-serif text-xl font-bold text-[#75152F] sm:text-3xl">Personalizados</h2><span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#75152F]">Explorar <ChevronRight size={15}/></span></div><span className="text-5xl sm:text-7xl">🎁</span></a>
        </div>
      </section>
      <section id="categorias" className="mx-auto max-w-7xl px-4 pb-12 lg:px-8"><div className="mb-5 flex items-end justify-between"><div><span className="text-xs font-bold uppercase tracking-[.2em] text-[#819B87]">Encontre o que procura</span><h2 className="mt-2 font-serif text-3xl text-[#75152F] sm:text-4xl">Compre por categoria</h2></div><a href="/produtos" className="hidden items-center gap-1 text-sm font-bold text-[#75152F] sm:inline-flex">Ver tudo <ArrowRight size={17}/></a></div><div className="grid grid-cols-3 gap-3 sm:grid-cols-6">{catalog.categories.map(c=>({...c,icon:"🎁"})).map(item=><a key={item.name} href="/produtos" className="rounded-2xl border border-[#eee0e2] bg-white p-3 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"><div className="flex aspect-square items-center justify-center rounded-xl bg-[#f8e9ec] text-4xl sm:text-5xl">{item.icon}</div><p className="mt-3 text-xs font-bold text-[#75152F] sm:text-sm">{item.name}</p></a>)}</div></section>
      <section id="produtos" className="bg-white/80 py-12"><div className="mx-auto max-w-7xl px-4 lg:px-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><span className="text-xs font-bold uppercase tracking-[.2em] text-[#819B87]">Nossa vitrine</span><h2 className="mt-2 font-serif text-3xl text-[#75152F] sm:text-4xl">Escolha seu favorito</h2><p className="mt-2 text-sm text-[#85747a]">Convites e personalizados para seu momento especial.</p></div><div className="flex items-center gap-2 text-sm text-[#75152F]"><SlidersHorizontal size={18}/> {filtered.length} opções</div></div>
        <div className="mt-6 flex gap-2 overflow-x-auto pb-3">{categories.map(name=><button key={name} onClick={()=>setCategory(name)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${category===name?"border-[#75152F] bg-[#75152F] text-white":"border-[#e9d9dc] bg-white text-[#654b54] hover:border-[#75152F]"}`}>{name}</button>)}</div>
        {filtered.length===0?<div className="rounded-2xl bg-[#FFF8F6] p-10 text-center text-[#75152F]">Nenhum produto encontrado. Tente outra busca ou categoria.</div>:<div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">{filtered.map(item=><article key={item.id} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#eddee0] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className={`relative flex aspect-square items-center justify-center bg-gradient-to-br text-6xl sm:text-8xl ${item.gradient}`}><ProductMedia media={item.media[0]} emoji={item.emoji} name={item.name}/>{item.badge&&<span className="absolute left-2 top-2 rounded-full bg-[#75152F] px-2.5 py-1 text-[10px] font-bold text-white sm:left-3 sm:top-3">{item.badge}</span>}<button onClick={()=>setFavorites(current=>current.includes(item.id)?current.filter(id=>id!==item.id):[...current,item.id])} aria-label={favorites.includes(item.id)?"Remover favorito":"Favoritar"} className="absolute right-2 top-2 rounded-full bg-white/95 p-2 text-[#75152F] shadow"><Heart size={17} fill={favorites.includes(item.id)?"currentColor":"none"}/></button></div><div className="flex flex-1 flex-col p-3 sm:p-4"><p className="text-[11px] font-semibold text-[#819B87]">{item.category}</p><h3 className="mt-1 min-h-10 text-sm font-semibold leading-5 text-[#422e36] sm:text-base">{item.name}</h3><div className="mt-auto pt-3">{item.old&&<span className="text-xs text-[#a19598] line-through">{money(item.old)}</span>}<p className="text-xl font-extrabold text-[#75152F]">{money(item.price)}</p><p className="mt-1 text-[11px] text-[#87777b]"></p></div><button onClick={()=>window.location.assign(`/produto/${item.id}`)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#75152F] px-2 py-3 text-xs font-bold text-white transition hover:bg-[#5b1025] sm:text-sm"><ArrowRight size={16}/> Ver detalhes</button></div></article>)}</div>}
      </div></section>
      <section id="como-funciona" className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 md:grid-cols-2 lg:px-8"><div className="rounded-3xl bg-[#e7eee7] p-9"><span className="text-xs font-bold uppercase tracking-[.2em] text-[#647e6b]">Sua ideia ganha vida</span><h2 className="mt-3 font-serif text-4xl text-[#75152F]">Personalizado para momentos inesquecíveis.</h2><p className="mt-4 leading-7 text-[#5c6760]">Escolha seu produto, compartilhe os detalhes e acompanhe cada etapa. Convites digitais são enviados online; produtos físicos são retirados em Salvador — BA.</p></div><div className="space-y-4">{[{n:"01",title:"Escolha o produto",text:"Navegue pelo catálogo e selecione o que combina com sua ocasião."},{n:"02",title:"Personalize seu pedido",text:"Informe os detalhes necessários para a criação."},{n:"03",title:"Receba ou retire",text:"Receba o convite digital ou combine a retirada do personalizado."}].map(item=><div key={item.n} className="flex gap-4 rounded-2xl border border-[#eee0e2] bg-white p-5"><span className="font-serif text-3xl text-[#819B87]">{item.n}</span><div><h3 className="font-bold text-[#75152F]">{item.title}</h3><p className="mt-1 text-sm leading-6 text-[#786b70]">{item.text}</p></div></div>)}</div></section>
    </main>
    <footer className="bg-[#461222] px-4 py-3 text-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-2"><span className="min-w-0 whitespace-nowrap text-[10px] font-medium tracking-tight text-white sm:text-sm">Feito com carinho, pensado para você.</span><div className="flex items-center gap-8"><a href="https://wa.me/5571986691076" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white hover:underline">Entre em contato</a><a href="/administrador" className="text-sm font-medium text-white hover:underline">Admin</a></div></div></footer>
    {loginPromptOpen&&<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4" role="presentation"><section role="dialog" aria-modal="true" aria-labelledby="login-required-title" className="w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f8e8ec] text-[#75152F]"><ShoppingBag size={27}/></div><h2 id="login-required-title" className="mt-4 font-serif text-2xl text-[#75152F]">Entre na sua conta</h2><p className="mt-3 text-sm leading-6 text-[#75666b]">Para adicionar produtos à sacola, você precisa entrar ou criar uma conta. Deseja continuar?</p><div className="mt-6 flex gap-3"><button onClick={()=>setLoginPromptOpen(false)} className="flex-1 rounded-xl border border-[#e8d6db] px-4 py-3 text-sm font-bold text-[#75152F]">Agora não</button><a href="/minha-conta" className="flex-1 rounded-xl bg-[#75152F] px-4 py-3 text-sm font-bold text-white">Sim, continuar</a></div></section></div>}

  </div>;
}
