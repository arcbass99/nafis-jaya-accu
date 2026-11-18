import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);
const rootDir = process.cwd();
const moduleCache = new Map();

function loadTsModule(filePath, pathname = "/home/pesan-aki") {
  const absPath = path.resolve(filePath);
  const cacheKey = `${absPath}::${pathname}`;
  if (moduleCache.has(cacheKey)) return moduleCache.get(cacheKey);

  const source = fs.readFileSync(absPath, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });

  const mod = { exports: {} };
  moduleCache.set(cacheKey, mod.exports);

  const localRequire = (specifier) => {
    if (specifier === "next/link") {
      return {
        __esModule: true,
        default: ({ href, children, ...rest }) =>
          React.createElement("a", { href, ...rest }, children),
      };
    }
    if (specifier === "next/image") {
      return {
        __esModule: true,
        default: ({ alt, src, ...rest }) =>
          React.createElement("img", { alt: alt ?? "", src, ...rest }),
      };
    }
    if (specifier === "next/navigation") {
      return {
        __esModule: true,
        usePathname: () => pathname,
      };
    }
    if (specifier.endsWith(".css")) {
      return {};
    }
    if (specifier.startsWith("@/")) {
      const rel = specifier.slice(2);
      const candidates = [
        path.join(rootDir, "src", `${rel}.ts`),
        path.join(rootDir, "src", `${rel}.tsx`),
      ];
      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          return loadTsModule(candidate, pathname);
        }
      }
    }
    if (specifier.startsWith("./") || specifier.startsWith("../")) {
      const baseDir = path.dirname(absPath);
      const candidates = [
        path.resolve(baseDir, `${specifier}.ts`),
        path.resolve(baseDir, `${specifier}.tsx`),
      ];
      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          return loadTsModule(candidate, pathname);
        }
      }
    }
    return require(specifier);
  };

  const fn = new Function("exports", "require", "module", outputText);
  fn(mod.exports, localRequire, mod);
  return mod.exports;
}

const batteriesPath = path.join(rootDir, "src/data/batteries.ts");
const searchLibPath = path.join(rootDir, "src/lib/battery-search.ts");
const orderSummaryPath = path.join(rootDir, "src/components/OrderSummary.tsx");
const batterySearchPath = path.join(rootDir, "src/components/BatterySearch.tsx");
const globalsCssPath = path.join(rootDir, "src/app/globals.css");

test("Task 1: smart search matches multi-token, separator variations, digit-guarded codes, and typo fallbacks", () => {
  assert.ok(fs.existsSync(searchLibPath), "Expected src/lib/battery-search.ts to exist");
  const { batteries } = loadTsModule(batteriesPath);
  const {
    searchAndSortBatteries,
    QUICK_SEARCH_KEYWORDS,
    extractCapacityAh,
  } = loadTsModule(searchLibPath);

  assert.equal(batteries.length, 36);
  assert.ok(Array.isArray(QUICK_SEARCH_KEYWORDS) && QUICK_SEARCH_KEYWORDS.length >= 6);
  assert.equal(extractCapacityAh("32 Ah"), 32);
  assert.equal(extractCapacityAh("Motor / MF"), null);

  const defaultFilters = { vehicle: "all", tech: "all", onlyPopular: false };

  // Multi-token across vehicle + tech
  const avanzaKering = searchAndSortBatteries(batteries, {
    query: "avanza kering",
    filters: defaultFilters,
    sort: "relevance",
  });
  assert.ok(avanzaKering.length >= 1);
  assert.ok(avanzaKering.every((item) => item.technology === "maintenance-free"));
  assert.ok(avanzaKering.some((item) => item.code === "NS40/L"));

  // Separator normalization
  const nsSpaced = searchAndSortBatteries(batteries, {
    query: "ns 40",
    filters: defaultFilters,
    sort: "relevance",
  });
  assert.ok(nsSpaced.some((item) => item.code === "NS40/L"));

  const gtzHyphen = searchAndSortBatteries(batteries, {
    query: "gtz-5",
    filters: defaultFilters,
    sort: "relevance",
  });
  assert.ok(gtzHyphen.some((item) => item.code === "GTZ5"));

  const xtrailNoHyphen = searchAndSortBatteries(batteries, {
    query: "xtrail",
    filters: defaultFilters,
    sort: "relevance",
  });
  assert.ok(xtrailNoHyphen.some((item) => item.code === "55D23L"));

  // Digit guard: NS40 must NOT fuzzy match NS60 or NS70; GTZ7S must NOT fuzzy match GTZ7V
  const ns40Exact = searchAndSortBatteries(batteries, {
    query: "NS40",
    filters: defaultFilters,
    sort: "relevance",
  });
  assert.ok(ns40Exact.length >= 2);
  assert.ok(ns40Exact.every((item) => item.code.startsWith("NS40")));

  const gtz7sExact = searchAndSortBatteries(batteries, {
    query: "GTZ7S",
    filters: defaultFilters,
    sort: "relevance",
  });
  assert.equal(gtz7sExact.length, 1);
  assert.equal(gtz7sExact[0].code, "GTZ7S");

  // Alphabetical zero-hit fuzzy fallback
  const avansaTypo = searchAndSortBatteries(batteries, {
    query: "avansa",
    filters: defaultFilters,
    sort: "relevance",
  });
  assert.ok(avansaTypo.some((item) => item.commonVehicles.includes("Avanza")));

  const inovaTypo = searchAndSortBatteries(batteries, {
    query: "inova",
    filters: defaultFilters,
    sort: "relevance",
  });
  assert.ok(inovaTypo.some((item) => item.code === "55D23L"));
});

test("Task 1: multi-facet filters (AND) and all 5 sorting modes work accurately", () => {
  assert.ok(fs.existsSync(searchLibPath), "Expected src/lib/battery-search.ts to exist");
  const { batteries } = loadTsModule(batteriesPath);
  const { extractCapacityAh, searchAndSortBatteries } = loadTsModule(searchLibPath);

  const motorMf = searchAndSortBatteries(batteries, {
    query: "",
    filters: { vehicle: "motorcycle", tech: "mf", onlyPopular: false },
    sort: "relevance",
  });
  assert.equal(motorMf.length, 4);
  assert.ok(motorMf.every((item) => item.vehicleType === "motorcycle" && item.technology === "motorcycle-mf"));

  const popularOnly = searchAndSortBatteries(batteries, {
    query: "",
    filters: { vehicle: "all", tech: "all", onlyPopular: true },
    sort: "popular",
  });
  assert.ok(popularOnly.length > 0 && popularOnly.every((item) => item.isPopular));

  const asc = searchAndSortBatteries(batteries, {
    query: "",
    filters: { vehicle: "all", tech: "all", onlyPopular: false },
    sort: "capacity-asc",
  });
  assert.equal(asc[0].code, "VRLA 1212");
  assert.equal(extractCapacityAh(asc[asc.length - 1].capacity), null);
  const carOnlyAsc = searchAndSortBatteries(batteries, {
    query: "",
    filters: { vehicle: "car", tech: "all", onlyPopular: false },
    sort: "capacity-asc",
  });
  assert.equal(carOnlyAsc[0].capacity, "32 Ah");
  assert.equal(carOnlyAsc[carOnlyAsc.length - 1].capacity, "100 Ah");

  const desc = searchAndSortBatteries(batteries, {
    query: "",
    filters: { vehicle: "car", tech: "all", onlyPopular: false },
    sort: "capacity-desc",
  });
  assert.equal(desc[0].capacity, "100 Ah");
  assert.equal(desc[desc.length - 1].capacity, "32 Ah");

  const codeAsc = searchAndSortBatteries(batteries, {
    query: "",
    filters: { vehicle: "all", tech: "all", onlyPopular: false },
    sort: "code-asc",
  });
  assert.ok(codeAsc[0].code.localeCompare(codeAsc[codeAsc.length - 1].code) < 0);
});

test("Task 2: OrderSummary renders universal floating pill, controlled open drawer, Kosongkan button, and Escape focus restore", () => {
  const { batteries } = loadTsModule(batteriesPath);
  const { default: OrderSummary } = loadTsModule(orderSummaryPath);

  const emptyHtml = renderToStaticMarkup(
    React.createElement(OrderSummary, {
      selectedItems: [],
      context: { vehicle: "", need: "", location: "" },
      onContextChange: () => {},
      onRemoveItem: () => {},
      onClearItems: () => {},
      needOptions: ["Beli aki baru"],
      isOpen: false,
      onOpenChange: () => {},
    }),
  );

  assert.match(emptyHtml, /class="floating-cart-btn"[^>]*aria-expanded="false"[^>]*aria-controls="order-summary-drawer"/);
  assert.match(emptyHtml, /Ringkasan WA/);
  assert.doesNotMatch(emptyHtml, /summary-clear-btn/);
  assert.doesNotMatch(emptyHtml, /mobile-floating-cart/);

  const openHtml = renderToStaticMarkup(
    React.createElement(OrderSummary, {
      selectedItems: batteries.slice(0, 2),
      context: { vehicle: "Avanza", need: "Beli aki baru", location: "Sidoarjo" },
      onContextChange: () => {},
      onRemoveItem: () => {},
      onClearItems: () => {},
      needOptions: ["Beli aki baru"],
      isOpen: true,
      onOpenChange: () => {},
    }),
  );

  assert.match(openHtml, /class="floating-cart-btn has-items"[^>]*aria-expanded="true"/);
  assert.match(openHtml, /2 Aki • Lanjut WA/);
  assert.match(openHtml, /id="order-summary-drawer"[^>]*class="order-summary glass-panel is-open"/);
  assert.match(openHtml, /class="summary-clear-btn"[^>]*>Kosongkan</);
  assert.match(openHtml, /class="summary-close"/);

  const source = fs.readFileSync(orderSummaryPath, "utf8");
  assert.match(source, /Escape/);
  assert.match(source, /triggerRef\.current\?\.focus\(\)/);
});

test("Task 3: BatterySearch renders olshop showcase, sticky search bar, quick pills, multi-facet filters, and 36 visual cards", () => {
  const { default: BatterySearch } = loadTsModule(batterySearchPath);
  const { QUICK_SEARCH_KEYWORDS } = loadTsModule(searchLibPath);
  const html = renderToStaticMarkup(React.createElement(BatterySearch));

  assert.doesNotMatch(html, /class="marketplace-strip/);
  assert.match(html, /class="catalog-info-bar"/);
  assert.match(html, /Bingung tipe\? Tanya Admin/);
  assert.match(html, /class="catalog-sticky-search"/);
  assert.match(html, /class="quick-search-strip"/);

  for (const kw of QUICK_SEARCH_KEYWORDS) {
    assert.match(html, new RegExp(`>${kw}<`));
  }

  assert.match(html, /class="vehicle-tabs"[^>]*role="tablist"/);
  assert.equal((html.match(/role="tab"/g) ?? []).length, 4);
  assert.match(html, /Kering \/ MF/);
  assert.match(html, /Basah/);
  assert.match(html, /Terlaris/);
  assert.match(html, /aria-label="Urutkan katalog"/);

  assert.equal((html.match(/class="battery-card"/g) ?? []).length, 36);
  assert.equal((html.match(/class="battery-card-banner /g) ?? []).length, 36);
  assert.match(html, /Cek stok &amp; harga di WA/);
  assert.match(html, /class="floating-cart-btn"/);

  const source = fs.readFileSync(batterySearchPath, "utf8");
  assert.match(source, /searchAndSortBatteries/);
  assert.match(source, /setTechFilter\("all"\)/);
  assert.match(source, /Tidak ada aki yang cocok dengan kombinasi filter ini/);
  assert.match(source, /onClearItems/);
});

test("Task 4: globals.css uses overflow-x clip, 4-col desktop / 2-col mobile grid, sticky search bar, universal floating cart drawer, and reduced-motion", () => {
  const css = fs.readFileSync(globalsCssPath, "utf8");

  assert.match(css, /body\s*\{[^}]*overflow-x:\s*clip;/s);
  assert.doesNotMatch(css, /\.marketplace-strip/);
  assert.doesNotMatch(css, /\.search-layout\s*\{/);
  assert.doesNotMatch(css, /\.mobile-floating-cart/);

  assert.match(css, /\.battery-grid\s*\{[^}]*grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*\.battery-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /\.catalog-sticky-search\s*\{[^}]*position:\s*sticky;/s);
  assert.match(css, /@media\s*\(max-width:\s*1024px\)[\s\S]*\.catalog-sticky-search\s*\{[^}]*top:\s*3rem;/);

  assert.match(css, /\.floating-cart-btn\s*\{[^}]*display:\s*flex;/s);
  assert.match(css, /\.order-summary\s*\{[^}]*position:\s*fixed;[^}]*visibility:\s*hidden;[^}]*transform:\s*translateX\(105%\)/s);
  assert.match(css, /\.order-summary\.is-open\s*\{[^}]*visibility:\s*visible;[^}]*transform:\s*translateX\(0\)/s);
  assert.match(css, /@media\s*\(max-width:\s*1024px\)[\s\S]*\.order-summary\s*\{[^}]*transform:\s*translateY\(105%\)/);
  assert.match(css, /@media\s*\(max-width:\s*1024px\)[\s\S]*\.order-summary\.is-open\s*\{[^}]*transform:\s*translateY\(0\)/);

  const reducedMotionBlock = css.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*\}\s*$/)?.[0] ?? "";
  assert.match(reducedMotionBlock, /\.floating-cart-btn/);
  assert.match(reducedMotionBlock, /\.order-summary/);
});

test("Final Review Fixes: numeric separator queries stay exact, drawer exposes dialog + focus entry, cards wrap cleanly, and reduced-motion covers is-open", () => {
  const { batteries } = loadTsModule(batteriesPath);
  const { searchAndSortBatteries } = loadTsModule(searchLibPath);
  const { default: OrderSummary } = loadTsModule(orderSummaryPath);

  const gtz5 = searchAndSortBatteries(batteries, {
    query: "gtz-5",
    filters: { vehicle: "all", tech: "all", onlyPopular: false },
    sort: "relevance",
  });
  assert.equal(gtz5.length, 1);
  assert.equal(gtz5[0].code, "GTZ5");

  const ns4 = searchAndSortBatteries(batteries, {
    query: "ns 4",
    filters: { vehicle: "all", tech: "all", onlyPopular: false },
    sort: "relevance",
  });
  assert.equal(ns4.length, 4);
  assert.ok(ns4.every((item) => item.code.startsWith("NS40")));

  const nx100 = searchAndSortBatteries(batteries, {
    query: "nx 100",
    filters: { vehicle: "all", tech: "all", onlyPopular: false },
    sort: "relevance",
  });
  assert.equal(nx100.length, 2);
  assert.ok(nx100.every((item) => item.code === "NX100-6/L"));

  const closedHtml = renderToStaticMarkup(
    React.createElement(OrderSummary, {
      selectedItems: [],
      context: { vehicle: "", need: "", location: "" },
      onContextChange: () => {},
      onRemoveItem: () => {},
      needOptions: ["Beli aki baru"],
      isOpen: false,
      onOpenChange: () => {},
    }),
  );
  assert.match(closedHtml, /id="order-summary-drawer"[^>]*role="dialog"/);
  assert.doesNotMatch(closedHtml, /aria-modal="true"/);

  const openHtml = renderToStaticMarkup(
    React.createElement(OrderSummary, {
      selectedItems: [],
      context: { vehicle: "", need: "", location: "" },
      onContextChange: () => {},
      onRemoveItem: () => {},
      needOptions: ["Beli aki baru"],
      isOpen: true,
      onOpenChange: () => {},
    }),
  );
  assert.match(openHtml, /id="order-summary-drawer"[^>]*role="dialog"[^>]*aria-modal="true"/);

  const orderSummarySource = fs.readFileSync(orderSummaryPath, "utf8");
  assert.match(orderSummarySource, /closeButtonRef/);
  assert.match(orderSummarySource, /closeButtonRef\.current\?\.focus\(\)/);
  assert.match(orderSummarySource, /isControlled/);

  const batterySearchSource = fs.readFileSync(batterySearchPath, "utf8");
  assert.match(batterySearchSource, /searchInputRef/);
  assert.match(batterySearchSource, /Array\.isArray\(parsed\.selectedIds\)/);

  const css = fs.readFileSync(globalsCssPath, "utf8");
  assert.match(css, /\.battery-card\s*\{[^}]*min-width:\s*0;/s);
  assert.match(css, /\.battery-card-head\s*\{[^}]*flex-wrap:\s*wrap;/s);
  assert.match(css, /\.battery-card-head\s*>\s*div\s*\{[^}]*min-width:\s*0;[^}]*overflow-wrap:\s*anywhere;/s);
  assert.match(css, /@media\s*\(max-width:\s*1120px\)\s*\{[^}]*\.battery-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(css, /\.floating-cart-btn\s*\{[^}]*z-index:\s*42;/s);

  const reducedMotionBlock = css.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*\}\s*$/)?.[0] ?? "";
  assert.match(reducedMotionBlock, /\.order-summary\.is-open/);
});
