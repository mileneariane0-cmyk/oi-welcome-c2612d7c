import { createFileRoute } from "@tanstack/react-router";
import {useSuspenseQuery} from "@tanstack/react-query";
import {catalogQuery} from "@/lib/catalog.functions";
import {ProductMedia} from "@/components/product-media";
import { BrandLogo } from "@/components/brand-logo";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Search, ShoppingBag, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/produtos")({ loader: ({context})=>context.queryClient.ensureQueryData(catalogQuery), head: () => ({ meta: [{ title: "Produtos | Personalizê" }, { name: "description", content: "Explore o catálogo de convites digitais e personalizados da Personalizê." }, { property: "og:title", content: "Produtos | Personalizê" }, { property: "og:description", content: "Explore o catálogo de convites digitais e personalizados da Personalizê." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: Products });

const money = (value: number) => value.toLocaleString("pt-BR", {style:"currency",currency:"BRL"});

function Products() {
  const {data:catalog}=useSuspenseQuery(catalogQuery);
  const items=catalog.products;
  const categories=["Todos",...catalog.categories.map(c=>c.name)];
  const [query,setQuery] = useState("");
  const [category,setCategory] = useState(()=>{if(typeof window==="undefined")return "Todos";const slug=new URLSearchParams(window.location.search).get("categoria");return catalog.categories.find(c=>c.slug===slug)?.name??"Todos";});
  const [sort,setSort] = useState("default");
  const [cart,setCart] = useState<Record<string,number>>({});
  const [loginPromptOpen,setLoginPromptOpen] = useState(false);
  async function addToBag(id:string){
    const {data,error}=await supabase.auth.getUser();
    if(error||!data.user){setLoginPromptOpen(true);return;}
    setCart(current=>({...current,[id]:(current[id]||0)+1}));
  }
  const filtered = useMemo(()=>{
    const result=items.filter(item=>(category==="Todos"||item.categories.includes(category))&&(item.name+" "+item.category).toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR")));
    if(sort==="low")result.sort((a,b)=>a.price-b.price);
    if(sort==="high")result.sort((a,b)=>b.price-a.price);
    return result;
  },[query,category,sort]);
  const count=Object.values(cart).reduce((sum,n)=>sum+n,0);
  return <div className="min-h-screen bg-[#FFF8F6] text-[#30272B]">

    <header className="border-b border-[#eadde0] bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 lg:px-8"><a href="/" className="shrink-0" aria-label="Personalizê — página inicial"><BrandLogo /></a><div className="flex items-center gap-4"><a href="/minha-conta" className="text-sm font-semibold text-[#75152F]">Minha Conta</a><a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#75152F]"><ArrowLeft size={17}/> Voltar à loja</a></div></div></header>
    <main className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <span className="text-xs font-bold uppercase tracking-[.2em] text-[#819B87]">Catálogo completo</span>
      <h1 className="mt-2 font-serif text-4xl text-[#75152F] sm:text-5xl">Todos os produtos</h1>
      <p className="mt-3 text-sm text-[#77676b]">Encontre convites e personalizados para seu momento especial.</p>
      <div className="mt-7 grid gap-3 md:grid-cols-[1fr_220px]">
        <label className="flex items-center gap-3 rounded-xl border border-[#e6d5d9] bg-white px-4 py-3"><Search size={19} className="text-[#75152F]"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pesquisar pelo nome do produto..." className="w-full bg-transparent text-sm outline-none" aria-label="Pesquisar produtos"/></label>
        <label className="flex items-center gap-2 rounded-xl border border-[#e6d5d9] bg-white px-3"><SlidersHorizontal size={18} className="text-[#75152F]"/><select aria-label="Ordenar produtos" value={sort} onChange={e=>setSort(e.target.value)} className="w-full bg-white py-3 text-sm outline-none"><option value="default">Ordenar produtos</option><option value="low">Menor preço</option><option value="high">Maior preço</option></select></label>
      </div>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-3">{categories.map(name=><button key={name} onClick={()=>setCategory(name)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold ${category===name?"border-[#75152F] bg-[#75152F] text-white":"border-[#e9d9dc] bg-white text-[#654b54]"}`}>{name}</button>)}</div>
      <p className="mb-5 text-sm text-[#806e74]">{filtered.length} produto(s) encontrado(s) • Sacola: {count} item(ns)</p>
      {filtered.length===0?<div className="rounded-2xl bg-white p-10 text-center text-[#75152F]">Nenhum produto encontrado. Tente outra busca ou categoria.</div>:<div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">{filtered.map(item=><article key={item.id} className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#eddee0] bg-white shadow-sm"><div className={`relative flex aspect-square items-center justify-center bg-gradient-to-br text-6xl sm:text-8xl ${item.gradient}`}><ProductMedia media={item.media[0]} emoji={item.emoji} name={item.name}/>{item.badge&&<span className="absolute left-2 top-2 rounded-full bg-[#75152F] px-2.5 py-1 text-[10px] font-bold text-white">{item.badge}</span>}</div><div className="flex flex-1 flex-col p-3 sm:p-4"><p className="text-xs font-semibold text-[#819B87]">{item.category}</p><h2 className="mt-1 min-h-10 text-sm font-semibold sm:text-base">{item.name}</h2><div className="mt-auto pt-3">{item.old&&<p className="mt-2 text-xs text-[#a19598] line-through">{money(item.old)}</p>}<p className="mt-1 text-xl font-extrabold text-[#75152F]">{money(item.price)}</p><p className="mt-1 text-[11px] text-[#86777b]"></p></div><button onClick={()=>window.location.assign(`/produto/${item.id}`)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#75152F] px-2 py-3 text-xs font-bold text-white sm:text-sm"><ShoppingBag size={16}/> Ver detalhes</button></div></article>)}</div>}
      <p className="mt-8 text-center text-xs text-[#8b7b7f]"></p>
    </main>
    {loginPromptOpen&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"><section role="dialog" aria-modal="true" aria-labelledby="products-login-title" className="w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f8e8ec] text-[#75152F]"><ShoppingBag size={27}/></div><h2 id="products-login-title" className="mt-4 font-serif text-2xl text-[#75152F]">Entre na sua conta</h2><p className="mt-3 text-sm leading-6 text-[#75666b]">Para adicionar produtos à sacola, você precisa entrar ou criar uma conta. Deseja continuar?</p><div className="mt-6 flex gap-3"><button onClick={()=>setLoginPromptOpen(false)} className="flex-1 rounded-xl border border-[#e8d6db] px-4 py-3 text-sm font-bold text-[#75152F]">Agora não</button><a href="/minha-conta" className="flex-1 rounded-xl bg-[#75152F] px-4 py-3 text-sm font-bold text-white">Sim, continuar</a></div></section></div>}
    <footer className="bg-[#461222] px-4 py-3 text-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-2"><span className="min-w-0 whitespace-nowrap text-[10px] font-medium tracking-tight text-white sm:text-sm">Feito com carinho, pensado para você.</span><div className="flex gap-8 text-sm"><a href="https://wa.me/5571986691076" target="_blank" rel="noopener noreferrer">Entre em contato</a><a href="/administrador">Admin</a></div></div></footer>
  </div>;
}
