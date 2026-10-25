import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Eye, EyeOff, LogIn, Mail, UserRound, Package, Gift, Settings2, ChevronRight, ShoppingBag, CalendarDays, Phone, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/minha-conta")({
  ssr: false,
  head: () => ({ meta: [{ title: "Minha conta | Personalizê" }, { name: "description", content: "Acesse sua conta de cliente na Personalizê." }, { property: "og:title", content: "Minha conta | Personalizê" }, { property: "og:description", content: "Acesse sua conta de cliente na Personalizê." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: CustomerAccount,
});

function CustomerAccount() {
  const [userId,setUserId] = useState<string|null>(null);
  const [accountName,setAccountName] = useState("");
  const [accountSection,setAccountSection] = useState<"overview"|"profile">("overview");
  const [email,setEmail] = useState("");
  const [name,setName] = useState("");
  const [whatsapp,setWhatsapp] = useState("");
  const [birthday,setBirthday] = useState("");
  const [gender,setGender] = useState("");
  const [genderOther,setGenderOther] = useState("");
  const [password,setPassword] = useState("");
  const [confirm,setConfirm] = useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [mode,setMode] = useState<"login"|"signup"|"forgot">("login");
  const [busy,setBusy] = useState(false);
  const [loading,setLoading] = useState(true);
  const [message,setMessage] = useState("");
  useEffect(()=>{
    const syncUser=(user: {id:string;email?:string;user_metadata?:Record<string,unknown>}|null|undefined)=>{setUserId(user?.id??null);setEmail(user?.email??"");setAccountName(typeof user?.user_metadata?.['display_name']==="string"?user.user_metadata['display_name']:"");setName(typeof user?.user_metadata?.['display_name']==="string"?user.user_metadata['display_name']:"");setWhatsapp(typeof user?.user_metadata?.['whatsapp']==="string"?user.user_metadata['whatsapp']:"");setBirthday(typeof user?.user_metadata?.['birthday']==="string"?user.user_metadata['birthday']:"");setGender(typeof user?.user_metadata?.['gender']==="string"?user.user_metadata['gender']:"");setGenderOther(typeof user?.user_metadata?.['gender_other']==="string"?user.user_metadata['gender_other']:"");};
    let mounted=true;
    supabase.auth.getUser().then(({data})=>{if(mounted){syncUser(data.user);setLoading(false);}});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{if(mounted){syncUser(session?.user);}});
    return ()=>{mounted=false;subscription.unsubscribe();};
  },[]);
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setMessage("");
    if(!email.trim()||!email.includes("@")){setMessage("Informe um e-mail válido.");return;}
    if(mode!=="forgot"&&password.length<8){setMessage("A senha precisa ter pelo menos 8 caracteres.");return;}
    if(mode==="signup"&&(!name.trim()||name.trim().length>100)){setMessage("Informe seu nome (até 100 caracteres).");return;}
    if(mode==="signup"&&password!==confirm){setMessage("As senhas não coincidem.");return;}
    setBusy(true);
    try{
      if(mode==="forgot"){
        const {error}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:`${window.location.origin}/recuperar-conta`});
        if(error)throw error;
        setMessage("Se o e-mail estiver cadastrado, você receberá instruções para recuperar sua senha.");
      }else if(mode==="signup"){
        const {data,error}=await supabase.auth.signUp({email:email.trim(),password,options:{data:{display_name:name.trim(),whatsapp:whatsapp.replace(/\D/g,"")||null,birthday:birthday||null,gender:gender||null,gender_other:gender==="self_describe"?genderOther.trim().slice(0,80)||null:null},emailRedirectTo:`${window.location.origin}/minha-conta`}});
        if(error)throw error;
        if(data.session){setUserId(data.user?.id??null);setMessage("Cadastro realizado!");}
        else setMessage("Confirme seu cadastro pelo e-mail informado. Verifique também a caixa de spam.");
      }else{
        const {data,error}=await supabase.auth.signInWithPassword({email:email.trim(),password});
        if(error)throw error;
        setUserId(data.user.id);
      }
    }catch{setMessage("Não foi possível concluir. Confira os dados e tente novamente.");}
    finally{setBusy(false);}
  }
  async function saveProfile(e:FormEvent<HTMLFormElement>){e.preventDefault();setMessage("");if(!name.trim()){setMessage("Informe seu nome.");return;}setBusy(true);const {data,error}=await supabase.auth.updateUser({data:{display_name:name.trim(),whatsapp:whatsapp.replace(/\D/g,"")||null,birthday:birthday||null}});if(error)setMessage("Não foi possível salvar seus dados. Tente novamente.");else{setAccountName(typeof data.user.user_metadata?.['display_name']==="string"?data.user.user_metadata['display_name']:name.trim());setMessage("Seus dados foram atualizados!");}setBusy(false);}
  async function signOut(){await supabase.auth.signOut();setUserId(null);setPassword("");setMessage("");}
  return <main className="min-h-screen bg-[#FFF8F6] px-4 py-8 text-[#30272B]">
    <div className="mx-auto max-w-xl"><a href="/" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#75152F]"><ArrowLeft size={17}/> Voltar à loja</a><section className="rounded-3xl border border-[#ead9dd] bg-white p-6 shadow-sm sm:p-9">
    {loading?<p className="text-center text-sm">Carregando sua conta...</p>:userId?<div>
      <div className="flex items-center gap-3 border-b border-[#f0e2e5] pb-5"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f7e6eb] text-[#75152F]"><UserRound size={20}/></div><div className="min-w-0"><h1 className="mt-0.5 font-serif text-3xl text-[#75152F] sm:text-4xl">Olá, {accountName.trim().split(/\s+/)[0]||"cliente"}!</h1><p className="mt-1 truncate text-xs text-[#817177]">{email}</p></div></div>
      <div className="mt-5 flex flex-wrap gap-2"><button onClick={()=>{setAccountSection("overview");setMessage("");}} className={`rounded-full px-4 py-2 text-sm font-semibold ${accountSection==="overview"?"bg-[#75152F] text-white":"bg-[#f8ebef] text-[#75152F]"}`}>Visão geral</button><button onClick={()=>{setAccountSection("profile");setMessage("");}} className={`rounded-full px-4 py-2 text-sm font-semibold ${accountSection==="profile"?"bg-[#75152F] text-white":"bg-[#f8ebef] text-[#75152F]"}`}>Meus dados</button></div>
      {accountSection==="overview"?<><h2 className="mt-5 font-serif text-2xl text-[#75152F]">Minha área</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-[#eadde0] bg-[#fff9f7] p-5"><Package className="text-[#819B87]" size={25}/><h3 className="mt-4 font-semibold text-[#75152F]">Meus pedidos</h3><p className="mt-2 text-sm leading-6 text-[#7b6d72]">Em breve você poderá acompanhar cada etapa dos seus pedidos.</p><span className="mt-4 inline-block rounded-full bg-[#f5e7eb] px-3 py-1 text-xs text-[#75152F]">Em desenvolvimento</span></div><div className="rounded-2xl border border-[#eadde0] bg-[#fff9f7] p-5"><Gift className="text-[#819B87]" size={25}/><h3 className="mt-4 font-semibold text-[#75152F]">Meus convites</h3><p className="mt-2 text-sm leading-6 text-[#7b6d72]">Em breve seus convites e links exclusivos ficarão aqui.</p><span className="mt-4 inline-block rounded-full bg-[#f5e7eb] px-3 py-1 text-xs text-[#75152F]">Em desenvolvimento</span></div></div><div className="mt-5 rounded-2xl border border-[#eadde0] p-5"><div className="flex items-center gap-3"><Settings2 className="text-[#819B87]"/><h3 className="font-semibold text-[#75152F]">Meu perfil</h3></div><p className="mt-2 text-sm text-[#7b6d72]">Confira e atualize seus dados de contato.</p><button onClick={()=>{setAccountSection("profile");setMessage("");}} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#75152F]">Editar meus dados <ChevronRight size={17}/></button></div><a href="/produtos" className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#819B87] px-5 py-3 font-bold text-white"><ShoppingBag size={18}/> Continuar comprando</a></>:<div className="mt-6"><h2 className="font-serif text-2xl text-[#75152F]">Meus dados</h2><p className="mt-2 text-sm text-[#7b6d72]">Mantenha suas informações atualizadas.</p><form onSubmit={saveProfile} className="mt-5 space-y-4"><label className="block text-sm font-semibold">Nome completo<input required maxLength={100} value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full rounded-xl border border-[#e4d3d8] p-3 font-normal"/></label><label className="block text-sm font-semibold">E-mail<input readOnly value={email} className="mt-2 w-full rounded-xl border border-[#e4d3d8] bg-[#f8f4f4] p-3 font-normal text-[#786970]"/></label><label className="block text-sm font-semibold"><Phone size={15} className="mr-1 inline"/> WhatsApp (opcional)<input type="tel" maxLength={20} value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} placeholder="(71) 99999-9999" className="mt-2 w-full rounded-xl border border-[#e4d3d8] p-3 font-normal"/></label><label className="block text-sm font-semibold"><CalendarDays size={15} className="mr-1 inline"/> Aniversário (opcional)<input type="date" max={new Date().toISOString().slice(0,10)} value={birthday} onChange={e=>setBirthday(e.target.value)} className="mt-2 w-full rounded-xl border border-[#e4d3d8] bg-white p-3 font-normal"/></label><label className="block text-sm font-semibold">Gênero (opcional)<select value={gender} onChange={e=>{setGender(e.target.value);if(e.target.value!=="self_describe")setGenderOther("");}} className="mt-2 w-full rounded-xl border border-[#e4d3d8] bg-white p-3 font-normal"><option value="">Prefiro não informar</option><option value="woman">Mulher</option><option value="man">Homem</option><option value="nonbinary">Não binário</option><option value="self_describe">Prefiro me descrever</option></select></label>{gender==="self_describe"&&<label className="block text-sm font-semibold">Como você se identifica? <span className="font-normal text-[#817177]">(opcional)</span><input maxLength={80} value={genderOther} onChange={e=>setGenderOther(e.target.value)} className="mt-2 w-full rounded-xl border border-[#e4d3d8] p-3 font-normal" placeholder="Escreva como prefere se identificar"/></label>}<button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#75152F] p-3 font-bold text-white disabled:opacity-60"><CheckCircle2 size={18}/>{busy?"Salvando...":"Salvar alterações"}</button></form></div>}
      {message&&<p role="status" className="mt-4 text-center text-sm text-[#75152F]">{message}</p>}
      <button onClick={signOut} className="mt-7 w-full rounded-xl border border-[#75152F] px-5 py-3 text-sm font-bold text-[#75152F]">Sair da conta</button>
    </div>:<>
      <h1 className="text-center font-serif text-3xl text-[#75152F]">{mode==="login"?"Entrar na minha conta":mode==="signup"?"Criar minha conta":"Recuperar senha"}</h1><p className="mt-2 text-center text-sm text-[#817177]">{mode==="signup"?"Cadastre-se para acompanhar seus pedidos e convites.":mode==="forgot"?"Enviaremos instruções para seu e-mail.":"Acesse seus pedidos e convites em um só lugar."}</p>
      <form onSubmit={submit} className="mt-7 space-y-4">{mode==="signup"&&<div><label htmlFor="customer-name" className="mb-1 block text-sm font-semibold">Nome completo</label><input id="customer-name" required maxLength={100} value={name} onChange={e=>setName(e.target.value)} autoComplete="name" className="w-full rounded-xl border border-[#e4d3d8] px-4 py-3 outline-none focus:border-[#75152F]"/></div>}
      {mode==="signup"&&<><div><label htmlFor="customer-whatsapp" className="mb-1 block text-sm font-semibold">WhatsApp <span className="font-normal text-[#817177]">(opcional)</span></label><input id="customer-whatsapp" type="tel" inputMode="tel" autoComplete="tel" maxLength={16} placeholder="(71) 99999-9999" value={whatsapp} onChange={e=>{const digits=e.target.value.replace(/\D/g,"").slice(0,11);const ddd=digits.slice(0,2);const local=digits.slice(2);const formatted=digits.length<=2?digits:local.length<=4?`(${ddd}) ${local}`:`(${ddd}) ${local.slice(0,local.length===9?5:4)}-${local.slice(local.length===9?5:4)}`;setWhatsapp(formatted)}} className="w-full rounded-xl border border-[#e4d3d8] px-4 py-3 outline-none focus:border-[#75152F]"/></div><div><label htmlFor="customer-birthday" className="mb-1 block text-sm font-semibold">Data de aniversário <span className="font-normal text-[#817177]">(opcional)</span></label><input id="customer-birthday" type="date" max={new Date().toISOString().slice(0,10)} value={birthday} onChange={e=>setBirthday(e.target.value)} className="w-full rounded-xl border border-[#e4d3d8] bg-white px-4 py-3 outline-none focus:border-[#75152F]"/></div></>}
      {mode==="signup"&&<div className="space-y-3"><label className="block text-sm font-semibold">Gênero (opcional)<select value={gender} onChange={e=>{setGender(e.target.value);if(e.target.value!=="self_describe")setGenderOther("");}} className="mt-2 w-full rounded-xl border border-[#e4d3d8] bg-white p-3 font-normal"><option value="">Prefiro não informar</option><option value="woman">Mulher</option><option value="man">Homem</option><option value="nonbinary">Não binário</option><option value="self_describe">Prefiro me descrever</option></select></label>{gender==="self_describe"&&<label className="block text-sm font-semibold">Como você se identifica? <span className="font-normal text-[#817177]">(opcional)</span><input maxLength={80} value={genderOther} onChange={e=>setGenderOther(e.target.value)} className="mt-2 w-full rounded-xl border border-[#e4d3d8] p-3 font-normal" placeholder="Escreva como prefere se identificar"/></label>}</div>}
      <div><label htmlFor="customer-email" className="mb-1 block text-sm font-semibold">E-mail</label><input id="customer-email" type="email" required maxLength={255} value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" className="w-full rounded-xl border border-[#e4d3d8] px-4 py-3 outline-none focus:border-[#75152F]"/></div>
      {mode!=="forgot"&&<div><label htmlFor="customer-password" className="mb-1 block text-sm font-semibold">Senha</label><div className="relative"><input id="customer-password" type={showPassword?"text":"password"} required minLength={8} maxLength={256} value={password} onChange={e=>setPassword(e.target.value)} autoComplete={mode==="signup"?"new-password":"current-password"} className="w-full rounded-xl border border-[#e4d3d8] px-4 py-3 pr-12 outline-none focus:border-[#75152F]"/><button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-3 text-[#75152F]" aria-label={showPassword?"Ocultar senha":"Mostrar senha"}>{showPassword?<EyeOff size={20}/>:<Eye size={20}/>}</button></div></div>}
      {mode==="signup"&&<div><label htmlFor="customer-confirm" className="mb-1 block text-sm font-semibold">Confirmar senha</label><input id="customer-confirm" type="password" required minLength={8} maxLength={256} value={confirm} onChange={e=>setConfirm(e.target.value)} autoComplete="new-password" className="w-full rounded-xl border border-[#e4d3d8] px-4 py-3 outline-none focus:border-[#75152F]"/></div>}
      <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#75152F] px-5 py-3.5 text-sm font-bold text-white disabled:opacity-50">{mode==="forgot"?<Mail size={18}/>:<LogIn size={18}/>} {busy?"Aguarde...":mode==="login"?"Entrar":mode==="signup"?"Cadastrar":"Enviar instruções"}</button></form>
      {message&&<p role="status" className="mt-4 text-center text-sm text-[#75152F]">{message}</p>}
      <div className="mt-6 flex flex-col items-center gap-3 text-sm"><button onClick={()=>{setMode(mode==="signup"?"login":"signup");setMessage("");}} className="font-semibold text-[#75152F]">{mode==="signup"?"Já tenho conta. Entrar":"Não tenho conta. Cadastrar"}</button><button onClick={()=>{setMode(mode==="forgot"?"login":"forgot");setMessage("");}} className="text-[#786970]">{mode==="forgot"?"Voltar ao login":"Esqueci minha senha"}</button></div>
    </>}</section></div>
  </main>;
}
