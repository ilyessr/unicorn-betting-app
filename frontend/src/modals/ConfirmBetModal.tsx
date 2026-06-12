import { Sparkles } from 'lucide-react';
import { BetType, Race, Unicorn } from '../api';
import { betTypeLabels } from '../constants';
import { formatMoney, formatSelectionLabel } from '../utils/format';

export function ConfirmBetModal({
  amount,
  betType,
  isSubmitting,
  selectedPotentialWin,
  selectedRace,
  selectedUnicorns,
  onCancel,
  onSubmit,
}: {
  amount: number;
  betType: BetType;
  isSubmitting: boolean;
  selectedPotentialWin: number;
  selectedRace: Race;
  selectedUnicorns: Unicorn[];
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <div className="modal-icon">
          <Sparkles size={22} />
        </div>
        <h2 id="confirm-title">Confirmer le pari</h2>
        <div className="modal-summary">
          <div>
            <span>Course</span>
            <strong>{selectedRace.name}</strong>
          </div>
          <div>
            <span>Type</span>
            <strong>{betTypeLabels[betType]}</strong>
          </div>
          <div>
            <span>Mise</span>
            <strong>{formatMoney(amount)}</strong>
          </div>
          <div>
            <span>Gain potentiel</span>
            <strong>{formatMoney(selectedPotentialWin)}</strong>
          </div>
        </div>
        <div className="modal-picks">
          {selectedUnicorns.map((unicorn, index) => (
            <span key={unicorn.id}>{formatSelectionLabel(betType, unicorn.name, index)}</span>
          ))}
        </div>
        <div className="modal-actions">
          <button className="secondary-button" disabled={isSubmitting} onClick={onCancel}>
            Annuler
          </button>
          <button className="primary-button" disabled={isSubmitting} onClick={onSubmit}>
            {isSubmitting ? (
              <span className="button-loader">
                <span className="spinner" />
                Paiement CB...
              </span>
            ) : (
              'Valider le pari'
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
