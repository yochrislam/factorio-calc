/** Nauvis recipes for science packs through utility science (Factorio 2.0). */
const ITEMS = {
  "automation-science-pack": {
    name: "Automation science pack",
    alias: "Red",
    color: "#d94c4c",
    category: "science",
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
  "logistic-science-pack": {
    name: "Logistic science pack",
    alias: "Green",
    color: "#4caf62",
    category: "science",
    recipe: {
      time: 6,
      output: 1,
      machine: "assembler",
      ingredients: [
        { item: "inserter", amount: 1 },
        { item: "transport-belt", amount: 1 },
      ],
    },
  },
  "military-science-pack": {
    name: "Military science pack",
    alias: "Black",
    color: "#6b6b6b",
    category: "science",
    recipe: {
      time: 10,
      output: 2,
      machine: "assembler",
      ingredients: [
        { item: "piercing-rounds-magazine", amount: 1 },
        { item: "grenade", amount: 1 },
        { item: "stone-wall", amount: 1 },
      ],
    },
  },
  "chemical-science-pack": {
    name: "Chemical science pack",
    alias: "Blue",
    color: "#3d8ec9",
    category: "science",
    recipe: {
      time: 24,
      output: 2,
      machine: "assembler",
      ingredients: [
        { item: "advanced-circuit", amount: 3 },
        { item: "engine-unit", amount: 2 },
        { item: "sulfur", amount: 1 },
      ],
    },
  },
  "production-science-pack": {
    name: "Production science pack",
    alias: "Purple",
    color: "#c45ac4",
    category: "science",
    recipe: {
      time: 21,
      output: 3,
      machine: "assembler",
      ingredients: [
        { item: "electric-furnace", amount: 1 },
        { item: "productivity-module", amount: 1 },
        { item: "rail", amount: 30 },
      ],
    },
  },
  "utility-science-pack": {
    name: "Utility science pack",
    alias: "Yellow",
    color: "#d4c84a",
    category: "science",
    recipe: {
      time: 21,
      output: 3,
      machine: "assembler",
      ingredients: [
        { item: "processing-unit", amount: 2 },
        { item: "flying-robot-frame", amount: 1 },
        { item: "low-density-structure", amount: 3 },
      ],
    },
  },

  "iron-gear-wheel": {
    name: "Iron gear wheel",
    color: "#9aa4b0",
    category: "intermediate",
    recipe: {
      time: 0.5,
      output: 1,
      machine: "assembler",
      ingredients: [{ item: "iron-plate", amount: 2 }],
    },
  },
  "copper-cable": {
    name: "Copper cable",
    color: "#d4783c",
    category: "intermediate",
    recipe: {
      time: 0.5,
      output: 2,
      machine: "assembler",
      ingredients: [{ item: "copper-plate", amount: 1 }],
    },
  },
  "electronic-circuit": {
    name: "Electronic circuit",
    color: "#3d9a4a",
    category: "intermediate",
    recipe: {
      time: 0.5,
      output: 1,
      machine: "assembler",
      ingredients: [
        { item: "iron-plate", amount: 1 },
        { item: "copper-cable", amount: 3 },
      ],
    },
  },
  "advanced-circuit": {
    name: "Advanced circuit",
    color: "#c44c4c",
    category: "intermediate",
    recipe: {
      time: 6,
      output: 1,
      machine: "assembler",
      ingredients: [
        { item: "electronic-circuit", amount: 2 },
        { item: "plastic-bar", amount: 2 },
        { item: "copper-cable", amount: 4 },
      ],
    },
  },
  "processing-unit": {
    name: "Processing unit",
    color: "#3d6ec9",
    category: "intermediate",
    recipe: {
      time: 10,
      output: 1,
      machine: "assembler",
      ingredients: [
        { item: "electronic-circuit", amount: 20 },
        { item: "advanced-circuit", amount: 2 },
        { item: "sulfuric-acid", amount: 5 },
      ],
    },
  },
  inserter: {
    name: "Inserter",
    color: "#c9a227",
    category: "logistics",
    recipe: {
      time: 0.5,
      output: 1,
      machine: "assembler",
      ingredients: [
        { item: "electronic-circuit", amount: 1 },
        { item: "iron-gear-wheel", amount: 1 },
        { item: "iron-plate", amount: 1 },
      ],
    },
  },
  "transport-belt": {
    name: "Transport belt",
    color: "#c9a227",
    category: "logistics",
    recipe: {
      time: 0.5,
      output: 2,
      machine: "assembler",
      ingredients: [
        { item: "iron-plate", amount: 1 },
        { item: "iron-gear-wheel", amount: 1 },
      ],
    },
  },
  pipe: {
    name: "Pipe",
    color: "#8a93a0",
    category: "logistics",
    recipe: {
      time: 0.5,
      output: 1,
      machine: "assembler",
      ingredients: [{ item: "iron-plate", amount: 1 }],
    },
  },
  rail: {
    name: "Rail",
    color: "#7a7a7a",
    category: "logistics",
    recipe: {
      time: 0.5,
      output: 2,
      machine: "assembler",
      ingredients: [
        { item: "iron-stick", amount: 1 },
        { item: "steel-plate", amount: 1 },
        { item: "stone", amount: 1 },
      ],
    },
  },
  "engine-unit": {
    name: "Engine unit",
    color: "#7a5a3a",
    category: "intermediate",
    recipe: {
      time: 10,
      output: 1,
      machine: "assembler",
      ingredients: [
        { item: "steel-plate", amount: 1 },
        { item: "iron-gear-wheel", amount: 1 },
        { item: "pipe", amount: 2 },
      ],
    },
  },
  "electric-engine-unit": {
    name: "Electric engine unit",
    color: "#7a8a3a",
    category: "intermediate",
    recipe: {
      time: 10,
      output: 1,
      machine: "assembler",
      ingredients: [
        { item: "engine-unit", amount: 1 },
        { item: "electronic-circuit", amount: 2 },
        { item: "lubricant", amount: 15 },
      ],
    },
  },
  "flying-robot-frame": {
    name: "Flying robot frame",
    color: "#8a9aa8",
    category: "intermediate",
    recipe: {
      time: 20,
      output: 1,
      machine: "assembler",
      ingredients: [
        { item: "battery", amount: 2 },
        { item: "electric-engine-unit", amount: 1 },
        { item: "electronic-circuit", amount: 3 },
        { item: "steel-plate", amount: 1 },
      ],
    },
  },
  "low-density-structure": {
    name: "Low density structure",
    color: "#c9b48a",
    category: "intermediate",
    recipe: {
      time: 15,
      output: 1,
      machine: "assembler",
      ingredients: [
        { item: "copper-plate", amount: 20 },
        { item: "steel-plate", amount: 2 },
        { item: "plastic-bar", amount: 5 },
      ],
    },
  },
  "iron-stick": {
    name: "Iron stick",
    color: "#b8c0cc",
    category: "intermediate",
    recipe: {
      time: 0.5,
      output: 2,
      machine: "assembler",
      ingredients: [{ item: "iron-plate", amount: 1 }],
    },
  },
  "electric-furnace": {
    name: "Electric furnace",
    color: "#6a6a78",
    category: "production",
    recipe: {
      time: 5,
      output: 1,
      machine: "assembler",
      ingredients: [
        { item: "advanced-circuit", amount: 5 },
        { item: "steel-plate", amount: 10 },
        { item: "stone-brick", amount: 10 },
      ],
    },
  },
  "productivity-module": {
    name: "Productivity module",
    color: "#6a9a4a",
    category: "production",
    recipe: {
      time: 15,
      output: 1,
      machine: "assembler",
      ingredients: [
        { item: "advanced-circuit", amount: 5 },
        { item: "electronic-circuit", amount: 5 },
      ],
    },
  },
  "firearm-magazine": {
    name: "Firearm magazine",
    color: "#8a7a4a",
    category: "combat",
    recipe: {
      time: 1,
      output: 1,
      machine: "assembler",
      ingredients: [{ item: "iron-plate", amount: 4 }],
    },
  },
  "piercing-rounds-magazine": {
    name: "Piercing rounds magazine",
    color: "#a05a3a",
    category: "combat",
    recipe: {
      time: 6,
      output: 2,
      machine: "assembler",
      ingredients: [
        { item: "firearm-magazine", amount: 2 },
        { item: "steel-plate", amount: 1 },
        { item: "copper-plate", amount: 2 },
      ],
    },
  },
  grenade: {
    name: "Grenade",
    color: "#6a8a3a",
    category: "combat",
    recipe: {
      time: 8,
      output: 1,
      machine: "assembler",
      ingredients: [
        { item: "iron-plate", amount: 5 },
        { item: "coal", amount: 10 },
      ],
    },
  },
  "stone-wall": {
    name: "Wall",
    color: "#9a9078",
    category: "combat",
    recipe: {
      time: 0.5,
      output: 1,
      machine: "assembler",
      ingredients: [{ item: "stone-brick", amount: 5 }],
    },
  },

  "iron-plate": {
    name: "Iron plate",
    color: "#b8c0cc",
    category: "smelted",
    recipe: {
      time: 3.2,
      output: 1,
      machine: "furnace",
      ingredients: [{ item: "iron-ore", amount: 1 }],
    },
  },
  "copper-plate": {
    name: "Copper plate",
    color: "#d4783c",
    category: "smelted",
    recipe: {
      time: 3.2,
      output: 1,
      machine: "furnace",
      ingredients: [{ item: "copper-ore", amount: 1 }],
    },
  },
  "steel-plate": {
    name: "Steel plate",
    color: "#8a96a8",
    category: "smelted",
    recipe: {
      time: 16,
      output: 1,
      machine: "furnace",
      ingredients: [{ item: "iron-plate", amount: 5 }],
    },
  },
  "stone-brick": {
    name: "Stone brick",
    color: "#a09070",
    category: "smelted",
    recipe: {
      time: 3.2,
      output: 1,
      machine: "furnace",
      ingredients: [{ item: "stone", amount: 2 }],
    },
  },

  "plastic-bar": {
    name: "Plastic bar",
    color: "#d0d0d0",
    category: "chemical",
    recipe: {
      time: 1,
      output: 2,
      machine: "chemical-plant",
      ingredients: [
        { item: "coal", amount: 1 },
        { item: "petroleum-gas", amount: 20 },
      ],
    },
  },
  sulfur: {
    name: "Sulfur",
    color: "#d4c84a",
    category: "chemical",
    recipe: {
      time: 1,
      output: 2,
      machine: "chemical-plant",
      ingredients: [
        { item: "water", amount: 30 },
        { item: "petroleum-gas", amount: 30 },
      ],
    },
  },
  battery: {
    name: "Battery",
    color: "#c9a227",
    category: "chemical",
    recipe: {
      time: 4,
      output: 1,
      machine: "chemical-plant",
      ingredients: [
        { item: "iron-plate", amount: 1 },
        { item: "copper-plate", amount: 1 },
        { item: "sulfuric-acid", amount: 20 },
      ],
    },
  },
  "sulfuric-acid": {
    name: "Sulfuric acid",
    color: "#d4c84a",
    category: "chemical",
    recipe: {
      time: 1,
      output: 50,
      machine: "chemical-plant",
      ingredients: [
        { item: "iron-plate", amount: 1 },
        { item: "sulfur", amount: 5 },
        { item: "water", amount: 100 },
      ],
    },
  },
  lubricant: {
    name: "Lubricant",
    color: "#4a8a3a",
    category: "chemical",
    recipe: {
      time: 1,
      output: 10,
      machine: "chemical-plant",
      ingredients: [{ item: "heavy-oil", amount: 10 }],
    },
  },

  "iron-ore": {
    name: "Iron ore",
    color: "#5a80b0",
    category: "raw",
    recipe: { time: 1, output: 1, machine: "miner", ingredients: [] },
  },
  "copper-ore": {
    name: "Copper ore",
    color: "#c06030",
    category: "raw",
    recipe: { time: 1, output: 1, machine: "miner", ingredients: [] },
  },
  coal: {
    name: "Coal",
    color: "#2a2a2a",
    category: "raw",
    recipe: { time: 1, output: 1, machine: "miner", ingredients: [] },
  },
  stone: {
    name: "Stone",
    color: "#8a8070",
    category: "raw",
    recipe: { time: 1, output: 1, machine: "miner", ingredients: [] },
  },
  water: {
    name: "Water",
    color: "#3a7aad",
    category: "raw",
    recipe: { time: 1, output: 1, machine: "pump", ingredients: [] },
  },
  "petroleum-gas": {
    name: "Petroleum gas",
    color: "#c060c0",
    category: "chemical",
    // Advanced oil processing with light/heavy cracked to petroleum: 100 crude + 132.5 water → 97.5 gas.
    recipe: {
      time: 5,
      output: 97.5,
      machine: "oil-refinery",
      ingredients: [
        { item: "crude-oil", amount: 100 },
        { item: "water", amount: 132.5 },
      ],
    },
  },
  "heavy-oil": {
    name: "Heavy oil",
    color: "#7a4a2a",
    category: "chemical",
    // Advanced oil processing only (no cracking). Counted separately from petroleum, so crude is overstated if both are needed.
    recipe: {
      time: 5,
      output: 25,
      machine: "oil-refinery",
      ingredients: [
        { item: "crude-oil", amount: 100 },
        { item: "water", amount: 50 },
      ],
    },
  },
  "crude-oil": {
    name: "Crude oil",
    color: "#4a3a2a",
    category: "raw",
    recipe: { time: 1, output: 10, machine: "pumpjack", ingredients: [] },
  },
};

const SCIENCE_PACKS = [
  "automation-science-pack",
  "logistic-science-pack",
  "military-science-pack",
  "chemical-science-pack",
  "production-science-pack",
  "utility-science-pack",
];

const CATEGORY_LABELS = {
  science: "Science",
  logistics: "Logistics",
  production: "Production",
  intermediate: "Intermediate",
  combat: "Combat",
  smelted: "Smelting",
  chemical: "Chemical",
  raw: "Raw",
};

const CATEGORY_ORDER = [
  "science",
  "logistics",
  "production",
  "intermediate",
  "combat",
  "smelted",
  "chemical",
  "raw",
];

const CRAFT_TABS = [
  { id: "all", label: "All" },
  { id: "science", label: "Science", icon: "automation-science-pack" },
  { id: "logistics", label: "Logistics", icon: "transport-belt" },
  { id: "production", label: "Production", icon: "electric-furnace" },
  { id: "intermediate", label: "Intermediate", icon: "electronic-circuit" },
  { id: "combat", label: "Combat", icon: "piercing-rounds-magazine" },
  { id: "smelted", label: "Smelting", icon: "iron-plate" },
  { id: "chemical", label: "Chemical", icon: "sulfur" },
  { id: "raw", label: "Raw", icon: "iron-ore" },
];

const MACHINES = {
  assembler: {
    label: "Assembling machine",
    short: "Assembler",
    speeds: { 1: 0.5, 2: 0.75, 3: 1.25 },
  },
  furnace: {
    label: "Furnace",
    short: "Furnace",
    speeds: { stone: 1, steel: 2, electric: 2 },
  },
  "chemical-plant": {
    label: "Chemical plant",
    short: "Chem",
    speeds: { default: 1 },
  },
  miner: {
    label: "Electric mining drill",
    short: "Miner",
    speeds: { default: 0.5 },
  },
  pump: {
    label: "Offshore pump",
    short: "Pump",
    speeds: { default: 1200 },
  },
  "oil-refinery": {
    label: "Oil refinery",
    short: "Refinery",
    speeds: { default: 1 },
  },
  pumpjack: {
    label: "Pumpjack",
    short: "Pumpjack",
    speeds: { default: 1 },
  },
};
