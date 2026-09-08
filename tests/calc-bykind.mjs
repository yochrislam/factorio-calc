#!/usr/bin/env node
/**
 * byKind sums per-item machine counts that share recipe.machine.
 * Ore is skipped (null). Furnaces = copper plate + iron plate.
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
const { machines, byKind } = calculate("automation-science-pack", 1, settings);

const furnaces =
  machines.get("copper-plate") + machines.get("iron-plate");
const assemblers =
  machines.get("automation-science-pack") + machines.get("iron-gear-wheel");

check("furnaces = both plates", byKind.get("furnace"), furnaces);
check("assemblers = pack + gear", byKind.get("assembler"), assemblers);

if (byKind.has("miner") || byKind.has("pump")) {
  throw new Error("ore should not add a machine kind");
}
console.log("ok  ore skipped");

console.log("all byKind checks passed");
