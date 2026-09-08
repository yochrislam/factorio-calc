import { ITEMS } from "./data.js";
import { calculate } from "./calc.js";

const status = document.getElementById("module-status");
if (status) status.textContent = "app module loaded";

const settings = { assembler: 2, furnace: "steel" };
const result = calculate("automation-science-pack", 1, settings);

function renderNode(node) {
  const name = ITEMS[node.id] ? ITEMS[node.id].name : node.id;
  const kids =
    node.children.length === 0
      ? ""
      : `<ul>${node.children.map(renderNode).join("")}</ul>`;
  return `<li>${name} ${node.rate}/s${kids}</li>`;
}

const treeRoot = document.getElementById("tree");
if (treeRoot) {
  treeRoot.innerHTML = `<ul>${renderNode(result.tree)}</ul>`;
}
