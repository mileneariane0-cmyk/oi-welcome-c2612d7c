import {supabase} from '@/integrations/supabase/client';
import type {CatalogMedia} from '@/lib/catalog';
export function ProductMedia({media,name,className='aspect-square w-full object-contain',controls=false}:{media?:CatalogMedia|undefined;name:string;className?:string;controls?:boolean}){
 if(!media)return <span role="img" aria-label={name}>🎁</span>;
 const url=supabase.storage.from('products-public').getPublicUrl(media.storage_path).data.publicUrl;
 return media.media_type==='video'?<video src={url} controls={controls} muted playsInline preload="metadata" className={className}/>:<img src={url} alt={name} className={className}/>;
}