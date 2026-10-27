// @vitest-environment node
import {PGlite} from '@electric-sql/pglite';
import {readFileSync} from 'node:fs';
import {it,expect} from 'vitest';
it('RSVP database enforces published enabled invitations and a five-request limit',async()=>{
 const db=new PGlite();try{
 await db.exec("CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role; CREATE TABLE public.invitation_pages(id uuid PRIMARY KEY,slug text,status text,content jsonb); CREATE TABLE public.rsvp_responses(invitation_id uuid,guest_name text,attendance text,party_size integer); INSERT INTO public.invitation_pages VALUES('11111111-1111-1111-1111-111111111111','evento','published','{\"rsvp_enabled\":true}');");
 await db.exec(readFileSync('drizzle/migrations/0007_secure_invitation_rsvp.sql','utf8'));
 const key='a'.repeat(64);const call=()=>db.query<{allowed:boolean}>("SELECT public.submit_invitation_rsvp('evento','Convidado isolado','yes',2,$1) AS allowed",[key]);
 for(let i=0;i<5;i++)expect((await call()).rows[0]?.allowed).toBe(true);
 expect((await call()).rows[0]?.allowed).toBe(false);
 expect((await db.query<{count:number}>('SELECT count(*)::int AS count FROM public.rsvp_responses')).rows[0]?.count).toBe(5);
 await db.exec("UPDATE public.invitation_pages SET status='draft'");await expect(call()).rejects.toThrow('Invitation unavailable');
 await db.exec("UPDATE public.invitation_pages SET status='archived'");await expect(call()).rejects.toThrow('Invitation unavailable');
 await db.exec("UPDATE public.invitation_pages SET status='published',content='{\"rsvp_enabled\":false}'");await expect(call()).rejects.toThrow('Invitation unavailable');
 const access=await db.query<{allowed:boolean}>("SELECT has_function_privilege('anon','public.submit_invitation_rsvp(text,text,text,integer,text)','EXECUTE') AS allowed");expect(access.rows[0]?.allowed).toBe(false);
 }finally{await db.close();}
},20000);