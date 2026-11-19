"use client";

import {
  Battery,
  BatteryCharging,
  Bike,
  Car,
  Check,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { batteries } from "@/data/batteries";
import {
  QUICK_SEARCH_KEYWORDS,
  searchAndSortBatteries,
} from "@/lib/battery-search";
import { orderNeedOptions } from "@/lib/constants";
import { cn, normalizeText } from "@/lib/utils";
import type {
  BatterySortOption,
  BatteryTechFilter,
  BatteryVehicleFilter,
  OrderContext,
} from "@/types/battery";
import OrderSummary from "@/components/OrderSummary";

const STORAGE_KEY = "nja-order-draft-v1";

interface StoredOrderDraft {
  selectedIds: string[];
  context: OrderContext;
}

const VEHICLE_TABS: readonly { id: BatteryVehicleFilter; label: string; desktopSuffix?: string }[] = [
  { id: "all", label: "Semua" },
  { id: "car", label: "Mobil" },
  { id: "motorcycle", label: "Motor" },
  { id: "vrla", label: "VRLA", desktopSuffix: " / UPS" },
];

const TECH_CHIPS: readonly { id: BatteryTechFilter; label: string }[] = [
  { id: "all", label: "Semua Tipe" },
  { id: "mf", label: "Kering / MF" },
  { id: "dry-charge", label: "Basah" },
];

const SORT_OPTIONS: readonly { id: BatterySortOption; label: string }[] = [
  { id: "relevance", label: "Paling Relevan" },
  { id: "popular", label: "Populer" },
  { id: "capacity-asc", label: "Kapasitas Terkecil" },
  { id: "capacity-desc", label: "Kapasitas Terbesar" },
  { id: "code-asc", label: "Kode A–Z" },
];

const VEHICLE_META = {
  car: { label: "Mobil", bannerClass: "is-car", icon: Car },
  motorcycle: { label: "Motor", bannerClass: "is-motorcycle", icon: Bike },
  vrla: { label: "VRLA", bannerClass: "is-vrla", icon: BatteryCharging },
} as const;

const TECH_BADGE_MAP = {
  "maintenance-free": "is-mf",
  "motorcycle-mf": "is-mf",
  "dry-charge": "is-dry",
  vrla: "is-vrla",
} as const;

export default function BatterySearch() {
  const [query, setQuery] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState<BatteryVehicleFilter>("all");
  const [techFilter, setTechFilter] = useState<BatteryTechFilter>("all");
  const [onlyPopular, setOnlyPopular] = useState(false);
  const [sortBy, setSortBy] = useState<BatterySortOption>("relevance");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [context, setContext] = useState<OrderContext>({ vehicle: "", need: "", location: "" });
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const restoreDraftTimer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        setDraftLoaded(true);
        return;
      }

      try {
        const parsed = JSON.parse(saved) as StoredOrderDraft;
        setSelectedIds(Array.isArray(parsed.selectedIds) ? parsed.selectedIds : []);
        setContext({
          vehicle: parsed.context?.vehicle ?? "",
          need: parsed.context?.need ?? "",
          location: parsed.context?.location ?? "",
        });
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        setDraftLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(restoreDraftTimer);
  }, []);

  useEffect(() => {
    if (!draftLoaded) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ selectedIds, context } satisfies StoredOrderDraft),
    );
  }, [selectedIds, context, draftLoaded]);

  const selectedItems = useMemo(
    () => batteries.filter((item) => selectedIds.includes(item.id)),
    [selectedIds],
  );

  const filteredItems = useMemo(
    () =>
      searchAndSortBatteries(batteries, {
        query,
        filters: {
          vehicle: vehicleFilter,
          tech: techFilter,
          onlyPopular,
        },
        sort: sortBy,
      }),
    [query, vehicleFilter, techFilter, onlyPopular, sortBy],
  );

  const popularItems = filteredItems.filter((item) => item.isPopular).length;
  const trimmedQuery = query.trim();
  const hasCatalogRefinement =
    Boolean(trimmedQuery) ||
    vehicleFilter !== "all" ||
    techFilter !== "all" ||
    onlyPopular ||
    sortBy !== "relevance";

  const handleVehicleChange = (nextVehicle: BatteryVehicleFilter) => {
    setVehicleFilter(nextVehicle);
    if (nextVehicle === "vrla") {
      setTechFilter("all");
    }
  };

  const toggleItem = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id],
    );
  };

  const removeItem = (id: string) => {
    setSelectedIds((current) => current.filter((itemId) => itemId !== id));
  };

  const resetCatalog = () => {
    setQuery("");
    setVehicleFilter("all");
    setTechFilter("all");
    setOnlyPopular(false);
    setSortBy("relevance");
  };

  const openConsultDrawer = (prefillVehicle?: string) => {
    const cleanPrefill = prefillVehicle?.trim();
    if (cleanPrefill && !context.vehicle.trim()) {
      setContext((prev) => ({ ...prev, vehicle: cleanPrefill }));
    }
    setIsDrawerOpen(true);
  };

  return (
    <section id="cari-aki" className="section search-section" aria-labelledby="search-title">
      <div className="catalog-head">
        <h2 id="search-title">Katalog Aki</h2>
        <span className="catalog-head-count">{batteries.length} tipe</span>
      </div>

      <div className="catalog-sticky-search">
        <div className="search-input-wrap">
          <label htmlFor="battery-search-input" className="sr-only">
            Cari aki kendaraan atau kode
          </label>
          <Search size={17} className="search-input-icon" aria-hidden="true" />
          <input
            ref={searchInputRef}
            id="battery-search-input"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari mobil, motor, atau kode (Avanza, NMAX, NS40)..."
            autoComplete="off"
          />
          {query ? (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => {
                setQuery("");
                searchInputRef.current?.focus();
              }}
              aria-label="Hapus pencarian"
            >
              <X size={14} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="quick-search-strip" aria-label="Pencarian cepat kendaraan populer">
        {QUICK_SEARCH_KEYWORDS.map((keyword) => {
          const isKeywordActive = normalizeText(query) === normalizeText(keyword);
          return (
            <button
              key={keyword}
              type="button"
              className={cn("quick-pill", isKeywordActive && "is-active")}
              aria-pressed={isKeywordActive}
              onClick={() => setQuery(isKeywordActive ? "" : keyword)}
            >
              {keyword}
            </button>
          );
        })}
      </div>

      <div className="vehicle-tabs" role="tablist" aria-label="Segmen kendaraan">
        {VEHICLE_TABS.map((tab) => {
          const active = vehicleFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={cn("vehicle-tab", active && "is-active")}
              onClick={() => handleVehicleChange(tab.id)}
            >
              {tab.label}
              {tab.desktopSuffix ? <span className="hide-mobile">{tab.desktopSuffix}</span> : null}
            </button>
          );
        })}
      </div>

      <div className="facet-bar">
        <div className="facet-chips" aria-label="Filter tipe aki">
          {TECH_CHIPS.map((chip) => {
            const disabledForVrla = vehicleFilter === "vrla" && chip.id !== "all";
            const active = techFilter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                disabled={disabledForVrla}
                aria-pressed={active}
                className={cn("filter-chip", active && "is-active")}
                onClick={() => setTechFilter(chip.id)}
              >
                {chip.label}
              </button>
            );
          })}
          <button
            type="button"
            aria-pressed={onlyPopular}
            className={cn("filter-chip is-popular-chip", onlyPopular && "is-active")}
            onClick={() => setOnlyPopular((prev) => !prev)}
          >
            <Sparkles size={12} aria-hidden="true" />
            Terlaris
          </button>
        </div>
      </div>

      <div className="catalog-toolbar-row">
        <div className="catalog-meta">
          <span>{filteredItems.length} produk</span>
          <span className="hide-mobile">• {popularItems} populer</span>
          {selectedItems.length > 0 ? (
            <span className="meta-cart-count">• {selectedItems.length} dipilih</span>
          ) : null}
        </div>

        <div className="facet-actions">
          <select
            className="catalog-sort-select"
            aria-label="Urutkan katalog"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as BatterySortOption)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>

          {hasCatalogRefinement ? (
            <button className="catalog-reset" type="button" onClick={resetCatalog}>
              <X size={13} aria-hidden="true" />
              Reset
            </button>
          ) : null}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty-state glass-panel" role="status">
          <Battery size={26} aria-hidden="true" />
          {trimmedQuery ? (
            <>
              <h3>Tidak ada hasil untuk &ldquo;{trimmedQuery}&rdquo;</h3>
              <p>Coba nama mobil/motor lain, hapus filter aktif, atau langsung konsultasi ke admin.</p>
              <div className="empty-state-actions">
                <button type="button" className="catalog-reset" onClick={resetCatalog}>
                  Reset pencarian
                </button>
                <button
                  type="button"
                  className="btn btn-primary empty-state-cta"
                  onClick={() => openConsultDrawer(trimmedQuery)}
                >
                  Tanya Admin untuk &ldquo;{trimmedQuery}&rdquo; via WA
                </button>
              </div>
            </>
          ) : (
            <>
              <h3>Tidak ada aki yang cocok dengan kombinasi filter ini</h3>
              <p>Ubah kombinasi tipe/segmen di atas atau langsung konsultasi kecocokan aki via WhatsApp.</p>
              <div className="empty-state-actions">
                <button type="button" className="catalog-reset" onClick={resetCatalog}>
                  Reset filter
                </button>
                <button
                  type="button"
                  className="btn btn-primary empty-state-cta"
                  onClick={() => openConsultDrawer()}
                >
                  Tanya Admin via WhatsApp
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="battery-grid">
          {filteredItems.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const meta = VEHICLE_META[item.vehicleType];
            const VehicleIcon = meta.icon;
            const techClass = TECH_BADGE_MAP[item.technology];

            return (
              <article className={cn("battery-card", meta.bannerClass, isSelected && "is-selected")} key={item.id}>
                <div className="battery-card-top">
                  <span className="battery-segment-label">
                    <VehicleIcon size={12} aria-hidden="true" />
                    {meta.label}
                  </span>
                  {item.isPopular ? (
                    <span className="popular-badge">
                      <Sparkles size={10} aria-hidden="true" />
                      Populer
                    </span>
                  ) : null}
                </div>

                <div className="battery-card-head">
                  <div>
                    <h3>{item.code}</h3>
                    <p>{item.capacity}</p>
                  </div>
                  <span className={cn("battery-tech-tag", techClass)}>{item.typeLabel}</span>
                </div>

                <p className="battery-fit">
                  {item.commonVehicles.join(", ")}
                </p>

                <div className="battery-card-footer">
                  <button
                    className="battery-select"
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleItem(item.id)}
                  >
                    {isSelected ? (
                      <>
                        <Check size={13} aria-hidden="true" /> Dipilih
                      </>
                    ) : (
                      "+ Pilih"
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <OrderSummary
        selectedItems={selectedItems}
        context={context}
        onContextChange={setContext}
        onRemoveItem={removeItem}
        onClearItems={() => setSelectedIds([])}
        needOptions={orderNeedOptions}
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </section>
  );
}
