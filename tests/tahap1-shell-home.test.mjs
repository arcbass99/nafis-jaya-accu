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

function transpileCjs(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });
  return outputText;
}

function loadTsModule(filePath) {
  const outputText = transpileCjs(filePath);
  const mod = { exports: {} };
  const fn = new Function("exports", "require", "module", outputText);
  fn(mod.exports, require, mod);
  return mod.exports;
}

function loadComponent(filePath, pathname = "/home") {
  const outputText = transpileCjs(filePath);
  const mod = { exports: {} };

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
    if (specifier.endsWith(".module.css") || specifier.endsWith(".css")) {
      return {
        __esModule: true,
        default: new Proxy({}, { get: (_, prop) => String(prop) }),
      };
    }
    if (specifier.startsWith("./")) {
      const targetTsx = path.resolve(path.dirname(filePath), `${specifier}.tsx`);
      if (fs.existsSync(targetTsx)) {
        return loadComponent(targetTsx, pathname);
      }
    }
    if (specifier.startsWith("@/")) {
      const rel = specifier.slice(2);
      const tsPath = path.join(rootDir, "src", `${rel}.ts`);
      if (fs.existsSync(tsPath)) {
        return loadTsModule(tsPath);
      }
      const tsxPath = path.join(rootDir, "src", `${rel}.tsx`);
      if (fs.existsSync(tsxPath)) {
        return loadComponent(tsxPath, pathname);
      }
    }
    return require(specifier);
  };

  const fn = new Function("exports", "require", "module", outputText);
  fn(mod.exports, localRequire, mod);
  return mod.exports.default;
}

const sidebarPath = path.join(rootDir, "src/components/Sidebar.tsx");
const globalsCssPath = path.join(rootDir, "src/app/globals.css");

test("Task 1: Sidebar replaces static dots and native progress with icons, ARIA progressbar, live dot, and Escape cleanup", () => {
  const Sidebar = loadComponent(sidebarPath, "/home");
  const html = renderToStaticMarkup(React.createElement(Sidebar));

  assert.doesNotMatch(html, /sidebar-dot/);
  assert.doesNotMatch(html, /<progress[^>]*class="battery-progress"/);
  assert.match(html, /class="sidebar-scroll-track"[^>]*role="progressbar"[^>]*aria-valuemin="0"[^>]*aria-valuemax="100"/);
  assert.match(html, /class="sidebar-scroll-fill"/);
  assert.match(html, /class="status-live-dot"/);
  assert.match(html, /href="\/home"[^>]*aria-current="page"/);

  const sidebarNavBlock = html.match(/<nav class="sidebar-nav"[\s\S]*?<\/nav>/)?.[0] ?? "";
  assert.equal((sidebarNavBlock.match(/<svg/g) ?? []).length, 4, "Expected 4 icons inside sidebar-nav");

  const source = fs.readFileSync(sidebarPath, "utf8");
  assert.match(source, /Escape/);
});

test("Task 1: globals.css styles animated sidebar active indicator, staggered mobile drawer, live pulse, and reduced-motion", () => {
  const css = fs.readFileSync(globalsCssPath, "utf8");

  assert.doesNotMatch(css, /\.battery-progress/);
  assert.doesNotMatch(css, /\.sidebar-dot/);
  assert.match(css, /\.sidebar-link::before/);
  assert.match(css, /\.sidebar-link\.is-active::before/);
  assert.match(css, /\.status-live-dot/);
  assert.match(css, /@keyframes\s+status-pulse/);
  assert.match(css, /@media\s*\(max-width:\s*1024px\)[\s\S]*\.site-sidebar\.is-open\s+\.sidebar-link/);
  assert.match(css, /\.mobile-bottom-nav\s+a\.is-active::before/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});

const heroPath = path.join(rootDir, "src/components/HeroSection.tsx");
const heroCssPath = path.join(rootDir, "src/components/HeroSection.module.css");
const boxCssPath = path.join(rootDir, "src/components/BatteryBoxScrollAnimation.module.css");

test("Task 2: HeroSection renders layered hero-card, live status pill, primary CTA, and secondary action pair", () => {
  const HeroSection = loadComponent(heroPath, "/home");
  const html = renderToStaticMarkup(React.createElement(HeroSection));

  assert.match(html, /class="hero-card"/);
  assert.match(html, /class="hero-status-pill"[\s\S]*status-live-dot[\s\S]*06\.00-21\.00/);
  assert.match(html, /href="\/home\/pesan-aki"/);
  assert.match(html, /class="hero-actions-secondary"[\s\S]*href="\/home\/lokasi"[\s\S]*href="\/home\/layanan"/);
});

test("Task 2: Hero and 3D canvas CSS configure mobile visual-first order (-1) and scaled box dimensions without clipping", () => {
  const heroCss = fs.readFileSync(heroCssPath, "utf8");
  const boxCss = fs.readFileSync(boxCssPath, "utf8");
  const globalsCss = fs.readFileSync(globalsCssPath, "utf8");

  assert.match(heroCss, /@media\s*\(max-width:\s*980px\)[\s\S]*order:\s*-1;/);
  assert.match(heroCss, /@media\s*\(max-width:\s*980px\)[\s\S]*min-height:\s*9\.5rem;/);
  assert.match(boxCss, /@media\s*\(max-width:\s*980px\)[\s\S]*width:\s*min\(100%,\s*13rem\);/);
  assert.match(boxCss, /@media\s*\(max-width:\s*520px\)[\s\S]*width:\s*min\(100%,\s*10\.5rem\);/);
  assert.match(globalsCss, /\.hero-card\s*\{/);
  assert.doesNotMatch(globalsCss, /\.hero-card\s*\{[^}]*overflow:\s*hidden/s);
  assert.match(globalsCss, /@media\s*\(max-width:\s*1024px\)[\s\S]*\.hero-actions-secondary\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
});

const highlightsPath = path.join(rootDir, "src/components/HomeHighlights.tsx");
const faqPath = path.join(rootDir, "src/components/FAQSection.tsx");
const footerPath = path.join(rootDir, "src/components/Footer.tsx");
const homePagePath = path.join(rootDir, "src/app/home/page.tsx");

test("Task 3: HomeHighlights, FAQSection, Footer, and home/page.tsx render streamlined structure cleanly", () => {
  const HomeHighlights = loadComponent(highlightsPath, "/home");
  const FAQSection = loadComponent(faqPath, "/home");
  const Footer = loadComponent(footerPath, "/home");

  const highlightsHtml = renderToStaticMarkup(React.createElement(HomeHighlights));
  assert.match(highlightsHtml, /class="section highlights-section"/);
  assert.equal((highlightsHtml.match(/class="highlight-card/g) ?? []).length, 3);
  assert.match(highlightsHtml, /href="\/home\/pesan-aki"/);
  assert.match(highlightsHtml, /href="\/home\/layanan"/);
  assert.match(highlightsHtml, /href="\/home\/lokasi"/);

  const faqHtml = renderToStaticMarkup(React.createElement(FAQSection));
  assert.equal((faqHtml.match(/<button[^>]*type="button"[^>]*class="faq-summary"/g) ?? []).length, 7);
  assert.equal((faqHtml.match(/faq-chevron/g) ?? []).length, 7);

  const footerHtml = renderToStaticMarkup(React.createElement(Footer));
  assert.doesNotMatch(footerHtml, /<h3>Navigasi<\/h3>/);
  assert.match(footerHtml, /href="\/"/);
  assert.match(footerHtml, /wa\.me\/6281331289410/);
  assert.match(footerHtml, /06\.00-21\.00/);
  assert.match(footerHtml, /@nfs_ky07/);

  const pageSource = fs.readFileSync(homePagePath, "utf8");
  const heroIdx = pageSource.indexOf("<HeroSection");
  const hlIdx = pageSource.indexOf("<HomeHighlights");
  const faqIdx = pageSource.indexOf("<FAQSection");
  const footIdx = pageSource.indexOf("<Footer");
  assert.ok(heroIdx !== -1 && hlIdx !== -1 && faqIdx !== -1 && footIdx !== -1);
  assert.ok(heroIdx < hlIdx && hlIdx < faqIdx && faqIdx < footIdx);
});

test("Task 3: globals.css defines highlights-grid, faq-chevron rotation, and streamlined footer without faq-summary::after", () => {
  const css = fs.readFileSync(globalsCssPath, "utf8");

  assert.doesNotMatch(css, /\.faq-summary::after/);
  assert.match(css, /\.faq-chevron\s*\{/);
  assert.match(css, /\.faq-item\.is-open\s+\.faq-chevron\s*\{[^}]*transform:\s*rotate\(180deg\)/s);
  assert.match(css, /\.highlights-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*\.highlights-grid\s*\{[^}]*grid-template-columns:\s*1fr;/);
});

test("Final Review Important #1: .visualPanel uses isolation: isolate so radial glow renders above .hero-card", () => {
  const heroCss = fs.readFileSync(heroCssPath, "utf8");
  assert.match(heroCss, /\.visualPanel\s*\{[^}]*isolation:\s*isolate;/s);
});

test("Final Review Important #2: FAQSection removes inline transition and reduced-motion covers .faq-content-wrapper and .sidebar-backdrop", () => {
  const FAQSection = loadComponent(faqPath, "/home");
  const faqHtml = renderToStaticMarkup(React.createElement(FAQSection));
  const globalsCss = fs.readFileSync(globalsCssPath, "utf8");

  assert.doesNotMatch(faqHtml, /faq-content-wrapper"[^>]*style=/);
  assert.match(globalsCss, /\.faq-content-wrapper\s*\{[^}]*transition:\s*grid-template-rows/s);
  assert.match(globalsCss, /\.faq-item\.is-open\s+\.faq-content-wrapper\s*\{[^}]*grid-template-rows:\s*1fr/s);

  const reducedMotionBlock = globalsCss.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*\}\s*$/)?.[0] ?? "";
  assert.match(reducedMotionBlock, /\.faq-content-wrapper/);
  assert.match(reducedMotionBlock, /\.sidebar-backdrop/);
});

test("Final Review Important #3: mobile .hero-actions-secondary buttons allow wrapping and compact padding on <= 355px", () => {
  const globalsCss = fs.readFileSync(globalsCssPath, "utf8");
  assert.match(globalsCss, /\.hero-actions-secondary\s+\.btn\s*\{[^}]*white-space:\s*normal;/s);
  assert.match(globalsCss, /\.hero-actions-secondary\s+\.btn\s*\{[^}]*padding:\s*0\.45rem\s+0\.5rem;/s);
});

test("Final Review Important #4: closed mobile drawer hides visibility from tab order and restores focus to menu button on Escape/close", () => {
  const globalsCss = fs.readFileSync(globalsCssPath, "utf8");
  const sidebarSource = fs.readFileSync(sidebarPath, "utf8");

  assert.match(globalsCss, /@media\s*\(max-width:\s*1024px\)[\s\S]*\.site-sidebar\s*\{[^}]*visibility:\s*hidden;/s);
  assert.match(globalsCss, /@media\s*\(max-width:\s*1024px\)[\s\S]*\.site-sidebar\.is-open\s*\{[^}]*visibility:\s*visible;/s);
  assert.match(sidebarSource, /menuButtonRef\.current\?\.focus\(\)/);
});

test("Polish Pass: Sidebar places brand-mark inside sidebar-brand horizontally, Hero box clamps <=16.5rem, highlights stay concise, and FAQ uses 2-col desktop grid", () => {
  const Sidebar = loadComponent(sidebarPath, "/home");
  const HomeHighlights = loadComponent(highlightsPath, "/home");
  const sidebarHtml = renderToStaticMarkup(React.createElement(Sidebar));
  const highlightsHtml = renderToStaticMarkup(React.createElement(HomeHighlights));
  const boxCss = fs.readFileSync(boxCssPath, "utf8");
  const globalsCss = fs.readFileSync(globalsCssPath, "utf8");

  assert.match(sidebarHtml, /<div class="sidebar-topline">[\s\S]*class="sidebar-brand"[\s\S]*class="brand-mark"/);
  assert.match(boxCss, /\.root\s*\{[^}]*clamp\(13rem,\s*20vw,\s*16\.5rem\)/s);

  const subtexts = [...highlightsHtml.matchAll(/<small>([^<]+)<\/small>/g)].map((m) => m[1]);
  assert.equal(subtexts.length, 3);
  for (const text of subtexts) {
    assert.ok(text.length <= 38, `Highlight description too long for single desktop line (${text.length}): "${text}"`);
  }

  assert.match(globalsCss, /\.faq-list\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(globalsCss, /\.faq-item:last-child:nth-child\(odd\)\s*\{[^}]*grid-column:\s*1\s*\/\s*-1;/s);
  assert.match(globalsCss, /@media\s*\(max-width:\s*768px\)[\s\S]*\.faq-list\s*\{[^}]*grid-template-columns:\s*1fr;/);
});
