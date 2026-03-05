export const PRODUCT_CATALOG = [
  {
    id: "ECO-001", name: "Bamboo Office Essentials Kit",
    category: "Office", unitCost: 3780, minQty: 10, maxQty: 500,
    co2Saved: 2.1, plasticSaved: 0.8,
    certifications: ["FSC", "B-Corp"], impactScore: 8.5, emoji: "🎋",
  },
  {
    id: "ECO-002", name: "Recycled PET Packaging Bundle",
    category: "Packaging", unitCost: 1008, minQty: 100, maxQty: 10000,
    co2Saved: 0.6, plasticSaved: 0.3,
    certifications: ["GRS", "OEKO-TEX"], impactScore: 7.2, emoji: "📦",
  },
  {
    id: "ECO-003", name: "Solar-Powered Desk Charger",
    category: "Electronics", unitCost: 7476, minQty: 5, maxQty: 200,
    co2Saved: 15.4, plasticSaved: 0.0,
    certifications: ["Energy Star", "RoHS"], impactScore: 9.1, emoji: "☀️",
  },
  {
    id: "ECO-004", name: "Organic Cotton Tote Bags",
    category: "Merch", unitCost: 672, minQty: 50, maxQty: 5000,
    co2Saved: 0.4, plasticSaved: 1.2,
    certifications: ["GOTS", "Fair Trade"], impactScore: 7.8, emoji: "👜",
  },
  {
    id: "ECO-005", name: "Compostable Mailer Envelopes",
    category: "Packaging", unitCost: 76, minQty: 500, maxQty: 50000,
    co2Saved: 0.05, plasticSaved: 0.02,
    certifications: ["TÜV OK Compost"], impactScore: 8.0, emoji: "✉️",
  },
  {
    id: "ECO-006", name: "Plant-Based Cleaning Concentrates",
    category: "Facilities", unitCost: 1848, minQty: 20, maxQty: 2000,
    co2Saved: 1.8, plasticSaved: 0.5,
    certifications: ["EPA Safer Choice"], impactScore: 8.3, emoji: "🌿",
  },
  {
    id: "ECO-007", name: "Reclaimed Wood Signage Set",
    category: "Branding", unitCost: 15120, minQty: 3, maxQty: 50,
    co2Saved: 8.7, plasticSaved: 0.0,
    certifications: ["FSC", "Rainforest Alliance"], impactScore: 8.9, emoji: "🪵",
  },
  {
    id: "ECO-008", name: "Biodegradable Phone Cases",
    category: "Merch", unitCost: 1176, minQty: 25, maxQty: 1000,
    co2Saved: 0.9, plasticSaved: 0.4,
    certifications: ["TÜV OK Biobased"], impactScore: 7.5, emoji: "📱",
  },
  {
    id: "ECO-009", name: "Refillable Water Bottle Fleet",
    category: "Wellness", unitCost: 2352, minQty: 20, maxQty: 1000,
    co2Saved: 3.2, plasticSaved: 2.8,
    certifications: ["B-Corp", "1% for Planet"], impactScore: 9.3, emoji: "💧",
  },
  {
    id: "ECO-010", name: "Recycled Paper Stationery Set",
    category: "Office", unitCost: 1512, minQty: 25, maxQty: 2000,
    co2Saved: 1.1, plasticSaved: 0.1,
    certifications: ["FSC", "SFI"], impactScore: 7.0, emoji: "📝",
  },
];

export const INDUSTRY_TEMPLATES = {
  Technology:  { focus: ["Electronics", "Office",    "Merch"],     budgetSplit: { core: 0.6, impact: 0.3, brand: 0.1 } },
  Retail:      { focus: ["Packaging",   "Merch",     "Branding"],  budgetSplit: { core: 0.5, impact: 0.2, brand: 0.3 } },
  Healthcare:  { focus: ["Facilities",  "Packaging", "Office"],    budgetSplit: { core: 0.7, impact: 0.2, brand: 0.1 } },
  Hospitality: { focus: ["Wellness",    "Facilities","Branding"],  budgetSplit: { core: 0.5, impact: 0.3, brand: 0.2 } },
  Finance:     { focus: ["Office",      "Merch",     "Branding"],  budgetSplit: { core: 0.5, impact: 0.3, brand: 0.2 } },
  Education:   { focus: ["Office",      "Merch",     "Facilities"],budgetSplit: { core: 0.6, impact: 0.3, brand: 0.1 } },
};