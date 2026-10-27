import {z} from 'zod';
export const invitationSlug=z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(90);
export const rsvpInput=z.object({slug:invitationSlug,name:z.string().trim().min(1).max(100),attendance:z.enum(['yes','no','maybe']),partySize:z.number().int().min(1).max(100),website:z.string().max(0)});
export function publicInvitationContent(value:unknown){const c=value&&typeof value==='object'?value as Record<string,unknown>:{};return {description:typeof c['description']==='string'?c['description']:'',location:typeof c['location']==='string'?c['location']:'',mapUrl:typeof c['map_url']==='string'&&/^https:\/\//i.test(c['map_url'])?c['map_url']:'',rsvpEnabled:c['rsvp_enabled']===true};}
export function canViewInvitation(status:string){return status==='published';}
export const INVITATION_MEDIA_TTL=300;