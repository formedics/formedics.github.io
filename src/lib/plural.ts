/** Lithuanian plural form for a count followed by a noun: 1 partneris, 2–9 partneriai, 10–20 partnerių. */
export function ltPlural(n: number, forms: [string, string, string]) {
  const last = n % 10;
  const tens = n % 100;
  if (last === 1 && tens !== 11) return forms[0];
  if (last >= 2 && last <= 9 && !(tens >= 11 && tens <= 19)) return forms[1];
  return forms[2];
}
