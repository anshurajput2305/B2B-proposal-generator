import { PRODUCT_CATALOG, INDUSTRY_TEMPLATES } from './data.js';

export function selectProducts(industry, budget, teamSize) {
  const template = INDUSTRY_TEMPLATES[industry] || INDUSTRY_TEMPLATES['Technology'];
  const { focus, budgetSplit } = template;
  const scored = PRODUCT_CATALOG.map(p => ({ ...p, relevanceScore: focus.includes(p.category) ? p.impactScore * 1.5 : p.impactScore * 0.7 })).sort((a, b) => b.relevanceScore - a.relevanceScore);
  const selected = []; let remaining = budget;
  const splitKeys = ['core', 'impact', 'brand'];
  focus.forEach((category, idx) => {
    let bucketBudget = budget * budgetSplit[splitKeys[idx]];
    for (const product of scored.filter(p => p.category === category)) {
      if (selected.find(s => s.id === product.id) || selected.length >= 5) continue;
      const rawQty = Math.floor(bucketBudget / (product.unitCost * 1.1) / product.minQty) * product.minQty;
      const qty = Math.max(product.minQty, Math.min(rawQty, Math.min(product.maxQty, teamSize * 2)));
      const lineTotal = qty * product.unitCost;
      if (qty >= product.minQty && lineTotal <= remaining) { selected.push({ ...product, quantity: qty, lineTotal }); remaining -= lineTotal; bucketBudget -= lineTotal; }
    }
  });
  return selected;
}

export function calculateImpact(products) {
  const allCerts = [...new Set(products.flatMap(p => p.certifications))];
  return { totalCO2: +(products.reduce((s,p)=>s+p.co2Saved*p.quantity,0)).toFixed(1), totalPlastic: +(products.reduce((s,p)=>s+p.plasticSaved*p.quantity,0)).toFixed(1), avgScore: +(products.reduce((s,p)=>s+p.impactScore,0)/products.length).toFixed(1), certCount: allCerts.length, allCerts };
}

export function validateInput(input) {
  const errors = [];
  if (!input.companyName?.trim()) errors.push('Company name is required');
  if (!input.budget || input.budget < 40000) errors.push('Budget must be at least \u20b940,000');
  if (!input.teamSize || input.teamSize < 1) errors.push('Team size must be at least 1');
  if (!input.goals?.trim()) errors.push('Sustainability goals are required');
  return errors;
}

export function computeBudgetAllocation(products, total) {
  const allocated = products.reduce((s, p) => s + p.lineTotal, 0);
  return { total, allocated, remaining: total - allocated, utilizationPct: +((allocated / total) * 100).toFixed(1) };
}