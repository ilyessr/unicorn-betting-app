import { History } from 'lucide-react';
import { BettorDashboard } from '../api';
import { Metric } from '../components/Metric';
import { betTypeLabels } from '../constants';
import { formatMoney } from '../utils/format';

export function BettorDashboardPage({
  bettor,
  onOpenHistory,
}: {
  bettor: BettorDashboard | null;
  onOpenHistory: () => void;
}) {
  return (
    <section className="page-section">
      <div className="panel">
        <div className="panel-heading">
          <h2>Dashboard parieur</h2>
          <button className="ghost-button" onClick={onOpenHistory}>
            <History size={16} />
            Historique
          </button>
        </div>
        <p className="panel-caption">{bettor?.user?.name ?? 'Démo'}</p>
        <div className="mini-kpis">
          <Metric label="Mises" value={formatMoney(bettor?.totals.totalStaked ?? 0)} />
          <Metric label="Gagnés" value={bettor?.totals.wonBets ?? 0} />
          <Metric label="Perdus" value={bettor?.totals.lostBets ?? 0} />
        </div>
        <div className="bet-history">
          {bettor?.recentBets.map((bet) => (
            <div key={bet.id} className="history-row">
              <span>{betTypeLabels[bet.type]}</span>
              <strong>{bet.status}</strong>
              <small>{bet.selections.map((selection) => selection.unicorn.name).join(', ')}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
