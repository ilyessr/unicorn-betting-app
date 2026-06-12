import { BarChart3, Trophy, Users } from 'lucide-react';
import { Page } from '../constants';

export function AppNav({ page, onChange }: { page: Page; onChange: (page: Page) => void }) {
  return (
    <nav className="app-nav" aria-label="Navigation principale">
      <button className={page === 'races' ? 'is-active' : ''} onClick={() => onChange('races')}>
        <Trophy size={16} />
        Courses
      </button>
      <button className={page === 'bettor' ? 'is-active' : ''} onClick={() => onChange('bettor')}>
        <Users size={16} />
        Dashboard parieur
      </button>
      <button className={page === 'product' ? 'is-active' : ''} onClick={() => onChange('product')}>
        <BarChart3 size={16} />
        Produit & usage
      </button>
    </nav>
  );
}
