import { History } from 'lucide-react';
import { BettorDashboard } from '../api';
import { Metric } from '../components/Metric';
import { Status } from '../components/Status';
import { betTypeLabels } from '../constants';
import { formatMoney, formatSelectionLabel } from '../utils/format';

export function BetHistoryModal({
  bettor,
  onClose,
}: {
  bettor: BettorDashboard | null;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal history-modal" role="dialog" aria-modal="true" aria-labelledby="history-title">
        <div className="modal-icon">
          <History size={22} />
        </div>
        <div>
          <h2 id="history-title">Historique des paris</h2>
          <p>{bettor?.user?.name ?? 'Parieur'} · {bettor?.recentBets.length ?? 0} pari(s)</p>
        </div>
        <div className="history-list">
          {bettor?.recentBets.length ? (
            bettor.recentBets.map((bet) => (
              <article key={bet.id} className="history-card">
                <div className="history-card-head">
                  <span>{bet.race.name}</span>
                  <Status status={bet.race.status} />
                </div>
                <div className="history-card-grid">
                  <Metric label="Type" value={betTypeLabels[bet.type]} />
                  <Metric label="Mise" value={formatMoney(Number(bet.amount))} />
                  <Metric label="Gain potentiel" value={formatMoney(Number(bet.potentialWin))} />
                  <Metric label="Statut" value={bet.status} />
                </div>
                <div className="modal-picks">
                  {bet.selections.map((selection) => (
                    <span key={`${bet.id}-${selection.position}`}>
                      {formatSelectionLabel(bet.type, selection.unicorn.name, selection.position - 1)}
                    </span>
                  ))}
                </div>
              </article>
            ))
          ) : (
            <p>Aucun pari enregistré pour le moment.</p>
          )}
        </div>
        <button className="primary-button" onClick={onClose}>
          Fermer
        </button>
      </section>
    </div>
  );
}
