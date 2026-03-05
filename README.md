# 🌿 GreenCart B2B — AI Proposal Generator
![Node](https://img.shields.io/badge/Node.js-18-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![AI](https://img.shields.io/badge/AI-Llama3-orange)

> Module 2 · Applied AI for Sustainable Commerce Internship

An AI-powered B2B sustainable procurement proposal generator for Indian businesses. Enter client details — the business logic engine selects the optimal product mix, allocates budget intelligently, and AI writes the strategy.

## 📹 Demo



https://github.com/user-attachments/assets/e03b5c37-5da3-4e85-8f64-8114f2c89a9f



---

## ✨ Features

- 🤖 AI-generated proposals using Groq (Llama 3.1)
- ♻️ 10-product sustainable catalog with INR pricing
- 📊 5-tab interactive UI — Overview, Products, Impact, JSON, Logs
- 🧮 Deterministic business logic — AI never selects products or computes numbers
- 🔐 Secure API key management via environment variables
- 📋 Full audit trail with prompt and response logging
- 🇮🇳 India-specific context — SEBI BRSR, INR pricing, Indian locale formatting

---

## 🗂️ File Structure

```
B2B/
├── src/
│   ├── api.js          ← AI layer (only file that calls the API)
│   ├── app.js          ← App controller
│   ├── data.js         ← Product catalog & industry templates
│   ├── engine.js       ← Business logic (no AI)
│   ├── logger.js       ← Prompt/response audit logger
│   ├── styles.css      ← All styling
│   └── ui.js           ← DOM rendering helpers
├── .gitignore
├── index.html
├── package.json
├── README.md
└── server.js           ← Express proxy (manages API key)
```

---

## ⚙️ Setup & Run

```bash
# 1. Clone the repo
git clone https://github.com/anshurajput2305/B2B-proposal-generator.git
cd B2B-proposal-generator

# 2. Install dependencies
npm install

# 3. Create .env file
echo "GROQ_API_KEY=your-key-here" > .env
echo "PORT=3000" >> .env

# 4. Start the server
npm start

# 5. Open browser
# http://localhost:3000
```

> Get a free Groq API key at **console.groq.com** — no billing required

---

## ✅ Technical Requirements

### 1. Structured JSON Outputs
Every proposal is a typed JSON object:
```json
{
  "metadata": { "proposalId": "PROP-...", "generatedAt": "..." },
  "client": { "companyName": "TechNova India", "industry": "Technology", "budget": 420000 },
  "productMix": [{ "id": "ECO-003", "quantity": 10, "lineTotal": 74760 }],
  "budgetAllocation": { "total": 420000, "allocated": 398400, "utilizationPct": 94.9 },
  "impactMetrics": { "totalCO2": "847.5", "totalPlastic": "203.2", "certCount": 9 },
  "aiContent": { "executiveSummary": "...", "esgAlignment": { "environmental": "..." } }
}
```

### 2. Prompt + Response Logging
`src/logger.js` logs every event with timestamps:
- `AI_REQUEST` — company, budget, product count
- `AI_RESPONSE` — input/output token counts
- `PARSE_SUCCESS` / `PARSE_ERROR` — JSON parse result

Visible in the **Logs tab** of the UI.

### 3. Environment-based API Key Management
- API key stored in `.env` — never in source code
- `server.js` reads it via `dotenv`
- Browser calls `/api/propose` (local proxy) — key never exposed to client
- `.gitignore` ensures `.env` is never committed
- Server exits at startup if key is missing

### 4. Clear Separation of AI and Business Logic

| File | Responsibility | Calls AI? |
|---|---|---|
| `data.js` | Product catalog & config | ❌ |
| `engine.js` | Product selection, budget math, impact calc | ❌ |
| `logger.js` | Audit trail | ❌ |
| `api.js` | Prompt building + API call | ✅ |
| `ui.js` | DOM rendering | ❌ |
| `app.js` | Orchestration | ❌ |
| `server.js` | API proxy, key management | ❌ |

Engine always runs first. AI receives its outputs as grounded context and only generates qualitative language.

### 5. Error Handling and Validation
- Input validated before any processing — company name, budget (min ₹40,000), team size, goals
- Network errors, API errors, JSON parse failures all caught and logged
- Server exits with error if API key missing at startup
- Missing fields return `400`, upstream errors forwarded with status code

---

## 🏗️ Architecture

```
Browser Form
     │
     ▼
engine.validateInput()       ← stops here if invalid
     │
     ▼
engine.selectProducts()      ← greedy budget-bucket algorithm
engine.calculateImpact()     ← CO2, plastic, certifications
engine.computeBudget()       ← allocation summary
     │
     ▼  deterministic outputs
api.generateProposalContent()
     │
     ▼  POST /api/propose
server.js (Express)
     │  reads GROQ_API_KEY from .env
     ▼
Groq API (Llama 3.1 8B)
     │
     ▼
UI renders 5 tabs + logger records full audit trail
```

---

## 🛠️ Tech Stack

- **Frontend** — Vanilla JS, HTML, CSS (no frameworks)
- **Backend** — Node.js, Express
- **AI** — Groq API (Llama 3.1 8B Instant)
- **Environment** — dotenv

---

## 📦 Product Catalog

10 sustainable products with INR pricing:

| ID | Product | Category | Price/unit |
|---|---|---|---|
| ECO-001 | Bamboo Office Essentials Kit | Office | ₹3,780 |
| ECO-002 | Recycled PET Packaging Bundle | Packaging | ₹1,008 |
| ECO-003 | Solar-Powered Desk Charger | Electronics | ₹7,476 |
| ECO-004 | Organic Cotton Tote Bags | Merch | ₹672 |
| ECO-005 | Compostable Mailer Envelopes | Packaging | ₹76 |
| ECO-006 | Plant-Based Cleaning Concentrates | Facilities | ₹1,848 |
| ECO-007 | Reclaimed Wood Signage Set | Branding | ₹15,120 |
| ECO-008 | Biodegradable Phone Cases | Merch | ₹1,176 |
| ECO-009 | Refillable Water Bottle Fleet | Wellness | ₹2,352 |
| ECO-010 | Recycled Paper Stationery Set | Office | ₹1,512 |

---

Made with 💚 for the GreenCart Applied AI Internship
