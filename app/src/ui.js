import { ITEMS } from "./data.js";
import { calculate } from "./calc.js";

const status = document.getElementById("module-status");
if (status) status.textContent = "app module loaded";

const settings = { assembler: 2, furnace: "steel" };
const result = calculate("automation-science-pack", 1, settings);

function itemName(id) {
  return ITEMS[id] ? ITEMS[id].name : id;
}

function renderNode(node) {
  const kids =
    node.children.length === 0
      ? ""
      : `<ul>${node.children.map(renderNode).join("")}</ul>`;
  return `<li>${itemName(node.id)} ${node.rate}/s${kids}</li>`;
}

const treeRoot = document.getElementById("tree");
if (treeRoot) {
  treeRoot.innerHTML = `<ul>${renderNode(result.tree)}</ul>`;
}

const totalsRoot = document.getElementById("totals");
if (totalsRoot) {
  const rows = result.order
    .map((id) => `<li>${itemName(id)} ${result.totals.get(id)}/s</li>`)
    .join("");
  totalsRoot.innerHTML = `<ul>${rows}</ul>`;
}

const summaryRoot = document.getElementById("summary");
if (summaryRoot) {
  const rows = [...result.byKind.entries()]
    .map(([kind, count]) => `<li>${kind} ${count}</li>`)
    .join("");
  summaryRoot.innerHTML = `<ul>${rows}</ul>`;
}
