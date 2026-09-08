/**
 * Display only. Calc keeps full floats.
 * Truncate to 3 decimal places (no rounding, no ceiling), then
 * strip trailing zeros: 4.800000000000001 → "4.8".
 */
export function formatRate(n) {
  if (n == null || Number.isNaN(n)) return "—";
  if (n === 0) return "0";
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  const raw = String(abs);
  const [whole, frac = ""] = raw.includes("e") || raw.includes("E")
    ? abs.toFixed(10).split(".")
    : raw.split(".");
  const clipped = frac.slice(0, 3).replace(/0+$/, "");
  return clipped ? `${sign}${whole}.${clipped}` : `${sign}${whole}`;
}
