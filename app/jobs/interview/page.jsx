"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const COMPANIES = ["TCS", "Infosys", "Wipro", "HCL", "Accenture", "Startup", "Government", "Bank"];
const ROUNDS = ["HR Round", "Technical Round", "Managerial Round"];

export default function Interview() {
  const [step, setStep] = useState(1);
  const [setup, setSetup] = useState({ company: "", round: "", language: "Hinglish" });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionNum, setQuestionNum] = useState(0);
  const [score, setScore] = useState(null);
  const messagesEnd = useRef(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startInterview = async () => {
    if (!setup.company || !setup.round) return;
    setStep(2);
    setLoading(true);
    const res = await fetch("/api/jobs/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start", setup }),
    });
    const data = await res.json();
    setMessages([{ role: "ai", text: data.question, feedback: null }]);
    setQuestionNum(1);
    setLoading(false);
  };

  const sendAnswer = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    const res = await fetch("/api/jobs/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "answer",
        setup,
        answer: userMsg,
        questionNum,
        history: messages,
      }),
    });
    const data = await res.json();
    if (data.done) {
      setMessages((prev) => [...prev, { role: "ai", text: data.feedback, feedback: null }]);
      setScore(data.score);
      setStep(3);
    } else {
      setMessages((prev) => [
        ...prev,
        { role: "feedback", text: data.feedback },
        { role: "ai", text: data.nextQuestion },
      ]);
      setQuestionNum((n) => n + 1);
    }
    setLoading(false);
  };

  const getScoreColor = (s) => s >= 70 ? "#6ee7b7" : s >= 45 ? "#fbbf24" : "#f472b6";

  return (
    <main style={s.main}>
      <nav style={s.nav}>
        <Link href="/jobs" style={s.backLink}>← YesYouPro Jobs</Link>
        <span style={s.navTitle}>
          {step === 2 ? `${setup.company} — ${setup.round} (Q${questionNum}/8)` : "AI Mock Interview"}
        </span>
      </nav>

      <div style={s.container}>
        {step === 1 && (
          <div style={s.card}>
            <div style={s.cardIcon}>🎤</div>
            <h1 style={s.cardTitle}>Mock Interview Shuru Karo</h1>
            <p style={s.cardSub}>Company aur round choose karo — AI real interviewer ban jaayega</p>
            <div style={s.formGroup}>
              <label style={s.label}>Company *</label>
              <div style={s.chipGrid}>
                {COMPANIES.map((c) => (
                  <button
                    key={c}
                    style={{ ...s.chip, ...(setup.company === c ? s.chipActive : {}) }}
                    onClick={() => setSetup({ ...setup, company: c })}
                  >{c}</button>
                ))}
              </div>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Round *</label>
              <div style={s.chipGrid}>
                {ROUNDS.map((r) => (
                  <button
                    key={r}
                    style={{ ...s.chip, ...(setup.round === r ? s.chipActive : {}) }}
                    onClick={() => setSetup({ ...setup, round: r })}
                  >{r}</button>
                ))}
              </div>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Language</label>
              <div style={s.chipGrid}>
                {["Hindi", "Hinglish", "English"].map((l) => (
                  <button
                    key={l}
                    style={{ ...s.chip, ...(setup.language === l ? s.chipActive : {}) }}
                    onClick={() => setSetup({ ...setup, language: l })}
                  >{l}</button>
                ))}
              </div>
            </div>
            <div style={s.infoBox}>
              <span style={{ color: "#6ee7b7" }}>ℹ️</span>
              <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                8 questions honge. Har jawab ke baad honest feedback milega.
              </span>
            </div>
            <button
              style={{ ...s.btnPrimary, opacity: (!setup.company || !setup.round) ? 0.5 : 1 }}
              onClick={startInterview}
              disabled={!setup.company || !setup.round}
            >
              Interview Shuru Karo →
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={s.chatWrap}>
            <div style={s.progressBar}>
              <div style={{ ...s.progressFill, width: `${(questionNum / 8) * 100}%` }}></div>
            </div>
            <div style={s.chatMessages}>
              {messages.map((msg, i) => (
                <div key={i}>
                  {msg.role === "ai" && (
                    <div style={s.msgGroup}>
                      <div style={s.msgLabel}>🤖 AI Interviewer</div>
                      <div style={s.msgAI}>{msg.text}</div>
                    </div>
                  )}
                  {msg.role === "user" && (
                    <div style={{ ...s.msgGroup, alignItems: "flex-end" }}>
                      <div style={{ ...s.msgLabel, textAlign: "right" }}>👤 Tum</div>
                      <div style={s.msgUser}>{msg.text}</div>
                    </div>
                  )}
                  {msg.role === "feedback" && (
                    <div style={s.msgGroup}>
                      <div style={s.msgFeedback}>
                        <div style={s.feedbackLabel}>⚡ AI Feedback</div>
                        <div style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>{msg.text}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div style={s.msgGroup}>
                  <div style={s.typingDots}>
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEnd}></div>
            </div>
            <div style={s.inputRow}>
              <input
                style={s.chatInput}
                placeholder="Apna jawab yahan likho..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendAnswer()}
                disabled={loading}
              />
              <button
                style={{ ...s.sendBtn, opacity: (!input.trim() || loading) ? 0.5 : 1 }}
                onClick={sendAnswer}
                disabled={!input.trim() || loading}
              >→</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={s.resultWrap}>
            <div style={s.resultCard}>
              <div style={s.resultEmoji}>
                {score >= 70 ? "🎉" : score >= 45 ? "💪" : "📚"}
              </div>
              <h2 style={s.resultTitle}>Interview Complete!</h2>
              <div style={{ ...s.resultScore, color: getScoreColor(score) }}>
                {score}<span style={s.scoreSlash}>/100</span>
              </div>
              <div style={s.resultLabel}>
                {score >= 70 ? "Bahut Acha! Job ke liye ready lag rahe ho." :
                  score >= 45 ? "Theek Hai. Thodi aur practice karo." :
                    "Koi baat nahi. Practice se perfect hoga."}
              </div>
            </div>
            <div style={s.finalFeedback}>
              <div style={s.feedbackLabel}>📝 Overall Feedback</div>
              {messages[messages.length - 1]?.text && (
                <div style={{ fontSize: "0.88rem", lineHeight: 1.7, color: "#94a3b8" }}>
                  {messages[messages.length - 1].text}
                </div>
              )}
            </div>
            <div style={s.resultBtns}>
              <button
                style={s.btnPrimary}
                onClick={() => { setStep(1); setMessages([]); setScore(null); setQuestionNum(0); }}
              >
                Dobara Practice Karo
              </button>
              <Link href="/jobs/skill-gap">
                <button style={s.btnOutline}>Skill Gap Check Karo</button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
      `}</style>
    </main>
  );
}

const s = {
  main: { background: "#0a0a0f", color: "#e2e8f0", minHeight: "100vh", fontFamily: "sans-serif" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", borderBottom: "1px solid #1e1e2e", background: "rgba(10,10,15,0.9)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100 },
  backLink: { color: "#64748b", textDecoration: "none", fontSize: "0.85rem" },
  navTitle: { fontWeight: 700, fontSize: "0.88rem", color: "#6ee7b7" },
  container: { maxWidth: "680px", margin: "0 auto", padding: "2rem 1.5rem" },
  card: { background: "#0f0f17", border: "1px solid #1e1e2e", borderRadius: "20px", padding: "2.5rem" },
  cardIcon: { fontSize: "2.5rem", marginBottom: "1rem" },
  cardTitle: { fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "0.6rem" },
  cardSub: { color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "2rem" },
  formGroup: { marginBottom: "1.8rem" },
  label: { display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.7rem" },
  chipGrid: { display: "flex", gap: "0.5rem", flexWrap: "wrap" },
  chip: { padding: "0.5rem 1rem", background: "#13131a", border: "1px solid #1e1e2e", borderRadius: "100px", color: "#94a3b8", fontSize: "0.82rem", cursor: "pointer", transition: "all 0.15s" },
  chipActive: { background: "rgba(110,231,183,0.1)", border: "1px solid rgba(110,231,183,0.4)", color: "#6ee7b7" },
  infoBox: { display: "flex", gap: "0.6rem", alignItems: "flex-start", background: "rgba(110,231,183,0.04)", border: "1px solid rgba(110,231,183,0.1)", borderRadius: "10px", padding: "0.8rem 1rem", marginBottom: "1.5rem" },
  btnPrimary: { width: "100%", background: "#6ee7b7", color: "#0a0a0f", border: "none", padding: "0.9rem", borderRadius: "10px", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" },
  btnOutline: { background: "transparent", color: "#e2e8f0", border: "1px solid #1e1e2e", padding: "0.9rem 1.8rem", borderRadius: "10px", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" },
  chatWrap: { display: "flex", flexDirection: "column", height: "calc(100vh - 140px)" },
  progressBar: { height: "3px", background: "#1e1e2e", borderRadius: "10px", marginBottom: "1.5rem" },
  progressFill: { height: "100%", background: "linear-gradient(90deg,#6ee7b7,#818cf8)", borderRadius: "10px", transition: "width 0.5s ease" },
  chatMessages: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem", paddingBottom: "1rem" },
  msgGroup: { display: "flex", flexDirection: "column", gap: "0.3rem" },
  msgLabel: { fontSize: "0.68rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" },
  msgAI: { background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.15)", borderRadius: "4px 14px 14px 14px", padding: "0.9rem 1.1rem", fontSize: "0.88rem", lineHeight: 1.6, maxWidth: "90%", color: "#c7d2fe" },
  msgUser: { background: "rgba(110,231,183,0.06)", border: "1px solid rgba(110,231,183,0.12)", borderRadius: "14px 4px 14px 14px", padding: "0.9rem 1.1rem", fontSize: "0.88rem", lineHeight: 1.6, maxWidth: "85%", alignSelf: "flex-end" },
  msgFeedback: { background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.12)", borderRadius: "10px", padding: "1rem 1.2rem", maxWidth: "95%", color: "#fef3c7" },
  feedbackLabel: { fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#fbbf24", marginBottom: "0.4rem" },
  typingDots: { display: "flex", gap: "4px", padding: "0.8rem 1rem", background: "rgba(129,140,248,0.08)", border: "1px solid rgba(129,140,248,0.15)", borderRadius: "4px 14px 14px 14px", width: "fit-content" },
  inputRow: { display: "flex", gap: "0.8rem", paddingTop: "1rem", borderTop: "1px solid #1e1e2e" },
  chatInput: { flex: 1, padding: "0.9rem 1.1rem", background: "#13131a", border: "1px solid #1e1e2e", borderRadius: "10px", color: "#e2e8f0", fontSize: "0.9rem", outline: "none" },
  sendBtn: { background: "#6ee7b7", color: "#0a0a0f", border: "none", width: "48px", height: "48px", borderRadius: "10px", fontSize: "1.2rem", fontWeight: 700, cursor: "pointer" },
  resultWrap: { display: "flex", flexDirection: "column", gap: "1.5rem" },
  resultCard: { background: "#0f0f17", border: "1px solid #1e1e2e", borderRadius: "20px", padding: "2.5rem", textAlign: "center" },
  resultEmoji: { fontSize: "3rem", marginBottom: "0.8rem" },
  resultTitle: { fontSize: "1.6rem", fontWeight: 800, marginBottom: "0.5rem" },
  resultScore: { fontSize: "5rem", fontWeight: 800, letterSpacing: "-3px", lineHeight: 1 },
  scoreSlash: { fontSize: "1.5rem", color: "#64748b", fontWeight: 400 },
  resultLabel: { color: "#64748b", fontSize: "0.9rem", marginTop: "0.5rem" },
  finalFeedback: { background: "#0f0f17", border: "1px solid #1e1e2e", borderRadius: "14px", padding: "1.5rem" },
  resultBtns: { display: "flex", gap: "1rem", flexWrap: "wrap" },
};
