#!/usr/bin/env node
/**
 * calculate() is tree → rollup → machinesNeeded(id, totalRate, settings).
 * Iron plate machines come from the rolled-up 2/s, not a tree node.
 */
import { calculate } from "../app/src/calc.js";

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
const { tree, totals, order, machines } = calculate(
  "automation-science-pack",
  1,
  settings
);

if (tree.id !== "automation-science-pack" || tree.rate !== 1) {
  throw new Error("tree root should be red pack at 1/s");
}
console.log("ok  tree root");

check("iron plate total", totals.get("iron-plate"), 2);
check("iron plate machines from total", machines.get("iron-plate"), 3.2);

if (machines.get("iron-ore") !== null) {
  throw new Error(`ore machines should be null, got ${machines.get("iron-ore")}`);
}
console.log("ok  ore machines null");

if (!order.includes("iron-plate") || !machines.has("iron-plate")) {
  throw new Error("order and machines should cover the same items");
}
console.log("ok  machines keyed by order");

console.log("all calculate() checks passed");
