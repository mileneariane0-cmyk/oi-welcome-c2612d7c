import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/produto/$id")({ component: ProductDetail });
type Product = { id:string; name:string; description:string; price:number; product_type:string; category_id:string|null; published:boolean };
const samples = [
 ["Convite digital interativo floral","Convites digitais",49.9,"💌"],
 ["Kit festa personalizado","Personalizados",89.9,"🎉"],
 ["Convite de casamento elegante","Casamento",59.9,"💍"],
 ["Topo de bolo personalizado","Aniversário",24.9,"🎂"],
 ["Convite chá de bebê delicado","Chá de bebê",44.9,"🧸"],
 ["Tags e adesivos personalizados","Papelaria",19.9,"🎀"],
 ["Convite digital de aniversário","Convites digitais",39.9,"🎈"],
 ["Lembrancinha personalizada","Personalizados",34.9,"🎁"],
] as const;
const money=(n:number)=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
function ProductDetail(){
 const {id}=Route.useParams();
 const [product,setProduct]=useState<Product|null>(null);
 const [loading,setLoading]=useState(true);
 const [terms,setTerms]=useState(false);
 const [loginPrompt,setLoginPrompt]=useState(false);
 const [variants,setVariants]=useState<{id:string;name:string;price:number|null}[]>([]);
 const [variant,setVariant]=useState("");
 const [message,setMessage]=useState("");
 const sampleIndex=Number(id)-1;
 const sample=Number.isInteger(sampleIndex)&&sampleIndex>=0&&sampleIndex<samples.length?samples[sampleIndex]:null;
 useEffect(()=>{let active=true;setLoading(true);setProduct(null);setVariants([]);setVariant("");setTerms(false);
  if(sample){setLoading(false);return;}
  supabase.from("products").select("id,name,description,price,product_type,category_id,published").eq("id",id).eq("published",true).maybeSingle().then(({data})=>{if(!active)return;setProduct(data as Product|null);setLoading(false);if(data)supabase.from("product_variants").select("id,name,price").eq("product_id",id).then(({data:v})=>{if(active)setVariants((v??[]) as typeof variants);});});
  return ()=>{active=false;};
 },[id]);
 const name=sample?.[0]??product?.name;
 const price=sample?.[2]??Number(product?.price??0);
 const chosen=variants.find(v=>v.id===variant);
 const finalPrice=chosen?.price==null?price:Number(chosen.price);
 async function buy(){
  setMessage("");
  if(!terms){setMessage("Leia e aceite os termos e condições para continuar.");return;}
  if(variants.length>0&&!variant){setMessage("Selecione uma variação do produto.");return;}
  const {data,error}=await supabase.auth.getUser();
  if(error||!data.user){setLoginPrompt(true);return;}
  setMessage("Produto selecionado! A finalização de pedidos e a sacola persistente serão disponibilizadas em breve.");
 }
 const related=samples.map((item,i)=>({item,id:i+1})).filter(x=>String(x.id)!==id).sort((a,b)=>Number(b.item[1]===sample?.[1])-Number(a.item[1]===sample?.[1])).slice(0,4);
 return <div className="min-h-screen bg-[#FFF8F6] text-[#30272B]">
 <header className="border-b border-[#eadde0] bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4"><Link to="/"><BrandLogo/></Link><Link to="/minha-conta" className="text-sm font-bold text-[#75152F]">Minha Conta</Link></div></header>
 <main className="mx-auto max-w-6xl px-4 py-8"><Link to="/produtos" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#75152F]"><ArrowLeft size={16}/> Voltar aos produtos</Link>
 {loading?<p>Carregando produto...</p>:!name?<p>Produto não encontrado ou indisponível.</p>:<><div className="grid gap-7 md:grid-cols-2">
 <div className="flex min-h-[290px] items-center justify-center rounded-3xl bg-gradient-to-br from-[#f0d8dd] via-[#fff0eb] to-[#e7e9dd] text-8xl">{sample?.[3]??"🎁"}</div>
 <section className="rounded-3xl border border-[#efdee1] bg-white p-6"><p className="text-xs font-bold uppercase tracking-wider text-[#819B87]">{sample?.[1]??(product?.product_type==="digital"?"Produto digital":"Produto personalizado")}</p><h1 className="mt-2 font-serif text-3xl text-[#75152F]">{name}</h1><p className="mt-5 text-3xl font-bold text-[#75152F]">{money(finalPrice)}</p><h2 className="mt-6 font-semibold">Sobre este produto</h2><p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#77676d]">{product?.description||"Produto demonstrativo. As informações completas de personalização e entrega serão disponibilizadas pelo administrador."}</p>
 {variants.length>0&&<label className="mt-5 block text-sm font-bold">Escolha uma variação<select value={variant} onChange={e=>setVariant(e.target.value)} className="mt-2 w-full rounded-xl border border-[#ead9dd] bg-white p-3"><option value="">Selecione uma opção</option>{variants.map(v=><option key={v.id} value={v.id}>{v.name}{v.price!=null?" — "+money(Number(v.price)):""}</option>)}</select></label>}
 <label className="mt-6 flex items-start gap-3 text-sm leading-6"><input type="checkbox" checked={terms} onChange={e=>setTerms(e.target.checked)} className="mt-1 accent-[#75152F]"/><span>Li e concordo com os termos e condições da compra e com as informações de personalização deste produto.</span></label>
 <button onClick={()=>void buy()} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#75152F] px-5 py-4 font-bold text-white"><ShoppingBag size={18}/> Adicionar à sacola</button>
 {message&&<p role="status" className="mt-3 text-sm text-[#75152F]">{message}</p>}</section></div>
 <section className="mt-14"><h2 className="font-serif text-3xl text-[#75152F]">Você também pode gostar</h2><p className="mt-2 text-sm text-[#77676d]">Conheça outras opções da Personalizê.</p><div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">{related.map(({item,id:relatedId})=><Link key={relatedId} to="/produto/$id" params={{id:String(relatedId)}} className="flex flex-col overflow-hidden rounded-2xl border border-[#eadde0] bg-white"><div className="flex aspect-square items-center justify-center bg-[#f7e9ec] text-6xl">{item[3]}</div><div className="flex flex-1 flex-col p-4"><p className="text-xs text-[#819B87]">{item[1]}</p><h3 className="mt-2 text-sm font-semibold">{item[0]}</h3><p className="mt-auto pt-4 font-bold text-[#75152F]">{money(item[2])}</p><span className="mt-3 text-xs font-bold text-[#75152F]">Ver detalhes</span></div></Link>)}</div></section></>}
 </main>
 {loginPrompt&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"><section role="dialog" aria-modal="true" aria-label="Entre na sua conta" className="w-full max-w-sm rounded-3xl bg-white p-7 text-center"><h2 className="font-serif text-2xl text-[#75152F]">Entre na sua conta</h2><p className="mt-3 text-sm">Para continuar, entre ou cadastre-se na Personalizê.</p><div className="mt-6 flex gap-3"><button onClick={()=>setLoginPrompt(false)} className="flex-1 rounded-xl border p-3">Agora não</button><Link to="/minha-conta" className="flex-1 rounded-xl bg-[#75152F] p-3 font-bold text-white">Sim, continuar</Link></div></section></div>}
 </div>;
}
