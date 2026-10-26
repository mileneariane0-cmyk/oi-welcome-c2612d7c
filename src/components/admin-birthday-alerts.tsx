import {useEffect,useState} from "react";
import {Bell,Gift} from "lucide-react";
import {supabase} from "@/integrations/supabase/client";
type Customer={id:string;name:string;phone:string|null;birth_date:string|null};
function localDate(){const parts=new Intl.DateTimeFormat("en-US",{timeZone:"America/Bahia",month:"2-digit",day:"2-digit"}).formatToParts(new Date());return {month:parts.find(p=>p.type==="month")?.value,day:parts.find(p=>p.type==="day")?.value};}
export function AdminBirthdayAlerts(){
 const [customers,setCustomers]=useState<Customer[]>([]);
 const [open,setOpen]=useState(false);
 const [error,setError]=useState(false);
 useEffect(()=>{let active=true;supabase.from("customers").select("id,name,phone,birth_date").not("birth_date","is",null).then(({data,error})=>{if(active){setCustomers((data??[]) as Customer[]);setError(Boolean(error));}});return()=>{active=false;};},[]);
 const {month,day}=localDate();
 const birthdays=customers.filter(c=>c.birth_date?.slice(5,7)===month&&c.birth_date?.slice(8,10)===day);
 return <div className="relative"><button onClick={()=>setOpen(v=>!v)} aria-label={`Notificações de aniversário: ${birthdays.length}`} aria-expanded={open} className="relative rounded-lg p-2 text-[#75152F] hover:bg-[#f9edf0]"><Bell size={20}/>{birthdays.length>0&&<span className="absolute -right-1 -top-1 rounded-full bg-[#75152F] px-1.5 text-[10px] font-bold text-white">{birthdays.length}</span>}</button>{open&&<div className="absolute right-0 top-12 z-50 w-[min(90vw,340px)] rounded-2xl border border-[#eadce0] bg-white p-4 shadow-xl"><h3 className="flex items-center gap-2 font-serif text-lg text-[#75152F]"><Gift size={18}/> Aniversariantes de hoje</h3>{error?<p className="mt-3 text-sm">Não foi possível consultar os aniversários.</p>:birthdays.length===0?<p className="mt-3 text-sm text-[#77676d]">Nenhum aniversário registrado para hoje.</p>:<div className="mt-3 space-y-3">{birthdays.map(c=>{const digits=(c.phone??"").replace(/\D/g,"");const phone=digits.length===10||digits.length===11?"55"+digits:digits;const valid=phone.length>=12&&phone.length<=13;const message=encodeURIComponent(`Olá, ${c.name}! 🎉 A Personalizê deseja um feliz aniversário! Que seu dia seja cheio de alegria e momentos especiais! 💗`);return <div key={c.id} className="rounded-xl bg-[#FFF8F6] p-3"><p className="text-sm font-bold">{c.name}</p>{valid?<a href={`https://wa.me/${phone}?text=${message}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs font-bold text-[#75152F] underline">Preparar mensagem no WhatsApp</a>:<p className="mt-1 text-xs text-[#77676d]">Cadastre um WhatsApp válido para enviar a mensagem.</p>}</div>;})}</div>}</div>}</div>;
}
