import {useState} from 'react';
import {ChevronLeft,ChevronRight} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {supabase} from '@/integrations/supabase/client';
type Banner={id:string;title:string;storage_path:string;media_type:string;destination_url:string|null};
export function StoreBannerCarousel({banners}:{banners:Banner[]}){
 const [index,setIndex]=useState(0);const banner=banners[index%banners.length];if(!banner)return null;
 const url=supabase.storage.from('banners-public').getPublicUrl(banner.storage_path).data.publicUrl;
 const href=banner.destination_url&&/^(https?:\/\/|\/(?!\/))/.test(banner.destination_url)?banner.destination_url:'/produtos';
 return <section aria-roledescription="carrossel" aria-label="Campanhas Personalizê" className="relative min-w-0 overflow-hidden rounded-lg bg-accent"><a href={href} aria-label={banner.title} className="block">{banner.media_type==='video'?<video key={banner.id} src={url} controls muted playsInline preload="metadata" className="aspect-[16/9] w-full object-contain"/>:<img src={url} alt={banner.title} className="aspect-[16/9] w-full object-contain"/>}</a>{banners.length>1&&<div className="flex items-center justify-between bg-card px-3 py-2"><Button variant="ghost" size="icon" aria-label="Banner anterior" onClick={()=>setIndex(v=>(v-1+banners.length)%banners.length)}><ChevronLeft/></Button><span aria-live="polite" className="text-xs text-muted-foreground">{index%banners.length+1} / {banners.length}</span><Button variant="ghost" size="icon" aria-label="Próximo banner" onClick={()=>setIndex(v=>(v+1)%banners.length)}><ChevronRight/></Button></div>}</section>;
}