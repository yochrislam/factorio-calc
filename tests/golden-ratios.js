#!/usr/bin/env node
/**
 * Golden ratios from docs/prd.md §11.
 *
 * Loads the v0.1 prototype as one script (recipes.js + calc.js) so the
 * existing `const ITEMS` / `function machinesNeeded` style keeps working.
 *
 * Formula (same as calc.js):
 *   throughput of one machine = (recipe.output * machineSpeed) / recipe.time
 *   machines needed           = targetRatePerSec / throughput
 *
 * Utility (yellow):  21s, output 3, AM3 speed 1.25
 *   225/min = 3.75/s  →  3.75 / (3 * 1.25 / 21)  = 21
 *
 * Production (purple): same craft time/output, 450/min = 7.5/s → 42
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const PROTO = path.join(ROOT, "prototypes", "v0.1");

function loadPrototypeCalc() {
  const recipes = fs.readFileSync(path.join(PROTO, "recipes.js"), "utf8");
  const calc = fs.readFileSync(path.join(PROTO, "calc.js"), "utf8");
  const sandbox = {};
  vm.createContext(sandbox);
  // `const` bindings are not properties of the sandbox; export what tests need.
  vm.runInContext(
    `${recipes}\n${calc}\nthis.machinesNeeded = machinesNeeded;\nthis.ITEMS = ITEMS;\n`,
    sandbox
  );
  return sandbox;
}

function almostEqual(actual, expected) {
  const delta = Math.abs(actual - expected);
  return delta <= 1e-10 * Math.max(1, Math.abs(expected));
}

function check(name, actual, expected) {
  if (typeof actual !== "number" || Number.isNaN(actual)) {
    throw new Error(`${name}: expected ${expected}, got ${actual}`);
  }
  if (!almostEqual(actual, expected)) {
    throw new Error(`${name}: expected ${expected}, got ${actual}`);
  }
  console.log(`ok  ${name}  (${actual})`);
}

const { machinesNeeded, ITEMS } = loadPrototypeCalc();
const am3 = { assembler: 3, furnace: "steel" };

if (!ITEMS["utility-science-pack"] || !ITEMS["production-science-pack"]) {
  throw new Error("Prototype ITEMS is missing the science packs under test.");
}

check(
  "225 yellow /min on AM3 → 21 assemblers",
  machinesNeeded("utility-science-pack", 225 / 60, am3),
  21
);
check(
  "450 purple /min on AM3 → 42 assemblers",
  machinesNeeded("production-science-pack", 450 / 60, am3),
  42
);

console.log("all golden ratios passed");
