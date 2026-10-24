import { describe, expect, it } from 'vitest';
import { isAdministrator } from '@/lib/admin-access';

describe('Administrator authorization', () => {
  it('allows only an explicitly verified administrator', () => {
    expect(isAdministrator(true)).toBe(true);
  });
  it('blocks ordinary authenticated users', () => {
    expect(isAdministrator(false)).toBe(false);
  });
  it('blocks absent and caller-shaped role values', () => {
    expect(isAdministrator(null)).toBe(false);
    expect(isAdministrator('admin')).toBe(false);
    expect(isAdministrator({ role: 'admin' })).toBe(false);
  });
});