import type {ReactNode} from "react";
import {CalendarDays,MapPin} from "lucide-react";
import type {Block} from "@/lib/invitation-blocks";
type Media={id:string;url?:string|undefined;type:string};
const sizes={heading:{sm:"text-2xl",md:"text-4xl",lg:"text-5xl"},text:{sm:"text-sm",md:"text-base",lg:"text-xl"}};
export function InvitationBlocksView({blocks,media,themeColor,date,location,mapUrl,rsvp}:{blocks:Block[];media:Media[];themeColor:string;date:string;location:string;mapUrl:string;rsvp:ReactNode}){
 return <div className="space-y-6 px-6 py-10">{blocks.map(b=>{const style={textAlign:b.align,color:b.color||undefined} as const;const m=media.find(x=>x.id===b.mediaId);
  switch(b.type){
   case "heading":return <h2 key={b.id} style={{...style,color:b.color||themeColor}} className={`font-serif leading-tight ${sizes.heading[b.size]}`}>{b.text}</h2>;
   case "text":return <p key={b.id} style={style} className={`whitespace-pre-line leading-8 ${sizes.text[b.size]}`}>{b.text}</p>;
   case "image":return m?.url?<img key={b.id} src={m.url} alt={b.text||"Foto do convite"} className="w-full rounded-lg object-contain"/>:<p key={b.id} className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">Selecione uma foto</p>;
   case "video":return m?.url?<video key={b.id} src={m.url} controls playsInline preload="metadata" className="w-full rounded-lg"/>:<p key={b.id} className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">Selecione um vídeo</p>;
   case "date":return <div key={b.id} style={style} className="flex items-center justify-center gap-3"><CalendarDays className="shrink-0"/><p className="capitalize">{b.text||date||"Data a definir"}</p></div>;
   case "location":return <div key={b.id} style={style}><p className="inline-flex items-center gap-2"><MapPin className="shrink-0"/>{b.text||location||"Local a definir"}</p>{mapUrl&&<a href={mapUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block text-sm font-bold underline">Ver no mapa</a>}</div>;
   case "rsvp":return <div key={b.id}>{rsvp}</div>;
   case "spacer":return <div key={b.id} className={b.size==="sm"?"h-4":b.size==="lg"?"h-20":"h-10"}/>;
  }})}</div>;
}
