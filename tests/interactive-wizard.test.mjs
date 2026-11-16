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

function loadTsxComponent(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });

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
    if (specifier === "next/dynamic") {
      return {
        __esModule: true,
        default: () =>
          function DynamicMapStub() {
            return React.createElement("div", { "data-testid": "leaflet-map-stub" }, "Map");
          },
      };
    }
    if (specifier.endsWith(".css")) {
      return {};
    }
    if (specifier === "@/lib/constants") {
      return loadTsModule(path.join(rootDir, "src/lib/constants.ts"));
    }
    if (specifier === "@/lib/utils") {
      return loadTsModule(path.join(rootDir, "src/lib/utils.ts"));
    }
    return require(specifier);
  };

  const fn = new Function("exports", "require", "module", outputText);
  fn(mod.exports, localRequire, mod);
  return mod.exports.default;
}

function loadTsModule(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });
  const mod = { exports: {} };
  const fn = new Function("exports", "require", "module", outputText);
  fn(mod.exports, require, mod);
  return mod.exports;
}

const wizardTsxPath = path.join(rootDir, "src/components/InteractiveWizard.tsx");
const wizardCssPath = path.join(rootDir, "src/components/InteractiveWizard.css");

test("Task 1: InteractiveWizard defaults to Pesan Aki without empty state or left-reference copy", () => {
  const InteractiveWizard = loadTsxComponent(wizardTsxPath);
  const html = renderToStaticMarkup(React.createElement(InteractiveWizard));

  assert.doesNotMatch(html, /wz-empty-state/);
  assert.doesNotMatch(html, /di sebelah kiri/i);
  assert.match(html, /Untuk kendaraan apa\?/);
  assert.match(html, /Lihat Katalog Aki Lengkap/);
  assert.match(html, /aria-disabled="true"/);
  assert.match(html, /tabindex="-1"/i);
});

test("Task 1: InteractiveWizard separates wz-location after wz-right with hours badge and accessible topbar", () => {
  const InteractiveWizard = loadTsxComponent(wizardTsxPath);
  const html = renderToStaticMarkup(React.createElement(InteractiveWizard));

  const leftIdx = html.indexOf('class="wz-left"');
  const rightIdx = html.indexOf('class="wz-right"');
  const locationIdx = html.indexOf('class="wz-location"');

  assert.ok(leftIdx !== -1, "Expected .wz-left in rendered markup");
  assert.ok(rightIdx !== -1, "Expected .wz-right in rendered markup");
  assert.ok(locationIdx !== -1, "Expected .wz-location in rendered markup");
  assert.ok(leftIdx < rightIdx && rightIdx < locationIdx, "Expected DOM order: left -> right -> location");

  assert.match(html, /Buka 06\.00-21\.00/);
  assert.match(html, /Buka di Google Maps/);
  assert.match(html, /wz-home-link-full/);
  assert.match(html, /wz-home-link-short/);
  assert.match(html, /role="tablist"/);
  assert.match(html, /role="tab"[^>]*aria-selected="true"/);

  const source = fs.readFileSync(wizardTsxPath, "utf8");
  assert.doesNotMatch(source, /scrollIntoView/);
});

test("Task 2: InteractiveWizard.css removes empty state, styles dark map tiles, desktop row span, and mobile horizontal tabs", () => {
  const css = fs.readFileSync(wizardCssPath, "utf8");

  assert.doesNotMatch(css, /\.wz-empty-state/);
  assert.match(css, /\.wz-right\s*\{[^}]*grid-column:\s*2;[^}]*grid-row:\s*1\s*\/\s*span 2;/s);
  assert.match(css, /\.wz-location\s*\{[^}]*grid-column:\s*1;[^}]*grid-row:\s*2;/s);
  assert.match(css, /\.wz-mini-map-container\s+\.leaflet-tile-pane\s*\{[^}]*filter:\s*invert\(100%\)/s);
  assert.match(css, /@media\s*\(max-width:\s*900px\)[\s\S]*\.wz-categories\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /@media\s*\(max-width:\s*480px\)[\s\S]*\.wz-home-link-short\s*\{[^}]*display:\s*inline/);
});

test("Final Review: interactive choice buttons have aria-pressed and text inputs have aria-label", () => {
  const InteractiveWizard = loadTsxComponent(wizardTsxPath);
  const html = renderToStaticMarkup(React.createElement(InteractiveWizard));

  assert.match(html, /<button[^>]*aria-pressed="false"[^>]*class="wz-choice"|<button[^>]*class="wz-choice"[^>]*aria-pressed="false"/);

  const source = fs.readFileSync(wizardTsxPath, "utf8");
  const choiceMatches = source.match(/className=\{cn\("wz-choice"/g) ?? [];
  const ariaPressedMatches = source.match(/aria-pressed=\{/g) ?? [];
  assert.equal(choiceMatches.length, 8, "Expected 8 choice buttons across Pesan and Setrum flows");
  assert.equal(ariaPressedMatches.length, 8, "Every choice button must declare aria-pressed");

  const inputMatches = source.match(/<input[^>]*>/g) ?? [];
  assert.equal(inputMatches.length, 3, "Expected 3 text inputs across wizard flows");
  for (const inputTag of inputMatches) {
    assert.match(inputTag, /aria-label="/, `Input lacks aria-label: ${inputTag}`);
  }
});
