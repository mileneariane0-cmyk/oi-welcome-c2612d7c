import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/sacola")({component: Bag, ssr:false});
const products=[
 {id:1,name:"Convite digital interativo floral",price:49.9,emoji:"💌"},
 {id:2,name:"Kit festa personalizado",price:89.9,emoji:"🎉"},
 {id:3,name:"Convite de casamento elegante",price:59.9,emoji:"💍"},
 {id:4,name:"Topo de bolo personalizado",price:24.9,emoji:"🎂"},
 {id:5,name:"Convite chá de bebê delicado",price:44.9,emoji:"🧸"},
 {id:6,name:"Tags e adesivos personalizados",price:19.9,emoji:"🎀"},
 {id:7,name:"Convite digital de aniversário",price:39.9,emoji:"🎈"},
 {id:8,name:"Lembrancinha personalizada",price:34.9,emoji:"🎁"},
];
const money=(n:number)=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
function Bag(){
 const [userId,setUserId]=useState<string|null>(null);
 const [loading,setLoading]=useState(true);
 const [cart,setCart]=useState<Record<string,number>>({});
 const [terms,setTerms]=useState(false);
 useEffect(()=>{let active=true;supabase.auth.getUser().then(({data})=>{if(!active)return;const id=data.user?.id??null;setUserId(id);if(id){try{const saved=JSON.parse(localStorage.getItem(`personalize_demo_bag_${id}`)||"{}");if(saved&&typeof saved==="object")setCart(saved);}catch{setCart({});}}setLoading(false);});return()=>{active=false;};},[]);
 function change(id:number,delta:number){setCart(current=>{const next={...current};const quantity=Math.max(0,(Number(current[id])||0)+delta);if(quantity===0)delete next[id];else next[id]=quantity;if(userId)try{localStorage.setItem(`personalize_demo_bag_${userId}`,JSON.stringify(next));}catch{}return next;});}
 const entries=products.filter(p=>Number(cart[p.id])>0);
 const total=entries.reduce((sum,p)=>sum+p.price*Number(cart[p.id]),0);
 return <div className="min-h-screen bg-[#FFF8F6] text-[#30272B]"><header className="border-b border-[#eadde0] bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4"><Link to="/"><BrandLogo/></Link><Link to="/minha-conta" className="text-sm font-semibold text-[#75152F]">Minha Conta</Link></div></header>
 <main className="mx-auto max-w-6xl px-4 py-8"><Link to="/produtos" className="inline-flex items-center gap-2 text-sm font-semibold text-[#75152F]"><ArrowLeft size={17}/> Continuar comprando</Link><h1 className="mt-6 flex items-center gap-3 font-serif text-4xl text-[#75152F]"><ShoppingBag/> Minha sacola</h1>
 {loading?<p className="mt-8">Carregando sacola...</p>:!userId?<section className="mt-8 rounded-2xl bg-white p-7"><p>Entre na sua conta para visualizar sua sacola.</p><Link to="/minha-conta" className="mt-4 inline-block rounded-xl bg-[#75152F] px-5 py-3 font-bold text-white">Entrar ou cadastrar</Link></section>:entries.length===0?<section className="mt-8 rounded-2xl bg-white p-8 text-center"><p>Sua sacola está vazia.</p><Link to="/produtos" className="mt-5 inline-block rounded-xl bg-[#75152F] px-5 py-3 font-bold text-white">Ver produtos</Link></section>:<div className="mt-8 grid gap-6 lg:grid-cols-[1fr_330px]"><section className="space-y-3">{entries.map(p=><article key={p.id} className="flex items-center gap-4 rounded-2xl border border-[#eadde0] bg-white p-4"><Link to="/produto/$id" params={{id:String(p.id)}} className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[#f8e9ec] text-4xl">{p.emoji}</Link><div className="min-w-0 flex-1"><Link to="/produto/$id" params={{id:String(p.id)}} className="text-sm font-bold">{p.name}</Link><p className="mt-1 font-semibold text-[#75152F]">{money(p.price)}</p><div className="mt-3 flex items-center gap-3"><button aria-label="Diminuir quantidade" onClick={()=>change(p.id,-1)} className="rounded-lg border p-1"><Minus size={16}/></button><span>{cart[p.id]}</span><button aria-label="Aumentar quantidade" onClick={()=>change(p.id,1)} className="rounded-lg border p-1"><Plus size={16}/></button><button aria-label="Excluir produto" onClick={()=>change(p.id,-Number(cart[p.id]))} className="ml-auto text-[#75152F]"><Trash2 size={18}/></button></div></div></article>)}</section><aside className="h-fit rounded-2xl border border-[#eadde0] bg-white p-5"><h2 className="font-serif text-2xl text-[#75152F]">Resumo do pedido</h2><div className="mt-5 flex justify-between font-bold"><span>Subtotal</span><span>{money(total)}</span></div><p className="mt-3 text-xs text-[#817177]">Valores demonstrativos. A confirmação de pedidos e o pagamento ainda não estão disponíveis.</p><label className="mt-5 flex items-start gap-2 text-sm leading-6"><input type="checkbox" checked={terms} onChange={e=>setTerms(e.target.checked)} className="mt-1 accent-[#75152F]"/><span>Li e concordo com os termos e condições da compra e personalização.</span></label><button disabled className="mt-5 w-full rounded-xl bg-[#75152F] px-5 py-3 font-bold text-white opacity-50">Finalizar pedido — em breve</button></aside></div>}
 </main></div>;
}
