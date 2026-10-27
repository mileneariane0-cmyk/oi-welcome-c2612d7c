import {createServerFn} from '@tanstack/react-start';
import {getRequestHeader,setResponseHeader} from '@tanstack/react-start/server';
import {queryOptions} from '@tanstack/react-query';
import {invitationSlug,rsvpInput,publicInvitationContent,canViewInvitation,INVITATION_MEDIA_TTL} from './invitation';

export const getPublicInvitation=createServerFn({method:'GET'}).inputValidator((input:{slug:string})=>({slug:invitationSlug.parse(input.slug)})).handler(async({data})=>{
 setResponseHeader('Cache-Control','no-store');
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const {data:page,error}=await supabaseAdmin.from('invitation_pages').select('id,slug,title,event_at,content,status').eq('slug',data.slug).eq('status','published').maybeSingle();
 if(error)throw new Error('Não foi possível carregar este convite.');
 if(!page||!canViewInvitation(page.status))return null;
 const {data:files,error:mediaError}=await supabaseAdmin.from('invitation_media').select('id,storage_path,media_type,position').eq('invitation_id',page.id).order('position').order('created_at');
 if(mediaError)throw new Error('Não foi possível carregar as mídias do convite.');
 const media=await Promise.all((files??[]).map(async file=>{const signed=await supabaseAdmin.storage.from('invitations-private').createSignedUrl(file.storage_path,INVITATION_MEDIA_TTL);if(signed.error||!signed.data?.signedUrl)throw new Error('Mídia temporariamente indisponível.');return {id:file.id,type:file.media_type,position:file.position,url:signed.data.signedUrl};}));
 const {data:current}=await supabaseAdmin.from('invitation_pages').select('status').eq('id',page.id).maybeSingle();
 if(!current||!canViewInvitation(current.status))return null;
 return {slug:page.slug,title:page.title,eventAt:page.event_at,...publicInvitationContent(page.content),media};
});
export function invitationQuery(slug:string){return queryOptions({queryKey:['public-invitation',slug],queryFn:()=>getPublicInvitation({data:{slug}}),staleTime:0,gcTime:0,refetchInterval:240000});}
export const submitPublicRsvp=createServerFn({method:'POST'}).inputValidator(input=>rsvpInput.parse(input)).handler(async({data})=>{
 setResponseHeader('Cache-Control','no-store');
 const ip=getRequestHeader('cf-connecting-ip')??'unknown';
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(`${data.slug}:${ip}`));const key=Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,'0')).join('');
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const {data:allowed,error}=await supabaseAdmin.rpc('submit_invitation_rsvp',{p_slug:data.slug,p_name:data.name,p_attendance:data.attendance,p_party_size:data.partySize,p_request_key:key});
 if(error)return {ok:false,message:'Este convite está indisponível ou não aceita confirmações.'};
 return allowed?{ok:true,message:'Resposta registrada com sucesso! Obrigado por confirmar.'}:{ok:false,message:'Muitas respostas em pouco tempo. Aguarde alguns minutos.'};
});