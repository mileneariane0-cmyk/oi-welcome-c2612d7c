import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import {useSuspenseQuery} from "@tanstack/react-query";
import {catalogQuery} from "@/lib/catalog.functions";
import {selectedPrice} from "@/lib/catalog";
import {readBag,writeBag,type BagEntry} from "@/lib/bag";
import {ProductMedia} from "@/components/product-media";
import {Button} from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/sacola")({loader:({context})=>context.queryClient.ensureQueryData(catalogQuery),component: Bag, ssr:false, head: () => ({ meta: [
 { title: "Minha sacola | Personalizê" },
 { name: "description", content: "Confira os produtos e o resumo da sua sacola na Personalizê." },
 { property: "og:title", content: "Minha sacola | Personalizê" },
 { property: "og:description", content: "Confira os produtos e o resumo da sua sacola na Personalizê." },
 { property: "og:type", content: "website" },
 { name: "twitter:card", content: "summary" },
] }) });
const money=(n:number)=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
function Bag(){
 const {data:catalog}=useSuspenseQuery(catalogQuery);
 const [userId,setUserId]=useState<string|null>(null),[loading,setLoading]=useState(true);
 const [cart,setCart]=useState<BagEntry[]>([]),[terms,setTerms]=useState(false);
 useEffect(()=>{let active=true;supabase.auth.getUser().then(({data})=>{if(!active)return;const id=data.user?.id??null;setUserId(id);if(id)setCart(readBag(id));setLoading(false);});return()=>{active=false;};},[]);
 function change(key:string,delta:number){if(!userId)return;setCart(current=>{const next=current.map(e=>e.key===key?{...e,quantity:Math.max(0,e.quantity+delta)}:e).filter(e=>e.quantity>0);writeBag(userId,next);return next;});}
 const entries=cart.map(e=>{const p=catalog.products.find(p=>p.id===e.productId);return {...e,product:p,price:p?selectedPrice(p.price,p.variants,e.selected):0};});
 const total=entries.reduce((sum,e)=>sum+e.price*e.quantity,0);
 return <div className="min-h-screen bg-[#FFF8F6] text-[#30272B]"><header className="border-b border-[#eadde0] bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4"><Link to="/"><BrandLogo/></Link><Link to="/minha-conta" className="text-sm font-semibold text-[#75152F]">Minha Conta</Link></div></header>
 <main className="mx-auto max-w-6xl px-4 py-8"><Link to="/produtos" className="inline-flex items-center gap-2 text-sm font-semibold text-[#75152F]"><ArrowLeft size={17}/> Continuar comprando</Link><h1 className="mt-6 flex items-center gap-3 font-serif text-4xl text-[#75152F]"><ShoppingBag/> Minha sacola</h1>
 {loading?<p className="mt-8">Carregando sacola...</p>:!userId?<section className="mt-8 rounded-2xl bg-white p-7"><p>Entre na sua conta para visualizar sua sacola.</p><Link to="/minha-conta" className="mt-4 inline-block rounded-xl bg-[#75152F] px-5 py-3 font-bold text-white">Entrar ou cadastrar</Link></section>:entries.length===0?<section className="mt-8 rounded-2xl bg-white p-8 text-center"><p>Sua sacola está vazia.</p><Link to="/produtos" className="mt-5 inline-block rounded-xl bg-[#75152F] px-5 py-3 font-bold text-white">Ver produtos</Link></section>:<div className="mt-8 grid gap-6 lg:grid-cols-[1fr_330px]"><section className="space-y-3">{entries.map(p=><article key={p.key} className="flex items-center gap-4 rounded-2xl border border-[#eadde0] bg-white p-4"><Link to="/produto/$id" params={{id:p.productId}} className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[#f8e9ec] text-4xl"><ProductMedia media={p.product?.media[0]} name={p.product?.name??"Produto indisponível"}/></Link><div className="min-w-0 flex-1"><Link to="/produto/$id" params={{id:p.productId}} className="text-sm font-bold">{p.product?.name??"Produto indisponível"}</Link><p className="mt-1 font-semibold text-[#75152F]">{money(p.price)}</p><p className="mt-2 text-xs">{Object.entries(p.selected).map(([group,id])=>`${group}: ${p.product?.variants.find(v=>v.id===id)?.name??"Opção indisponível"}`).join(" • ")}</p>{p.personalization&&<p className="text-xs">{p.personalization}</p>}<div className="mt-3 flex items-center gap-3"><Button variant="outline" size="icon" aria-label="Diminuir quantidade" onClick={()=>change(p.key,-1)} className="rounded-lg border p-1"><Minus size={16}/></Button><span>{p.quantity}</span><Button variant="outline" size="icon" aria-label="Aumentar quantidade" onClick={()=>change(p.key,1)} className="rounded-lg border p-1"><Plus size={16}/></Button><Button variant="ghost" size="icon" aria-label="Excluir produto" onClick={()=>change(p.key,-p.quantity)} className="ml-auto text-[#75152F]"><Trash2 size={18}/></Button></div></div></article>)}</section><aside className="h-fit rounded-2xl border border-[#eadde0] bg-white p-5"><h2 className="font-serif text-2xl text-[#75152F]">Resumo do pedido</h2><div className="mt-5 flex justify-between font-bold"><span>Subtotal</span><span>{money(total)}</span></div><p className="mt-3 text-xs text-[#817177]">A confirmação de pedidos e o pagamento ainda não estão disponíveis.</p><label className="mt-5 flex items-start gap-2 text-sm leading-6"><input type="checkbox" checked={terms} onChange={e=>setTerms(e.target.checked)} className="mt-1 accent-[#75152F]"/><span>Li e concordo com os termos e condições da compra e personalização.</span></label><Button disabled className="mt-5 w-full rounded-xl bg-[#75152F] px-5 py-3 font-bold text-white opacity-50">Finalizar pedido — em breve</Button></aside></div>}
 </main></div>;
}
