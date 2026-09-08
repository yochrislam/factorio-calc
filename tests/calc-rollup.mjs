#!/usr/bin/env node
/**
 * Rollup sums rates by item. Red science at 1/s has iron plate only
 * once (2/s). A handmade two-branch tree shows the same id adding.
 */
import { buildTree, rollupRates } from "../app/src/calc.js";

function almostEqual(actual, expected) {
  const delta = Math.abs(actual - expected);
  return delta <= 1e-10 * Math.max(1, Math.abs(expected));
}

function check(label, actual, expected) {
  if (!almostEqual(actual, expected)) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
  console.log(`ok  ${label}  (${actual})`);
}

const tree = buildTree("automation-science-pack", 1);
const { totals, order } = rollupRates(tree);

check("red pack", totals.get("automation-science-pack"), 1);
check("copper plate", totals.get("copper-plate"), 1);
check("gear", totals.get("iron-gear-wheel"), 1);
check("iron plate", totals.get("iron-plate"), 2);
check("iron ore", totals.get("iron-ore"), 2);
check("copper ore", totals.get("copper-ore"), 1);

const expectedOrder = [
  "automation-science-pack",
  "copper-plate",
  "copper-ore",
  "iron-gear-wheel",
  "iron-plate",
  "iron-ore",
];
if (order.join(",") !== expectedOrder.join(",")) {
  throw new Error(`order: expected ${expectedOrder.join(",")}, got ${order.join(",")}`);
}
console.log("ok  first-seen order");

const branched = {
  id: "root",
  rate: 1,
  children: [
    { id: "iron-plate", rate: 1, children: [] },
    { id: "iron-plate", rate: 3, children: [] },
  ],
};
check("two iron-plate branches", rollupRates(branched).totals.get("iron-plate"), 4);

console.log("all rollup checks passed");
