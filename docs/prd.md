# Factorio Calc — Product Requirements

Personal companion calculator for Factorio 2.0 (Space Age). Used while playing: pick products and a target rate, see the ingredient tree and how many machines that implies.

This document is based on the working `prototypes/v0.1` app. It captures what that prototype already is, what “done enough for Nauvis” means, and what must be designed for even if it is not built until those systems are unlocked in-game.

---

## 1. Purpose

Answer, quickly and in Factorio’s own visual language:

> To make **this much** of **these items**, what inputs and how many machines do I need?

It is a rate calculator, not a factory planner. It does not place belts, balance lanes, generate blueprints, or simulate power grids.

The player unlocks content over a long save. The product should stay useful on day one (red science) and still be the same tool at Aquilo — by growing the recipe set and the modifier model as those systems actually get used, not by shipping a complete Space Age encyclopedia up front.

---

## 2. Product principles

Drawn from the prototype and the decisions that shaped it.

1. **Familiar, not clever.** In-game icons, crafting-menu product picker, grey/yellow palette. Categories follow the craft tabs (Science, Logistics, Production, Intermediate, Combat, Smelting, Chemical, Raw).
2. **Exact rates, not rounded factories.** `machines = rate × time / (output × speed)`. Display truncates to 6 decimal places. No ceiling, no “you need 8 so build 8.”
3. **Tree is local, totals are rolled up.** A branch shows machines for that line only. Totals by item and the machine strip are the sum across the whole demand.
4. **Setup is global until a node needs its own.** Assembler tier and furnace type live in a left Setup pane and apply to every recipe of that machine class. Per-node overrides come later (modules, alternate recipes, different machines for the same item).
5. **One screen, three answers.** Machine totals strip, foldable recipe tree, totals by item. That layout is the product; later features hang off it rather than replacing it.
6. **Build when it is needed.** Ultimate scope is every planet and every modifier. Delivery is unlock-driven: add a system when it is about to be used in the save, not when it is theoretically available in the game.

---

## 3. Current prototype (v0.1)

Static HTML/CSS/JS, no build step. Served from `prototypes/v0.1`. Launch with `scripts/serve-prototype.sh`.

### 3.1 What it does

- Pick one product from a crafting-menu overlay (tabs, icon grid, search).
- Enter a target rate as free decimal text, in `/s` or `/min`.
- Choose assembling machine 1/2/3 (speeds 0.5 / 0.75 / 1.25) and stone / steel / electric furnace (1 / 2 / 2).
- See a foldable recipe tree (item, rate, machines for that line).
- See totals by item, grouped by craft category, with rolled-up rate and machines.
- See a horizontal machine-type summary (all assemblers, all furnaces, miners, chem plants, etc.).
- Defaults: AM2, steel furnace, 1/s red science.

### 3.2 Recipe coverage today

Science through **utility (yellow)**, plus the ingredients those packs actually pull:

| Group | Items |
| --- | --- |
| Science | Red, green, military, blue, purple, yellow |
| Intermediate | Gears, cable, green/red/blue circuits, engines, electric engines, robot frames, LDS, iron sticks |
| Logistics | Belt, inserter, pipe, rail |
| Production | Electric furnace, productivity module 1 |
| Combat | Firearm mag, piercing mag, grenade, wall |
| Smelting | Iron, copper, steel, stone brick |
| Chemical | Plastic, sulfur, battery, sulfuric acid, lubricant, petroleum gas, heavy oil |
| Raw | Iron/copper ore, coal, stone, water, crude |

### 3.3 Calculator assumptions (v0.1)

| Machine | Model |
| --- | --- |
| Assembler | Global AM1/2/3 speed |
| Furnace | Global stone/steel/electric speed |
| Chemical plant | Speed 1 |
| Oil refinery | Speed 1 |
| Electric mining drill | 0.5 ore/s |
| Pumpjack | 10 crude/s (100% yield) |
| Offshore pump | 1200 water/s |

Petroleum gas is a **collapsed** advanced oil processing + full crack: 5s, 100 crude + 132.5 water → 97.5 gas. Heavy oil is counted from advanced oil processing **without** cracking. If a tree needs both, crude and refineries are overstated.

One recipe per item. No modules, no beacons, no mining productivity, no quality, no recipe-inherent productivity, no per-node machine choice. Fluid recipes that require AM2+ (processing units, electric engines) are not enforced.

These approximations are acceptable for the prototype. They are **not** acceptable as the long-term oil or modifier model.

---

## 4. Vision (ultimate scope)

A single calculator that can represent **any** Factorio 2.0 production chain the player is running:

- Every item and recipe on Nauvis, space platforms, Vulcanus, Gleba, Fulgora, Aquilo, and later surfaces.
- Every machine that can craft a recipe (assembler, furnace, chem plant, foundry, electromagnetic plant, biochamber, recycler, cryogenic plant, rocket silo, …).
- Every modifier that changes `machines = rate × time / (output × speed × productivity)` — and the input-side cost of that productivity.
- Several target items at once (typical: a science mix, or “rocket parts + platform foundation”).
- On any node that has more than one legal recipe or machine, the player can pick which one this factory is using.

The UI stays the prototype’s: setup, product(s), tree, totals, machine strip. Depth is added to nodes and to Setup, not by inventing a new app.

---

## 5. Delivery approach

Two tracks, kept separate on purpose.

**Catalog track (initial scope).** Fill Nauvis pre-space recipes and machines so the existing UI can calculate anything needed before the first rocket. This is data + small calc/UI adjustments, still one product, still global setup.

**Modifier / surface track (later).** Unlock-driven features. Each one is added when it is about to be used:

| When it shows up in the save | Feature to add |
| --- | --- |
| Prod/speed/efficiency modules in machines | Per-node (or per-machine-type) modules |
| Beacons around a build | Beacon count + module mix |
| Mining productivity researched | Mining productivity on miners/pumpjacks |
| Multiple sciences at a chosen SPM | Multiple target items |
| Solid fuel / oil products / Kovarex / recycling | Recipe selection on a tree node |
| First rocket | Rocket part, rocket fuel, silo as a machine |
| Space platform | Platform recipes, asteroid collectors, crushers |
| Vulcanus / Gleba / Fulgora / Aquilo | That planet’s machines, recipes, and mechanics |
| Quality used in production | Quality as a modifier and as item variants |
| Gleba spoilage | Spoil as a rate/loss model |
| Fulgora recycling loops | Scrap → recycle with recipe choice and quality |

Do not build a planet or modifier because it exists in the wiki. Build it because the save is about to need the number.

---

## 6. Initial scope — Nauvis, pre-space

**Goal:** the current prototype, completed into a calculator that covers **all Nauvis recipes and machines used before leaving for space**. Same UX. Same “one product, one rate, global assembler/furnace.” Space science, platforms, and other planets are out.

“Pre-space” means: everything craftable on Nauvis that is required or commonly used up to launching a rocket and a space platform starter pack. It does **not** include space-platform-only recipes or other planets.

### 6.1 Must keep from the prototype

- Crafting-menu product picker with in-game-like tabs.
- Decimal rate field, `/s` and `/min`.
- Left Setup pane (assembler + furnace, ready for more machine types).
- Foldable recipe tree; expand/collapse all.
- Totals by item (rate + machines) grouped by category.
- Horizontal machine-type summary.
- Exact (non-rounded) machine counts.
- Wiki-style 64px icons.

### 6.2 Catalog to complete

v0.1 only contains science-pack trees. Initial scope fills the rest of Nauvis, including items that are not on those trees, so they can be selected as the product.

Priority bands (all in scope; order is play order, not optional vs cut):

1. **Already in v0.1** — six Nauvis sciences and their current ingredient graphs.
2. **Oil products that yellow/rocket actually use** — light oil, solid fuel (all source recipes as *data*, one default in the tree), rocket fuel, basic vs advanced oil processing represented honestly enough that crude is not double-counted for typical yellow + rocket-fuel factories.
3. **Rocket launch** — concrete, rocket silo, rocket part, cargo landing pad, space platform starter pack. Rocket silo crafts rocket parts (50 parts/rocket in Space Age).
4. **The rest of Nauvis crafting** — remaining logistics (fast/express belts, undergrounds, splitters, inserters, poles, trains), production (miners, assembling machines as items, labs, modules 1–3 as items, roboport, robots, beacons as items), combat, power (boiler, steam engine, solar, accumulator, and nuclear if it is used before space), barrels, landfill, repair pack, and any other Nauvis item the craft menu would show.

Nuclear is Nauvis content and often comes online around purple science. Include it in the catalog even if the first save does not use it before the rocket. Do not include space-only or planet-only items.

### 6.3 Calculator work that belongs in initial scope

These are required for the catalog to be truthful on Nauvis, not “later modifiers”:

- **Honest oil.** Replace the collapsed-PG + separate-heavy-oil hack with a model that can produce petroleum, light oil, and heavy oil from the same advanced oil processing step, plus cracking as explicit recipes. Until per-node recipe selection exists, pick defaults (advanced processing + crack surplus toward whatever the tree is asking for) and document them in the machine-strip note.
- **Multi-output recipes in the data model**, even if the UI still shows a single “primary” product. Oil processing and uranium processing need this; Kovarex and rocket parts benefit from it.
- **Machine coverage** for every crafting category used on Nauvis: assembler, furnace, chem plant, refinery, miner, pumpjack, offshore pump, centrifuge, rocket silo. Setup pane should expose a speed/tier where the player actually switches (assembler, furnace). Fixed-speed machines can stay implicit until they get modules.
- **Recipe data shaped for alternates** — each item can have more than one recipe in data, with one marked default. The UI does not have to offer a picker yet. Solid fuel, oil, and iron/copper from ore vs recycling-later must not require a data rewrite when the picker ships.

### 6.4 Explicitly out of initial scope

- Space platform, asteroid, and other-planet recipes.
- Modules and beacons as **speed/productivity modifiers** (module *items* may exist in the catalog as craftable products).
- Mining productivity research.
- Quality.
- Multiple simultaneous target items.
- Per-node recipe or machine picker in the tree.
- Power consumption, pollution, UPS, belt throughput.
- Persistence, accounts, import from a save file.

---

## 7. Foreseeable enhancements

Design the data and tree so these can attach without throwing away v0.1 UX. Do not implement them in the initial build.

### 7.1 Modules and beacons

The real formula is closer to:

`effective speed = machine speed × (1 + speed bonus)`  
`effective productivity = 1 + recipe productivity + module productivity + research productivity`  
`output/s = (craft output × effective speed × effective productivity) / time`  
`input/s = (craft input × effective speed) / time`  — productivity does not reduce ingredients, except where a recipe or machine says otherwise (foundry, recycler, etc. have their own rules).

Needed, eventually:

- Per machine type, then per tree node: module slots filled with speed / productivity / efficiency (and quality later).
- Beacon transmission: beacon count, modules in beacons, transmission strength, later quality beacons.
- Recipe-inherent productivity (2.0 has this on many recipes).
- Research modifiers: mining productivity, rocket part productivity, and other infinite prod techs.
- Display both **machine count** and **module count** in totals when modules are in play.

Setup pane is the right home for “default modules on all assemblers.” The tree is the right home for “this LDS line is beaconed.”

### 7.2 Per-node recipe selection

Many Nauvis items already have multiple recipes; planets add more (foundry vs assembler, recycler loops, biochamber vs assembler).

- Click (or slot-click) a tree node to choose among legal recipes for that item.
- Changing a recipe rebuilds that subtree and the totals.
- Defaults remain so a first click on “yellow science” still just works.
- Oil products are the first hard case: choosing “solid fuel from light oil” vs “from petroleum” changes the whole fluid balance.

### 7.3 Per-node machine selection

Same item, different buildings: stone vs steel vs electric furnace; assembling machine vs foundry vs electromagnetic plant. Global Setup stays the default; a node can override.

### 7.4 Multiple target items

A list of products, each with its own rate (or a shared “n of each science /s”). One combined tree (or a forest with shared rollup). Totals and the machine strip merge duplicate items. This is how real science and rocket planning works; single-product is only a prototype convenience.

### 7.5 Raw-input and mining modifiers

- Mining drill tier (burner / electric / big), ore hardness, and mining productivity.
- Pumpjack yield (not locked at 100% / 10/s).
- Later: Vulcanus tungsten, Gleba harvest, Fulgora scrap, Aquilo lithium — each is a different “raw” machine, not a copy of the electric miner.

### 7.6 Planets and surfaces

Each surface is a recipe + machine + mechanic pack on top of the same calculator:

| Surface | What the model must gain |
| --- | --- |
| Space platform | Platform recipes, collectors, crushers, thrusters; no miners in the Nauvis sense |
| Vulcanus | Foundry, big mining, lava/calcite, tungsten, metallurgic science |
| Gleba | Biochamber, spoilage, nutrients, agricultural science |
| Fulgora | Recycler, scrap, electromagnetic plant, quality-adjacent loops, electromagnetic science |
| Aquilo | Cryogenic plant, heat, fluoroketone, cryogenic science |

Planet packs should be **gated in the craft menu** (tab or filter) so Nauvis stays scannable. A surface setting may later restrict which recipes/machines are legal.

### 7.7 Quality

Quality changes craft time, module effects, machine speed, and the item identity itself. Treat it as a modifier on a node (and on the item key) once it is used in production, not as a separate app. Until then, all items are normal quality.

### 7.8 Other look-aheads worth not boxing out

- **Fluids vs items** in the UI (same math, clearer totals).
- **Byproducts and waste** (heavy/light surplus, spoilage, recycler junk) as first-class tree children, not hidden inside a collapsed recipe.
- **Shared intermediates with a cap** (“I already make 20 green circuits/s elsewhere”) — optional later; would turn some nodes into raw inputs.
- **Save/load of a calculation** (product list, rates, setup, per-node choices).
- **Import from Factorio recipe prototypes** so the catalog does not stay hand-maintained forever.

---

## 8. UX requirements (stable)

The full product should still feel like v0.1, scaled.

- **Setup pane (left):** machine tiers and, later, default modules / mining productivity / surface. Groups, not a settings dump.
- **Workspace:** product picker + rate, then machine strip, then tree | totals.
- **Product picker:** crafting grid, search, tabs that match the game. Multiple products later reuse the same grid (“add item”).
- **Tree:** indent, fold, icons, rate, machines. Later: a small recipe/machine/module control on the row, without turning the row into a form.
- **Numbers:** monospace, truncated decimals, `/s` vs `/min` everywhere consistently.
- **Notes:** short, only for model assumptions (oil, pumpjack yield, etc.). No tutorial overlay.

Non-requirements: SPM preset buttons (rejected in the prototype), three equal columns, dropdowns for long item lists.

---

## 9. Data and calc implications (no implementation in this round)

The prototype stores `ITEMS[id].recipe` as a single object. That is the main thing that will not survive contact with oil, solid fuel, or planets.

The durable shape, when it is time to change it:

- **Items** (id, name, icon, category, stack, fluid vs item, spoil time if any).
- **Recipes** (id, ingredients[], products[] with amounts, time, category, allowed machines, inherent productivity).
- **Machines** (id, speed, module slots, allowed recipe categories, defaults).
- **Calculation settings** (global defaults + per-node overrides: recipe id, machine id, modules, beacons, quality).
- **Demand** (one or more item + rate pairs).

v0.1 can keep its flat file until the catalog work forces multi-recipe or multi-output. When it does, migrate once; do not add a third collapsed-oil special case.

---

## 10. Non-goals

Not this product, now or later unless the need is explicit:

- Belt/pipe layout, rail planner, or blueprint generation.
- Full electrical network or fluid-network simulation.
- Combat sim, pollution, evolution.
- Multiplayer, cloud sync, or accounts.
- Pixel-perfect Factorio GUI clone beyond the craft-menu metaphor.
- Supporting 1.1-only recipes as a separate mode (2.0 Space Age is the source of truth).

---

## 11. Success criteria

**Initial scope is done when:**

- Every Nauvis pre-space item is selectable and produces a tree that reaches raw inputs.
- Yellow science and rocket fuel/rocket parts can be calculated without knowingly double-counting crude for a normal AOP + cracking setup.
- Machine counts for known wiki ratios (e.g. 21× AM3 for 225 yellow/min, 42× AM3 for 450 purple/min) still match.
- The v0.1 layout and craft-menu picker are unchanged in spirit.

**The product is on track for the vision when:**

- A new planet or modifier can be added as data + a small UI control, without changing how demand, rollup, or the three-pane layout work.
- Alternate recipes and modules are node properties, not new screens.

---

## 12. Open questions

Resolve when the work comes up, not up front.

1. For oil in initial scope: is a single documented default chain (AOP + crack toward demanded fluids) enough, or is a minimal recipe picker required before rocket fuel?
2. Are assembling machines, belts, etc. first-class products in v1 even if they never appear on a science tree? (This PRD says yes.)
3. Nuclear before space: catalog-only, or also centrifuge as a machine in Setup?
4. When multiple targets ship, is the primary use “N sciences at rate R” or an arbitrary list?
5. Will recipe data stay hand-authored, or is a dump from the game/wiki the source of truth once the catalog grows past Nauvis?
6. Quality: treat as a multiplier on the same item, or as distinct item ids (`iron-plate` vs `iron-plate-uncommon`)?
