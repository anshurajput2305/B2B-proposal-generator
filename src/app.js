import { validateInput, selectProducts, calculateImpact, computeBudgetAllocation } from "./engine.js";
import { generateProposalContent } from "./api.js";
import { getLogs, clearLogs } from "./logger.js";
import {
  renderMetrics, renderResultHeader,
  renderOverview, renderProducts, renderImpact, renderJson, renderLogs,
  updateProgress,
} from "./ui.js";

let currentProposal  = null;
let currentProducts  = [];
let currentImpact    = null;
let currentAIContent = null;
let activeTab        = "overview";
let progressTimer    = null;
let savedFormValues  = {};

const app = document.getElementById("app");

function render(templateId) {
  const tmpl = document.getElementById(templateId);
  app.innerHTML = "";
  app.appendChild(tmpl.content.cloneNode(true));
}

function getFormValues() {
  return {
    companyName: document.getElementById("f-company")?.value || "",
    industry:    document.getElementById("f-industry")?.value || "Technology",
    budget:      parseFloat(document.getElementById("f-budget")?.value) || 0,
    teamSize:    parseInt(document.getElementById("f-teamsize")?.value)  || 0,
    goals:       document.getElementById("f-goals")?.value || "",
    timeline:    document.getElementById("f-timeline")?.value || "Q2 2025",
  };
}

function startProgress() {
  let pct = 0;
  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    pct += Math.random() * 7 + 2;
    if (pct >= 90) { clearInterval(progressTimer); pct = 90; }
    updateProgress(Math.min(pct, 90));
  }, 210);
}

function stopProgress(finalPct) {
  clearInterval(progressTimer);
  updateProgress(finalPct !== undefined ? finalPct : 100);
}

function showForm() {
  render("tmpl-form");

  
  if (savedFormValues.companyName) document.getElementById("f-company").value   = savedFormValues.companyName;
  if (savedFormValues.teamSize)    document.getElementById("f-teamsize").value  = savedFormValues.teamSize;
  if (savedFormValues.budget)      document.getElementById("f-budget").value    = savedFormValues.budget;
  if (savedFormValues.goals)       document.getElementById("f-goals").value     = savedFormValues.goals;
  if (savedFormValues.industry)    document.getElementById("f-industry").value  = savedFormValues.industry;
  if (savedFormValues.timeline)    document.getElementById("f-timeline").value  = savedFormValues.timeline;

  
  document.getElementById("preset-btns").addEventListener("click", function(e) {
    const btn = e.target.closest(".preset");
    if (!btn) return;
    document.querySelectorAll(".preset").forEach(function(b) { b.classList.remove("on"); });
    btn.classList.add("on");
    document.getElementById("f-budget").value = btn.dataset.val;
  });

  const budgetEl = document.getElementById("f-budget");
  budgetEl.addEventListener("input", function() {
    document.querySelectorAll(".preset").forEach(function(b) {
      b.classList.toggle("on", b.dataset.val === budgetEl.value);
    });
  });

  
  document.querySelectorAll(".preset").forEach(function(b) {
    if (b.dataset.val === String(savedFormValues.budget || 5000)) b.classList.add("on");
  });

  document.getElementById("btn-generate").addEventListener("click", handleGenerate);
}

function showLoading() {
  render("tmpl-loading");
  startProgress();
}

function showError(messages) {
  stopProgress(0);
  render("tmpl-error");
  const container = document.getElementById("error-messages");
  container.innerHTML = messages.map(function(m) { return "<p>" + m + "</p>"; }).join("");
  document.getElementById("btn-back-error").addEventListener("click", showForm);
}

function showResult() {
  stopProgress(100);
  render("tmpl-result");

  const h = renderResultHeader(savedFormValues, currentProposal);
  document.getElementById("r-company").textContent = h.company;
  document.getElementById("r-meta").textContent    = h.meta;
  document.getElementById("r-tags").innerHTML      = h.tags;

  document.getElementById("metrics-strip").innerHTML =
    renderMetrics(currentImpact, currentProposal.budgetAllocation);

  document.getElementById("tab-bar").addEventListener("click", function(e) {
    const btn = e.target.closest(".tabbt");
    if (!btn) return;
    document.querySelectorAll(".tabbt").forEach(function(b) { b.classList.remove("on"); });
    btn.classList.add("on");
    activeTab = btn.dataset.tab;
    renderTabContent();
  });

  document.getElementById("btn-new").addEventListener("click", showForm);

  activeTab = "overview";
  renderTabContent();
}

function renderTabContent() {
  const content = document.getElementById("tab-content");
  if (!content) return;

  switch (activeTab) {
    case "overview":
      content.innerHTML = renderOverview(currentAIContent);
      break;
    case "products":
      content.innerHTML = renderProducts(currentProducts, currentAIContent, currentProposal.budgetAllocation);
      break;
    case "impact":
      content.innerHTML = renderImpact(currentImpact, currentAIContent);
      break;
    case "json":
      content.innerHTML = renderJson(currentProposal);
      var copyBtn = document.getElementById("copy-json-btn");
      if (copyBtn) {
        copyBtn.addEventListener("click", function() {
          navigator.clipboard.writeText(JSON.stringify(currentProposal, null, 2));
          copyBtn.textContent = "Copied!";
          setTimeout(function() { copyBtn.textContent = "Copy JSON"; }, 2000);
        });
      }
      break;
    case "logs":
      content.innerHTML = renderLogs(getLogs());
      break;
  }
}

async function handleGenerate() {
  const form   = getFormValues();
  const errors = validateInput(form);

  if (errors.length) {
    const box = document.getElementById("error-box");
    box.classList.remove("hidden");
    box.innerHTML = errors.map(function(e) { return '<div class="erritem">&#9888; ' + e + "</div>"; }).join("");
    return;
  }

  savedFormValues = form;
  clearLogs();
  showLoading();

  try {
    const products    = selectProducts(form.industry, form.budget, form.teamSize);
    const impact      = calculateImpact(products);
    const budgetAlloc = computeBudgetAllocation(products, form.budget);

    currentProducts = products;
    currentImpact   = impact;

    const aiContent  = await generateProposalContent(form, products, impact);
    currentAIContent = aiContent;

    currentProposal = {
      metadata: {
        proposalId:  "PROP-" + Date.now(),
        generatedAt: new Date().toISOString(),
        model:       "claude-sonnet-4-20250514",
        version:     "1.0.0",
      },
      client:           form,
      productMix:       products,
      budgetAllocation: budgetAlloc,
      impactMetrics:    impact,
      aiContent:        aiContent,
    };

    setTimeout(showResult, 380);

  } catch (err) {
    showError([err.message]);
  }
}

showForm();