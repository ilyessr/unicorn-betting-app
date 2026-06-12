import { RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { analyticsApi, BetType, Unicorn } from "./api";
import { AppNav } from "./components/AppNav";
import { Page, selectionCount } from "./constants";
import { useAppData } from "./hooks/useAppData";
import { useCreateBet } from "./hooks/useCreateBet";
import { BetHistoryModal } from "./modals/BetHistoryModal";
import { ConfirmBetModal } from "./modals/ConfirmBetModal";
import { SuccessModal } from "./modals/SuccessModal";
import { BettorDashboardPage } from "./pages/BettorDashboardPage";
import { ProductUsagePage } from "./pages/ProductUsagePage";
import { RacesPage } from "./pages/RacesPage";

export function App() {
  const [selectedRaceId, setSelectedRaceId] = useState<string>("");
  const [betType, setBetType] = useState<BetType>("WINNER");
  const [selectedUnicornIds, setSelectedUnicornIds] = useState<string[]>([]);
  const [amount, setAmount] = useState(10);
  const [message, setMessage] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [page, setPage] = useState<Page>("races");

  const {
    races,
    bettor,
    product,
    demoUserId,
    loading,
    productLoading,
    error,
    hasNoDemoUser,
    refreshProductUsage,
    refreshAll,
  } = useAppData();

  const selectedRace =
    races.find((race) => race.id === selectedRaceId) ?? races[0];

  const {
    error: createBetError,
    isPending: isCreatingBet,
    isSuccess: hasCreatedBet,
    mutate: createBet,
    reset: resetCreateBet,
  } = useCreateBet({
    amount,
    betType,
    demoUserId,
    selectedRace,
    selectedUnicornIds,
  });

  useEffect(() => {
    if (hasCreatedBet) {
      setIsConfirmOpen(false);
      setIsSuccessOpen(true);
      setSelectedUnicornIds([]);
      resetCreateBet();
    }
  }, [hasCreatedBet, resetCreateBet]);

  useEffect(() => {
    if (createBetError) {
      setIsConfirmOpen(false);
      setMessage(createBetError instanceof Error ? createBetError.message : "Impossible de créer le pari");
    }
  }, [createBetError]);

  const selectedPotentialWin = useMemo(() => {
    const odds = betType === "WINNER" ? 4.5 : betType === "TOP_3" ? 2.4 : 1.6;
    return amount * odds;
  }, [amount, betType]);

  const selectedUnicorns = useMemo<Unicorn[]>(() => {
    if (!selectedRace) return [];

    return selectedUnicornIds.reduce<Unicorn[]>((acc, id) => {
      const unicorn = selectedRace.entries.find(
        (entry) => entry.unicorn.id === id,
      )?.unicorn;
      if (unicorn) acc.push(unicorn);
      return acc;
    }, []);
  }, [selectedRace, selectedUnicornIds]);

  useEffect(() => {
    if (!selectedRaceId && races[0]) {
      setSelectedRaceId(races[0].id);
    }
  }, [races, selectedRaceId]);

  useEffect(() => {
    if (hasNoDemoUser) {
      setMessage("Aucun parieur de démonstration. Lancez le seed Prisma.");
    }
  }, [hasNoDemoUser]);

  useEffect(() => {
    if (error) {
      setMessage(error instanceof Error ? error.message : "Impossible de charger les données");
    }
  }, [error]);

  useEffect(() => {
    if (demoUserId) {
      analyticsApi.track({ userId: demoUserId, name: "view", target: "race-list" });
    }
  }, [demoUserId]);

  const handleRaceSelect = (raceId: string) => {
    setSelectedRaceId(raceId);
    setSelectedUnicornIds([]);
  };

  const handleBetTypeChange = (type: BetType) => {
    setBetType(type);
    setSelectedUnicornIds([]);
  };

  const handlePageChange = (nextPage: Page) => {
    setPage(nextPage);

    if (nextPage === "product") {
      refreshProductUsage();
    }
  };

  const toggleUnicorn = (unicornId: string) => {
    setSelectedUnicornIds((current) => {
      if (current.includes(unicornId)) {
        return current.filter((id) => id !== unicornId);
      }
      if (selectionCount[betType] === 1) {
        return [unicornId];
      }
      return [...current, unicornId].slice(0, selectionCount[betType]);
    });
  };

  const submitBet = async () => {
    if (!selectedRace) return;

    setMessage("");
    createBet();
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="title-block">
          <p className="eyebrow">Hippodrome pastel</p>
          <h1>Paris licornes 🦄</h1>
          <p className="subtitle">
            Courses enchantées, pronostics rapides et gains arc-en-ciel.
          </p>
        </div>
        <button
          className="icon-button"
          onClick={refreshAll}
          aria-label="Rafraîchir"
        >
          <RefreshCw size={18} />
        </button>
      </header>

      {message && <div className="notice">{message}</div>}

      <AppNav page={page} onChange={handlePageChange} />

      {page === "races" && (
        <RacesPage
          amount={amount}
          betType={betType}
          demoUserId={demoUserId}
          loading={loading}
          product={product}
          races={races}
          selectedRace={selectedRace}
          selectedUnicornIds={selectedUnicornIds}
          selectedPotentialWin={selectedPotentialWin}
          onAmountChange={setAmount}
          onBetTypeChange={handleBetTypeChange}
          onOpenConfirm={() => setIsConfirmOpen(true)}
          onRaceSelect={handleRaceSelect}
          onTrackRaceClick={(raceId) =>
            analyticsApi.track({
              userId: demoUserId,
              name: "click",
              target: "race-row",
              metadata: { raceId },
            })
          }
          onTrackTypeClick={(type) =>
            analyticsApi.track({
              userId: demoUserId,
              name: "click",
              target: `bet-type-${type.toLowerCase()}`,
            })
          }
          onToggleUnicorn={toggleUnicorn}
        />
      )}

      {page === "bettor" && (
        <BettorDashboardPage
          bettor={bettor}
          onOpenHistory={() => setIsHistoryOpen(true)}
        />
      )}

      {page === "product" && (
        <ProductUsagePage loading={productLoading} product={product} />
      )}

      {isConfirmOpen && selectedRace && (
        <ConfirmBetModal
          amount={amount}
          betType={betType}
          isSubmitting={isCreatingBet}
          selectedPotentialWin={selectedPotentialWin}
          selectedRace={selectedRace}
          selectedUnicorns={selectedUnicorns}
          onCancel={() => setIsConfirmOpen(false)}
          onSubmit={submitBet}
        />
      )}

      {isSuccessOpen && (
        <SuccessModal onClose={() => setIsSuccessOpen(false)} />
      )}

      {isHistoryOpen && (
        <BetHistoryModal
          bettor={bettor}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}
    </main>
  );
}
