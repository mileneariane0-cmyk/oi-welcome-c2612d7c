import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import {useSuspenseQuery} from "@tanstack/react-query";
import {catalogQuery} from "@/lib/catalog.functions";
import {variantGroups,selectedPrice} from "@/lib/catalog";
import {readBag,writeBag,addBagEntry,savePendingSelection,pendingSelection} from "@/lib/bag";
import {ProductMedia} from "@/components/product-media";
import {Button} from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/produto/$id")({ loader:({context})=>context.queryClient.ensureQueryData(catalogQuery), component: ProductDetail, head: ({ params, loaderData }) => { const product=loaderData?.products.find(p=>p.id===params.id||p.slug===params.id); const title=product?`${product.name} | Personalizê`:"Produto indisponível | Personalizê"; return { meta: [
 { title: title },
 { name: "description", content: "Confira os detalhes do produto personalizado da Personalizê." },
 { property: "og:title", content: title },
 { property: "og:description", content: "Confira os detalhes do produto personalizado da Personalizê." },
 { property: "og:type", content: "website" },
 { name: "twitter:card", content: "summary" },
] }; } });
const money=(n:number)=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
function ProductDetail(){
 const {id}=Route.useParams();
 const {data:catalog}=useSuspenseQuery(catalogQuery);
 const product=catalog.products.find(p=>p.id===id||p.slug===id);
 const [addedPrompt,setAddedPrompt]=useState(false),[loginPrompt,setLoginPrompt]=useState(false);
 const [selected,setSelected]=useState<Record<string,string>>({});
 const [quantity,setQuantity]=useState(1),[personalization,setPersonalization]=useState(""),[mediaIndex,setMediaIndex]=useState(0),[message,setMessage]=useState("");
 useEffect(()=>{const pending=pendingSelection(product?.id??id);setSelected(pending?.selected??{});setQuantity(pending?.quantity??1);setPersonalization(pending?.personalization??"");setMediaIndex(0);},[id,product?.id]);
 const groups=variantGroups(product?.variants??[]);
 const finalPrice=selectedPrice(product?.price??0,product?.variants??[],selected);
 const related=catalog.products.filter(p=>p.id!==product?.id).sort((a,b)=>Number(b.category_id===product?.category_id)-Number(a.category_id===product?.category_id)).slice(0,4);
 async function buy(){
  setMessage("");if(!product)return;
  const {data,error}=await supabase.auth.getUser();if(error||!data.user){savePendingSelection(product.id,quantity,selected,personalization);sessionStorage.setItem('personalize-shopping-return',`/produto/${product.id}`);setLoginPrompt(true);return;}
  if(groups.some(g=>g.required&&!selected[g.name])){setMessage("Selecione uma opção de cada grupo obrigatório.");return;}
  try{writeBag(data.user.id,addBagEntry(readBag(data.user.id),product.id,quantity,selected,personalization));setAddedPrompt(true);}catch{setMessage("Não foi possível atualizar a sacola neste dispositivo.");}
 }
 return <div className="min-h-screen bg-[#FFF8F6] text-[#30272B]">
 <header className="border-b border-[#eadde0] bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4"><Link to="/"><BrandLogo/></Link><Link to="/minha-conta" className="text-sm font-bold text-[#75152F]">Minha Conta</Link></div></header>
 <main className="mx-auto max-w-6xl px-4 py-8"><Link to="/produtos" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#75152F]"><ArrowLeft size={16}/> Voltar aos produtos</Link>
 {!product?<p>Produto não encontrado ou indisponível.</p>:<><div className="grid gap-7 md:grid-cols-2">
 <div><div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-accent text-8xl"><ProductMedia media={product.media[mediaIndex]} emoji={product.emoji} name={product.name} controls/></div><div className="mt-3 flex gap-2 overflow-x-auto">{product.media.map((m,i)=><Button key={m.id} variant="outline" onClick={()=>setMediaIndex(i)} aria-label={`Mídia ${i+1}`} className="h-20 w-20 shrink-0 overflow-hidden p-1"><ProductMedia media={m} name={product.name}/></Button>)}</div></div>
 <section className="rounded-3xl border border-[#efdee1] bg-white p-6"><p className="text-xs font-bold uppercase tracking-wider text-[#819B87]">{product.category}</p><h1 className="mt-2 font-serif text-3xl text-[#75152F]">{product.name}</h1><p className="mt-5 text-3xl font-bold text-[#75152F]">{money(finalPrice)}</p><h2 className="mt-6 font-semibold">Sobre este produto</h2><p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#77676d]">{product.description}</p>
 {product.old&&<p className="text-muted-foreground line-through">{money(product.old)}</p>}
 {groups.map(group=><label key={group.name} className="mt-5 block text-sm font-bold">{group.name}{group.required?" *":" (opcional)"}<select value={selected[group.name]??""} onChange={e=>setSelected(v=>({...v,[group.name]:e.target.value}))} className="mt-2 w-full rounded-lg border bg-card p-3"><option value="">Selecione uma opção</option>{group.options.map(v=><option key={v.id} value={v.id}>{v.name}{v.price!=null?" — "+money(Number(v.price)):""}</option>)}</select></label>)}
 {product.personalization_instructions&&<p className="mt-5 whitespace-pre-line text-sm">{product.personalization_instructions}</p>}
 <label className="mt-5 block text-sm font-bold">Personalização<textarea maxLength={5000} value={personalization} onChange={e=>setPersonalization(e.target.value)} className="mt-2 w-full rounded-lg border p-3"/></label>
 <label className="mt-4 block text-sm font-bold">Quantidade<input type="number" min="1" max="999" value={quantity} onChange={e=>setQuantity(Math.max(1,Math.min(999,Number(e.target.value)||1)))} className="ml-3 w-20 rounded-lg border p-2"/></label>
 <Button onClick={()=>void buy()} className="mt-5 h-12 w-full"><ShoppingBag size={18}/> Adicionar à sacola</Button>
 {message&&<p role="status" className="mt-3 text-sm text-[#75152F]">{message}</p>}</section></div>
 <section className="mt-14"><h2 className="font-serif text-3xl text-[#75152F]">Você também pode gostar</h2><p className="mt-2 text-sm text-[#77676d]">Conheça outras opções da Personalizê.</p><div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">{related.map(item=><Link key={item.id} to="/produto/$id" params={{id:item.id}} className="flex flex-col overflow-hidden rounded-2xl border border-[#eadde0] bg-white"><div className="flex aspect-square items-center justify-center bg-[#f7e9ec] text-6xl"><ProductMedia media={item.media[0]} emoji={item.emoji} name={item.name}/></div><div className="flex flex-1 flex-col p-4"><p className="text-xs text-[#819B87]">{item.category}</p><h3 className="mt-2 text-sm font-semibold">{item.name}</h3><p className="mt-auto pt-4 font-bold text-[#75152F]">{money(item.price)}</p><span className="mt-3 text-xs font-bold text-[#75152F]">Ver detalhes</span></div></Link>)}</div></section></>}
 </main>
 {addedPrompt&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"><section role="dialog" aria-modal="true" aria-labelledby="added-title" className="w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-xl"><h2 id="added-title" className="font-serif text-2xl text-[#75152F]">Produto adicionado à sacola!</h2><p className="mt-3 text-sm text-[#77676d]">Deseja continuar comprando ou ir para a sacola?</p><div className="mt-6 flex flex-col gap-3"><Button variant="outline" onClick={()=>setAddedPrompt(false)} className="rounded-xl border border-[#75152F] px-4 py-3 font-bold text-[#75152F]">Continuar comprando</Button><a href="/sacola" className="rounded-xl bg-[#75152F] px-4 py-3 font-bold text-white">Ir para a sacola</a></div></section></div>}
 {loginPrompt&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"><section role="dialog" aria-modal="true" aria-label="Entre na sua conta" className="w-full max-w-sm rounded-3xl bg-white p-7 text-center"><h2 className="font-serif text-2xl text-[#75152F]">Entre na sua conta</h2><p className="mt-3 text-sm">Para continuar, entre ou cadastre-se na Personalizê.</p><div className="mt-6 flex gap-3"><Button variant="outline" onClick={()=>setLoginPrompt(false)} className="flex-1 rounded-xl border p-3">Agora não</Button><Link to="/minha-conta" className="flex-1 rounded-xl bg-[#75152F] p-3 font-bold text-white">Sim, continuar</Link></div></section></div>}
 </div>;
}
