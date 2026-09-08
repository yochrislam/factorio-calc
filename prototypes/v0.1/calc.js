function getMachineSpeed(machineKind, settings) {
  const spec = MACHINES[machineKind];
  if (!spec) return 1;
  if (machineKind === "assembler") return spec.speeds[settings.assembler];
  if (machineKind === "furnace") return spec.speeds[settings.furnace];
  return spec.speeds.default;
}

function machineLabel(machineKind, settings) {
  const spec = MACHINES[machineKind];
  if (!spec) return "";
  if (machineKind === "assembler") return `Assembling machine ${settings.assembler}`;
  if (machineKind === "furnace") {
    const names = { stone: "Stone furnace", steel: "Steel furnace", electric: "Electric furnace" };
    return names[settings.furnace];
  }
  return spec.label;
}

function machineIconFile(machineKind, settings) {
  if (machineKind === "assembler") return `assembling-machine-${settings.assembler}.png`;
  if (machineKind === "furnace") return `${settings.furnace}-furnace.png`;
  return {
    "chemical-plant": "chemical-plant.png",
    miner: "electric-mining-drill.png",
    pump: "offshore-pump.png",
    "oil-refinery": "oil-refinery.png",
    pumpjack: "pumpjack.png",
  }[machineKind];
}

function machineShort(machineKind, settings) {
  if (!machineKind) return "";
  if (machineKind === "assembler") return `AM${settings.assembler}`;
  if (machineKind === "furnace") {
    return { stone: "Stone", steel: "Steel", electric: "Elec" }[settings.furnace];
  }
  return MACHINES[machineKind].short;
}

/** Output rate of one machine crafting this item. */
function machineThroughput(itemId, settings) {
  const item = ITEMS[itemId];
  const recipe = item && item.recipe;
  if (!recipe || !recipe.machine) return 0;
  const speed = getMachineSpeed(recipe.machine, settings);
  return (recipe.output * speed) / recipe.time;
}

function machinesNeeded(itemId, rate, settings) {
  const item = ITEMS[itemId];
  if (!item || !item.recipe || !item.recipe.machine) return null;
  const throughput = machineThroughput(itemId, settings);
  if (throughput <= 0) return null;
  return rate / throughput;
}

function buildTree(itemId, rate) {
  const item = ITEMS[itemId];
  const node = { id: itemId, rate, children: [] };
  if (!item || !item.recipe || !item.recipe.ingredients || item.recipe.ingredients.length === 0) {
    return node;
  }
  const craftsPerSec = rate / item.recipe.output;
  for (const ingredient of item.recipe.ingredients) {
    node.children.push(buildTree(ingredient.item, craftsPerSec * ingredient.amount));
  }
  return node;
}

function rollupRates(node, totals = new Map(), order = []) {
  if (!totals.has(node.id)) order.push(node.id);
  totals.set(node.id, (totals.get(node.id) || 0) + node.rate);
  for (const child of node.children) rollupRates(child, totals, order);
  return { totals, order };
}

function summarizeMachines(order, totals, settings) {
  const byType = new Map();
  const rows = [];
  for (const id of order) {
    const count = machinesNeeded(id, totals.get(id), settings);
    const machine = ITEMS[id] && ITEMS[id].recipe && ITEMS[id].recipe.machine;
    rows.push({ id, count, machine });
    if (count == null || !machine) continue;
    const current = byType.get(machine) || {
      count: 0,
      label: machineLabel(machine, settings),
      kind: machine,
    };
    current.count += count;
    byType.set(machine, current);
  }
  return { rows, byType };
}

function calculate(itemId, ratePerSec, settings) {
  const tree = buildTree(itemId, ratePerSec);
  const { totals, order } = rollupRates(tree);
  const machines = summarizeMachines(order, totals, settings);
  return { tree, totals, order, machines };
}
