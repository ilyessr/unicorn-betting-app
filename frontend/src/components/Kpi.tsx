import { ReactNode } from 'react';

export function Kpi({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
  return (
    <article className="kpi-card">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
