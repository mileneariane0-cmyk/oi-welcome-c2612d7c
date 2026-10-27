// @vitest-environment node
import {PGlite} from '@electric-sql/pglite';
import {readFileSync} from 'node:fs';
import {it,expect} from 'vitest';
it('administrator can create, read and update customers with optional birthday while visitors cannot read them',async()=>{
 const db=new PGlite();
 try{
 const initial=readFileSync('drizzle/migrations/0000_personalize_initial_secure_platform.sql','utf8');
 const start=initial.indexOf('CREATE TABLE public.customers');const end=initial.indexOf('CREATE TABLE public.categories',start);
 await db.exec("CREATE ROLE authenticated; CREATE ROLE service_role; CREATE SCHEMA auth; CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT null::uuid $$; CREATE FUNCTION public.has_role(uuid,text) RETURNS boolean LANGUAGE sql AS $$ SELECT current_setting('test.admin',true)='yes' $$; CREATE TABLE public.profiles(id uuid PRIMARY KEY);");
 await db.exec(initial.slice(start,end));
 await db.exec(readFileSync('drizzle/migrations/0004_customer_birthday.sql','utf8'));
 await db.exec("SET ROLE authenticated; SET test.admin='yes'; INSERT INTO public.customers(name,email,phone,notes) VALUES ('Cliente isolado','cliente@example.invalid','71999999999','Observação');");
 expect((await db.query<{birth_date:string|null}>('SELECT birth_date FROM public.customers')).rows[0]?.birth_date).toBeNull();
 await db.exec("UPDATE public.customers SET birth_date='1990-10-26',notes='Atualizada' WHERE name='Cliente isolado'");
 const saved=(await db.query<{birth_date:string;notes:string}>("SELECT birth_date::text,notes FROM public.customers WHERE name='Cliente isolado'")).rows[0];
 expect(saved).toEqual({birth_date:'1990-10-26',notes:'Atualizada'});
 await db.exec("SET test.admin='no'");expect((await db.query('SELECT id FROM public.customers')).rows).toHaveLength(0);
 }finally{await db.close();}
});