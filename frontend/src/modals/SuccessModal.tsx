import { CheckCircle2 } from 'lucide-react';

export function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal success-modal" role="dialog" aria-modal="true" aria-labelledby="success-title">
        <div className="modal-icon success">
          <CheckCircle2 size={24} />
        </div>
        <h2 id="success-title">Pari validé</h2>
        <p>Le paiement CB a été autorisé et ton pari est enregistré.</p>
        <button className="primary-button" onClick={onClose}>
          Retour aux courses
        </button>
      </section>
    </div>
  );
}
