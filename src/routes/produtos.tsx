import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Search, ShoppingBag, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/produtos")({ component: Products });

type Item = { id: number; name: string; category: string; price: number; old?: number; emoji: string; gradient: string; badge?: string };
const categories = ["Todos", "Convites digitais", "Aniversário", "Casamento", "Chá de bebê", "Personalizados", "Papelaria"];
const items: Item[] = [
  {id:1,name:"Convite digital interativo floral",category:"Convites digitais",price:49.9,old:69.9,emoji:"💌",gradient:"from-[#eec5ce] via-[#fbe8e6] to-[#e8d5bd]",badge:"Destaque"},
  {id:2,name:"Kit festa personalizado",category:"Personalizados",price:89.9,emoji:"🎉",gradient:"from-[#d9e6d5] via-[#eff1e5] to-[#f6e1d9]",badge:"Sob encomenda"},
  {id:3,name:"Convite de casamento elegante",category:"Casamento",price:59.9,old:79.9,emoji:"💍",gradient:"from-[#e9ded2] via-[#faf2e8] to-[#e9d5dc]",badge:"Oferta"},
  {id:4,name:"Topo de bolo personalizado",category:"Aniversário",price:24.9,emoji:"🎂",gradient:"from-[#f5dce4] via-[#f9eee7] to-[#f3e5c8]"},
  {id:5,name:"Convite chá de bebê delicado",category:"Chá de bebê",price:44.9,emoji:"🧸",gradient:"from-[#dce8df] via-[#f9f1e7] to-[#e9dce8]"},
  {id:6,name:"Tags e adesivos personalizados",category:"Papelaria",price:19.9,emoji:"🎀",gradient:"from-[#ead6e3] via-[#f9e7e7] to-[#f2e8d5]"},
  {id:7,name:"Convite digital de aniversário",category:"Convites digitais",price:39.9,emoji:"🎈",gradient:"from-[#e9d9ed] via-[#fbe9e9] to-[#f7e3cf]"},
  {id:8,name:"Lembrancinha personalizada",category:"Personalizados",price:34.9,emoji:"🎁",gradient:"from-[#dbe8d8] via-[#f7ede2] to-[#f1d9dc]"},
];
const money = (value: number) => value.toLocaleString("pt-BR", {style:"currency",currency:"BRL"});

function Products() {
  const [query,setQuery] = useState("");
  const [category,setCategory] = useState("Todos");
  const [sort,setSort] = useState("default");
  const [cart,setCart] = useState<Record<number,number>>({});
  const filtered = useMemo(()=>{
    const result=items.filter(item=>(category==="Todos"||item.category===category)&&(item.name+" "+item.category).toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR")));
    if(sort==="low")result.sort((a,b)=>a.price-b.price);
    if(sort==="high")result.sort((a,b)=>b.price-a.price);
    return result;
  },[query,category,sort]);
  const count=Object.values(cart).reduce((sum,n)=>sum+n,0);
  return <div className="min-h-screen bg-[#FFF8F6] text-[#30272B]">

    <header className="border-b border-[#eadde0] bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 lg:px-8"><a href="/" className="text-2xl font-extrabold tracking-tight text-[#75152F]">Personaliz<span className="text-[#819B87]">ê</span> <span className="text-[#F29BAA]">✦</span></a><a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#75152F]"><ArrowLeft size={17}/> Voltar à loja</a></div></header>
    <main className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <span className="text-xs font-bold uppercase tracking-[.2em] text-[#819B87]">Catálogo completo</span>
      <h1 className="mt-2 font-serif text-4xl text-[#75152F] sm:text-5xl">Todos os produtos</h1>
      <p className="mt-3 text-sm text-[#77676b]">Encontre convites e personalizados para seu momento especial.</p>
      <div className="mt-7 grid gap-3 md:grid-cols-[1fr_220px]">
        <label className="flex items-center gap-3 rounded-xl border border-[#e6d5d9] bg-white px-4 py-3"><Search size={19} className="text-[#75152F]"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pesquisar pelo nome do produto..." className="w-full bg-transparent text-sm outline-none" aria-label="Pesquisar produtos"/></label>
        <label className="flex items-center gap-2 rounded-xl border border-[#e6d5d9] bg-white px-3"><SlidersHorizontal size={18} className="text-[#75152F]"/><select aria-label="Ordenar produtos" value={sort} onChange={e=>setSort(e.target.value)} className="w-full bg-white py-3 text-sm outline-none"><option value="default">Ordenar produtos</option><option value="low">Menor preço</option><option value="high">Maior preço</option></select></label>
      </div>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-3">{categories.map(name=><button key={name} onClick={()=>setCategory(name)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold ${category===name?"border-[#75152F] bg-[#75152F] text-white":"border-[#e9d9dc] bg-white text-[#654b54]"}`}>{name}</button>)}</div>
      <p className="mb-5 text-sm text-[#806e74]">{filtered.length} produto(s) encontrado(s) • Sacola de demonstração: {count} item(ns)</p>
      {filtered.length===0?<div className="rounded-2xl bg-white p-10 text-center text-[#75152F]">Nenhum produto encontrado. Tente outra busca ou categoria.</div>:<div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">{filtered.map(item=><article key={item.id} className="overflow-hidden rounded-2xl border border-[#eddee0] bg-white shadow-sm"><div className={`relative flex aspect-square items-center justify-center bg-gradient-to-br text-6xl sm:text-8xl ${item.gradient}`}><span role="img" aria-label={item.name}>{item.emoji}</span>{item.badge&&<span className="absolute left-2 top-2 rounded-full bg-[#75152F] px-2.5 py-1 text-[10px] font-bold text-white">{item.badge}</span>}</div><div className="p-3 sm:p-4"><p className="text-xs font-semibold text-[#819B87]">{item.category}</p><h2 className="mt-1 min-h-10 text-sm font-semibold sm:text-base">{item.name}</h2>{item.old&&<p className="mt-2 text-xs text-[#a19598] line-through">{money(item.old)}</p>}<p className="mt-1 text-xl font-extrabold text-[#75152F]">{money(item.price)}</p><p className="mt-1 text-[11px] text-[#86777b]">Preço ilustrativo</p><button onClick={()=>setCart(current=>({...current,[item.id]:(current[item.id]||0)+1}))} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#75152F] px-2 py-3 text-xs font-bold text-white sm:text-sm"><ShoppingBag size={16}/> {cart[item.id]?"Adicionado ("+cart[item.id]+")":"Adicionar à sacola"}</button></div></article>)}</div>}
      <p className="mt-8 text-center text-xs text-[#8b7b7f]">Catálogo demonstrativo. O carrinho real e o pagamento serão configurados nas próximas etapas.</p>
    </main>
    <footer className="bg-[#461222] px-4 py-3 text-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-3"><span className="font-bold">Personalizê ✦</span><div className="flex gap-8 text-sm"><a href="https://wa.me/5571986691076" target="_blank" rel="noopener noreferrer">Entre em contato</a><a href="/administrador">Admin</a></div></div></footer>
  </div>;
}
