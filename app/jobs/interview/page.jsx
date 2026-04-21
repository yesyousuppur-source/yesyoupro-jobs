"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const COMPANIES = ["TCS", "Infosys", "Wipro", "HCL", "Accenture", "Startup", "Government", "Bank"];
const ROUNDS = ["HR Round", "Technical Round", "Managerial Round"];

function generateCertNumber() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "YYP-";
  for (let i = 0; i < 8; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function getTodayDate() {
  const d = new Date();
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

export default function Interview() {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [setup, setSetup] = useState({ company: "", round: "", language: "Hinglish" });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionNum, setQuestionNum] = useState(0);
  const [score, setScore] = useState(null);
  const [certNumber] = useState(generateCertNumber());
  const [certDate] = useState(getTodayDate());
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
    setMessages([{ role: "ai", text: data.question }]);
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
      body: JSON.stringify({ action: "answer", setup, answer: userMsg, questionNum, history: messages }),
    });
    const data = await res.json();
    if (data.done) {
      setMessages((prev) => [...prev, { role: "ai", text: data.feedback }]);
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

  const shareOnWhatsApp = () => {
    const grade = score >= 80 ? "Outstanding" : score >= 60 ? "Good" : "Satisfactory";
    const msg =
      `🏆 *YesYouPro Certificate of Achievement*\n\n` +
      `✅ *${userName}* ne successfully complete kiya:\n` +
      `📋 *${setup.company} — ${setup.round}*\n` +
      `⭐ Score: *${score}/100* (${grade})\n` +
      `🔖 Certificate No: ${certNumber}\n` +
      `📅 Date: ${certDate}\n\n` +
      `🇮🇳 India ka #1 AI Mock Interview Platform\n` +
      `Free mein try karo 👇\n` +
      `https://yesyoupro-jobs.vercel.app/jobs\n\n` +
      `#YesYouPro #JobReady #MockInterview`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const getScoreColor = (s) => s >= 70 ? "#16a34a" : s >= 45 ? "#d97706" : "#dc2626";
  const getGrade = (s) => s >= 90 ? "A+" : s >= 80 ? "A" : s >= 70 ? "B+" : s >= 60 ? "B" : s >= 45 ? "C" : "D";
  const getGradeLabel = (s) => s >= 80 ? "Outstanding" : s >= 60 ? "Good" : s >= 45 ? "Satisfactory" : "Needs Improvement";

  return (
    <main style={s.main}>
      <nav style={s.nav}>
        <Link href="/jobs" style={s.backLink}>← YesYouPro Jobs</Link>
        <span style={s.navTitle}>
          {step === 2 ? `${setup.company} — ${setup.round} (Q${questionNum}/8)` : "AI Mock Interview"}
        </span>
      </nav>

      <div style={s.container}>

        {step === 0 && (
          <div style={s.card}>
            <div style={s.cardIcon}>👤</div>
            <h1 style={s.cardTitle}>Pehle Apna Naam Batao</h1>
            <p style={s.cardSub}>Interview complete hone ke baad tumhare naam ka certificate banega</p>
            <div style={s.formGroup}>
              <label style={s.label}>Tumhara Poora Naam *</label>
              <input
                style={s.inputField}
                type="text"
                placeholder="Jaise: Rahul Kumar Sharma"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && userName.trim() && setStep(1)}
              />
            </div>
            <div style={s.previewBox}>
              <div style={s.previewLabel}>Certificate Preview</div>
              <div style={s.previewName}>{userName || "Tumhara Naam"}</div>
              <div style={s.previewSub}>Successfully Completed AI Mock Interview</div>
            </div>
            <button
              style={{ ...s.btnPrimary, opacity: !userName.trim() ? 0.5 : 1 }}
              onClick={() => userName.trim() && setStep(1)}
              disabled={!userName.trim()}
            >Aage Badho →</button>
          </div>
        )}

        {step === 1 && (
          <div style={s.card}>
            <div style={s.cardIcon}>🎤</div>
            <h1 style={s.cardTitle}>Mock Interview Shuru Karo</h1>
            <p style={s.cardSub}>Namaste <strong>{userName}</strong>! Company aur round choose karo.</p>
            <div style={s.formGroup}>
              <label style={s.label}>Company *</label>
              <div style={s.chipGrid}>
                {COMPANIES.map((c) => (
                  <button key={c} style={{ ...s.chip, ...(setup.company === c ? s.chipActive : {}) }}
                    onClick={() => setSetup({ ...setup, company: c })}>{c}</button>
                ))}
              </div>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Round *</label>
              <div style={s.chipGrid}>
                {ROUNDS.map((r) => (
                  <button key={r} style={{ ...s.chip, ...(setup.round === r ? s.chipActive : {}) }}
                    onClick={() => setSetup({ ...setup, round: r })}>{r}</button>
                ))}
              </div>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Language</label>
              <div style={s.chipGrid}>
                {["Hindi", "Hinglish", "English"].map((l) => (
                  <button key={l} style={{ ...s.chip, ...(setup.language === l ? s.chipActive : {}) }}
                    onClick={() => setSetup({ ...setup, language: l })}>{l}</button>
                ))}
              </div>
            </div>
            <div style={s.infoBox}>
              <span>🏆</span>
              <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                8 questions ke baad tumhara <strong>official certificate</strong> banega — WhatsApp pe share kar sakte ho!
              </span>
            </div>
            <button
              style={{ ...s.btnPrimary, opacity: (!setup.company || !setup.round) ? 0.5 : 1 }}
              onClick={startInterview}
              disabled={!setup.company || !setup.round}
            >Interview Shuru Karo →</button>
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
                      <div style={{ ...s.msgLabel, textAlign: "right" }}>👤 {userName}</div>
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
                  <div style={s.typingDots}><span></span><span></span><span></span></div>
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

        {step === 3 && score !== null && (
          <div style={s.resultWrap}>
            <div style={s.certificate}>
              <div style={s.certTopBorder}></div>
              <div style={s.certHeader}>
                <div style={s.certLogo}>YesYouPro</div>
                <div style={s.certLogoSub}>AI Interview Platform • India</div>
              </div>
              <div style={s.certDivider}></div>
              <div style={s.certTitle}>Certificate of Achievement</div>
              <div style={s.certSubtitle}>This is to certify that</div>
              <div style={s.certName}>{userName}</div>
              <div style={s.certBody}>has successfully completed the</div>
              <div style={s.certRound}>{setup.company} — {setup.round}</div>
              <div style={s.certBody}>on YesYouPro AI Interview Platform</div>
              <div style={s.certScoreWrap}>
                <div style={s.certScoreBox}>
                  <div style={s.certScoreLabel}>Score</div>
                  <div style={{ ...s.certScoreNum, color: getScoreColor(score) }}>{score}/100</div>
                </div>
                <div style={s.certScoreBox}>
                  <div style={s.certScoreLabel}>Grade</div>
                  <div style={{ ...s.certScoreNum, color: getScoreColor(score) }}>{getGrade(score)}</div>
                </div>
                <div style={s.certScoreBox}>
                  <div style={s.certScoreLabel}>Performance</div>
                  <div style={{ ...s.certPerf, color: getScoreColor(score) }}>{getGradeLabel(score)}</div>
                </div>
              </div>
              <div style={s.certDivider}></div>
              <div style={s.certFooter}>
                <div style={s.certFooterItem}>
                  <div style={s.certFooterLabel}>Certificate No.</div>
                  <div style={s.certFooterValue}>{certNumber}</div>
                </div>
                <div style={s.certSeal}>✦</div>
                <div style={s.certFooterItem}>
                  <div style={s.certFooterLabel}>Issue Date</div>
                  <div style={s.certFooterValue}>{certDate}</div>
                </div>
              </div>
              <div style={s.certBottomBorder}></div>
              <div style={s.certWatermark}>YesYouPro</div>
            </div>

            <div style={s.finalFeedback}>
              <div style={s.feedbackLabel}>📝 Overall Feedback</div>
              <div style={{ fontSize: "0.88rem", lineHeight: 1.7, color: "#94a3b8" }}>
                {messages[messages.length - 1]?.text}
              </div>
            </div>

            <button style={s.whatsappBtn} onClick={shareOnWhatsApp}>
              <span style={{ fontSize: "1.2rem" }}>📱</span>
              WhatsApp Pe Certificate Share Karo
            </button>

            <div style={s.sharePreview}>
              <div style={s.sharePreviewLabel}>📤 WhatsApp mein ye message jaayega:</div>
              <div style={s.sharePreviewText}>
                🏆 <strong>YesYouPro Certificate of Achievement</strong><br />
                ✅ <strong>{userName}</strong> ne successfully complete kiya:<br />
                📋 <strong>{setup.company} — {setup.round}</strong><br />
                ⭐ Score: <strong>{score}/100</strong> ({getGradeLabel(score)})<br />
                🔖 Certificate No: {certNumber}<br />
                📅 Date: {certDate}
              </div>
            </div>

            <div style={s.actionBtns}>
              <button style={s.btnOutline}
                onClick={() => { setStep(0); setMessages([]); setScore(null); setQuestionNum(0); setUserName(""); setSetup({ company: "", round: "", language: "Hinglish" }); }}>
                Dobara Try Karo
              </button>
              <Link href="/jobs/skill-gap">
                <button style={s.btnOutline}>Skill Gap Check Karo</button>
              </Link>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </main>
  );
}

const s = {
  main:{background:"#0a0a0f",color:"#e2e8f0",minHeight:"100vh",fontFamily:"sans-serif"},
  nav:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1rem 2rem",borderBottom:"1px solid #1e1e2e",background:"rgba(10,10,15,0.9)",backdropFilter:"blur(20px)",position:"sticky",top:0,zIndex:100},
  backLink:{color:"#64748b",textDecoration:"none",fontSize:"0.85rem"},
  navTitle:{fontWeight:700,fontSize:"0.88rem",color:"#6ee7b7"},
  container:{maxWidth:"720px",margin:"0 auto",padding:"2rem 1.5rem"},
  card:{background:"#0f0f17",border:"1px solid #1e1e2e",borderRadius:"20px",padding:"2.5rem"},
  cardIcon:{fontSize:"2.5rem",marginBottom:"1rem"},
  cardTitle:{fontSize:"1.8rem",fontWeight:800,letterSpacing:"-0.5px",marginBottom:"0.6rem"},
  cardSub:{color:"#64748b",fontSize:"0.9rem",lineHeight:1.6,marginBottom:"2rem"},
  formGroup:{marginBottom:"1.8rem"},
  label:{display:"block",fontSize:"0.82rem",fontWeight:600,color:"#94a3b8",marginBottom:"0.7rem"},
  inputField:{width:"100%",padding:"0.9rem 1.1rem",background:"#13131a",border:"1px solid #1e1e2e",borderRadius:"10px",color:"#e2e8f0",fontSize:"1rem",outline:"none",boxSizing:"border-box"},
  previewBox:{background:"linear-gradient(135deg,#1a1a2e,#16213e)",border:"1px solid rgba(110,231,183,0.2)",borderRadius:"12px",padding:"1.5rem",textAlign:"center",marginBottom:"1.5rem"},
  previewLabel:{fontSize:"0.68rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"2px",color:"#6ee7b7",marginBottom:"0.8rem"},
  previewName:{fontSize:"1.4rem",fontWeight:800,color:"#e2e8f0",marginBottom:"0.3rem",fontStyle:"italic"},
  previewSub:{fontSize:"0.75rem",color:"#64748b"},
  chipGrid:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},
  chip:{padding:"0.5rem 1rem",background:"#13131a",border:"1px solid #1e1e2e",borderRadius:"100px",color:"#94a3b8",fontSize:"0.82rem",cursor:"pointer"},
  chipActive:{background:"rgba(110,231,183,0.1)",border:"1px solid rgba(110,231,183,0.4)",color:"#6ee7b7"},
  infoBox:{display:"flex",gap:"0.6rem",alignItems:"flex-start",background:"rgba(110,231,183,0.04)",border:"1px solid rgba(110,231,183,0.1)",borderRadius:"10px",padding:"0.8rem 1rem",marginBottom:"1.5rem"},
  btnPrimary:{width:"100%",background:"#6ee7b7",color:"#0a0a0f",border:"none",padding:"0.9rem",borderRadius:"10px",fontWeight:700,fontSize:"0.95rem",cursor:"pointer"},
  btnOutline:{background:"transparent",color:"#e2e8f0",border:"1px solid #1e1e2e",padding:"0.85rem 1.5rem",borderRadius:"10px",fontWeight:600,fontSize:"0.88rem",cursor:"pointer"},
  chatWrap:{display:"flex",flexDirection:"column",height:"calc(100vh - 140px)"},
  progressBar:{height:"3px",background:"#1e1e2e",borderRadius:"10px",marginBottom:"1.5rem"},
  progressFill:{height:"100%",background:"linear-gradient(90deg,#6ee7b7,#818cf8)",borderRadius:"10px",transition:"width 0.5s ease"},
  chatMessages:{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:"1rem",paddingBottom:"1rem"},
  msgGroup:{display:"flex",flexDirection:"column",gap:"0.3rem"},
  msgLabel:{fontSize:"0.68rem",color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"},
  msgAI:{background:"rgba(129,140,248,0.08)",border:"1px solid rgba(129,140,248,0.15)",borderRadius:"4px 14px 14px 14px",padding:"0.9rem 1.1rem",fontSize:"0.88rem",lineHeight:1.6,maxWidth:"90%",color:"#c7d2fe"},
  msgUser:{background:"rgba(110,231,183,0.06)",border:"1px solid rgba(110,231,183,0.12)",borderRadius:"14px 4px 14px 14px",padding:"0.9rem 1.1rem",fontSize:"0.88rem",lineHeight:1.6,maxWidth:"85%",alignSelf:"flex-end"},
  msgFeedback:{background:"rgba(251,191,36,0.05)",border:"1px solid rgba(251,191,36,0.12)",borderRadius:"10px",padding:"1rem 1.2rem",maxWidth:"95%",color:"#fef3c7"},
  feedbackLabel:{fontSize:"0.68rem",fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",color:"#fbbf24",marginBottom:"0.4rem"},
  typingDots:{display:"flex",gap:"4px",padding:"0.8rem 1rem",background:"rgba(129,140,248,0.08)",border:"1px solid rgba(129,140,248,0.15)",borderRadius:"4px 14px 14px 14px",width:"fit-content"},
  inputRow:{display:"flex",gap:"0.8rem",paddingTop:"1rem",borderTop:"1px solid #1e1e2e"},
  chatInput:{flex:1,padding:"0.9rem 1.1rem",background:"#13131a",border:"1px solid #1e1e2e",borderRadius:"10px",color:"#e2e8f0",fontSize:"0.9rem",outline:"none"},
  sendBtn:{background:"#6ee7b7",color:"#0a0a0f",border:"none",width:"48px",height:"48px",borderRadius:"10px",fontSize:"1.2rem",fontWeight:700,cursor:"pointer"},
  resultWrap:{display:"flex",flexDirection:"column",gap:"1.5rem",animation:"fadeIn 0.5s ease"},
  certificate:{background:"linear-gradient(145deg,#fefefe 0%,#f8f6f0 50%,#fefefe 100%)",border:"3px solid #1a1a2e",borderRadius:"16px",padding:"2.5rem 2rem",position:"relative",overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.5)",color:"#1a1a2e"},
  certTopBorder:{position:"absolute",top:0,left:0,right:0,height:"6px",background:"linear-gradient(90deg,#6ee7b7,#818cf8,#f472b6,#6ee7b7)"},
  certBottomBorder:{position:"absolute",bottom:0,left:0,right:0,height:"6px",background:"linear-gradient(90deg,#6ee7b7,#818cf8,#f472b6,#6ee7b7)"},
  certWatermark:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%) rotate(-30deg)",fontSize:"5rem",fontWeight:900,color:"rgba(110,231,183,0.06)",pointerEvents:"none",whiteSpace:"nowrap"},
  certHeader:{textAlign:"center",marginBottom:"0.5rem"},
  certLogo:{fontSize:"1.6rem",fontWeight:900,letterSpacing:"-1px",background:"linear-gradient(135deg,#0a0a0f,#1a1a2e)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},
  certLogoSub:{fontSize:"0.7rem",color:"#64748b",letterSpacing:"2px",textTransform:"uppercase"},
  certDivider:{height:"2px",margin:"1rem 0",background:"linear-gradient(90deg,transparent,#6ee7b7,#818cf8,transparent)"},
  certTitle:{textAlign:"center",fontSize:"1.4rem",fontWeight:800,letterSpacing:"1px",textTransform:"uppercase",color:"#1a1a2e",marginBottom:"0.3rem"},
  certSubtitle:{textAlign:"center",fontSize:"0.82rem",color:"#64748b",marginBottom:"0.8rem"},
  certName:{textAlign:"center",fontSize:"2rem",fontWeight:800,fontStyle:"italic",color:"#0a0a0f",letterSpacing:"-0.5px",borderBottom:"2px solid rgba(110,231,183,0.5)",paddingBottom:"0.5rem",marginBottom:"0.8rem"},
  certBody:{textAlign:"center",fontSize:"0.82rem",color:"#475569",marginBottom:"0.3rem"},
  certRound:{textAlign:"center",fontSize:"1.1rem",fontWeight:700,color:"#1a1a2e",marginBottom:"0.3rem"},
  certScoreWrap:{display:"flex",justifyContent:"center",gap:"1.5rem",margin:"1.2rem 0",flexWrap:"wrap"},
  certScoreBox:{background:"rgba(26,26,46,0.05)",border:"1px solid rgba(26,26,46,0.1)",borderRadius:"12px",padding:"0.8rem 1.2rem",textAlign:"center",minWidth:"80px"},
  certScoreLabel:{fontSize:"0.65rem",color:"#64748b",fontWeight:600,textTransform:"uppercase",letterSpacing:"1px",marginBottom:"0.3rem"},
  certScoreNum:{fontSize:"1.6rem",fontWeight:900,letterSpacing:"-1px"},
  certPerf:{fontSize:"0.8rem",fontWeight:700,marginTop:"0.2rem"},
  certFooter:{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"0.5rem"},
  certFooterItem:{textAlign:"center"},
  certFooterLabel:{fontSize:"0.6rem",color:"#94a3b8",textTransform:"uppercase",letterSpacing:"1px"},
  certFooterValue:{fontSize:"0.75rem",fontWeight:700,color:"#1a1a2e",fontFamily:"monospace"},
  certSeal:{fontSize:"2rem",color:"#6ee7b7"},
  whatsappBtn:{width:"100%",background:"linear-gradient(135deg,#25d366,#128c7e)",color:"#fff",border:"none",padding:"1rem 1.5rem",borderRadius:"10px",fontWeight:700,fontSize:"1rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.6rem",boxShadow:"0 4px 15px rgba(37,211,102,0.3)"},
  finalFeedback:{background:"#0f0f17",border:"1px solid #1e1e2e",borderRadius:"14px",padding:"1.5rem"},
  sharePreview:{background:"#0f0f17",border:"1px solid rgba(37,211,102,0.2)",borderRadius:"14px",padding:"1.5rem"},
  sharePreviewLabel:{fontSize:"0.72rem",fontWeight:700,color:"#25d366",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"0.8rem"},
  sharePreviewText:{fontSize:"0.82rem",lineHeight:1.8,color:"#94a3b8"},
  actionBtns:{display:"flex",gap:"0.8rem",flexWrap:"wrap"},
};
