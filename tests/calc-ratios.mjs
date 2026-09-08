#!/usr/bin/env node
/**
 * Wiki ratios against app/src/calc.js (not the prototype).
 *
 * 225 yellow /min = 3.75/s. One AM3: 3 * 1.25 / 21 items/s → 21 machines.
 * 450 purple /min = 7.5/s, same recipe shape → 42 machines.
 */
import { ITEMS } from "../app/src/data.js";
import { machinesNeeded } from "../app/src/calc.js";

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

const am3 = { assembler: 3 };

if (!ITEMS["utility-science-pack"] || !ITEMS["production-science-pack"]) {
  throw new Error("data.js is missing the science packs under test.");
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

console.log("all app ratios passed");
