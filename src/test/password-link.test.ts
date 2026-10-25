import { describe, expect, it } from 'vitest';
import { passwordLinkType } from '@/lib/password-link';

describe('Password definition links', () => {
  it('accepts invitation links for first access', () => {
    expect(passwordLinkType('#type=invite')).toBe('invite');
  });
  it('accepts recovery links for future password resets', () => {
    expect(passwordLinkType('#type=recovery')).toBe('recovery');
  });
  it('does not treat ordinary sign-in as password recovery', () => {
    expect(passwordLinkType('#type=signup')).toBeNull();
    expect(passwordLinkType('')).toBeNull();
  });
});