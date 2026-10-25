// @vitest-environment node
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const db = new PGlite();
const authorized = 'arianeararagaocomercial@gmail.com';
const migration = readFileSync('drizzle/migrations/0002_authorized_admin_email.sql', 'utf8');

describe('Database administrator email authorization', () => {
  beforeAll(async () => {
    await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated;
      CREATE SCHEMA auth;
      CREATE TABLE auth.users (id uuid PRIMARY KEY, email text, email_confirmed_at timestamptz);
      CREATE TYPE public.app_role AS ENUM ('admin', 'user');
      CREATE TABLE public.user_roles (user_id uuid, role public.app_role, UNIQUE(user_id, role));`);
    await db.exec(migration);
  }, 30000);
  afterAll(() => db.close());

  it('does not grant administrator before authorized email confirmation', async () => {
    await db.query('INSERT INTO auth.users VALUES ($1, $2, NULL)', ['00000000-0000-0000-0000-000000000001', authorized]);
    const result = await db.query('SELECT * FROM public.user_roles');
    expect(result.rows).toHaveLength(0);
  });
  it('grants administrator to the confirmed authorized email', async () => {
    await db.exec("UPDATE auth.users SET email_confirmed_at = now() WHERE id = '00000000-0000-0000-0000-000000000001'");
    const result = await db.query('SELECT role FROM public.user_roles WHERE user_id = $1', ['00000000-0000-0000-0000-000000000001']);
    expect(result.rows).toEqual([{ role: 'admin' }]);
  });
  it('blocks a confirmed different mailbox', async () => {
    await db.query('INSERT INTO auth.users VALUES ($1, $2, now())', ['00000000-0000-0000-0000-000000000002', 'ordinary@example.test']);
    const result = await db.query('SELECT * FROM public.user_roles WHERE user_id = $1', ['00000000-0000-0000-0000-000000000002']);
    expect(result.rows).toHaveLength(0);
  });
  it('revokes administrator when the authorized mailbox changes', async () => {
    await db.query('UPDATE auth.users SET email = $1 WHERE id = $2', ['different@example.test', '00000000-0000-0000-0000-000000000001']);
    const result = await db.query('SELECT * FROM public.user_roles');
    expect(result.rows).toHaveLength(0);
  });
  it('does not allow ordinary roles to execute the privileged trigger function', async () => {
    const result = await db.query("SELECT has_function_privilege('anon', 'public.sync_personalize_admin_role()', 'EXECUTE') AS anon, has_function_privilege('authenticated', 'public.sync_personalize_admin_role()', 'EXECUTE') AS authenticated");
    expect(result.rows).toEqual([{ anon: false, authenticated: false }]);
  });
});