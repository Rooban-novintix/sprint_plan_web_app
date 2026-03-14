"use client"; 

import { useState } from "react";

const ENGINEERS = ["E1 – FullStack/DevOps/AI", "E2 – CV/OpenCV", "E3 – OCR/Barcodes", "E4 – Logic/LLM"];

const STATUS_COLORS = {
  "Not Started": { bg: "#f1f5f9", text: "#64748b", border: "#cbd5e1" },
  "In Progress": { bg: "#eff6ff", text: "#1d4ed8", border: "#93c5fd" },
  "Done": { bg: "#f0fdf4", text: "#15803d", border: "#86efac" },
  "Blocked": { bg: "#fef2f2", text: "#dc2626", border: "#fca5a5" },
};

const OWNER_COLORS = {
  "E1": "#dbeafe", "E2": "#fce7f3", "E3": "#dcfce7", "E4": "#fef9c3",
  "All": "#f3e8ff", "E2+E3": "#e0f2fe", "E3+E4": "#fef3c7",
  "E1+E4": "#ede9fe", "E1+E2": "#fff1f2", "E1+Stakeholder": "#f0fdf4",
};

const ownerColor = (o : string) => {
  for (const k of Object.keys(OWNER_COLORS)) if (o?.startsWith(k)) return OWNER_COLORS[k];
  return "#f8fafc";
};

const weeks = [
  { week:1, label:"WEEK 1 — Foundation & Parallel Build", color:"#1e40af", days:[
    { day:1, label:"Day 1 — Kickoff + Infrastructure", tasks:[
      { id:"1.1", task:"Provision GCP/AWS VM · install Docker · configure ports", owner:"E1", output:"VM live", priority:"P0" },
      { id:"1.2", task:"Write Dockerfile — all system libs (tesseract, libzbar0, libdmtx0b, libGL, poppler)", owner:"E1", output:"Dockerfile + docker-compose.yml", priority:"P0" },
      { id:"1.3", task:"Set up GitHub repo · branch strategy · .env template", owner:"E1", output:"Repo structure", priority:"P0" },
      { id:"1.4", task:"Ingest real label images · assess resolution, format, scan quality", owner:"E2+E3", output:"Label quality report (1 page)", priority:"P0" },
      { id:"1.5", task:"Review PRD attribute list · flag ambiguous verification methods", owner:"E4", output:"Annotated PRD notes", priority:"P1" },
      { id:"1.6", task:"STANDUP EOD: VM live, all engineers run Docker locally ✅", owner:"All", output:"Kickoff confirmed", priority:"P0" },
    ]},
    { day:2, label:"Day 2 — Schema + Form Foundation", tasks:[
      { id:"2.1", task:"Implement schema.py — 130+ attributes with types, validation rules, verification_method", owner:"E1+E4", output:"form/schema.py", priority:"P0" },
      { id:"2.2", task:"Implement Pydantic models (models.py) for form data + CV findings + proof results", owner:"E4", output:"form/models.py", priority:"P0" },
      { id:"2.3", task:"MongoDB setup · create all 5 collections · implement indexes from PRD §7.4", owner:"E1", output:"MongoDB live + db/mongo_client.py", priority:"P0" },
      { id:"2.4", task:"Add attribute_definitions collection · seed with 130+ attributes", owner:"E1", output:"Collection seeded", priority:"P0" },
      { id:"2.5", task:"Begin image aligner (aligner.py) — SIFT + RANSAC homography", owner:"E2", output:"Draft core/aligner.py", priority:"P1" },
      { id:"2.6", task:"Set up pytesseract + easyocr in Docker · smoke test on real labels", owner:"E3", output:"OCR working in container", priority:"P0" },
    ]},
    { day:3, label:"Day 3 — Interface Contracts Frozen", tasks:[
      { id:"3.1", task:"Build Streamlit UI shell — 5 tabs, navigation, file upload components", owner:"E1", output:"app.py skeleton", priority:"P0" },
      { id:"3.2", task:"Implement dynamic form renderer (renderer.py) — attribute picker + edit form", owner:"E1", output:"Step 1 + Step 2 of form flow", priority:"P0" },
      { id:"3.3", task:"⚠ INTERFACE CONTRACT REVIEW (10am) — sign off all 3 JSON contracts", owner:"All", output:"Contracts FROZEN ✅", priority:"P0" },
      { id:"3.4", task:"Begin symbol detector — template library setup + SIFT keypoint matching", owner:"E2", output:"core/detector.py draft", priority:"P1" },
      { id:"3.5", task:"Begin OCR pipeline — CLAHE preprocessing + pytesseract primary + easyocr fallback", owner:"E3", output:"modules/text_extractor.py draft", priority:"P1" },
      { id:"3.6", task:"Begin attribute rule definitions (rules.py) — text attributes first (20 rules)", owner:"E4", output:"proofing/rules.py draft", priority:"P1" },
    ]},
    { day:4, label:"Day 4 — Form Complete + CV Building", tasks:[
      { id:"4.1", task:"Form validation rules (validator.py) — all 8 rules from PRD §3.4", owner:"E1", output:"form/validator.py", priority:"P0" },
      { id:"4.2", task:"Form state auto-save to session storage · confirm/preview step", owner:"E1", output:"Step 3 of form flow complete", priority:"P0" },
      { id:"4.3", task:"Symbol detector — add ORB fallback + confidence-weighted NMS", owner:"E2", output:"Detector handles 3 strategies", priority:"P1" },
      { id:"4.4", task:"SSIM graphics diff module — contour analysis on aligned images", owner:"E2", output:"modules/graphics_diff.py draft", priority:"P1" },
      { id:"4.5", task:"Barcode waterfall — pyzbar → zxingcpp → pylibdmtx → OpenCV-QR", owner:"E3", output:"modules/barcode_detector.py", priority:"P0" },
      { id:"4.6", task:"Text diff engine — fuzzy match (SequenceMatcher) + old/new value comparison", owner:"E3", output:"modules/text_extractor.py complete", priority:"P0" },
      { id:"4.7", task:"Rule definitions — symbol attributes (15) + barcode attributes (14 rules)", owner:"E4", output:"49 rules total in rules.py", priority:"P1" },
    ]},
    { day:5, label:"Day 5 — Integration Checkpoint #1", tasks:[
      { id:"5.1", task:"Integration test: Form submission → produces valid form_submission.json", owner:"E1+E4", output:"Contract 1 validated ✅", priority:"P0" },
      { id:"5.2", task:"Run symbol detector + OCR + barcode decoder on real labels", owner:"E2+E3", output:"Raw findings JSON per module", priority:"P0" },
      { id:"5.3", task:"Gap check: Compare raw findings against Contract 2 schema — fix mismatches", owner:"E2+E3", output:"Contract 2 alignment confirmed", priority:"P0" },
      { id:"5.4", task:"Image aligner complete — homography corrects skew on real label scans", owner:"E2", output:"core/aligner.py complete", priority:"P0" },
      { id:"5.5", task:"Begin proof engine skeleton — attribute router + matcher stubs", owner:"E4", output:"proofing/engine.py scaffold", priority:"P1" },
      { id:"5.6", task:"STAKEHOLDER REVIEW: Demo form UI + raw CV findings on real label", owner:"All", output:"Week 1 milestone sign-off", priority:"P0" },
    ]},
    { day:"6–7", label:"Days 6–7 — Buffer + Catch-up", tasks:[
      { id:"6.1", task:"MongoDB CRUD operations complete · session auto-save wired to form submit", owner:"E1", output:"db/mongo_client.py complete", priority:"P0" },
      { id:"6.2", task:"Symbol comparator — diff logic between base and child detection sets", owner:"E2", output:"modules/symbol_comparator.py", priority:"P1" },
      { id:"6.3", task:"GS1 Application Identifier parser for barcode fields", owner:"E3", output:"GS1 AI parser module", priority:"P0" },
      { id:"6.4", task:"Attribute-to-CV-finding matcher — exact, fuzzy, symbol normalisation, GS1 AI", owner:"E4", output:"proofing/matchers.py", priority:"P0" },
      { id:"6.5", task:"WEEKEND GATE: All Contract 1 + Contract 2 outputs producing valid JSON ✅", owner:"All", output:"Gate confirmed before Week 2", priority:"P0" },
    ]},
  ]},
  { week:2, label:"WEEK 2 — Engine Integration + Proof Logic", color:"#6d28d9", days:[
    { day:8, label:"Day 8 — Proof Engine Core", tasks:[
      { id:"8.1", task:"Proof engine pipeline steps 1–4: routing, candidate matching, old-value check, new-value verify", owner:"E4", output:"Engine processes text attributes end-to-end", priority:"P0" },
      { id:"8.2", task:"Wire CV module outputs into unified cv_findings.json aggregator", owner:"E2+E3", output:"Single findings file from all 4 modules", priority:"P0" },
      { id:"8.3", task:"MongoDB proofing_history schema — add cv_findings, report refs, file hashes", owner:"E1", output:"Schema matches PRD §7.1 exactly", priority:"P0" },
      { id:"8.4", task:"SHA-256 file hashing at image ingestion — store in session document", owner:"E1", output:"Audit trail integrity implemented", priority:"P1" },
    ]},
    { day:9, label:"Day 9 — Proof Engine Rules + Verdict Logic", tasks:[
      { id:"9.1", task:"Proof engine pipeline steps 5–8: positional check, completeness, threshold eval, verdict assignment", owner:"E4", output:"All 4 verdict types working", priority:"P0" },
      { id:"9.2", task:"Remaining rule definitions — graphic/logo (10) + compliance (10) + custom attributes", owner:"E4", output:"All 130+ attributes have rules", priority:"P0" },
      { id:"9.3", task:"Integration test: Feed real label CV findings into proof engine — check verdicts", owner:"E3+E4", output:"First real end-to-end verdict", priority:"P0" },
      { id:"9.4", task:"Annotated visual diff — colour-coded bounding boxes on side-by-side image", owner:"E2", output:"reports/annotator.py", priority:"P1" },
    ]},
    { day:10, label:"Day 10 — Unintended Change Classifier + Proof UI", tasks:[
      { id:"10.1", task:"Unintended change classifier — all 5 classification rules from PRD §5.5", owner:"E4", output:"proofing/engine.py complete", priority:"P0" },
      { id:"10.2", task:"Proof Engine tab UI — per-attribute verdict table, evidence details, unintended changes", owner:"E1", output:"Tab 3 (✅ Proof Engine) complete", priority:"P0" },
      { id:"10.3", task:"CV Inspection tab UI — upload, run, annotated diff display, per-module results tabs", owner:"E1", output:"Tab 2 (🔍 CV Inspection) complete", priority:"P0" },
      { id:"10.4", task:"Tune CV thresholds on real labels — symbol confidence floors, OCR similarity thresholds", owner:"E2+E3", output:"Threshold config file", priority:"P1" },
    ]},
    { day:11, label:"Day 11 — Report Builder", tasks:[
      { id:"11.1", task:"Report builder sections 1–5: cover, summary, attribute table, missing cards, incomplete cards", owner:"E4", output:"reports/report_builder.py draft", priority:"P0" },
      { id:"11.2", task:"Report builder sections 6–11: unintended, symbol table, OCR, barcode, visual diff, audit", owner:"E4", output:"Full report structure complete", priority:"P0" },
      { id:"11.3", task:"Word (.docx) export with tables + annotated image embedded", owner:"E4", output:"reports/pdf_export.py — docx working", priority:"P1" },
      { id:"11.4", task:"Proof History tab UI — search/filter/sort table, session detail view", owner:"E1", output:"Tab 5 (🗄️ Proof History) draft", priority:"P1" },
    ]},
    { day:12, label:"Day 12 — Integration Checkpoint #2", tasks:[
      { id:"12.1", task:"Full pipeline run on real label: Form → CV → Proof Engine → Report → MongoDB", owner:"All", output:"First complete end-to-end run", priority:"P0" },
      { id:"12.2", task:"STAKEHOLDER REVIEW: Walk through full pipeline output — verdict accuracy check", owner:"All", output:"Feedback list captured", priority:"P0" },
      { id:"12.3", task:"Identify top 5 verdict errors — root cause (CV threshold? Rule logic? Matcher?)", owner:"E3+E4", output:"Bug/tuning list", priority:"P0" },
      { id:"12.4", task:"PDF export via ReportLab/WeasyPrint", owner:"E4", output:".pdf export working", priority:"P1" },
    ]},
    { day:"13–14", label:"Days 13–14 — Fixes + Robustness", tasks:[
      { id:"13.1", task:"History tab complete — trend chart (Plotly), CSV/Excel export, session diff view", owner:"E1", output:"Tab 5 fully functional", priority:"P1" },
      { id:"13.2", task:"Handle edge cases — low-res scans, partial label images, rotated labels", owner:"E2", output:"Robust CV on edge cases", priority:"P1" },
      { id:"13.3", task:"OCR edge cases — small fonts, colour backgrounds, multilingual text", owner:"E3", output:"OCR hardened", priority:"P1" },
      { id:"13.4", task:"Fix top verdict errors identified Day 12 · JSON export · overall verdict logic", owner:"E4", output:"PASS/CONDITIONAL/FAIL working correctly", priority:"P0" },
      { id:"13.5", task:"Auth stub — role field on user documents, basic session login", owner:"All", output:"Role-based access in place", priority:"P2" },
    ]},
  ]},
  { week:3, label:"WEEK 3 — Hardening + Systematic Testing", color:"#b45309", days:[
    { day:"15–16", label:"Days 15–16 — Systematic Testing", tasks:[
      { id:"T1", task:"Test all 8 form validation rules with edge case inputs", owner:"E1", output:"Validation test report", priority:"P0" },
      { id:"T2", task:"Test all 5 verdict types across 10+ real label pairs", owner:"E2+E3", output:"Verdict accuracy matrix", priority:"P0" },
      { id:"T3", task:"Test all 5 unintended change classifications", owner:"E4", output:"Classification test report", priority:"P0" },
      { id:"T4", task:"Test barcode grade thresholds — Grade A/B/C/D across real barcodes", owner:"E3", output:"Barcode test report", priority:"P0" },
      { id:"T5", task:"Performance test — CV < 45s, proof engine < 10s, report < 15s", owner:"E1", output:"Performance benchmark", priority:"P0" },
      { id:"T6", task:"MongoDB write/query latency under 10 concurrent sessions", owner:"E1", output:"Load test results", priority:"P1" },
    ]},
    { day:"17–18", label:"Days 17–18 — Tuning + Bug Fixes", tasks:[
      { id:"17.1", task:"Address all test failures from Days 15–16", owner:"All", output:"Zero P0 test failures", priority:"P0" },
      { id:"17.2", task:"Tune SIFT/ORB confidence thresholds per symbol type using real label results", owner:"E2", output:"Updated threshold config", priority:"P1" },
      { id:"17.3", task:"Tune OCR fuzzy match thresholds (default 0.90) per text region type", owner:"E3", output:"Updated OCR config", priority:"P1" },
      { id:"17.4", task:"Fix any MongoDB schema gaps discovered during full pipeline runs", owner:"E1", output:"Schema finalized", priority:"P0" },
      { id:"17.5", task:"Final annotated diff visual polish — directional arrows for repositioned elements", owner:"E2", output:"Annotated diff polished", priority:"P2" },
    ]},
    { day:19, label:"Day 19 — Pre-Delivery Integration Run", tasks:[
      { id:"19.1", task:"Run 5 complete proofing sessions on different label change scenarios", owner:"All", output:"5 full session records in MongoDB", priority:"P0" },
      { id:"19.2", task:"Verify all 5 MongoDB collections populated correctly", owner:"E1", output:"DB integrity confirmed", priority:"P0" },
      { id:"19.3", task:"Download all export formats (docx, pdf, json, csv) — visual QA", owner:"All", output:"Export QA sign-off", priority:"P0" },
      { id:"19.4", task:"Docker image final build — clean environment, no dev dependencies", owner:"E1", output:"Production Docker image", priority:"P0" },
    ]},
    { day:20, label:"Day 20 — Demo Prep + Docs", tasks:[
      { id:"20.1", task:"Prepare demo script — 3 scenarios (PASS, FAIL, CONDITIONAL)", owner:"E1+Stakeholder", output:"Demo script", priority:"P0" },
      { id:"20.2", task:"Write README — setup, .env config, Docker run instructions", owner:"E1", output:"README.md", priority:"P0" },
      { id:"20.3", task:"Write user guide — step-by-step workflow matching PRD §8.2", owner:"E4", output:"USER_GUIDE.md", priority:"P1" },
      { id:"20.4", task:"Final stakeholder walkthrough — sign off or log punch list", owner:"All", output:"Sign-off or punch list", priority:"P0" },
    ]},
  ]},
  { week:4, label:"WEEK 4 — Delivery, Hardening & Handover", color:"#065f46", days:[
    { day:21, label:"Day 21 — Production Delivery", tasks:[
      { id:"21.1", task:"Docker image pushed to container registry", owner:"E1", output:"Image tagged + pushed", priority:"P0" },
      { id:"21.2", task:"Cloud VM hardened — firewall rules, HTTPS, MongoDB access restricted", owner:"E1", output:"VM production-ready", priority:"P0" },
      { id:"21.3", task:"All documentation committed to repo", owner:"All", output:"Docs in repo", priority:"P0" },
      { id:"21.4", task:"Punch list items triaged: P0 (block) / P1 (fix) / P2 (backlog)", owner:"All", output:"Prioritised punch list", priority:"P0" },
    ]},
    { day:"22–23", label:"Days 22–23 — P0/P1 Punch List Fixes", tasks:[
      { id:"22.1", task:"Resolve all P0 punch list items from Day 21", owner:"All", output:"Zero blocking issues", priority:"P0" },
      { id:"22.2", task:"Resolve P1 punch list items (non-blocking but required for handover)", owner:"All", output:"P1 list cleared", priority:"P1" },
      { id:"22.3", task:"Re-run full 5-session integration test post-fixes", owner:"E1+E4", output:"Regression confirmed clean", priority:"P0" },
      { id:"22.4", task:"CV accuracy re-validation — confirm thresholds still hold after fixes", owner:"E2+E3", output:"Accuracy report v2", priority:"P1" },
    ]},
    { day:"24–25", label:"Days 24–25 — User Acceptance Testing", tasks:[
      { id:"24.1", task:"UAT session 1 — Stakeholder runs 3 real label proofing scenarios end-to-end", owner:"All", output:"UAT feedback log", priority:"P0" },
      { id:"24.2", task:"UAT session 2 — Edge case labels (low-res, multilingual, rotated)", owner:"E2+E3", output:"UAT edge case report", priority:"P1" },
      { id:"24.3", task:"Fix critical UAT findings (same-day turnaround)", owner:"All", output:"UAT blockers resolved", priority:"P0" },
      { id:"24.4", task:"Sign-off on verdict accuracy threshold — stakeholder accepts CV performance baseline", owner:"All", output:"Accuracy baseline signed off", priority:"P0" },
    ]},
    { day:"26–27", label:"Days 26–27 — Handover Preparation", tasks:[
      { id:"26.1", task:"E2 documents CV tuning guide", owner:"E2", output:"CV_TUNING_GUIDE.md", priority:"P1" },
      { id:"26.2", task:"E3 documents OCR + barcode config guide", owner:"E3", output:"OCR_CONFIG_GUIDE.md", priority:"P1" },
      { id:"26.3", task:"E4 documents rule engine + how to add new rules", owner:"E4", output:"RULES_GUIDE.md", priority:"P1" },
      { id:"26.4", task:"E1 documents infra runbook — VM restart, Docker ops, MongoDB backup", owner:"E1", output:"INFRA_RUNBOOK.md", priority:"P0" },
      { id:"26.5", task:"Backlog grooming — all P2 items documented in GitHub Issues for future sprint", owner:"All", output:"GitHub Issues populated", priority:"P2" },
    ]},
    { day:28, label:"Day 28 — Final Handover", tasks:[
      { id:"28.1", task:"Final demo to stakeholder — live system on production VM", owner:"All", output:"Handover demo complete", priority:"P0" },
      { id:"28.2", task:"Credentials + access handover — VM, MongoDB, container registry, GitHub", owner:"E1", output:"Access transfer confirmed", priority:"P0" },
      { id:"28.3", task:"Project retrospective — what worked, what to improve in next sprint", owner:"All", output:"Retrospective notes", priority:"P2" },
      { id:"28.4", task:"Archive all sprint artefacts — Dockerfile, contracts, test reports, tuning configs", owner:"E1", output:"Sprint archive committed to repo", priority:"P1" },
    ]},
  ]},
];

const allTasks = [];
weeks.forEach(w => w.days.forEach(d => d.tasks.forEach(t =>
  allTasks.push({ ...t, week:`Week ${w.week}`, day:`Day ${d.day}`, dayLabel:d.label, status:"Not Started", notes:"" })
)));

const exportCSV = (tasks) => {
  const headers = ["Week","Day","Task ID","Task Description","Owner","Priority","Output / Deliverable","Status","Notes"];
  const rows = tasks.map(t => [t.week, t.day, t.id, `"${t.task.replace(/"/g,'""')}"`, t.owner, t.priority, `"${t.output.replace(/"/g,'""')}"`, t.status, `"${t.notes.replace(/"/g,'""')}"`]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type:"text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "Medical_Label_Verification_4Week_Sprint.csv"; a.click();
  URL.revokeObjectURL(url);
};

export default function App() {
  const [tasks, setTasks] = useState(allTasks);
  const [filterWeek, setFilterWeek] = useState("All");
  const [filterOwner, setFilterOwner] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [activeTab, setActiveTab] = useState("plan");
  const [editingNote, setEditingNote] = useState(null);

  const updateTask = (id, field, val) => setTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: val } : t));

  const filtered = tasks.filter(t =>
    (filterWeek === "All" || t.week === filterWeek) &&
    (filterOwner === "All" || t.owner.includes(filterOwner.split(" ")[0])) &&
    (filterPriority === "All" || t.priority === filterPriority) &&
    (filterStatus === "All" || t.status === filterStatus)
  );

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === "Done").length,
    inProgress: tasks.filter(t => t.status === "In Progress").length,
    blocked: tasks.filter(t => t.status === "Blocked").length,
    notStarted: tasks.filter(t => t.status === "Not Started").length,
  };

  const pct = Math.round((stats.done / stats.total) * 100);
  const sel = { fontSize:12, border:"1px solid #e2e8f0", borderRadius:4, padding:"4px 8px", background:"white", cursor:"pointer" };

  return (
    <div style={{ fontFamily:"system-ui,sans-serif", fontSize:13, background:"#f8fafc", minHeight:"100vh" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#1e3a5f,#1e40af)", padding:"16px 24px", color:"white" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700 }}>🏥 Medical Label Verification Platform</div>
            <div style={{ fontSize:12, opacity:0.8, marginTop:2 }}>4-Week Sprint Plan · 4 Engineers · Docker + Cloud VM</div>
          </div>
          <button onClick={() => exportCSV(tasks)} style={{ background:"#16a34a", color:"white", border:"none", borderRadius:6, padding:"8px 16px", cursor:"pointer", fontWeight:600, fontSize:13 }}>
            ⬇ Export CSV
          </button>
        </div>
        <div style={{ marginTop:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
            <span>Overall Progress</span><span>{stats.done}/{stats.total} tasks · {pct}%</span>
          </div>
          <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:4, height:6 }}>
            <div style={{ background:"#4ade80", width:`${pct}%`, height:"100%", borderRadius:4, transition:"width 0.3s" }} />
          </div>
        </div>
        <div style={{ display:"flex", gap:12, marginTop:10 }}>
          {[["Done",stats.done,"#4ade80"],["In Progress",stats.inProgress,"#60a5fa"],["Blocked",stats.blocked,"#f87171"],["Not Started",stats.notStarted,"#94a3b8"]].map(([l,v,c]) => (
            <div key={l} style={{ background:"rgba(255,255,255,0.1)", borderRadius:6, padding:"4px 10px", fontSize:12 }}>
              <span style={{ color:c, fontWeight:700 }}>{v}</span> <span style={{ opacity:0.8 }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", background:"white", borderBottom:"1px solid #e2e8f0", padding:"0 24px" }}>
        {[["plan","📋 Sprint Plan"],["board","📊 Board View"]].map(([id,label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{ padding:"10px 18px", border:"none", background:"none", cursor:"pointer", fontWeight:activeTab===id?700:400, color:activeTab===id?"#1e40af":"#64748b", borderBottom:activeTab===id?"2px solid #1e40af":"2px solid transparent", fontSize:13 }}>
            {label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:8, padding:"10px 24px", background:"white", borderBottom:"1px solid #e2e8f0", flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ color:"#64748b", fontSize:12 }}>Filter:</span>
        <select style={sel} value={filterWeek} onChange={e => setFilterWeek(e.target.value)}>
          <option>All</option>{[1,2,3,4].map(w=><option key={w}>Week {w}</option>)}
        </select>
        <select style={sel} value={filterOwner} onChange={e => setFilterOwner(e.target.value)}>
          <option>All</option>{ENGINEERS.map(e=><option key={e}>{e}</option>)}
        </select>
        <select style={sel} value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option>All</option>{["P0","P1","P2"].map(p=><option key={p}>{p}</option>)}
        </select>
        <select style={sel} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option>All</option>{Object.keys(STATUS_COLORS).map(s=><option key={s}>{s}</option>)}
        </select>
        <span style={{ color:"#94a3b8", fontSize:11 }}>{filtered.length} tasks shown</span>
      </div>

      <div style={{ padding:"16px 24px" }}>
        {activeTab === "plan" && weeks.map(w => {
          const wFiltered = filtered.filter(t => t.week===`Week ${w.week}`);
          if (!wFiltered.length) return null;
          const dayGroups = {};
          wFiltered.forEach(t => { if (!dayGroups[t.day]) dayGroups[t.day]=[]; dayGroups[t.day].push(t); });
          return (
            <div key={w.week} style={{ marginBottom:24 }}>
              <div style={{ background:w.color, color:"white", padding:"8px 14px", borderRadius:"8px 8px 0 0", fontWeight:700, fontSize:14 }}>
                Week {w.week} — {w.label.split("—")[1]}
              </div>
              {Object.entries(dayGroups).map(([day, dayTasks]) => {
                const dl = weeks.flatMap(x=>x.days).find(d=>`Day ${d.day}`===day);
                return (
                  <div key={day} style={{ marginBottom:2 }}>
                    <div style={{ background:"#f1f5f9", padding:"5px 14px", fontSize:12, fontWeight:600, color:"#475569", borderLeft:`3px solid ${w.color}` }}>
                      {dl?.label || day}
                    </div>
                    <table style={{ width:"100%", borderCollapse:"collapse" }}>
                      <thead>
                        <tr style={{ background:"#f8fafc", fontSize:11, color:"#64748b" }}>
                          {["ID","Task","Owner","Pri","Output / Deliverable","Status","Notes"].map((h,i) => (
                            <th key={h} style={{ padding:"4px 8px", textAlign:"left", borderBottom:"1px solid #e2e8f0", width:[40,undefined,130,44,200,140,150][i] }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dayTasks.map(t => {
                          const sc = STATUS_COLORS[t.status];
                          return (
                            <tr key={t.id} style={{ background:"white", borderBottom:"1px solid #f1f5f9" }}>
                              <td style={{ padding:"5px 8px", color:"#94a3b8", fontWeight:600, fontSize:11 }}>{t.id}</td>
                              <td style={{ padding:"5px 8px", fontSize:12 }}>{t.task}</td>
                              <td style={{ padding:"5px 8px" }}>
                                <span style={{ background:ownerColor(t.owner), borderRadius:4, padding:"2px 6px", fontSize:11, fontWeight:600 }}>{t.owner}</span>
                              </td>
                              <td style={{ padding:"5px 8px" }}>
                                <span style={{ background:t.priority==="P0"?"#fef2f2":t.priority==="P1"?"#fff7ed":"#f0fdf4", color:t.priority==="P0"?"#dc2626":t.priority==="P1"?"#ea580c":"#16a34a", borderRadius:4, padding:"2px 5px", fontSize:10, fontWeight:700 }}>{t.priority}</span>
                              </td>
                              <td style={{ padding:"5px 8px", fontSize:11, color:"#475569" }}>{t.output}</td>
                              <td style={{ padding:"5px 8px" }}>
                                <select value={t.status} onChange={e => updateTask(t.id,"status",e.target.value)}
                                  style={{ fontSize:11, border:`1px solid ${sc.border}`, borderRadius:4, padding:"2px 4px", background:sc.bg, color:sc.text, cursor:"pointer" }}>
                                  {Object.keys(STATUS_COLORS).map(s=><option key={s}>{s}</option>)}
                                </select>
                              </td>
                              <td style={{ padding:"5px 8px" }}>
                                {editingNote===t.id
                                  ? <input autoFocus value={t.notes} onChange={e=>updateTask(t.id,"notes",e.target.value)} onBlur={()=>setEditingNote(null)} style={{ width:"100%", fontSize:11, border:"1px solid #93c5fd", borderRadius:4, padding:"2px 4px" }} />
                                  : <span onClick={()=>setEditingNote(t.id)} style={{ fontSize:11, color:t.notes?"#1e40af":"#cbd5e1", cursor:"pointer" }}>{t.notes||"＋ note"}</span>
                                }
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          );
        })}

        {activeTab === "board" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
            {Object.keys(STATUS_COLORS).map(status => {
              const sc = STATUS_COLORS[status];
              const col = filtered.filter(t => t.status===status);
              return (
                <div key={status} style={{ background:"white", borderRadius:8, border:`1px solid ${sc.border}`, overflow:"hidden" }}>
                  <div style={{ background:sc.bg, padding:"8px 12px", borderBottom:`1px solid ${sc.border}`, fontWeight:700, fontSize:12, color:sc.text, display:"flex", justifyContent:"space-between" }}>
                    <span>{status}</span><span style={{ background:sc.border, borderRadius:10, padding:"1px 7px" }}>{col.length}</span>
                  </div>
                  <div style={{ padding:8, maxHeight:500, overflowY:"auto" }}>
                    {col.map(t => (
                      <div key={t.id} style={{ background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:6, padding:"6px 8px", marginBottom:6 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                          <span style={{ fontSize:10, color:"#94a3b8", fontWeight:600 }}>{t.id}</span>
                          <span style={{ background:ownerColor(t.owner), borderRadius:3, padding:"1px 5px", fontSize:10, fontWeight:600 }}>{t.owner}</span>
                        </div>
                        <div style={{ fontSize:11, color:"#374151", lineHeight:1.4 }}>{t.task}</div>
                        <div style={{ marginTop:4, display:"flex", gap:4 }}>
                          <span style={{ fontSize:10, color:"#64748b" }}>{t.week}</span>
                          <span style={{ background:t.priority==="P0"?"#fef2f2":t.priority==="P1"?"#fff7ed":"#f0fdf4", color:t.priority==="P0"?"#dc2626":t.priority==="P1"?"#ea580c":"#16a34a", borderRadius:3, padding:"0 4px", fontSize:10, fontWeight:700 }}>{t.priority}</span>
                        </div>
                      </div>
                    ))}
                    {!col.length && <div style={{ color:"#cbd5e1", fontSize:12, textAlign:"center", padding:16 }}>No tasks</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
