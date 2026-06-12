"use client";

import { Battery, Filter, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { batteries, batteryFilters } from "@/data/batteries";
import { orderNeedOptions } from "@/lib/constants";
import { cn, normalizeText } from "@/lib/utils";
import type { BatteryFilter, OrderContext } from "@/types/battery";
import OrderSummary from "@/components/OrderSummary";

const STORAGE_KEY = "nja-order-draft-v1";

interface StoredOrderDraft {
  selectedIds: string[];
  context: OrderContext;
}

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
        activeFilter === "all" || item.vehicleType === activeFilter || item.technology === activeFilter;
      const matchesQuery = !normalizedQuery || getSearchableText(item).includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, query]);

  const popularItems = filteredItems.filter((item) => item.isPopular).length;

  const toggleItem = (id: string) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]));
  };

  const removeItem = (id: string) => setSelectedIds((current) => current.filter((itemId) => itemId !== id));

  return (
    <section id="cari-aki" className="section search-section" aria-labelledby="search-title">
      <div className="section-heading phi-heading">
        <div>
          <p className="section-kicker">
            <Search size={16} aria-hidden="true" />
            Cari berdasarkan kendaraan atau kode aki
          </p>
          <h2 id="search-title">Cari Aki Kendaraanmu</h2>
        </div>
        <p>
          Pencarian ini panduan awal. Untuk memastikan ukuran, kutub, terminal, stok, dan harga, konfirmasi ke admin.
        </p>
      </div>

      <div className="search-layout phi-grid">
        <div className="catalog-panel">
          <div className="search-toolbar glass-panel">
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
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="catalog-meta">
            <span>{filteredItems.length} tipe tampil</span>
            <span>{popularItems} rekomendasi populer</span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="empty-state glass-panel" role="status">
              <Battery size={26} aria-hidden="true" />
              <h3>Tidak ada hasil yang cocok</h3>
              <p>Coba pakai nama kendaraan, kode aki lain, atau langsung konsultasi ke admin.</p>
            </div>
          ) : (
            <div className="battery-grid">
              {filteredItems.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <article className={cn("battery-card", isSelected && "is-selected")} key={item.id}>
                    {item.isPopular ? (
                      <span className="popular-badge">
                        <Sparkles size={13} aria-hidden="true" />
                        Sering dicari
                      </span>
                    ) : null}
                    <div className="battery-card-head">
                      <div>
                        <h3>{item.code}</h3>
                        <p>{item.capacity}</p>
                      </div>
                      <span>{item.typeLabel}</span>
                    </div>
                    <p className="battery-fit">
                      <strong>Umumnya untuk:</strong> {item.commonVehicles.join(", ")}
                    </p>
                    {item.note ? <p className="battery-note">{item.note}</p> : null}
                    <button className="battery-select" type="button" onClick={() => toggleItem(item.id)}>
                      {isSelected ? "Dipilih" : "Pilih Aki"}
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
