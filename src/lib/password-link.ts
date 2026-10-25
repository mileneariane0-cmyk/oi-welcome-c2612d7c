export function passwordLinkType(hash: string): 'recovery' | 'invite' | null {
  const type = new URLSearchParams(hash.replace(/^#/, '')).get('type');
  return type === 'recovery' || type === 'invite' ? type : null;
}