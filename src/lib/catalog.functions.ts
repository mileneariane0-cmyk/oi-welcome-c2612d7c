import {createServerFn} from '@tanstack/react-start';
import {createClient} from '@supabase/supabase-js';
import {queryOptions} from '@tanstack/react-query';
import type {Database} from '@/integrations/supabase/types';
import type {CatalogProduct} from './catalog';
import {catalogAppearance} from './catalog';

export const getCatalog=createServerFn({method:'GET'}).handler(async()=>{
 const key=process.env['SUPABASE_PUBLISHABLE_KEY']!;
 const client=createClient<Database>(process.env['SUPABASE_URL']!,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>{const headers=new Headers(init?.headers);if(key.startsWith('sb_')&&headers.get('Authorization')===`Bearer ${key}`)headers.delete('Authorization');headers.set('apikey',key);return fetch(input,{...init,headers});}}});
 const [p,c,m,v,b,pc]=await Promise.all([client.from('products').select('id,slug,name,description,price,promotional_price,personalization_instructions,preview_url,category_id,product_type').eq('published',true).order('created_at'),client.from('categories').select('id,name,slug,show_on_home').eq('published',true).order('name'),client.from('product_media').select('id,product_id,storage_path,media_type,position').order('position'),client.from('product_variants').select('id,product_id,name,price,attributes').order('created_at'),client.from('banners').select('id,title,storage_path,media_type,destination_url,position').eq('published',true).order('position'),client.from('product_categories').select('product_id,category_id')]);
 if(p.error||c.error||m.error||v.error||b.error||pc.error)throw new Error('Não foi possível consultar o catálogo.');
 const products:CatalogProduct[]=(p.data??[]).map(row=>{const promo=row.promotional_price!=null&&Number(row.promotional_price)<Number(row.price)?Number(row.promotional_price):null;return {...row,price:promo??Number(row.price),promotional_price:promo,...(promo!=null?{old:Number(row.price),badge:'Oferta'}:{}),categories:(c.data??[]).filter(c=>c.id===row.category_id||(pc.data??[]).some(link=>link.product_id===row.id&&link.category_id===c.id)).map(c=>c.name),category:c.data?.find(c=>c.id===row.category_id)?.name??(row.product_type==='digital'?'Produto digital':'Personalizados'),media:(m.data??[]).filter(m=>m.product_id===row.id),variants:(v.data??[]).filter(v=>v.product_id===row.id),...catalogAppearance(row.slug,row.product_type)};});
 return {products,categories:c.data??[],banners:b.data??[]};
});
export const catalogQuery=queryOptions({queryKey:['storefront-catalog'],queryFn:()=>getCatalog(),staleTime:0});