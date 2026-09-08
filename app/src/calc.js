import { ITEMS, MACHINES } from "./data.js";

/**
 * Crafting speed of one machine of this kind, given Setup.
 * AM1/2/3 = 0.5 / 0.75 / 1.25. Stone furnace = 1, steel/electric = 2.
 */
export function getMachineSpeed(machineKind, settings) {
  const spec = MACHINES[machineKind];
  if (!spec) return 1;
  if (machineKind === "assembler") return spec.speeds[settings.assembler];
  if (machineKind === "furnace") return spec.speeds[settings.furnace];
  return spec.speeds.default ?? 1;
}

/**
 * Items per second from one machine making this item.
 *
 * Craft time in the recipe is for a machine at speed 1.
 * A faster machine shortens that: effective seconds = time / speed.
 * In one second you therefore finish (speed / time) crafts,
 * each craft yielding `output` items:
 *
 *   throughput = output * speed / time
 */
export function machineThroughput(itemId, settings) {
  const recipe = ITEMS[itemId] && ITEMS[itemId].recipe;
  if (!recipe || !recipe.machine) return 0;
  const speed = getMachineSpeed(recipe.machine, settings);
  return (recipe.output * speed) / recipe.time;
}

/**
 * How many machines you need to hold a target rate (items per second).
 * Exact, not rounded up: 21 not 21.0 "build 21".
 *
 *   machines = ratePerSec / throughput
 */
export function machinesNeeded(itemId, ratePerSec, settings) {
  const throughput = machineThroughput(itemId, settings);
  if (throughput <= 0) return null;
  return ratePerSec / throughput;
}

/**
 * Ingredient tree for a target item rate (items per second).
 *
 * One craft produces `recipe.output` of the parent, so crafts/sec =
 * parentRate / output. Each ingredient is then needed at
 * crafts/sec × amount. Recurse until an item has no ingredients (ore).
 */
export function buildTree(itemId, rate) {
  const item = ITEMS[itemId];
  const node = { id: itemId, rate, children: [] };
  const recipe = item && item.recipe;
  if (!recipe || !recipe.ingredients || recipe.ingredients.length === 0) {
    return node;
  }
  const craftsPerSec = rate / recipe.output;
  for (const ingredient of recipe.ingredients) {
    node.children.push(buildTree(ingredient.item, craftsPerSec * ingredient.amount));
  }
  return node;
}

/**
 * Factory-wide rates: walk the tree and add each node's rate into a Map
 * keyed by item id. The tree is per-line; this is the sum if the same
 * item appears on several branches.
 *
 * `order` is first-seen (depth-first), so the UI can list items without
 * sorting a Map.
 */
export function rollupRates(node, totals = new Map(), order = []) {
  if (!totals.has(node.id)) order.push(node.id);
  totals.set(node.id, (totals.get(node.id) || 0) + node.rate);
  for (const child of node.children) {
    rollupRates(child, totals, order);
  }
  return { totals, order };
}
