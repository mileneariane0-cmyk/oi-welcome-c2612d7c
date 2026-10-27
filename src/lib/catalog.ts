export type CatalogVariant = {id:string;name:string;price:number|null;attributes:unknown};
export type CatalogMedia = {id:string;storage_path:string;media_type:string;position:number};
export type CatalogProduct = {id:string;slug:string;name:string;description:string;price:number;promotional_price:number|null;personalization_instructions:string;category_id:string|null;category:string;product_type:string;media:CatalogMedia[];variants:CatalogVariant[];old?:number;emoji:string;gradient:string;badge?:string};
export function variantGroups(variants:CatalogVariant[]){
 const groups=new Map<string,{name:string;required:boolean;options:CatalogVariant[]}>();
 for(const option of variants){const a=option.attributes&&typeof option.attributes==='object'?option.attributes as Record<string,unknown>:{};const name=String(a['group']||'Opções');const group=groups.get(name)??{name,required:false,options:[]};group.required=group.required||a['required']!==false;group.options.push(option);groups.set(name,group);}
 return [...groups.values()];
}
// Each option's price is a final price; multiple groups add their differences from the base.
export function selectedPrice(base:number,variants:CatalogVariant[],selected:Record<string,string>){return Math.max(0,base+Object.values(selected).reduce((sum,id)=>{const v=variants.find(v=>v.id===id);return sum+(v?.price==null?0:Number(v.price)-base);},0));}
export function birthdaysToday<T extends {birth_date:string|null}>(customers:T[],now=new Date()){
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Bahia',month:'2-digit',day:'2-digit'}).formatToParts(now);
 const month=parts.find(p=>p.type==='month')?.value;const day=parts.find(p=>p.type==='day')?.value;
 return customers.filter(c=>c.birth_date?.slice(5,7)===month&&c.birth_date?.slice(8,10)===day);
}