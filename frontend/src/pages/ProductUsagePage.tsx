import { Activity, BarChart3, Eye, MousePointerClick, Trophy, Users } from 'lucide-react';
import { ProductDashboard } from '../api';
import { Kpi } from '../components/Kpi';
import { formatMoney, formatPercent } from '../utils/format';

export function ProductUsagePage({
  loading,
  product,
}: {
  loading: boolean;
  product: ProductDashboard | null;
}) {
  return (
    <section className="page-section">
      <div className="kpi-grid">
        <Kpi icon={<Activity />} label="Paris enregistrés" value={product?.kpis.betCount ?? 0} />
        <Kpi icon={<BarChart3 />} label="Paris perdus" value={product?.kpis.lostBetCount ?? 0} />
        <Kpi icon={<Users />} label="Utilisateurs" value={product?.kpis.totalUsers ?? 0} />
        <Kpi icon={<Trophy />} label="Volume misé" value={formatMoney(product?.kpis.totalStake ?? 0)} />
      </div>
      <div className="panel">
        <div className="panel-heading">
          <h2>Produit & usage</h2>
          <span>{loading ? 'Actualisation' : `${formatPercent(product?.kpis.lostBetRate ?? 0)} perdus`}</span>
        </div>
        <div className="event-table">
          {product?.productEvents.map((event) => (
            <div key={`${event.name}-${event.target}`} className="event-row">
              <EventIcon name={event.name} />
              <span>{event.name}</span>
              <strong>{event.target}</strong>
              <em>{event.count}</em>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EventIcon({ name }: { name: string }) {
  if (name === 'view') {
    return <Eye size={16} />;
  }

  if (name === 'click') {
    return <MousePointerClick size={16} />;
  }

  return <Activity size={16} />;
}
