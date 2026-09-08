/**
 * Tiny catalog so we can compute machine counts.
 * Only what this unit needs: assembler speeds + two science packs.
 * More items later; nothing here is loaded from prototypes/.
 *
 * A recipe answers: how long, how many come out, which machine.
 * Yellow and purple packs happen to share time/output; the rates we
 * check (225/min vs 450/min) are what make the machine counts 21 vs 42.
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
};
