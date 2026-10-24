import logo from '@/assets/personalize-logo.png.asset.json';

export function BrandLogo({ className = '' }: { className?: string }) {
  return <img src={logo.url} alt="Personalizê — Cada detalhe é único" width={1920} height={640} className={`brand-logo ${className}`} />;
}