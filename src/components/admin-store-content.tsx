import {useEffect,useState,type FormEvent} from "react";
import {supabase} from "@/integrations/supabase/client";

type ContentKey="terms"|"home"|"contact";
type StoreContent={key:ContentKey;content:{title?:string;body?:string;subtitle?:string};published:boolean;updated_at?:string};
const defaults:Record<ContentKey,StoreContent>={
 terms:{key:"terms",content:{title:"Termos e condições da Personalizê",body:""},published:false},
 home:{key:"home",content:{title:"Personalizê",subtitle:"Cada detalhe é único.",body:""},published:false},
 contact:{key:"contact",content:{title:"Contato",subtitle:"",body:""},published:false}
};
export function AdminStoreContent({section}:{section:ContentKey}){
 const [record,setRecord]=useState<StoreContent>(defaults[section]);
 const [loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[error,setError]=useState(""),[message,setMessage]=useState("");
 useEffect(()=>{let mounted=true;setLoading(true);setError("");setMessage("");
  supabase.from("store_content").select("key,content,published,updated_at").eq("key",section).maybeSingle().then(({data,error})=>{
   if(!mounted)return;
   if(error)setError("Não foi possível carregar as configurações. A tabela store_content pode ainda não existir no Cloud.");
   else if(data){const c=data.content&&typeof data.content==="object"&&!Array.isArray(data.content)?data.content:{};setRecord({key:section,content:{title:String("title" in c?c["title"]??"":""),subtitle:String("subtitle" in c?c["subtitle"]??"":""),body:String("body" in c?c["body"]??"":"")},published:data.published,updated_at:data.updated_at});}
   else setRecord(defaults[section]);setLoading(false);
  });return()=>{mounted=false;};
 },[section]);
 async function save(e:FormEvent){e.preventDefault();setSaving(true);setError("");setMessage("");
  const {error}=await supabase.from("store_content").upsert({key:section,content:record.content,published:record.published,updated_at:new Date().toISOString()},{onConflict:"key"});
  setSaving(false);if(error){setError("Não foi possível salvar. Verifique a migração e as permissões do Cloud.");return;}setMessage("Alterações salvas com sucesso.");
 }
 const update=(field:"title"|"subtitle"|"body",value:string)=>setRecord(r=>({...r,content:{...r.content,[field]:value}}));
 return <section className="space-y-5"><div><h2 className="font-serif text-3xl text-[#75152F]">{section==="terms"?"Termos e condições":section==="home"?"Personalizar site":"Informações de contato"}</h2><p className="mt-2 text-sm text-[#77676d]">{section==="terms"?"Um único texto para todos os produtos, exibido na sacola antes da finalização.":section==="home"?"Edite os textos principais da loja, sem alterar as páginas de convites. Banners e categorias são gerenciados nas abas próprias.":"Edite os dados e orientações de contato da loja."}</p></div>
 {error&&<p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}{message&&<p role="status" className="rounded-xl bg-[#eaf3e9] p-4 text-sm text-[#38563c]">{message}</p>}
 {loading?<p>Carregando configurações...</p>:<form onSubmit={save} className="space-y-5 rounded-2xl border bg-white p-5 sm:p-7">
 <label className="block text-sm font-semibold">Título<input maxLength={180} value={record.content["title"]??""} onChange={e=>update("title",e.target.value)} className="mt-2 w-full rounded-xl border p-3"/></label>
 {section!=="terms"&&<label className="block text-sm font-semibold">Subtítulo<input maxLength={300} value={record.content["subtitle"]??""} onChange={e=>update("subtitle",e.target.value)} className="mt-2 w-full rounded-xl border p-3"/></label>}
 <label className="block text-sm font-semibold">{section==="terms"?"Texto completo dos termos":"Texto de apresentação"}<textarea rows={section==="terms"?17:8} maxLength={30000} value={record.content["body"]??""} onChange={e=>update("body",e.target.value)} placeholder={section==="terms"?"Escreva as condições de compra, personalização, prazos, revisões, pagamento, cancelamentos, entrega e privacidade.": "Escreva o conteúdo desta seção."} className="mt-2 w-full rounded-xl border p-3 font-normal leading-7"/></label>
 <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={record.published} onChange={e=>setRecord(r=>({...r,published:e.target.checked}))} className="accent-[#75152F]"/> Publicar este conteúdo no site</label>
 {section==="terms"&&<p className="text-xs leading-5 text-[#77676d]">Revise os termos juridicamente antes de publicar. A publicação não habilita automaticamente o checkout. O texto publicado será usado para todos os produtos.</p>}
 <div className="flex flex-wrap items-center gap-3"><button disabled={saving} className="rounded-xl bg-[#75152F] px-5 py-3 font-bold text-white disabled:opacity-50">{saving?"Salvando...":"Salvar alterações"}</button>{record.updated_at&&<span className="text-xs text-gray-500">Última atualização: {new Date(record.updated_at).toLocaleString("pt-BR")}</span>}</div>
 </form>}</section>;
}
