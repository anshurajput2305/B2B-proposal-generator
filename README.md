# GreenCart B2B — AI Proposal Generator
### Module 2 · Applied AI for Sustainable Commerce

---

## Project Structure

```
b2b-proposal/
├── index.html          ← Entry point, HTML templates, script imports
├── src/
│   ├── styles.css      ← All styling (design system, components, responsive)
│   ├── data.js         ← Static product catalog & industry templates
│   ├── engine.js       ← Business logic: product selection, budget allocation, impact calc
│   ├── logger.js       ← Prompt/response audit logger
│   ├── api.js          ← AI layer: prompt builders + Anthropic API call
│   ├── ui.js           ← DOM rendering helpers (tabs, cards, metrics)
│   └── app.js          ← App controller: orchestrates all modules
└── README.md
```

---

## Architecture

```
User Input (index.html form)
        │
        ▼
┌─────────────────────────────┐
│  engine.js — validateInput  │  Pure validation, no AI
└──────────────┬──────────────┘
               │ valid
               ▼
┌─────────────────────────────┐
│  engine.js — selectProducts │  Greedy budget-bucket algorithm
│  engine.js — calcImpact     │  CO₂, plastic, cert aggregation
│  engine.js — computeBudget  │  Allocation summary
└──────────────┬──────────────┘
               │ deterministic outputs
               ▼
┌─────────────────────────────┐
│  api.js — generateProposal  │  Builds prompts, calls Groq API
│  logger.js — log()          │  Timestamps every request/response
└──────────────┬──────────────┘
               │ parsed JSON
               ▼
┌─────────────────────────────┐
│  ui.js — render*()          │  Pure DOM helpers per tab
│  app.js — showResult()      │  Assembles full proposal object
└─────────────────────────────┘
        │
        ▼
  Structured JSON proposal
  + 5-tab interactive UI
```

---

## Separation of Concerns

| File | Responsibility | Calls AI? |
|---|---|---|
| `data.js` | Static catalog & templates | No |
| `engine.js` | Product selection, budget math, impact calc | No |
| `logger.js` | Audit trail | No |
| `api.js` | Prompt building, API call, JSON parse | **Yes** |
| `ui.js` | DOM rendering | No |
| `app.js` | Orchestration | No |

**AI never selects products or computes numbers.**
The engine runs first; Groq only receives its outputs and generates qualitative language.

---

## AI Prompt Design

### System Prompt Strategy
- Assigns "B2B sustainable commerce consultant" persona
- Provides strict JSON schema — prevents parse failures
- Explicit: *"do NOT re-select products"* — AI justifies, engine decides
- Anti-greenwashing clause: *"be specific, honest, and data-driven"*

### User Prompt Strategy
- Injects all business-logic outputs verbatim (products, prices, metrics)
- AI never needs to guess or invent numbers
- Client goals + industry context guide tone and angle
- Structured sections prompt structured output

---

## Technical Requirements

| Requirement | Implementation |
|---|---|
| Structured JSON outputs | Full typed proposal schema across all sections |
| Prompt + response logging | `logger.js` — timestamps all events |
| Environment-based API key | Injected via Anthropic SDK (no hardcoding) |
| AI / business logic separation | `engine.js` has zero API calls; `api.js` has zero math |
| Error handling | Network errors, API errors, JSON parse errors all caught |
| Input validation | `engine.validateInput()` runs before any processing |

---

## Running Locally

```bash
# Serve with any static file server:
npx serve .
# or
python -m http.server 3000

# Open: http://localhost:3000
```

> Note: ES modules require a server (can't open index.html directly as file://)

---

## Sample Structured Output

```json
{
  "metadata": {
    "proposalId": "PROP-1772710394217",
    "generatedAt": "2026-03-05T11:33:14.217Z",
    "model": "claude-sonnet-4-20250514",
    "version": "1.0.0"
  },
  "client": {
    "companyName": "techNova",
    "industry": "Technology",
    "budget": 420000,
    "teamSize": 50,
    "goals": "reduce plastic 60% , improve SEBI BRSR score",
    "timeline": "Q2 2025"
  },
  "productMix": [
    {
      "id": "ECO-003",
      "name": "Solar-Powered Desk Charger",
      "category": "Electronics",
      "unitCost": 7476,
      "minQty": 5,
      "maxQty": 200,
      "co2Saved": 15.4,
      "plasticSaved": 0,
      "certifications": [
        "Energy Star",
        "RoHS"
      ],
      "impactScore": 9.1,
      "emoji": "☀️",
      "relevanceScore": 13.649999999999999,
      "quantity": 30,
      "lineTotal": 224280
    },
    {
      "id": "ECO-001",
      "name": "Bamboo Office Essentials Kit",
      "category": "Office",
      "unitCost": 3780,
      "minQty": 10,
      "maxQty": 500,
      "co2Saved": 2.1,
      "plasticSaved": 0.8,
      "certifications": [
        "FSC",
        "B-Corp"
      ],
      "impactScore": 8.5,
      "emoji": "🎋",
      "relevanceScore": 12.75,
      "quantity": 30,
      "lineTotal": 113400
    },
    {
      "id": "ECO-010",
      "name": "Recycled Paper Stationery Set",
      "category": "Office",
      "unitCost": 1512,
      "minQty": 25,
      "maxQty": 2000,
      "co2Saved": 1.1,
      "plasticSaved": 0.1,
      "certifications": [
        "FSC",
        "SFI"
      ],
      "impactScore": 7,
      "emoji": "📝",
      "relevanceScore": 10.5,
      "quantity": 25,
      "lineTotal": 37800
    },
    {
      "id": "ECO-004",
      "name": "Organic Cotton Tote Bags",
      "category": "Merch",
      "unitCost": 672,
      "minQty": 50,
      "maxQty": 5000,
      "co2Saved": 0.4,
      "plasticSaved": 1.2,
      "certifications": [
        "GOTS",
        "Fair Trade"
      ],
      "impactScore": 7.8,
      "emoji": "👜",
      "relevanceScore": 11.7,
      "quantity": 50,
      "lineTotal": 33600
    }
  ],
  "budgetAllocation": {
    "total": 420000,
    "allocated": 409080,
    "remaining": 10920,
    "utilizationPct": 97.4
  },
  "impactMetrics": {
    "totalCO2": 572.5,
    "totalPlastic": 86.5,
    "avgScore": 8.1,
    "certCount": 7,
    "allCerts": [
      "Energy Star",
      "RoHS",
      "FSC",
      "B-Corp",
      "SFI",
      "GOTS",
      "Fair Trade"
    ]
  },
  "aiContent": {
    "executiveSummary": "This proposal outlines a customized sustainable procurement plan for techNova, a 50-employee technology firm aiming to reduce plastic usage by 60% and enhance its SEBI BRSR score. Our solution incorporates four eco-friendly products, which will effectively minimize environmental footprint while boosting the company's brand reputation.",
    "strategicRationale": "By embracing sustainable practices, techNova can not only contribute to India's Nationally Determined Contribution (NDC) objectives but also improve its bottom line. A study by the Confederation of Indian Industry (CII) found that Indian businesses can save up to INR 15,000 crore through sustainable practices.",
    "productJustifications": [
      {
        "productId": "ECO-003",
        "reasoning": "The Solar-Powered Desk Charger is an innovative product that not only reduces plastic usage (by 90% compared to traditional power banks) but also saves 30% of energy. With 30 units purchased, techNova can minimize their carbon footprint by 172.5 kg per year (as per India's CO2 equivalent calculation). This aligns with the company's objective of reducing CO2 emissions."
      },
      {
        "productId": "ECO-001",
        "reasoning": "The Bamboo Office Essentials Kit is an eco-friendly alternative to traditional stationery, made from sustainably sourced bamboo. With 30 units purchased, techNova can reduce its plastic usage by 50% and lower its waste management costs. The kit's high FSC and B-Corp ratings will also enhance techNova's SEBI BRSR score."
      },
      {
        "productId": "ECO-010",
        "reasoning": "The Recycled Paper Stationery Set is a cost-effective and environmentally friendly option for techNova's stationery needs. With 25 units purchased, the company can minimize its waste generation and reduce its plastic dependence by 70%. The FSC and SFI certifications ensure that the product meets India's environmental standards."
      },
      {
        "productId": "ECO-004",
        "reasoning": "The Organic Cotton Tote Bags are made from 100% organic cotton, promoting sustainable fashion and reducing plastic usage in the supply chain. With 50 units purchased, techNova can reduce its plastic waste by 40% and create a positive brand image among its stakeholders. The GOTS and Fair Trade certifications further reinforce the product's eco-friendliness."
      }
    ],
    "impactNarrative": "By implementing this sustainable procurement plan, techNova can achieve significant environmental and social benefits while enhancing its brand reputation. The proposed products will reduce plastic usage by 60%, minimize CO2 emissions, and align with the company's ESG goals. A study by the National Centre for Sustainable CoCreation (NCSC) reported that businesses that adopt sustainable practices have 23% higher revenue growth rates in India.",
    "implementationPhases": [
      {
        "phase": "Pilot Program",
        "timeline": "Q2 2025 - Q3 2025",
        "action": "Implement the proposed sustainable procurement plan in one business unit, monitor key performance indicators (KPIs), and assess the feasibility of scaling up the initiative."
      },
      {
        "phase": "Scaling Up",
        "timeline": "Q4 2025 - Q1 2026",
        "action": "Roll out the sustainable procurement plan across all business units, conduct regular audits, and optimize the supply chain to minimize environmental impacts."
      }
    ],
    "roiHighlights": [
      "Expected reduction in plastic usage by 60%",
      "Projected savings of INR 50,000 - INR 75,000 through energy efficiency and waste reduction",
      "Enhanced SEBI BRSR score through the adoption of sustainable practices"
    ],
    "esgAlignment": {
      "environmental": "Reduces CO2 emissions by 172.5 kg per year, minimizes waste generation, and reduces plastic usage",
      "social": "Aligns with the company's mission to promote sustainability, improves brand reputation, and enhances stakeholder engagement",
      "governance": "Ensures effective supply chain management, monitors KPIs, and optimizes resource allocation to minimize environmental impacts"
    },
    "nextSteps": [
      "Schedule a meeting with the procurement team to discuss the proposal in detail",
      "Conduct a site visit to assess the feasibility of implementing the proposed sustainable procurement plan",
      "Finalize the budget and timeline for the implementation of the sustainable procurement plan"
    ]
  }
}
```
