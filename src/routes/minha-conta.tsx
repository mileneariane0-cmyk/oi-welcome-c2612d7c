import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Eye, EyeOff, LogIn, Mail, UserRound } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/minha-conta")({
  ssr: false,
  head: () => ({ meta: [{ title: "Minha conta | Personalizê" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: CustomerAccount,
});

function CustomerAccount() {
  const navigate = useNavigate();
  const [userId,setUserId] = useState<string|null>(null);
  const [email,setEmail] = useState("");
  const [name,setName] = useState("");
  const [password,setPassword] = useState("");
  const [confirm,setConfirm] = useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [mode,setMode] = useState<"login"|"signup"|"forgot">("login");
  const [busy,setBusy] = useState(false);
  const [loading,setLoading] = useState(true);
  const [message,setMessage] = useState("");
  useEffect(()=>{
    let mounted=true;
    supabase.auth.getUser().then(({data})=>{if(mounted){setUserId(data.user?.id??null);setEmail(data.user?.email??"");setLoading(false);}});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{if(mounted){setUserId(session?.user?.id??null);setEmail(session?.user?.email??"");}});
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
        const {data,error}=await supabase.auth.signUp({email:email.trim(),password,options:{data:{display_name:name.trim()},emailRedirectTo:`${window.location.origin}/minha-conta`}});
        if(error)throw error;
        if(data.session){setUserId(data.user?.id??null);setMessage("Cadastro realizado!");}
        else setMessage("Cadastro solicitado. Confira seu e-mail para confirmar a conta, se necessário.");
      }else{
        const {data,error}=await supabase.auth.signInWithPassword({email:email.trim(),password});
        if(error)throw error;
        setUserId(data.user.id);
      }
    }catch{setMessage("Não foi possível concluir. Confira os dados e tente novamente.");}
    finally{setBusy(false);}
  }
  async function signOut(){await supabase.auth.signOut();setUserId(null);setPassword("");setMessage("");}
  return <main className="min-h-screen bg-[#FFF8F6] px-4 py-8 text-[#30272B]">
    <div className="mx-auto max-w-xl"><a href="/" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#75152F]"><ArrowLeft size={17}/> Voltar à loja</a><section className="rounded-3xl border border-[#ead9dd] bg-white p-6 shadow-sm sm:p-9"><div className="mb-7 flex justify-center"><BrandLogo className="auth-logo"/></div>
    {loading?<p className="text-center text-sm">Carregando sua conta...</p>:userId?<><div className="text-center"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f7e6eb] text-[#75152F]"><UserRound/></div><h1 className="font-serif text-3xl text-[#75152F]">Minha conta</h1><p className="mt-2 break-all text-sm text-[#786970]">{email}</p></div><div className="mt-7 grid gap-3">{[{title:"Meus pedidos",text:"Em breve: acompanhe o andamento dos seus pedidos."},{title:"Meus convites",text:"Em breve: acesse seus convites publicados e confirmações de presença."},{title:"Meus dados",text:"Em breve: gerencie seus dados de contato."}].map(item=><div key={item.title} className="rounded-xl border border-[#eadde0] bg-[#fff9f7] p-4"><h2 className="font-semibold text-[#75152F]">{item.title}</h2><p className="mt-1 text-sm text-[#7b6d72]">{item.text}</p></div>)}</div><button onClick={signOut} className="mt-6 w-full rounded-xl border border-[#75152F] px-5 py-3 text-sm font-bold text-[#75152F]">Sair da conta</button></>:<>
      <h1 className="text-center font-serif text-3xl text-[#75152F]">{mode==="login"?"Entrar na minha conta":mode==="signup"?"Criar minha conta":"Recuperar senha"}</h1><p className="mt-2 text-center text-sm text-[#817177]">{mode==="signup"?"Cadastre-se para acompanhar seus pedidos e convites.":mode==="forgot"?"Enviaremos instruções para seu e-mail.":"Acesse seus pedidos e convites em um só lugar."}</p>
      <form onSubmit={submit} className="mt-7 space-y-4">{mode==="signup"&&<div><label htmlFor="customer-name" className="mb-1 block text-sm font-semibold">Nome completo</label><input id="customer-name" required maxLength={100} value={name} onChange={e=>setName(e.target.value)} autoComplete="name" className="w-full rounded-xl border border-[#e4d3d8] px-4 py-3 outline-none focus:border-[#75152F]"/></div>}
      <div><label htmlFor="customer-email" className="mb-1 block text-sm font-semibold">E-mail</label><input id="customer-email" type="email" required maxLength={255} value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" className="w-full rounded-xl border border-[#e4d3d8] px-4 py-3 outline-none focus:border-[#75152F]"/></div>
      {mode!=="forgot"&&<div><label htmlFor="customer-password" className="mb-1 block text-sm font-semibold">Senha</label><div className="relative"><input id="customer-password" type={showPassword?"text":"password"} required minLength={8} maxLength={256} value={password} onChange={e=>setPassword(e.target.value)} autoComplete={mode==="signup"?"new-password":"current-password"} className="w-full rounded-xl border border-[#e4d3d8] px-4 py-3 pr-12 outline-none focus:border-[#75152F]"/><button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-3 text-[#75152F]" aria-label={showPassword?"Ocultar senha":"Mostrar senha"}>{showPassword?<EyeOff size={20}/>:<Eye size={20}/>}</button></div></div>}
      {mode==="signup"&&<div><label htmlFor="customer-confirm" className="mb-1 block text-sm font-semibold">Confirmar senha</label><input id="customer-confirm" type="password" required minLength={8} maxLength={256} value={confirm} onChange={e=>setConfirm(e.target.value)} autoComplete="new-password" className="w-full rounded-xl border border-[#e4d3d8] px-4 py-3 outline-none focus:border-[#75152F]"/></div>}
      <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#75152F] px-5 py-3.5 text-sm font-bold text-white disabled:opacity-50">{mode==="forgot"?<Mail size={18}/>:<LogIn size={18}/>} {busy?"Aguarde...":mode==="login"?"Entrar":mode==="signup"?"Cadastrar":"Enviar instruções"}</button></form>
      {message&&<p role="status" className="mt-4 text-center text-sm text-[#75152F]">{message}</p>}
      <div className="mt-6 flex flex-col items-center gap-3 text-sm"><button onClick={()=>{setMode(mode==="signup"?"login":"signup");setMessage("");}} className="font-semibold text-[#75152F]">{mode==="signup"?"Já tenho conta. Entrar":"Não tenho conta. Cadastrar"}</button><button onClick={()=>{setMode(mode==="forgot"?"login":"forgot");setMessage("");}} className="text-[#786970]">{mode==="forgot"?"Voltar ao login":"Esqueci minha senha"}</button></div>
    </>}</section></div>
  </main>;
}
