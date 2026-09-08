#!/usr/bin/env node
import { formatRate } from "../app/src/format.js";

function check(label, actual, expected) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
  console.log(`ok  ${label}  (${actual})`);
}

check("3.2 stays 3.2", formatRate(3.2), "3.2");
check("float noise 4.8", formatRate(4.800000000000001), "4.8");
check("7.333… → 3dp", formatRate(7.333333333333334), "7.333");
check("integer", formatRate(21), "21");
check("null", formatRate(null), "—");

console.log("all formatRate checks passed");
