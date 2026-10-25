"use client";

import { Battery, CheckCircle2, Filter, MessageCircle, Search, ShieldCheck, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { batteries, batteryFilters } from "@/data/batteries";
import { orderNeedOptions, WHATSAPP_URL } from "@/lib/constants";
import { cn, normalizeText } from "@/lib/utils";
import type { BatteryFilter, OrderContext } from "@/types/battery";
import OrderSummary from "@/components/OrderSummary";

const STORAGE_KEY = "nja-order-draft-v1";

interface StoredOrderDraft {
  selectedIds: string[];
  context: OrderContext;
}

const marketplaceHighlights = [
  {
    label: "Panduan katalog",
    value: `${batteries.length} tipe`,
    description: "Mobil, motor, MF/kering, basah, dan VRLA.",
    icon: Battery,
  },
  {
    label: "Konfirmasi manual",
    value: "Via WhatsApp",
    description: "Stok, harga, merek, dan opsi pemasangan dicek dulu.",
    icon: MessageCircle,
  },
  {
    label: "Lebih aman pilih",
    value: "Cek ukuran",
    description: "Kode aki tetap perlu dicocokkan dengan kendaraanmu.",
    icon: ShieldCheck,
  },
] as const;

function getSearchableText(item: (typeof batteries)[number]) {
  return normalizeText(
    [
      item.code,
      item.capacity,
      item.categoryLabel,
      item.typeLabel,
      ...item.commonVehicles,
      ...item.keywords,
    ].join(" "),
  );
}

export default function BatterySearch() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<BatteryFilter>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [context, setContext] = useState<OrderContext>({ vehicle: "", need: "", location: "" });
  const [draftLoaded, setDraftLoaded] = useState(false);

  useEffect(() => {
    const restoreDraftTimer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        setDraftLoaded(true);
        return;
      }

      try {
        const parsed = JSON.parse(saved) as StoredOrderDraft;
        setSelectedIds(parsed.selectedIds ?? []);
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
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ selectedIds, context } satisfies StoredOrderDraft));
  }, [selectedIds, context, draftLoaded]);

  const selectedItems = useMemo(
    () => batteries.filter((item) => selectedIds.includes(item.id)),
    [selectedIds],
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = normalizeText(query);
    return batteries.filter((item) => {
      const matchesFilter =
        activeFilter === "all" ||
        item.vehicleType === activeFilter ||
        item.technology === activeFilter ||
        (activeFilter === "maintenance-free" && item.technology === "motorcycle-mf");
      const matchesQuery = !normalizedQuery || getSearchableText(item).includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, query]);

  const popularItems = filteredItems.filter((item) => item.isPopular).length;
  const activeFilterLabel = batteryFilters.find((filter) => filter.id === activeFilter)?.label ?? "Semua";
  const hasCatalogRefinement = Boolean(query.trim()) || activeFilter !== "all";

  const toggleItem = (id: string) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]));
  };

  const removeItem = (id: string) => setSelectedIds((current) => current.filter((itemId) => itemId !== id));

  const resetCatalog = () => {
    setQuery("");
    setActiveFilter("all");
  };

  return (
    <section id="cari-aki" className="section search-section" aria-labelledby="search-title">
      <div className="section-heading phi-heading">
        <div>
          <p className="section-kicker">
            <Search size={16} aria-hidden="true" />
            Cari berdasarkan kendaraan atau kode aki
          </p>
          <h2 id="search-title">Katalog Aki Kendaraan</h2>
        </div>
        <p>
          Pilih tipe aki seperti berbelanja di katalog. Hasil ini panduan awal; stok, harga, merek, dan kecocokan akhir tetap dikonfirmasi via WhatsApp.
        </p>
      </div>

      <div className="marketplace-strip glass-panel" aria-label="Ringkasan cara memakai katalog aki">
        {marketplaceHighlights.map((item) => {
          const Icon = item.icon;
          return (
            <article className="marketplace-strip-card" key={item.label}>
              <span className="marketplace-strip-icon" aria-hidden="true">
                <Icon size={18} />
              </span>
              <div>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.description}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="search-layout phi-grid">
        <div className="catalog-panel">
          <div className="search-toolbar glass-panel">
            <div className="catalog-toolbar-head">
              <div>
                <span>Katalog aktif</span>
                <strong>{activeFilterLabel}</strong>
              </div>
              {hasCatalogRefinement ? (
                <button className="catalog-reset" type="button" onClick={resetCatalog}>
                  <X size={15} aria-hidden="true" />
                  Reset
                </button>
              ) : null}
            </div>

            <label className="search-input-wrap" htmlFor="battery-search-input">
              <Search size={20} aria-hidden="true" />
              <span className="sr-only">Cari aki</span>
              <input
                id="battery-search-input"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari Avanza, Brio, Innova, NMAX, Vario, NS40, GTZ5..."
                autoComplete="off"
              />
            </label>

            <div className="filter-list" aria-label="Filter katalog aki">
              <Filter size={18} aria-hidden="true" />
              {batteryFilters.map((filter) => (
                <button
                  key={filter.id}
                  className={cn("filter-chip", activeFilter === filter.id && "is-active")}
                  type="button"
                  aria-pressed={activeFilter === filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="catalog-meta">
            <span>{filteredItems.length} tipe tampil</span>
            <span>{popularItems} sering dicari</span>
            <span>{selectedItems.length} masuk ringkasan</span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="empty-state glass-panel" role="status">
              <Battery size={26} aria-hidden="true" />
              <h3>Tidak ada hasil yang cocok</h3>
              <p>Coba nama kendaraan, kode aki lain, reset filter, atau langsung konsultasi ke admin.</p>
              <a className="btn btn-secondary empty-state-cta" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                Tanya admin
              </a>
            </div>
          ) : (
            <div className="battery-grid">
              {filteredItems.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <article className={cn("battery-card", isSelected && "is-selected")} key={item.id}>
                    <div className="battery-card-topline">
                      {item.isPopular ? (
                        <span className="popular-badge">
                          <Sparkles size={11} aria-hidden="true" />
                          Populer
                        </span>
                      ) : (
                        <span className="catalog-badge">Panduan</span>
                      )}
                      {isSelected ? (
                        <span className="selected-badge">
                          <CheckCircle2 size={11} aria-hidden="true" />
                          Dipilih
                        </span>
                      ) : null}
                    </div>

                    <div className="battery-card-head">
                      <div>
                        <h3>{item.code}</h3>
                        <p>{item.capacity}</p>
                      </div>
                      <span className="battery-tech-tag">{item.typeLabel}</span>
                    </div>

                    <p className="battery-fit">
                      <strong>Untuk:</strong> {item.commonVehicles.join(", ")}
                    </p>

                    <button
                      className="battery-select"
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => toggleItem(item.id)}
                    >
                      {isSelected ? "Hapus" : "+ Pilih"}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <OrderSummary
          selectedItems={selectedItems}
          context={context}
          onContextChange={setContext}
          onRemoveItem={removeItem}
          needOptions={orderNeedOptions}
        />
      </div>
    </section>
  );
}
