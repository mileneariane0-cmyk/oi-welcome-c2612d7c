// @vitest-environment node
import {PGlite} from '@electric-sql/pglite';
import {readFileSync} from 'node:fs';
import {it,expect} from 'vitest';
it('cannot mark paid until a confirmed payment with paid timestamp exists',async()=>{
 const db=new PGlite();try{
 await db.exec("CREATE ROLE anon; CREATE ROLE authenticated; CREATE TABLE public.orders(id uuid PRIMARY KEY,status text); CREATE TABLE public.payments(order_id uuid,status text,paid_at timestamptz); INSERT INTO public.orders VALUES('11111111-1111-1111-1111-111111111111','awaiting_payment');");
 await db.exec(readFileSync('drizzle/migrations/0009_verified_order_payment_status.sql','utf8'));
 await expect(db.exec("UPDATE public.orders SET status='paid'")).rejects.toThrow('Payment has not been confirmed');
 await db.exec("INSERT INTO public.payments VALUES('11111111-1111-1111-1111-111111111111','confirmed',now()); UPDATE public.orders SET status='paid'");
 expect((await db.query<{status:string}>('SELECT status FROM public.orders')).rows[0]?.status).toBe('paid');
 }finally{await db.close();}
},20000);