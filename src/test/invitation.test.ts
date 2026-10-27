import {describe,it,expect} from 'vitest';
import {canViewInvitation,publicInvitationContent,rsvpInput,INVITATION_MEDIA_TTL} from '@/lib/invitation';
describe('invitation safety',()=>{
 it('only published invitations are visible',()=>{expect(canViewInvitation('published')).toBe(true);expect(canViewInvitation('draft')).toBe(false);expect(canViewInvitation('archived')).toBe(false);});
 it('returns only event fields without customer secrets',()=>{expect(publicInvitationContent({description:'Festa',location:'Salvador',map_url:'javascript:alert(1)',rsvp_enabled:true,email:'private@example.invalid',customer_id:'private'})).toEqual({description:'Festa',location:'Salvador',mapUrl:'',rsvpEnabled:true});});
 it('validates attendance party size and automation trap',()=>{const input={slug:'aniversario-alice',name:'Alice',attendance:'yes',partySize:2,website:''};expect(rsvpInput.safeParse(input).success).toBe(true);expect(rsvpInput.safeParse({...input,attendance:'paid'}).success).toBe(false);expect(rsvpInput.safeParse({...input,partySize:0}).success).toBe(false);expect(rsvpInput.safeParse({...input,website:'bot'}).success).toBe(false);});
 it('limits signed access to five minutes',()=>{expect(INVITATION_MEDIA_TTL).toBe(300);});
});