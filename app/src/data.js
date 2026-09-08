/**
 * Catalog for machine counts + one short ingredient tree (red science).
 * Nothing here is loaded from prototypes/.
 *
 * ingredients: { item, amount } per craft. Raw ore has no recipe (tree leaf).
 */
export const MACHINES = {
  assembler: {
    speeds: { 1: 0.5, 2: 0.75, 3: 1.25 },
  },
};

export const ITEMS = {
  "utility-science-pack": {
    name: "Utility science pack",
    recipe: { time: 21, output: 3, machine: "assembler" },
  },
  "production-science-pack": {
    name: "Production science pack",
    recipe: { time: 21, output: 3, machine: "assembler" },
  },
  "automation-science-pack": {
    name: "Automation science pack",
    recipe: {
      time: 5,
      output: 1,
      machine: "assembler",
      ingredients: [
        { item: "copper-plate", amount: 1 },
        { item: "iron-gear-wheel", amount: 1 },
      ],
    },
  },
  "iron-gear-wheel": {
    name: "Iron gear wheel",
    recipe: {
      time: 0.5,
      output: 1,
      machine: "assembler",
      ingredients: [{ item: "iron-plate", amount: 2 }],
    },
  },
  "iron-plate": {
    name: "Iron plate",
    recipe: {
      time: 3.2,
      output: 1,
      machine: "furnace",
      ingredients: [{ item: "iron-ore", amount: 1 }],
    },
  },
  "copper-plate": {
    name: "Copper plate",
    recipe: {
      time: 3.2,
      output: 1,
      machine: "furnace",
      ingredients: [{ item: "copper-ore", amount: 1 }],
    },
  },
  "iron-ore": { name: "Iron ore" },
  "copper-ore": { name: "Copper ore" },
};
