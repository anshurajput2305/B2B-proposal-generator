import { log } from "./logger.js";

function inr(n) {
  return Number(n).toLocaleString("en-IN");
}

function buildSystemPrompt() {
  return `You are an expert B2B sustainable commerce consultant generating procurement proposals for Indian businesses.
Rules:
- Justify the pre-selected product mix, do NOT re-select products
- All monetary amounts are in INR (Indian Rupees)
- Use the exact metrics provided, never invent numbers
- Avoid greenwashing, be specific and data-driven
- Reference Indian market context where relevant (SEBI BRSR, MoEFCC, India NDC)
- Output ONLY valid JSON, no markdown, no preamble
Schema: {"executiveSummary":"string","strategicRationale":"string","productJustifications":[{"productId":"string","reasoning":"string"}],"impactNarrative":"string","implementationPhases":[{"phase":"string","timeline":"string","action":"string"}],"roiHighlights":["string"],"esgAlignment":{"environmental":"string","social":"string","governance":"string"},"nextSteps":["string"]}`;
}

function buildUserPrompt(form, products, impact) {
  const lines = products.map(p =>
    `- [${p.id}] ${p.name} (${p.category}): ${p.quantity} units @ Rs.${inr(p.unitCost)} = Rs.${inr(p.lineTotal)} | Certs: ${p.certifications.join(", ")} | Score: ${p.impactScore}/10`
  ).join("\n");

  return `CLIENT: ${form.companyName} | ${form.industry} | ${form.teamSize} employees | Rs.${inr(form.budget)} | ${form.timeline}
GOALS: ${form.goals}
PRODUCTS: ${lines}
IMPACT: CO2 ${impact.totalCO2}kg/yr | Plastic ${impact.totalPlastic}kg/yr | Certs: ${impact.allCerts.join(", ")}
Generate proposal JSON for this Indian ${form.industry} client.`;
}

export async function generateProposalContent(form, products, impact) {
  log("AI_REQUEST", { company: form.companyName, budgetINR: form.budget, productCount: products.length });

  let response;
  try {
    response = await fetch("/api/propose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system: buildSystemPrompt(),
        messages: [{ role: "user", content: buildUserPrompt(form, products, impact) }],
        max_tokens: 1000,
      }),
    });
  } catch (err) {
    log("NETWORK_ERROR", { message: err.message });
    throw new Error("Network error: " + err.message);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    log("API_ERROR", { status: response.status });
    throw new Error("API error " + response.status + ": " + (body.error || "Unknown"));
  }

  const data = await response.json();
  const rawText = (data.content || []).map(c => c.text || "").join("");
  log("AI_RESPONSE", { outputTokens: data.usage?.output_tokens });

  try {
    const parsed = JSON.parse(rawText.replace(/```json|```/g, "").trim());
    log("PARSE_SUCCESS", { keys: Object.keys(parsed) });
    return parsed;
  } catch {
    log("PARSE_ERROR", { preview: rawText.slice(0, 200) });
    throw new Error("Failed to parse AI response as JSON");
  }
}