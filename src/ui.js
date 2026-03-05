export function renderMetrics(impact, budgetAlloc) {
  const cards = [
    { cl: "cy", ico: "💰", val: "₹" + Number(budgetAlloc.allocated).toLocaleString("en-IN"), unit: " used",   lbl: "Budget Allocated" },
    { cl: "cm", ico: "🌱", val: impact.totalCO2,                              unit: " kg/yr",  lbl: "CO₂ Saved" },
    { cl: "cp", ico: "♻️", val: impact.totalPlastic,                          unit: " kg/yr",  lbl: "Plastic Diverted" },
    { cl: "cs", ico: "🏅", val: impact.certCount,                             unit: " certs",  lbl: "Certifications" },
  ];
  return cards.map(m => `
    <div class="mcard ${m.cl}">
      <div class="mico">${m.ico}</div>
      <div class="mval">${m.val}<span class="munit">${m.unit}</span></div>
      <div class="mlbl">${m.lbl}</div>
    </div>
  `).join("");
}

export function renderResultHeader(form, proposal) {
  return {
    company: form.companyName,
    meta:    `Sustainable Procurement Proposal · ${proposal.metadata.proposalId} · ${new Date(proposal.metadata.generatedAt).toLocaleDateString()}`,
    tags: `
      <span class="pill py">${form.industry}</span>
      <span class="pill pm">${form.teamSize} employees</span>
      <span class="pill pg">${"₹" + Number(form.budget).toLocaleString("en-IN")} budget</span>
    `,
  };
}

export function renderOverview(ai) {
  const phases = (ai.implementationPhases || []).map((ph, i) => `
    <div class="phase">
      <div class="pnum">${i + 1}</div>
      <div>
        <div class="ptime">${ph.timeline}</div>
        <div class="pname">${ph.phase}</div>
        <div class="pact">${ph.action}</div>
      </div>
    </div>
  `).join("");

  const esg = ["environmental", "social", "governance"].map(k => `
    <div class="ecard">
      <div class="etag ${k[0].toUpperCase()}">${k}</div>
      <div class="etext">${ai.esgAlignment?.[k] || ""}</div>
      <div class="eletter">${k[0].toUpperCase()}</div>
    </div>
  `).join("");

  const roi = (ai.roiHighlights || []).map(r => `
    <div class="roi"><div class="rarrow">→</div><div class="rtext">${r}</div></div>
  `).join("");

  return `
    <div class="card"><div class="clabel">Executive Summary</div><p class="cbody">${ai.executiveSummary}</p></div>
    <div class="card"><div class="clabel">Strategic Rationale</div><p class="cbody">${ai.strategicRationale}</p></div>
    <div class="card"><div class="clabel">ESG Alignment</div><div class="esgrid">${esg}</div></div>
    ${phases ? `<div class="card"><div class="clabel">Implementation Roadmap</div><div class="phases">${phases}</div></div>` : ""}
    ${roi    ? `<div class="card"><div class="clabel">ROI Highlights</div><div class="roi-list">${roi}</div></div>` : ""}
  `;
}

export function renderProducts(products, ai, budgetAlloc) {
  const cards = products.map(p => {
    const just = (ai?.productJustifications || []).find(j => j.productId === p.id);
    const certs = p.certifications.map(c => `<span class="pill pm">${c}</span>`).join("");
    return `
      <div class="pcard">
        <div class="ptop">
          <div>
            <div style="display:flex;gap:9px;align-items:center;margin-bottom:8px">
              <span class="pico">${p.emoji}</span>
              <span class="pname-el">${p.name}</span>
            </div>
            <div class="pbadges">
              <span class="pill pg">${p.category}</span>
              <span class="pill py">Score ${p.impactScore}/10</span>
              ${certs}
            </div>
          </div>
          <div class="pprice">
            <div class="ptotal">${"₹" + p.lineTotal.toLocaleString("en-IN")}</div>
            <div class="punit">${p.quantity} × ${"₹" + Number(p.unitCost).toLocaleString("en-IN")}</div>
            <div class="pco2">↓ ${p.co2Saved} kg CO₂/unit</div>
          </div>
        </div>
        ${just ? `<div class="pjust">"${just.reasoning}"</div>` : ""}
      </div>
    `;
  }).join("");

  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px">
      <span style="font-size:12px;font-weight:600;color:var(--muted)">${products.length} products selected</span>
      <span class="pill py">${budgetAlloc.utilizationPct}% utilized</span>
    </div>
    <div class="plist">${cards}</div>
    <div class="bsummary">
      <div><div class="blbl">Total Budget</div><div class="bval">${"₹" + budgetAlloc.total.toLocaleString("en-IN")}</div></div>
      <div><div class="blbl">Allocated</div><div class="bval y">${"₹" + budgetAlloc.allocated.toLocaleString("en-IN")}</div></div>
      <div><div class="blbl">Remaining</div><div class="bval">${"₹" + budgetAlloc.remaining.toLocaleString("en-IN")}</div></div>
    </div>
  `;
}

export function renderImpact(impact, ai) {
  const certs = impact.allCerts.map(c =>
    `<span class="pill pm" style="font-size:12px;padding:5px 12px">${c}</span>`
  ).join("");

  const steps = (ai?.nextSteps || []).map((s, i) => `
    <div class="nitem">
      <div class="nnum">${String(i + 1).padStart(2, "0")}</div>
      <div class="ntext">${s}</div>
    </div>
  `).join("");

  return `
    ${ai?.impactNarrative ? `<div class="card"><div class="clabel">Impact Narrative</div><p class="cbody">${ai.impactNarrative}</p></div>` : ""}
    <div class="ibig">
      <div class="icard ico2">
        <div class="inum c">${impact.totalCO2}</div>
        <div class="iunit">kilograms</div>
        <div class="ilbl">CO₂ Reduced / Year</div>
        <div class="ibg">🌿</div>
      </div>
      <div class="icard ipla">
        <div class="inum p">${impact.totalPlastic}</div>
        <div class="iunit">kilograms</div>
        <div class="ilbl">Plastic Diverted / Year</div>
        <div class="ibg">♻️</div>
      </div>
    </div>
    <div class="card"><div class="clabel">Certifications Portfolio</div><div class="certs">${certs}</div></div>
    ${steps ? `<div class="card"><div class="clabel">Next Steps</div><div class="nlist">${steps}</div></div>` : ""}
  `;
}

export function renderJson(proposal) {
  const escaped = JSON.stringify(proposal, null, 2)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `
    <p style="font-size:12px;color:var(--muted);margin-bottom:14px;font-weight:500">Full structured proposal — production-ready JSON output.</p>
    <div class="json-wrap">
      <button class="copybtn" id="copy-json-btn">Copy JSON</button>
      <pre class="jsonpre">${escaped}</pre>
    </div>
  `;
}

export function renderLogs(logs) {
  if (!logs.length) return `<p style="font-size:13px;color:var(--muted)">No logs yet.</p>`;

  const entries = logs.map(entry => {
    const { timestamp, type, ...rest } = entry;
    const pillClass = type.includes("ERROR") ? "pr" : type.includes("RESPONSE") ? "pm" : "py";
    const body = JSON.stringify(rest, null, 2)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `
      <div class="logcard">
        <div class="loghead">
          <span class="pill ${pillClass}">${type}</span>
          <span class="logtime">${timestamp}</span>
        </div>
        <pre class="logpre">${body}</pre>
      </div>
    `;
  }).join("");

  return `
    <p style="font-size:12px;color:var(--muted);margin-bottom:14px;font-weight:500">Audit trail — ${logs.length} events logged.</p>
    ${entries}
  `;
}

export function updateProgress(pct) {
  const fill = document.getElementById("progress-fill");
  if (fill) fill.style.width = `${pct}%`;

  
  const steps = document.querySelectorAll(".lstep");
  steps.forEach(step => {
    const t = parseFloat(step.dataset.t);
    const ico = step.querySelector(".lstep-ico");
    step.className = "lstep " + (pct > t ? "done" : pct > (t - 20) ? "act" : "pen");
    if (ico) ico.textContent = pct > t ? "✓" : pct > (t - 20) ? "⟳" : "·";
  });
}