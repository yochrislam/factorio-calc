#!/usr/bin/env node
/**
 * 1 red pack /s:
 *   pack 1 → copper plate 1, gear 1
 *   gear 1 → iron plate 2  (2 plates per gear)
 *   plates → matching ore
 */
import { buildTree } from "../app/src/calc.js";

function almostEqual(actual, expected) {
  const delta = Math.abs(actual - expected);
  return delta <= 1e-10 * Math.max(1, Math.abs(expected));
}

function child(node, id) {
  return node.children.find((c) => c.id === id);
}

function checkRate(label, node, expected) {
  if (!node) throw new Error(`${label}: missing node`);
  if (!almostEqual(node.rate, expected)) {
    throw new Error(`${label}: expected rate ${expected}, got ${node.rate}`);
  }
  console.log(`ok  ${label}  (${node.rate})`);
}

const tree = buildTree("automation-science-pack", 1);
checkRate("red pack", tree, 1);

const copper = child(tree, "copper-plate");
const gear = child(tree, "iron-gear-wheel");
checkRate("copper plate", copper, 1);
checkRate("gear", gear, 1);

const copperOre = child(copper, "copper-ore");
const plate = child(gear, "iron-plate");
checkRate("copper ore", copperOre, 1);
checkRate("iron plate", plate, 2);

const ironOre = child(plate, "iron-ore");
checkRate("iron ore", ironOre, 2);

if (copperOre.children.length !== 0 || ironOre.children.length !== 0) {
  throw new Error("ore should be a leaf");
}

console.log("all tree checks passed");
