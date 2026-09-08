#!/usr/bin/env node
/**
 * Machine counts use the rolled-up rate, not a single tree line.
 *
 * 1 red pack/s → 2 iron plate/s.
 * Steel furnace: speed 2, plate time 3.2, output 1
 *   throughput = 1 * 2 / 3.2
 *   machines   = 2 / (2 / 3.2) = 3.2
 */
import { buildTree, rollupRates, machinesNeeded } from "../app/src/calc.js";

function almostEqual(actual, expected) {
  const delta = Math.abs(actual - expected);
  return delta <= 1e-10 * Math.max(1, Math.abs(expected));
}

function check(label, actual, expected) {
  if (typeof actual !== "number" || Number.isNaN(actual)) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
  if (!almostEqual(actual, expected)) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
  console.log(`ok  ${label}  (${actual})`);
}

const settings = { assembler: 2, furnace: "steel" };
const tree = buildTree("automation-science-pack", 1);
const { totals } = rollupRates(tree);

check("iron plate rate", totals.get("iron-plate"), 2);
check(
  "2 plate/s on steel furnace → 3.2",
  machinesNeeded("iron-plate", totals.get("iron-plate"), settings),
  3.2
);

const oreMachines = machinesNeeded("iron-ore", totals.get("iron-ore"), settings);
if (oreMachines !== null) {
  throw new Error(`ore should have no machines, got ${oreMachines}`);
}
console.log("ok  ore is a leaf (no machines)");

console.log("all machine-from-total checks passed");
