# Factorio Calc — Master plan

Source of truth for *how* we work and *what* we build next. Product requirements stay in [`docs/prd.md`](../prd.md). This file is the living breakdown of that PRD into units small enough to follow, not a second PRD.

**Status:** Unit 1.9 is done. Next is [1.10 Machines by kind](#110-machines-by-kind-next-ready) — explain and wait.

---

## Standing working agreement

Read this before planning or coding. It exists so the same constraints do not have to be restated every session.

1. **The user is following along.** Explain how the piece works before writing it. Do not one-shot a phase, a port, or a “mechanical copy.”
2. **Explain, then wait.** In the chat: what files, what the code does, roughly how many lines. **Do not write those files in the same turn.** Start only after the user agrees.
3. **200 lines is a hard cap** unless the user explicitly agrees to more. Copying or moving an existing file **counts** — `recipes.js` is ~635 lines and is never a single unit. 20 files or fewer.
4. **Drill before you code.** High-level phase → units → one *ready* unit with files, done-when, and explicit non-goals.
5. **One unit per session (default).** Implement, verify, update this file, then stop. Next unit only if the user says so.
6. **Prototype UX is sacred for Track A.** Setup pane, craft-menu picker, rate field, machine strip, foldable tree, totals by item. Later features hang off those, they do not replace them.
7. **Do not build Track B** (modules as modifiers, planets, quality, multi-target, per-node pickers, persistence) until the save needs it. *Do* leave data shapes that those can attach to.
8. **Calc truth over catalog volume.** Known wiki ratios must stay green. Filling items on a dishonest oil model is wasted work.
9. **After every unit:** mark it done in this file, note surprises, and either drill the next unit to “ready” or leave it coarse on purpose.

If a future request conflicts with this agreement, follow this file and say so.

---

## How this document is used

| Status | Meaning |
| --- | --- |
| coarse | Too big to code. Needs a drill-down pass before it is a unit. |
| ready | Small enough. Has files, done-when, and explicit non-goals. |
| next | The unit to start when we say “go.” |
| done | Shipped and verified. |

**Current next unit:** [1.10 Machines by kind](#110-machines-by-kind-next-ready) — waiting for agreement, not started.

---

## Map: PRD → this plan

| PRD | Here |
| --- | --- |
| §3 Prototype v0.1 | Baseline. We keep it until the product home exists; then freeze it. |
| §5 Catalog track | **Track A** — the only implementation track for now. |
| §5 Modifier / surface track | **Track B** — listed so we do not box it out; not scheduled. |
| §6 Initial scope (Nauvis pre-space) | Phases 1–6 of Track A. |
| §6.3 Honest oil, multi-output, recipe-shaped-for-alternates | Phase 2–3. Must happen *before* most catalog fill. |
| §6.2 Catalog bands (oil products, rocket, rest of Nauvis) | Phases 4–6, many small data units. |
| §7 / §9 Foreseeable data shape | Constraints on Phase 2, not work items. |
| §11 Success criteria | Phase 7 acceptance. |
| §12 Open questions | [Working defaults](#open-questions--working-defaults) below. Resolve when that unit starts, not now. |

---

## Where we are

Living product is `app/`: hardcoded red science 1/s shows a nested tree and a flat totals list. Machine-kind strip is still empty. `prototypes/` stays isolated.

That nested recipe is the thing the PRD says will not survive oil, solid fuel, or planets. Catalog work that adds more items in the old shape is borrowing time.

What v0.1 already covers well: six Nauvis sciences and the ingredient graphs they actually pull, plus the UX we are keeping.

What v0.1 fakes: petroleum gas is a collapsed “AOP + full crack”; heavy oil is a separate AOP with no crack. Crude is overstated if a tree needs both.

---

## Track A — Nauvis pre-space (now)

Goal from the PRD: every Nauvis pre-space item selectable, tree to raw inputs, yellow + rocket fuel/parts without knowingly double-counting crude, wiki ratios still match, v0.1 layout unchanged in spirit.

Spine (order matters):

```
1. Safety net (golden ratios) + product home (`app/`, prototype frozen)
2. Data accessors + durable shape (still same numbers)
3. Multi-output + honest oil
4. Oil / rocket-fuel catalog (needs honest oil)
5. Rocket-launch catalog + silo as a machine
6. Rest of Nauvis catalog, in play-order batches
7. Acceptance against §11
```

Do not skip to 6. Filling belts while oil is still a special-case hack means rewriting those recipes later.

---

### Phase 1 — Safety net and a place to stand

**Why first.** Every later unit refactors calc or data. Without a ratio check, we will not know we broke yellow science.

#### 1.1 Golden ratio harness — **done**

Shipped. `tests/golden-ratios.js` loads `prototypes/v0.1/recipes.js` + `calc.js` in a Node VM and asserts:

- 225 utility science /min, AM3 → **21** assemblers (exact `21`)
- 450 production science /min, AM3 → **42** assemblers (exact `42`)

Run with `node tests/golden-ratios.js` or `scripts/test.sh`.

**Learned:** prototype `const` bindings are not sandbox globals; the harness concatenates the two files and assigns `this.machinesNeeded` / `this.ITEMS` at the end. Keep that pattern until `app/` uses real `import`/`export`.

---

#### 1.2 Product home — **done**

Shipped. ~85 lines. `app/` is the product home; prototype not edited.

- `package.json` (repo name only). `"type": "module"` lives in `app/package.json` so Node does not treat `tests/golden-ratios.js` as ESM.
- `app/index.html` — setup / product / rate / machines / tree / totals, empty.
- `app/src/ui.js` — sets `#module-status` to `app module loaded`.
- `scripts/serve-app.sh` — serves `app/` (default port 8765).

**Learned:** a root `"type": "module"` breaks the existing CommonJS test harness. Browser `<script type="module">` does not need a root package.json.

---

#### 1.2b GitHub Pages — **done**

Publish **only** `app/`. `prototypes/` is not on the site (no copies, no symlinks, no workflow paths into it). `docs/` stays product docs, not the Pages source.

- `.github/workflows/pages.yml` — on push to `main`, upload `app` as the Pages artifact (`include-hidden-files` so `.nojekyll` is included).
- `app/.nojekyll` — skip Jekyll if anyone ever switches to branch deploy.

Repo Settings → Pages → Source must be **GitHub Actions** (not “Deploy from a branch” / `/docs`).

---

#### 1.3 Calc module — **done**

Built from scratch in `app/` (not copied from the prototype). ~115 lines.

- `app/src/data.js` — assembler speeds + yellow/purple pack recipes (time, output, machine).
- `app/src/calc.js` — `getMachineSpeed`, `machineThroughput`, `machinesNeeded`.
- `tests/calc-ratios.mjs` — same 21 / 42 checks against **app** calc.
- `scripts/test.sh` — runs that file. Spike harness remains `tests/golden-ratios.js` if you want it.

UI still does not call calc. No ingredient tree yet.

---

#### 1.4 Recipe tree — **done**

`buildTree` plus a handmade red-science chain. At 1 pack/s: gear needs 2 iron plate/s (2 plates per gear), so 2 iron ore/s.

---

#### 1.5 Totals rollup — **done**

`rollupRates` walks the tree, sums `rate` by item id, and records first-seen order. Red science at 1/s: iron plate total = 2. A handmade two-branch tree in the test (1 + 3 plates) checks that duplicates add to 4.

---

#### 1.6 Machines from totals — **done**

Furnace speeds in `MACHINES` (stone 1, steel/electric 2). `getMachineSpeed` reads `settings.furnace`. 1 red/s → 2 plate/s → **3.2** steel furnaces. Ore has no recipe, so `machinesNeeded` is `null`.

---

#### 1.7 `calculate()` — **done**

`calculate(itemId, ratePerSec, settings)` runs `buildTree` → `rollupRates` → `machinesNeeded` **on each total**. Returns `{ tree, totals, order, machines }` (`machines` is a Map, `null` for ore).

---

#### 1.8 Draw the tree — **done**

Hardcoded red 1/s, AM2 + steel. Nested `<ul>` of name + rate in `#tree`. Gear line shows iron plate **2/s**. No CSS, no fold, no picker.

---

#### 1.9 Draw totals — **done**

Flat `#totals` list from `order` + `totals`. Iron plate appears once at 2/s. Same first-seen order as the rollup.

---

#### 1.10 Machines by kind — **next, ready** (waiting for agreement)

The Machines strip: total buildings **per machine kind** (all assemblers, all furnaces), not per item.

**This unit (~40 lines):** `calculate()` also returns `byKind` — Map of `assembler` / `furnace` → summed count from `machines` (skip `null`). `#summary` under Machines: one line per kind. Test: red 1/s steel → furnaces = copper plates + iron plates. No CSS, no per-item machine column.

**Not this unit:** craft menu, rate field, styling, grouping totals by category.

---

### Phase 2 — Durable data, same answers

**Why.** PRD §9: items, recipes (ingredients + *products[]*), machines, settings, demand. v0.1 can keep a flat file until multi-recipe or multi-output forces a change. Oil will force it. Migrate once.

**Constraint:** do not rewrite all of `recipes.js` in one unit (~635 lines today). Introduce a reading layer first, then migrate data in category-sized bites.

#### 2.1 Accessors — *coarse until 1.2 is in `app/`*

**Why.** Calc and UI currently poke `ITEMS[id].recipe`. Unit 2.2 will turn that into `item.defaultRecipe` + a `RECIPES` table. If every read already goes through `getRecipe(itemId)`, 2.2 is a data change, not a scavenger hunt.

**Shape (today’s internals, tomorrow’s names):**

```
getItem(id)        → ITEMS[id] or null
getRecipe(itemId)  → ITEMS[itemId].recipe or null   // still the nested object
getMachine(kind)   → MACHINES[kind] or null
```

**Touch:**

- `prototypes/v0.1/recipes.js` — add the three functions next to `ITEMS` / `MACHINES`.
- `prototypes/v0.1/calc.js` — `machineThroughput`, `machinesNeeded`, `buildTree`, `summarizeMachines` read only through accessors (no `item.recipe`, no `ITEMS[id].recipe`).
- `prototypes/v0.1/app.js` — `machinesCell` and `selectableIds` (the two UI reads of `.recipe`).
- `tests/golden-ratios.js` — still green; no new assertions required.

**Done when:** `scripts/test.sh` passes. Grep for `.recipe` in `calc.js` and `app.js` finds nothing except comments. UI behavior unchanged (no need to restyle).

**Not this unit:** `RECIPES` table, `products[]`, migrating science packs, new files, UI copy.

**Verify:** `scripts/test.sh`. Optionally serve the prototype and check yellow science still shows 21 AM3 at 225/min.

---

#### 2.2+ Recipe records — *coarse*

| Unit | Intent | Size note |
| --- | --- | --- |
| 2.2 Recipe records | `RECIPES[id]` with `ingredients[]` and `products[]` (length 1 for everything that is single-output today). Item points at `defaultRecipe`. | Schema + migrate **science packs only** first. |
| 2.3–2.n Migrate remaining v0.1 items | Same mechanical transform, one category per unit (intermediate, logistics, combat, smelted, chemical, raw). | Data-only. Stop at ~one category if the file is large. |
| 2.x Split files if needed | `data/machines.js`, `data/categories.js`, `data/items-*.js` — only when a single recipes file is a pain to edit. | Move, do not redesign. |

Leave room on the item for `fluid` vs `item` (optional field) so later UI can distinguish without a rewrite. Do not build that UI now.

Still **one default recipe per item** in the tree. Extra recipes may exist in data with no picker.

---

### Phase 3 — Multi-output and honest oil

**Why.** Yellow science + rocket fuel on the collapsed-PG hack double-counts crude. This is the hard calc of Track A. It is also the first real use of `products[]`.

Coarse until Phase 2 accessors exist. Expected drill:

| Unit | Intent |
| --- | --- |
| 3.1 Multi-output in calc | Throughput uses the *requested* product’s amount, not a single `recipe.output`. Other products are byproducts (visible later; may be ignored in the tree until 3.3). Single-output recipes unchanged. |
| 3.2 AOP + cracking as real recipes | Advanced oil processing: 100 crude + 50 water → 25 heavy + 45 light + 55 PG, 5s, refinery. Heavy cracking and light cracking as chem-plant recipes. Delete the collapsed-PG and solo-heavy hacks. |
| 3.3 Default oil policy | Until a node picker exists: demanded fluids from **one** AOP + crack surplus toward what the tree asked for. Document the policy on the machine-strip note. Shared crude (do not spawn a second AOP for heavy vs PG). |
| 3.4 Oil tests | A tree that needs PG **and** lubricant (heavy) must not pay crude twice. Machine-strip note matches the policy. |

Working default for PRD Q1: **documented default chain is enough for Track A.** No recipe picker before rocket fuel.

---

### Phase 4 — Oil products the rocket actually uses

Depends on Phase 3. Catalog + defaults, still no picker.

Coarse batches:

- Light oil as a first-class item (not only a hidden crack intermediate).
- Solid fuel: all three source recipes **in data**, default = from light oil (or whatever we document).
- Rocket fuel.

---

### Phase 5 — Rocket launch

Concrete, rocket silo (as a craftable and as a machine that crafts rocket parts), rocket part, cargo landing pad, space platform starter pack. Rocket silo: 50 parts/rocket in Space Age; speed/tier implicit like a chem plant until modules exist.

Centrifuge: add as a machine when nuclear items land (often next to this band or with “rest of Nauvis”). Setup pane stays assembler + furnace only; fixed-speed machines stay implicit.

---

### Phase 6 — Rest of Nauvis crafting

PRD says yes: items that never appear on a science tree are still products. Split by craft-menu group and play order so each unit is a handful of recipes + icons, not the whole game.

Indicative batches (each one unit or more, drilled when we get here):

- Belts / undergrounds / splitters (yellow → red → blue).
- Inserters and power poles.
- Trains.
- Production buildings as items (miners, assemblers, labs, modules 1–3 as *items*, roboport, robots, beacons as items).
- Combat remainder.
- Power (boiler, steam engine, solar, accumulator; nuclear if we include it here).
- Barrels, landfill, repair pack, and leftover craft-menu Nauvis items.

Nuclear: **catalog + centrifuge machine**, not a Setup-pane tier. Space-only and planet-only items stay out.

---

### Phase 7 — Track A acceptance

Walk [`docs/prd.md`](../prd.md) §11:

- Every Nauvis pre-space item selectable; tree reaches raw.
- Yellow + rocket fuel/parts: no known crude double-count for normal AOP + cracking.
- 21 AM3 / 225 yellow/min and 42 AM3 / 450 purple/min still match.
- Layout and craft-menu still feel like v0.1.

Fix gaps as their own units; do not “quickly add the missing fifty items” in one pass.

---

## Track B — later (do not implement)

Unlock-driven. Each row is a future phase when the save needs it, attached to the same calculator.

| When | What |
| --- | --- |
| Modules in machines | Per-type then per-node modules; formula in PRD §7.1 |
| Beacons | Count + module mix on a node |
| Mining prod research | On miners / pumpjacks |
| Several sciences at once | Multiple target items, one rollup |
| Solid fuel / Kovarex / recycling as a *choice* | Per-node recipe picker |
| First rocket (if not already in A) | Already in Track A catalog |
| Space platform | Platform recipes, collectors, crushers |
| Each planet | That planet’s machines + recipes + mechanic |
| Quality in production | Modifier + item identity |
| Gleba spoilage / Fulgora loops | Rate/loss and recycle-with-choice |

Design reminder only: demand, rollup, and the three-pane layout should not change when a planet pack is added.

---

## Open questions — working defaults

Resolve for real in the unit that first cares. Until then, use these so planning is not blocked:

| # | Question | Working default |
| --- | --- | --- |
| 1 | Oil: default chain vs picker before rocket fuel? | Default AOP + crack toward demand. Document it. No picker in Track A. |
| 2 | Assemblers, belts, etc. as products? | Yes (PRD). Phase 6. |
| 3 | Nuclear: catalog-only or centrifuge in Setup? | Catalog + centrifuge as an implicit machine. No Setup tier. |
| 4 | Multi-target: N sciences at R vs arbitrary list? | Track B. Arbitrary list that can still do “N at R.” |
| 5 | Hand-authored vs game dump? | Hand-authored through Nauvis. Revisit before the first planet pack. |
| 6 | Quality: multiplier vs distinct ids? | Track B. Distinct ids (`iron-plate-uncommon`) are less likely to box us in. |

---

## Suggested repo shape (not created yet)

```
app/                         # living product; this is the GitHub Pages site
.github/workflows/pages.yml  # deploys app/ only
prototypes/v0.1/             # frozen spike; never imported by app/ or Pages
tests/golden-ratios.js
scripts/test.sh
scripts/serve-prototype.sh
scripts/serve-app.sh
docs/prd.md
docs/plans/master.md
```

Stay static HTML/CSS/JS, no bundler, until something in Track A actually needs a build. Catalog growth is more files of data, not a framework. The published site must stay self-contained in `app/`.

---

## Log

| Date | Note |
| --- | --- |
| 2026-09-08 | Plan created from PRD. |
| 2026-09-08 | 1.1 done. Ratios are exact 21 and 42. |
| 2026-09-08 | 1.2 done. App shell only. Root `"type": "module"` would break tests; scoped it to `app/package.json`. |
| 2026-09-08 | 1.2b GitHub Pages: workflow publishes `app/` only. Prototypes isolated. |
| 2026-09-08 | 1.3 done from scratch: throughput / machinesNeeded + two packs. |
| 2026-09-08 | 1.4 done: buildTree + red science chain. |
| 2026-09-08 | 1.5 done: rollupRates by item. |
| 2026-09-09 | 1.6 done: furnace speeds; 2 plate/s → 3.2 steel furnaces. |
| 2026-09-09 | 1.7 done: calculate() wires machines from totals. |
| 2026-09-09 | 1.8 done: nested tree on the page (red 1/s). |
| 2026-09-09 | 1.9 done: flat totals list. Next: 1.10 machines by kind (waiting). |
