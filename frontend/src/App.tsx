import { RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  api,
  BetType,
  BettorDashboard,
  ProductDashboard,
  Race,
  Unicorn,
} from "./api";
import { AppNav } from "./components/AppNav";
import { Page, selectionCount } from "./constants";
import { BetHistoryModal } from "./modals/BetHistoryModal";
import { ConfirmBetModal } from "./modals/ConfirmBetModal";
import { SuccessModal } from "./modals/SuccessModal";
import { BettorDashboardPage } from "./pages/BettorDashboardPage";
import { ProductUsagePage } from "./pages/ProductUsagePage";
import { RacesPage } from "./pages/RacesPage";
import { delay } from "./utils/format";

export function App() {
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedRaceId, setSelectedRaceId] = useState<string>("");
  const [betType, setBetType] = useState<BetType>("WINNER");
  const [selectedUnicornIds, setSelectedUnicornIds] = useState<string[]>([]);
  const [amount, setAmount] = useState(10);
  const [bettor, setBettor] = useState<BettorDashboard | null>(null);
  const [product, setProduct] = useState<ProductDashboard | null>(null);
  const [demoUserId, setDemoUserId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState<Page>("races");

  const selectedRace =
    races.find((race) => race.id === selectedRaceId) ?? races[0];

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

  const loadData = async () => {
    setLoading(true);
    const raceList = await api.races();
    setRaces(raceList);
    setSelectedRaceId((current) => current || raceList[0]?.id || "");

    const demoUser = await api.demoUser();
    if (!demoUser) {
      throw new Error("Aucun parieur de démonstration. Lancez le seed Prisma.");
    }

    setDemoUserId(demoUser.id);
    const [bettorDashboard, productDashboard] = await Promise.all([
      api.bettorDashboard(demoUser.id),
      api.productDashboard(),
    ]);
    setBettor(bettorDashboard);
    setProduct(productDashboard);
    setLoading(false);
  };

  const refreshProductUsage = async () => {
    setProductLoading(true);
    try {
      await api.track({
        userId: demoUserId || undefined,
        name: "view",
        target: "product-dashboard",
      });
      const productDashboard = await api.productDashboard();
      setProduct(productDashboard);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Impossible de rafraîchir les données produit",
      );
    } finally {
      setProductLoading(false);
    }
  };

  useEffect(() => {
    loadData().catch((error) => {
      setMessage(error.message);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (demoUserId) {
      api.track({ userId: demoUserId, name: "view", target: "race-list" });
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
    setIsSubmitting(true);
    await api.track({
      userId: demoUserId,
      name: "click",
      target: "bet-submit",
      metadata: { betType },
    });

    try {
      await delay(1200);
      await api.createBet({
        userId: demoUserId,
        raceId: selectedRace.id,
        type: betType,
        amount,
        unicornIds: selectedUnicornIds,
        card: { token: "tok_demo_card", last4: "4242" },
      });
      setIsConfirmOpen(false);
      setIsSuccessOpen(true);
      setSelectedUnicornIds([]);
      await loadData();
    } catch (error) {
      setIsConfirmOpen(false);
      setMessage(
        error instanceof Error ? error.message : "Impossible de créer le pari",
      );
    } finally {
      setIsSubmitting(false);
    }
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
          onClick={() => loadData()}
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
            api.track({
              userId: demoUserId,
              name: "click",
              target: "race-row",
              metadata: { raceId },
            })
          }
          onTrackTypeClick={(type) =>
            api.track({
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
          isSubmitting={isSubmitting}
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
