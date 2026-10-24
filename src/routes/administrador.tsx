import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, LockKeyhole } from "lucide-react";

export const Route = createFileRoute("/administrador")({ component: AdminEntry });

function AdminEntry() {
  return <main className="flex min-h-screen items-center justify-center bg-[#FFF8F6] px-5 py-12 text-[#30272B]"><section className="w-full max-w-lg rounded-3xl border border-[#ecdce0] bg-white p-8 text-center shadow-sm"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f8e6ea] text-[#75152F]"><LockKeyhole size={28}/></div><h1 className="mt-5 font-serif text-3xl text-[#75152F]">Administrador</h1><p className="mt-4 text-sm leading-7 text-[#75666b]">A área administrativa da Personalizê será configurada na próxima etapa, com autenticação segura e acesso restrito. Nenhum dado administrativo está disponível nesta página.</p><a href="/" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#75152F] px-6 py-3 text-sm font-semibold text-white"><ArrowLeft size={16}/> Voltar à loja</a></section></main>;
}
