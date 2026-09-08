const state = {
  product: "automation-science-pack",
  rate: "1",
  unit: "s",
  assembler: 2,
  furnace: "steel",
  collapsed: new Set(),
  craftOpen: false,
  craftTab: "science",
  craftQuery: "",
};

/** Decimal display — no rounding or ceiling. */
function formatNum(n) {
  if (n == null || Number.isNaN(n)) return "—";
  if (n === 0) return "0";
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  const raw = String(abs);
  if (raw.includes("e") || raw.includes("E")) {
    const [whole, frac = ""] = abs.toFixed(10).split(".");
    const trimmed = frac.replace(/0+$/, "");
    return trimmed ? `${sign}${whole}.${trimmed}` : `${sign}${whole}`;
  }
  const [whole, frac = ""] = raw.split(".");
  const clipped = frac.slice(0, 6).replace(/0+$/, "");
  return clipped ? `${sign}${whole}.${clipped}` : `${sign}${whole}`;
}

function displayRate(perSec) {
  return state.unit === "min" ? perSec * 60 : perSec;
}

function rateUnitLabel() {
  return state.unit === "min" ? "/min" : "/s";
}

function iconHtml(id) {
  const item = ITEMS[id];
  return `<img class="icon" src="icons/${id}.png" alt="${item.name}" title="${item.name}" />`;
}

function machineIconHtml(machineKind, settingsObj) {
  const file = machineIconFile(machineKind, settingsObj);
  if (!file) return "";
  const label = machineLabel(machineKind, settingsObj);
  return `<img class="icon icon-machine" src="icons/${file}" alt="${label}" title="${label}" />`;
}

function itemLabel(id) {
  const item = ITEMS[id];
  const alias = item.alias ? ` <span class="alias">(${item.alias})</span>` : "";
  return `${iconHtml(id)}<span class="name">${item.name}${alias}</span>`;
}

function parseRateString(raw) {
  const text = String(raw).trim().replace(",", ".");
  if (text === "" || text === "." || text === "-") return { incomplete: true, value: null };
  if (text.endsWith(".")) {
    const n = Number(text.slice(0, -1));
    if (!Number.isFinite(n) || n < 0) return { incomplete: true, value: null };
    if (n === 0) return { incomplete: true, value: null };
    return { incomplete: false, value: n };
  }
  const value = Number(text);
  if (!Number.isFinite(value)) return { incomplete: true, value: null };
  if (value <= 0) return { incomplete: false, value: 0 };
  return { incomplete: false, value };
}

function ratePerSec() {
  const parsed = parseRateString(state.rate);
  if (parsed.value == null || parsed.value <= 0) return 0;
  return state.unit === "min" ? parsed.value / 60 : parsed.value;
}

function settings() {
  return { assembler: Number(state.assembler), furnace: state.furnace };
}

function collectExpandable(node, path = "", ids = []) {
  const nodePath = path ? `${path}/${node.id}` : node.id;
  if (node.children.length) {
    ids.push(nodePath);
    for (const child of node.children) collectExpandable(child, nodePath, ids);
  }
  return ids;
}

function machinesCell(itemId, rate) {
  const count = machinesNeeded(itemId, rate, settings());
  const machine = ITEMS[itemId] && ITEMS[itemId].recipe && ITEMS[itemId].recipe.machine;
  if (count == null || !machine) {
    return `<span class="machines"><span class="unit">raw</span></span>`;
  }
  const cfg = settings();
  return `<span class="machines" title="${machineLabel(machine, cfg)}">${machineIconHtml(machine, cfg)}<span>${formatNum(count)}</span></span>`;
}

function renderTree(node, path = "", depth = 0) {
  const nodePath = path ? `${path}/${node.id}` : node.id;
  const collapsed = state.collapsed.has(nodePath);
  const hasKids = node.children.length > 0;
  const chevron = hasKids ? (collapsed ? "▶" : "▼") : "·";
  const rate = formatNum(displayRate(node.rate));
  let html = `<li>
    <div class="row" data-item="${node.id}">
      <div class="item" style="padding-left:${depth * 18}px">
        <button class="toggle" data-toggle="${nodePath}" ${hasKids ? "" : "disabled"} aria-label="Toggle">${chevron}</button>
        ${itemLabel(node.id)}
      </div>
      <span class="rate">${rate} <span class="unit">${rateUnitLabel()}</span></span>
      ${machinesCell(node.id, node.rate)}
    </div>`;
  if (hasKids && !collapsed) {
    html += `<ul>${node.children.map((child) => renderTree(child, nodePath, depth + 1)).join("")}</ul>`;
  }
  html += "</li>";
  return html;
}

function groupedOrder(order) {
  const byCat = new Map();
  for (const id of order) {
    const cat = ITEMS[id].category;
    if (!byCat.has(cat)) byCat.set(cat, []);
    byCat.get(cat).push(id);
  }
  return CATEGORY_ORDER
    .filter((cat) => byCat.has(cat))
    .map((cat) => ({ category: cat, ids: byCat.get(cat) }));
}

function renderTotals(order, totals) {
  const groups = groupedOrder(order);
  let html = `<table class="table">
    <thead><tr><th>Item</th><th>Rate</th><th>Machines</th></tr></thead><tbody>`;
  for (const group of groups) {
    html += `<tr class="group-head"><td colspan="3">${CATEGORY_LABELS[group.category]}</td></tr>`;
    for (const id of group.ids) {
      html += `<tr data-item="${id}">
        <td><div class="item-cell">${itemLabel(id)}</div></td>
        <td class="rate">${formatNum(displayRate(totals.get(id)))} <span class="unit">${rateUnitLabel()}</span></td>
        <td>${machinesCell(id, totals.get(id))}</td>
      </tr>`;
    }
  }
  html += "</tbody></table>";
  return html;
}

function renderSummary(machineSummary) {
  const cfg = settings();
  const chips = [...machineSummary.byType.entries()].map(([, info]) => {
    return `<span class="chip">${machineIconHtml(info.kind, cfg)}<span class="chip-copy">${info.label}<strong>${formatNum(info.count)}</strong></span></span>`;
  });
  if (!chips.length) return `<div class="empty">No machines for this rate.</div>`;
  return `<div class="summary">${chips.join("")}</div>
    <p class="note">Rolled-up machine counts. Petroleum gas assumes advanced oil processing with light and heavy cracked to gas. Heavy oil is counted from advanced oil processing on its own, so crude is overstated when both are needed. Pumpjacks counted at 10 crude/s (100% yield).</p>`;
}

function selectableIds() {
  return Object.keys(ITEMS).filter((id) => ITEMS[id].recipe);
}

function itemsForCraftMenu() {
  const query = state.craftQuery.trim().toLowerCase();
  return selectableIds()
    .filter((id) => {
      const item = ITEMS[id];
      if (query) {
        const hay = `${item.name} ${item.alias || ""} ${id}`.toLowerCase();
        if (!hay.includes(query)) return false;
      } else if (state.craftTab !== "all" && item.category !== state.craftTab) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const aSci = SCIENCE_PACKS.indexOf(a);
      const bSci = SCIENCE_PACKS.indexOf(b);
      if (aSci !== -1 || bSci !== -1) {
        if (aSci === -1) return 1;
        if (bSci === -1) return -1;
        return aSci - bSci;
      }
      if (ITEMS[a].category !== ITEMS[b].category) {
        return ITEMS[a].category.localeCompare(ITEMS[b].category);
      }
      return ITEMS[a].name.localeCompare(ITEMS[b].name);
    });
}

function renderProductSlot() {
  const item = ITEMS[state.product];
  document.getElementById("product-slot-icon").innerHTML = `<img src="icons/${state.product}.png" alt="" />`;
  const alias = item.alias ? ` (${item.alias})` : "";
  document.getElementById("product-slot-name").textContent = `${item.name}${alias}`;
  document.getElementById("product-slot").setAttribute("aria-expanded", state.craftOpen ? "true" : "false");
}

function renderCraftMenu() {
  const tabs = document.getElementById("craft-tabs");
  tabs.innerHTML = CRAFT_TABS.map((tab) => {
    const active = !state.craftQuery && tab.id === state.craftTab ? " active" : "";
    const icon = tab.icon
      ? `<img src="icons/${tab.icon}.png" alt="" />`
      : `<span class="tab-all">All</span>`;
    return `<button type="button" class="craft-tab${active}" data-craft-tab="${tab.id}" title="${tab.label}">${icon}</button>`;
  }).join("");

  const ids = itemsForCraftMenu();
  const grid = document.getElementById("craft-grid");
  if (!ids.length) {
    grid.innerHTML = `<div class="craft-empty">No matching items</div>`;
  } else {
    grid.innerHTML = ids
      .map((id) => {
        const item = ITEMS[id];
        const selected = id === state.product ? " selected" : "";
        const label = item.alias ? `${item.name} (${item.alias})` : item.name;
        return `<button type="button" class="slot${selected}" data-craft-item="${id}" title="${label}">
        <img src="icons/${id}.png" alt="${item.name}" />
      </button>`;
      })
      .join("");
  }

  const tip = document.getElementById("craft-tip");
  const current = ITEMS[state.product];
  tip.textContent = current.alias ? `${current.name} (${current.alias})` : current.name;

  document.getElementById("craft-menu").hidden = !state.craftOpen;
}

function openCraftMenu() {
  state.craftOpen = true;
  state.craftTab = ITEMS[state.product].category || "all";
  state.craftQuery = "";
  document.getElementById("craft-search").value = "";
  renderProductSlot();
  renderCraftMenu();
  document.getElementById("craft-search").focus();
}

function closeCraftMenu() {
  if (!state.craftOpen) return;
  state.craftOpen = false;
  renderProductSlot();
  renderCraftMenu();
}

function bindCraftMenu() {
  document.getElementById("craft-tabs").addEventListener("click", (event) => {
    const btn = event.target.closest("[data-craft-tab]");
    if (!btn) return;
    state.craftTab = btn.dataset.craftTab;
    state.craftQuery = "";
    document.getElementById("craft-search").value = "";
    renderCraftMenu();
  });

  document.getElementById("craft-grid").addEventListener("click", (event) => {
    const btn = event.target.closest("[data-craft-item]");
    if (!btn) return;
    state.product = btn.dataset.craftItem;
    state.collapsed = new Set();
    closeCraftMenu();
    render();
  });

  document.getElementById("craft-grid").addEventListener("mouseover", (event) => {
    const btn = event.target.closest("[data-craft-item]");
    if (!btn) return;
    const item = ITEMS[btn.dataset.craftItem];
    document.getElementById("craft-tip").textContent = item.alias ? `${item.name} (${item.alias})` : item.name;
  });

  document.getElementById("craft-search").addEventListener("input", (event) => {
    state.craftQuery = event.target.value;
    renderCraftMenu();
  });

  document.getElementById("product-slot").addEventListener("click", (event) => {
    event.stopPropagation();
    if (state.craftOpen) closeCraftMenu();
    else openCraftMenu();
  });

  document.getElementById("craft-menu").addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", () => closeCraftMenu());
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCraftMenu();
  });
}

function bindHover() {
  const nodes = document.querySelectorAll("[data-item]");
  nodes.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      document.querySelectorAll(`[data-item="${el.dataset.item}"]`).forEach((hit) => hit.classList.add("lit"));
    });
    el.addEventListener("mouseleave", () => {
      document.querySelectorAll(`[data-item="${el.dataset.item}"]`).forEach((hit) => hit.classList.remove("lit"));
    });
  });
}

function render() {
  const rate = ratePerSec();
  const parsed = parseRateString(state.rate);
  const treeRoot = document.getElementById("tree");
  const totalsRoot = document.getElementById("totals");
  const summaryRoot = document.getElementById("summary");

  if (rate <= 0) {
    if (parsed.incomplete && treeRoot.querySelector(".tree")) return;
    const msg = `<div class="empty">Enter a target rate greater than zero.</div>`;
    treeRoot.innerHTML = msg;
    totalsRoot.innerHTML = msg;
    summaryRoot.innerHTML = msg;
    return;
  }

  const result = calculate(state.product, rate, settings());
  treeRoot.innerHTML = `<div class="tree-head"><span>Item</span><span>Rate</span><span>Machines</span></div><ul class="tree">${renderTree(result.tree)}</ul>`;
  totalsRoot.innerHTML = renderTotals(result.order, result.totals);
  summaryRoot.innerHTML = renderSummary(result.machines);
  bindHover();
  bindToggles();
}

function bindToggles() {
  document.querySelectorAll("[data-toggle]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const id = btn.dataset.toggle;
      if (state.collapsed.has(id)) state.collapsed.delete(id);
      else state.collapsed.add(id);
      render();
    });
  });
}

function setCollapsedAll(collapsed) {
  const rate = ratePerSec();
  if (rate <= 0) return;
  const tree = buildTree(state.product, rate);
  const ids = collectExpandable(tree);
  state.collapsed = collapsed ? new Set(ids) : new Set();
  render();
}

function syncControls() {
  renderProductSlot();
  const rateInput = document.getElementById("rate");
  if (document.activeElement !== rateInput) rateInput.value = state.rate;
  document.querySelectorAll("[data-assembler]").forEach((btn) => {
    btn.classList.toggle("active", Number(btn.dataset.assembler) === Number(state.assembler));
  });
  document.querySelectorAll("[data-furnace]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.furnace === state.furnace);
  });
  document.querySelectorAll("[data-unit]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.unit === state.unit);
  });
}

function init() {
  renderCraftMenu();
  syncControls();
  bindCraftMenu();

  document.getElementById("rate").addEventListener("input", (event) => {
    state.rate = event.target.value;
    render();
  });
  document.querySelectorAll("[data-assembler]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.assembler = Number(btn.dataset.assembler);
      syncControls();
      render();
    });
  });
  document.querySelectorAll("[data-furnace]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.furnace = btn.dataset.furnace;
      syncControls();
      render();
    });
  });
  document.querySelectorAll("[data-unit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.dataset.unit;
      if (next === state.unit) return;
      const perSec = ratePerSec();
      state.unit = next;
      if (perSec > 0) state.rate = String(next === "min" ? perSec * 60 : perSec);
      document.getElementById("rate").value = state.rate;
      syncControls();
      render();
    });
  });
  document.getElementById("expand-all").addEventListener("click", () => setCollapsedAll(false));
  document.getElementById("collapse-all").addEventListener("click", () => setCollapsedAll(true));
  render();
}

document.addEventListener("DOMContentLoaded", init);
