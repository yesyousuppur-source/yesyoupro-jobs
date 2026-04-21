"use client";
import { useState } from "react";
import Link from "next/link";

const JOB_ROLES = [
  "Data Analyst", "Software Developer", "Web Developer",
  "Digital Marketing", "Business Analyst", "HR Executive",
  "Graphic Designer", "Content Writer", "Sales Executive",
];

const COMPANIES = ["TCS", "Infosys", "Wipro", "HCL", "Accenture", "Startup", "Government Job", "Bank (IBPS)"];

export default function SkillGap() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ role: "", company: "", skills: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!form.role || !form.skills.trim()) {
      setError("Role aur current skills dono bharo.");
      return;
    }
    setError("");
    setStep(2);
    try {
      const res = await fetch("/api/jobs/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setStep(3);
    } catch (e) {
      setError("Kuch gadbad ho gayi. Dobara try karo.");
      setStep(1);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "#6ee7b7";
    if (score >= 40) return "#fbbf24";
    return "#f472b6";
  };

  return (
    <main style={s.main}>
      <nav style={s.nav}>
        <Link href="/jobs" style={s.backLink}>← YesYouPro Jobs</Link>
        <span style={s.navTitle}>Skill Gap Analyzer</span>
      </nav>

      <div style={s.container}>
        {/* STEP 1 — FORM */}
        {step === 1 && (
          <div style={s.card}>
            <div style={s.cardIcon}>🔍</div>
            <h1 style={s.cardTitle}>Apna Skill Gap Jaano</h1>
            <p style={s.cardSub}>Job role aur current skills daal do — AI 30 seconds mein bata dega kya miss hai</p>
            {error && <div style={s.errorBox}>{error}</div>}
            <div style={s.formGroup}>
              <label style={s.label}>Target Job Role *</label>
              <select style={s.select} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="">-- Role choose karo --</option>
                {JOB_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Target Company (optional)</label>
              <select style={s.select} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}>
                <option value="">-- Company choose karo --</option>
                {COMPANIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Tumhari Current Skills *</label>
              <textarea
                style={s.textarea}
                placeholder="Jaise: Excel, Basic Python, MS Word, Communication skills..."
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                rows={4}
              />
              <span style={s.hint}>Honest likho — achha result milega</span>
            </div>
            <button style={s.btnPrimary} onClick={handleAnalyze}>Analyze Karo →</button>
          </div>
        )}

        {/* STEP 2 — LOADING */}
        {step === 2 && (
          <div style={{ ...s.card, textAlign: "center" }}>
            <h2 style={s.cardTitle}>Analyzing...</h2>
            <p style={s.cardSub}>AI tumhari skills check kar raha hai {form.role} ke liye</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } } .sp { width:48px;height:48px;border:3px solid #1e1e2e;border-top-color:#6ee7b7;border-radius:50%;animation:spin 0.8s linear infinite;margin:1.5rem auto; }`}</style>
            <div className="sp"></div>
          </div>
        )}

        {/* STEP 3 — RESULT */}
        {step === 3 && result && (
          <div style={s.resultWrap}>
            <div style={s.scoreCard}>
              <div>
                <div style={s.scoreLabel}>Job Readiness Score</div>
                <div style={{ ...s.scoreNum, color: getScoreColor(result.score) }}>
                  {result.score}<span style={s.scoreSlash}>/100</span>
                </div>
                <div style={s.scoreRole}>{form.role} {form.company ? `— ${form.company}` : ""}</div>
              </div>
              <div style={s.scoreRight}>
                <div style={s.scoreStat}><span style={{ color: "#6ee7b7", fontWeight: 700 }}>{result.strong?.length || 0}</span><span style={s.scoreStatLabel}>Strong</span></div>
                <div style={s.scoreStat}><span style={{ color: "#f472b6", fontWeight: 700 }}>{result.missing?.length || 0}</span><span style={s.scoreStatLabel}>Missing</span></div>
                <div style={s.scoreStat}><span style={{ color: "#fbbf24", fontWeight: 700 }}>{result.improve?.length || 0}</span><span style={s.scoreStatLabel}>Improve</span></div>
              </div>
            </div>

            {result.strong?.length > 0 && (
              <div style={s.skillSection}>
                <div style={s.skillSectionTitle}>✅ Strong Skills</div>
                {result.strong.map((skill) => (
                  <div key={skill.name} style={s.skillItem}>
                    <div style={s.skillDotGreen}></div>
                    <div style={s.skillInfo}><div style={s.skillName}>{skill.name}</div><div style={s.skillNote}>{skill.note}</div></div>
                    <span style={s.badgeGreen}>Strong ✓</span>
                  </div>
                ))}
              </div>
            )}

            {result.missing?.length > 0 && (
              <div style={s.skillSection}>
                <div style={s.skillSectionTitle}>❌ Missing Skills</div>
                {result.missing.map((skill) => (
                  <div key={skill.name} style={s.skillItem}>
                    <div style={s.skillDotRed}></div>
                    <div style={s.skillInfo}>
                      <div style={s.skillName}>{skill.name}</div>
                      <div style={s.skillNote}>{skill.note}</div>
                      {skill.resource && <a href={skill.resource} target="_blank" rel="noreferrer" style={s.resourceLink}>📚 Free Course →</a>}
                    </div>
                    <span style={s.badgeRed}>Missing ✗</span>
                  </div>
                ))}
              </div>
            )}

            {result.improve?.length > 0 && (
              <div style={s.skillSection}>
                <div style={s.skillSectionTitle}>⚡ Improve Karo</div>
                {result.improve.map((skill) => (
                  <div key={skill.name} style={s.skillItem}>
                    <div style={s.skillDotYellow}></div>
                    <div style={s.skillInfo}><div style={s.skillName}>{skill.name}</div><div style={s.skillNote}>{skill.note}</div></div>
                    <span style={s.badgeYellow}>Weak</span>
                  </div>
                ))}
              </div>
            )}

            <div style={s.timelineBox}>
              <div style={{ fontSize: "1.5rem" }}>⏱️</div>
              <div>
                <div style={s.timelineTitle}>Ready Hone Ka Time</div>
                <div style={s.timelineText}>{result.timeline}</div>
              </div>
            </div>

            {result.advice && (
              <div style={s.adviceBox}>
                <div style={s.adviceTitle}>💡 AI Ki Salah</div>
                <div style={s.adviceText}>{result.advice}</div>
              </div>
            )}

            <div style={s.resultBtns}>
              <Link href="/jobs/interview"><button style={s.btnPrimary}>Ab Mock Interview Do →</button></Link>
              <button style={s.btnOutline} onClick={() => { setStep(1); setResult(null); setForm({ role: "", company: "", skills: "" }); }}>Dobara Try Karo</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

const s = {
  main: { background: "#0a0a0f", color: "#e2e8f0", minHeight: "100vh", fontFamily: "sans-serif" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", borderBottom: "1px solid #1e1e2e", background: "rgba(10,10,15,0.9)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100 },
  backLink: { color: "#64748b", textDecoration: "none", fontSize: "0.85rem" },
  navTitle: { fontWeight: 700, fontSize: "0.95rem", color: "#6ee7b7" },
  container: { maxWidth: "680px", margin: "0 auto", padding: "3rem 1.5rem" },
  card: { background: "#0f0f17", border: "1px solid #1e1e2e", borderRadius: "20px", padding: "2.5rem" },
  cardIcon: { fontSize: "2.5rem", marginBottom: "1rem" },
  cardTitle: { fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "0.6rem" },
  cardSub: { color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "2rem" },
  errorBox: { background: "rgba(244,114,182,0.08)", border: "1px solid rgba(244,114,182,0.2)", color: "#f472b6", padding: "0.8rem 1rem", borderRadius: "10px", fontSize: "0.85rem", marginBottom: "1.5rem" },
  formGroup: { marginBottom: "1.5rem" },
  label: { display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.5rem" },
  select: { width: "100%", padding: "0.85rem 1rem", background: "#13131a", border: "1px solid #1e1e2e", borderRadius: "10px", color: "#e2e8f0", fontSize: "0.9rem", outline: "none" },
  textarea: { width: "100%", padding: "0.85rem 1rem", background: "#13131a", border: "1px solid #1e1e2e", borderRadius: "10px", color: "#e2e8f0", fontSize: "0.88rem", outline: "none", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" },
  hint: { fontSize: "0.72rem", color: "#64748b", marginTop: "0.4rem", display: "block" },
  btnPrimary: { width: "100%", background: "#6ee7b7", color: "#0a0a0f", border: "none", padding: "0.9rem", borderRadius: "10px", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" },
  btnOutline: { background: "transparent", color: "#e2e8f0", border: "1px solid #1e1e2e", padding: "0.9rem 1.8rem", borderRadius: "10px", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" },
  resultWrap: { display: "flex", flexDirection: "column", gap: "1.5rem" },
  scoreCard: { background: "#0f0f17", border: "1px solid #1e1e2e", borderRadius: "20px", padding: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" },
  scoreLabel: { fontSize: "0.75rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.3rem" },
  scoreNum: { fontSize: "4rem", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1 },
  scoreSlash: { fontSize: "1.2rem", color: "#64748b", fontWeight: 400 },
  scoreRole: { fontSize: "0.82rem", color: "#64748b", marginTop: "0.4rem" },
  scoreRight: { display: "flex", gap: "1.5rem" },
  scoreStat: { display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem" },
  scoreStatLabel: { fontSize: "0.68rem", color: "#64748b" },
  skillSection: { background: "#0f0f17", border: "1px solid #1e1e2e", borderRadius: "16px", padding: "1.5rem" },
  skillSectionTitle: { fontWeight: 700, fontSize: "0.9rem", marginBottom: "1rem" },
  skillItem: { display: "flex", alignItems: "flex-start", gap: "0.8rem", padding: "0.7rem 0", borderBottom: "1px solid #1e1e2e" },
  skillDotGreen: { width: "8px", height: "8px", background: "#6ee7b7", borderRadius: "50%", marginTop: "0.3rem", flexShrink: 0 },
  skillDotRed: { width: "8px", height: "8px", background: "#f472b6", borderRadius: "50%", marginTop: "0.3rem", flexShrink: 0 },
  skillDotYellow: { width: "8px", height: "8px", background: "#fbbf24", borderRadius: "50%", marginTop: "0.3rem", flexShrink: 0 },
  skillInfo: { flex: 1 },
  skillName: { fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.2rem" },
  skillNote: { fontSize: "0.78rem", color: "#64748b", lineHeight: 1.4 },
  resourceLink: { fontSize: "0.75rem", color: "#6ee7b7", textDecoration: "none", display: "inline-block", marginTop: "0.3rem" },
  badgeGreen: { fontSize: "0.68rem", background: "rgba(110,231,183,0.1)", color: "#6ee7b7", padding: "0.2rem 0.6rem", borderRadius: "100px", fontWeight: 600, flexShrink: 0 },
  badgeRed: { fontSize: "0.68rem", background: "rgba(244,114,182,0.1)", color: "#f472b6", padding: "0.2rem 0.6rem", borderRadius: "100px", fontWeight: 600, flexShrink: 0 },
  badgeYellow: { fontSize: "0.68rem", background: "rgba(251,191,36,0.1)", color: "#fbbf24", padding: "0.2rem 0.6rem", borderRadius: "100px", fontWeight: 600, flexShrink: 0 },
  timelineBox: { background: "rgba(110,231,183,0.05)", border: "1px solid rgba(110,231,183,0.15)", borderRadius: "14px", padding: "1.2rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" },
  timelineTitle: { fontSize: "0.78rem", color: "#64748b", fontWeight: 600, marginBottom: "0.2rem" },
  timelineText: { fontSize: "0.95rem", fontWeight: 600, color: "#6ee7b7" },
  adviceBox: { background: "#0f0f17", border: "1px solid #1e1e2e", borderRadius: "14px", padding: "1.5rem" },
  adviceTitle: { fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.6rem" },
  adviceText: { fontSize: "0.88rem", color: "#94a3b8", lineHeight: 1.7 },
  resultBtns: { display: "flex", gap: "1rem", flexWrap: "wrap" },
};
