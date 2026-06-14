import { Activity, BarChart3, CreditCard, Trophy, Users } from "lucide-react";
import { BetType, ProductDashboard, Race, Unicorn } from "../api";
import { Kpi } from "../components/Kpi";
import { Status } from "../components/Status";
import { betTypeLabels, selectionCount } from "../constants";
import { formatMoney, formatTime } from "../utils/format";

type RacesPageProps = {
  amount: number;
  betType: BetType;
  demoUserId: string;
  loading: boolean;
  product: ProductDashboard | null;
  races: Race[];
  selectedRace: Race | undefined;
  selectedUnicornIds: string[];
  selectedPotentialWin: number;
  onAmountChange: (amount: number) => void;
  onBetTypeChange: (type: BetType) => void;
  onOpenConfirm: () => void;
  onRaceSelect: (raceId: string) => void;
  onTrackRaceClick: (raceId: string) => void;
  onTrackTypeClick: (type: BetType) => void;
  onToggleUnicorn: (unicornId: string) => void;
};

export function RacesPage({
  amount,
  betType,
  demoUserId,
  loading,
  product,
  races,
  selectedRace,
  selectedUnicornIds,
  selectedPotentialWin,
  onAmountChange,
  onBetTypeChange,
  onOpenConfirm,
  onRaceSelect,
  onTrackRaceClick,
  onTrackTypeClick,
  onToggleUnicorn,
}: RacesPageProps) {
  return (
    <>
      <section className="kpi-grid">
        <Kpi
          icon={<Trophy />}
          label="Licorne la plus gagnante"
          value={product?.mostWinningUnicorn?.name ?? "-"}
        />
        <Kpi
          icon={<Activity />}
          label="Paris enregistrés"
          value={product?.kpis.betCount ?? 0}
        />
        <Kpi
          icon={<BarChart3 />}
          label="Paris perdus"
          value={product?.kpis.lostBetCount ?? 0}
        />
        <Kpi icon={<Users />} label="Courses du jour" value={races.length} />
      </section>

      <section className="workspace">
        <div className="panel race-panel">
          <div className="panel-heading">
            <h2>{races.length} courses programmées aujourd'hui</h2>
          </div>
          <div className="race-list">
            {races.map((race) => (
              <button
                key={race.id}
                className={`race-row ${selectedRace?.id === race.id ? "is-active" : ""}`}
                onClick={() => {
                  onRaceSelect(race.id);
                  onTrackRaceClick(race.id);
                }}
              >
                <span>
                  <strong>{race.name}</strong>
                  <small>
                    Départ {formatTime(race.startsAt)} · ouverture{" "}
                    {formatTime(race.bettingOpen)}
                  </small>
                </span>
                <Status status={race.status} />
              </button>
            ))}
          </div>
        </div>

        <div className="panel bet-panel">
          <div className="panel-heading">
            <h2>Composer un pari</h2>
            <span>{selectedRace?.name ?? "-"}</span>
          </div>

          <div className="segmented">
            {(Object.keys(betTypeLabels) as BetType[]).map((type) => (
              <button
                key={type}
                className={betType === type ? "is-active" : ""}
                onClick={() => {
                  onBetTypeChange(type);
                  onTrackTypeClick(type);
                }}
              >
                {betTypeLabels[type]}
              </button>
            ))}
          </div>

          <div className="runner-grid">
            {selectedRace?.entries.map(({ unicorn, lane }) => (
              <RunnerCard
                key={unicorn.id}
                betType={betType}
                isSelected={selectedUnicornIds.includes(unicorn.id)}
                lane={lane}
                selectedIndex={selectedUnicornIds.indexOf(unicorn.id)}
                unicorn={unicorn}
                onClick={() => onToggleUnicorn(unicorn.id)}
              />
            ))}
          </div>

          <label className="amount-field">
            Mise
            <input
              min={1}
              type="number"
              value={amount}
              onChange={(event) => onAmountChange(Number(event.target.value))}
            />
          </label>

          <div className="payment-row">
            <CreditCard size={18} />
            <span>CB **** 4242</span>
            <strong>Gain potentiel {formatMoney(selectedPotentialWin)}</strong>
          </div>

          <button
            className="primary-button"
            disabled={
              !demoUserId ||
              !selectedRace ||
              selectedUnicornIds.length !== selectionCount[betType] ||
              selectedRace.status !== "OPEN"
            }
            onClick={onOpenConfirm}
          >
            Parier
          </button>
        </div>
      </section>
    </>
  );
}

function RunnerCard({
  betType,
  isSelected,
  lane,
  selectedIndex,
  unicorn,
  onClick,
}: {
  betType: BetType;
  isSelected: boolean;
  lane: number;
  selectedIndex: number;
  unicorn: Unicorn;
  onClick: () => void;
}) {
  return (
    <button
      className={`runner ${isSelected ? "is-selected" : ""}`}
      onClick={onClick}
    >
      {betType !== "WINNER" && isSelected ? (
        <span className="selection-rank">{selectedIndex + 1}</span>
      ) : (
        <span className="swatch" style={{ background: unicorn.color }} />
      )}
      <span>
        <strong>{unicorn.name}</strong>
        <small>
          Couloir {lane} · {unicorn.victories} victoires
        </small>
      </span>
    </button>
  );
}
