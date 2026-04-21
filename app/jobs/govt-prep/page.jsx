"use client";
import { useState } from "react";
import Link from "next/link";

const EXAMS = [
  { id: "ssc_cgl", name: "SSC CGL", icon: "🏛️", desc: "Combined Graduate Level" },
  { id: "ssc_chsl", name: "SSC CHSL", icon: "📋", desc: "Combined Higher Secondary" },
  { id: "railway_ntpc", name: "Railway NTPC", icon: "🚂", desc: "Non-Technical Popular Categories" },
  { id: "railway_group_d", name: "Railway Group D", icon: "🔧", desc: "Level 1 Posts" },
  { id: "bank_po", name: "Bank PO", icon: "🏦", desc: "Probationary Officer" },
  { id: "bank_clerk", name: "Bank Clerk", icon: "💼", desc: "IBPS Clerk" },
  { id: "upsc", name: "UPSC", icon: "⭐", desc: "Civil Services Prelims" },
  { id: "state_psc", name: "State PSC", icon: "🗺️", desc: "State Civil Services" },
];

const SUBJECTS = {
  ssc_cgl: ["General Intelligence", "General Awareness", "Quantitative Aptitude", "English Language"],
  ssc_chsl: ["General Intelligence", "General Awareness", "Quantitative Aptitude", "English Language"],
  railway_ntpc: ["Mathematics", "General Awareness", "General Intelligence", "Reasoning"],
  railway_group_d: ["Mathematics", "General Science", "General Awareness", "Reasoning"],
  bank_po: ["Quantitative Aptitude", "Reasoning", "English Language", "General Awareness", "Computer Knowledge"],
  bank_clerk: ["Quantitative Aptitude", "Reasoning", "English Language", "General Awareness"],
  upsc: ["History", "Geography", "Polity", "Economy", "Science & Technology", "Environment"],
  state_psc: ["General Studies", "History", "Geography", "Polity", "Economy"],
};

export default function GovtPrep() {
  const [step, setStep] = useState(1);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [explanation, setExplanation] = useState("");
  const [loadingQ, setLoadingQ] = useState(false);
  const [loadingExpl, setLoadingExpl] = useState(false);
  const [score, setScore] = useState(null);

  const startQuiz = async () => {
    if (!selectedExam || !selectedSubject) return;
    setLoadingQ(true);
    setStep(3);
    const res = await fetch("/api/jobs/govt-prep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate", exam: selectedExam.name, subject: selectedSubject }),
    });
    const data = await res.json();
    setQuestions(data.questions || []);
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setExplanation("");
    setLoadingQ(false);
  };

  const handleAnswer = async (optionIndex) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    const q = questions[current];
    const isCorrect = optionIndex === q.correct;
    setAnswers((prev) => [...prev, { questionIndex: current, selected: optionIndex, correct: q.correct, isCorrect }]);
    setLoadingExpl(true);
    const res = await fetch("/api/jobs/govt-prep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "explain", question: q.question, answer: q.options[q.correct], exam: selectedExam.name }),
    });
    const data = await res.json();
    setExplanation(data.explanation || "");
    setLoadingExpl(false);
  };

  const nextQuestion = () => {
    if (current + 1 >= questions.length) {
      const correct = answers.filter((a) => a.isCorrect).length;
      setScore(Math.round((correct / questions.length) * 100));
      setStep(4);
    } else {
      setCurrent((n) => n + 1);
      setSelected(null);
      setExplanation("");
    }
  };

  const getOptionStyle = (index) => {
    if (selected === null) return s.option;
    if (index === questions[current]?.correct) return { ...s.option, ...s.optionCorrect };
    if (index === selected && selected !== questions[current]?.correct) return { ...s.option, ...s.optionWrong };
    return { ...s.option, ...s.optionDim };
  };

  const correctCount = answers.filter((a) => a.isCorrect).length;

  return (
    <main style={s.main}>
      <nav style={s.nav}>
        <Link href="/jobs" style={s.backLink}>← YesYouPro Jobs</Link>
        <span style={s.navTitle}>🏛️ Government Job Prep</span>
      </nav>

      <div style={s.container}>

        {step === 1 && (
          <div>
            <div style={s.pageHeader}>
              <div style={s.pageIcon}>🏛️</div>
              <h1 style={s.pageTitle}>Government Job Prep</h1>
              <p style={s.pageSub}>Apna exam choose karo — AI tumhare level ke questions generate karega</p>
            </div>
            <div style={s.examGrid}>
              {EXAMS.map((exam) => (
                <div
                  key={exam.id}
                  style={{ ...s.examCard, ...(selectedExam?.id === exam.id ? s.examCardActive : {}) }}
                  onClick={() => setSelectedExam(exam)}
                >
                  <div style={s.examIcon}>{exam.icon}</div>
                  <div style={s.examName}>{exam.name}</div>
                  <div style={s.examDesc}>{exam.desc}</div>
                  {selectedExam?.id === exam.id && <div style={s.examCheck}>✓</div>}
                </div>
              ))}
            </div>
            <button
              style={{ ...s.btnPrimary, opacity: !selectedExam ? 0.5 : 1, marginTop: "1.5rem" }}
              onClick={() => selectedExam && setStep(2)}
              disabled={!selectedExam}
            >
              Aage Badho →
            </button>
          </div>
        )}

        {step === 2 && selectedExam && (
          <div style={s.card}>
            <div style={s.cardIcon}>{selectedExam.icon}</div>
            <h2 style={s.cardTitle}>{selectedExam.name}</h2>
            <p style={s.cardSub}>Kaunsa subject practice karna hai?</p>
            <div style={s.subjectGrid}>
              {SUBJECTS[selectedExam.id]?.map((sub) => (
                <button
                  key={sub}
                  style={{ ...s.subjectBtn, ...(selectedSubject === sub ? s.subjectBtnActive : {}) }}
                  onClick={() => setSelectedSubject(sub)}
                >
                  {sub}
                </button>
              ))}
            </div>
            <div style={s.infoBox}>
              <span>📝</span>
              <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                10 questions honge. Har jawab ke baad AI explanation milega. Bilkul free!
              </span>
            </div>
            <div style={{ display: "flex", gap: "0.8rem" }}>
              <button style={s.btnOutline} onClick={() => setStep(1)}>← Wapas</button>
              <button
                style={{ ...s.btnPrimary, flex: 1, opacity: !selectedSubject ? 0.5 : 1 }}
                onClick={startQuiz}
                disabled={!selectedSubject}
              >
                Practice Shuru Karo →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            {loadingQ ? (
              <div style={{ ...s.card, textAlign: "center" }}>
                <h2 style={s.cardTitle}>Questions Generate Ho Rahe Hain...</h2>
                <p style={s.cardSub}>{selectedExam?.name} — {selectedSubject} ke liye AI questions bana raha hai</p>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}} .sp{width:48px;height:48px;border:3px solid #1e1e2e;border-top-color:#6ee7b7;border-radius:50%;animation:spin 0.8s linear infinite;margin:1.5rem auto}`}</style>
                <div className="sp"></div>
              </div>
            ) : questions.length > 0 && (
              <div>
                <div style={s.quizHeader}>
                  <div style={s.quizMeta}>
                    <span style={s.quizExam}>{selectedExam?.name} — {selectedSubject}</span>
                    <span style={s.quizCount}>Q{current + 1}/{questions.length}</span>
                  </div>
                  <div style={s.progressBar}>
                    <div style={{ ...s.progressFill, width: `${(current / questions.length) * 100}%` }}></div>
                  </div>
                  <div style={s.scoreTrack}>
                    <span style={{ color: "#6ee7b7" }}>✓ {correctCount} Correct</span>
                    <span style={{ color: "#f472b6" }}>✗ {answers.length - correctCount} Wrong</span>
                  </div>
                </div>

                <div style={s.questionCard}>
                  <div style={s.questionNum}>Question {current + 1}</div>
                  <div style={s.questionText}>{questions[current]?.question}</div>
                  <div style={s.optionsGrid}>
                    {questions[current]?.options?.map((opt, i) => (
                      <button key={i} style={getOptionStyle(i)} onClick={() => handleAnswer(i)}>
                        <span style={s.optionLetter}>{String.fromCharCode(65 + i)}</span>
                        <span style={s.optionText}>{opt}</span>
                        {selected !== null && i === questions[current]?.correct && <span style={s.optionIcon}>✓</span>}
                        {selected === i && i !== questions[current]?.correct && <span style={s.optionIcon}>✗</span>}
                      </button>
                    ))}
                  </div>

                  {selected !== null && (
                    <div style={selected === questions[current]?.correct ? s.correctBanner : s.wrongBanner}>
                      {selected === questions[current]?.correct ? "🎉 Sahi Jawab!" : "❌ Galat Jawab"}
                    </div>
                  )}

                  {selected !== null && (
                    <div style={s.explanationBox}>
                      <div style={s.explanationLabel}>💡 Explanation</div>
                      {loadingExpl ? (
                        <div style={{ color: "#64748b", fontSize: "0.85rem" }}>AI explanation likh raha hai...</div>
                      ) : (
                        <div style={s.explanationText}>{explanation}</div>
                      )}
                    </div>
                  )}

                  {selected !== null && !loadingExpl && (
                    <button style={{ ...s.btnPrimary, marginTop: "1rem" }} onClick={nextQuestion}>
                      {current + 1 >= questions.length ? "Result Dekho →" : "Agla Question →"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div style={s.resultWrap}>
            <div style={s.resultCard}>
              <div style={s.resultEmoji}>
                {score >= 70 ? "🏆" : score >= 50 ? "💪" : "📚"}
              </div>
              <h2 style={s.resultTitle}>Practice Complete!</h2>
              <div style={s.resultExam}>{selectedExam?.name} — {selectedSubject}</div>
              <div style={{ ...s.resultScore, color: score >= 70 ? "#6ee7b7" : score >= 50 ? "#fbbf24" : "#f472b6" }}>
                {score}<span style={s.scoreSlash}>%</span>
              </div>
              <div style={s.resultStats}>
                <div style={s.resultStat}>
                  <span style={{ color: "#6ee7b7", fontWeight: 700, fontSize: "1.2rem" }}>{correctCount}</span>
                  <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Correct</span>
                </div>
                <div style={s.resultStat}>
                  <span style={{ color: "#f472b6", fontWeight: 700, fontSize: "1.2rem" }}>{questions.length - correctCount}</span>
                  <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Wrong</span>
                </div>
                <div style={s.resultStat}>
                  <span style={{ color: "#818cf8", fontWeight: 700, fontSize: "1.2rem" }}>{questions.length}</span>
                  <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Total</span>
                </div>
              </div>
              <div style={s.resultMsg}>
                {score >= 70 ? "Bahut acha! Is pace pe practice karte raho." :
                  score >= 50 ? "Theek hai. Thodi aur practice karo." :
                    "Koi baat nahi. Roz practice karo — zaroor improve hoga!"}
              </div>
            </div>
            <div style={s.actionBtns}>
              <button style={s.btnPrimary} onClick={() => { setStep(2); setSelected(null); setAnswers([]); setExplanation(""); setScore(null); setSelectedSubject(""); }}>
                Dobara Practice Karo
              </button>
              <button style={s.btnOutline} onClick={() => { setStep(1); setSelectedExam(null); setSelectedSubject(""); setSelected(null); setAnswers([]); setScore(null); }}>
                Alag Exam Choose Karo
              </button>
              <Link href="/jobs/interview">
                <button style={s.btnOutline}>Mock Interview Do</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

const s = {
  main:{background:"#0a0a0f",color:"#e2e8f0",minHeight:"100vh",fontFamily:"sans-serif"},
  nav:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1rem 2rem",borderBottom:"1px solid #1e1e2e",background:"rgba(10,10,15,0.9)",backdropFilter:"blur(20px)",position:"sticky",top:0,zIndex:100},
  backLink:{color:"#64748b",textDecoration:"none",fontSize:"0.85rem"},
  navTitle:{fontWeight:700,fontSize:"0.88rem",color:"#6ee7b7"},
  container:{maxWidth:"720px",margin:"0 auto",padding:"2rem 1.5rem"},
  pageHeader:{textAlign:"center",marginBottom:"2rem"},
  pageIcon:{fontSize:"3rem",marginBottom:"0.8rem"},
  pageTitle:{fontSize:"2rem",fontWeight:800,letterSpacing:"-1px",marginBottom:"0.5rem"},
  pageSub:{color:"#64748b",fontSize:"0.9rem"},
  examGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:"1rem"},
  examCard:{background:"#0f0f17",border:"1px solid #1e1e2e",borderRadius:"14px",padding:"1.2rem",cursor:"pointer",position:"relative",textAlign:"center"},
  examCardActive:{border:"1px solid rgba(110,231,183,0.5)",background:"rgba(110,231,183,0.05)"},
  examIcon:{fontSize:"2rem",marginBottom:"0.5rem"},
  examName:{fontWeight:700,fontSize:"0.95rem",marginBottom:"0.3rem"},
  examDesc:{fontSize:"0.72rem",color:"#64748b"},
  examCheck:{position:"absolute",top:"0.5rem",right:"0.8rem",color:"#6ee7b7",fontWeight:700},
  card:{background:"#0f0f17",border:"1px solid #1e1e2e",borderRadius:"20px",padding:"2.5rem"},
  cardIcon:{fontSize:"2.5rem",marginBottom:"1rem"},
  cardTitle:{fontSize:"1.6rem",fontWeight:800,letterSpacing:"-0.5px",marginBottom:"0.5rem"},
  cardSub:{color:"#64748b",fontSize:"0.9rem",lineHeight:1.6,marginBottom:"1.5rem"},
  subjectGrid:{display:"flex",flexWrap:"wrap",gap:"0.6rem",marginBottom:"1.5rem"},
  subjectBtn:{padding:"0.6rem 1.1rem",background:"#13131a",border:"1px solid #1e1e2e",borderRadius:"100px",color:"#94a3b8",fontSize:"0.82rem",cursor:"pointer"},
  subjectBtnActive:{background:"rgba(110,231,183,0.1)",border:"1px solid rgba(110,231,183,0.4)",color:"#6ee7b7"},
  infoBox:{display:"flex",gap:"0.6rem",alignItems:"flex-start",background:"rgba(110,231,183,0.04)",border:"1px solid rgba(110,231,183,0.1)",borderRadius:"10px",padding:"0.8rem 1rem",marginBottom:"1.5rem"},
  btnPrimary:{width:"100%",background:"#6ee7b7",color:"#0a0a0f",border:"none",padding:"0.9rem",borderRadius:"10px",fontWeight:700,fontSize:"0.95rem",cursor:"pointer"},
  btnOutline:{background:"transparent",color:"#e2e8f0",border:"1px solid #1e1e2e",padding:"0.85rem 1.5rem",borderRadius:"10px",fontWeight:600,fontSize:"0.88rem",cursor:"pointer"},
  quizHeader:{marginBottom:"1.5rem"},
  quizMeta:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.5rem"},
  quizExam:{fontSize:"0.78rem",color:"#6ee7b7",fontWeight:600},
  quizCount:{fontSize:"0.78rem",color:"#64748b",fontWeight:600},
  progressBar:{height:"4px",background:"#1e1e2e",borderRadius:"10px",marginBottom:"0.5rem"},
  progressFill:{height:"100%",background:"linear-gradient(90deg,#6ee7b7,#818cf8)",borderRadius:"10px",transition:"width 0.4s ease"},
  scoreTrack:{display:"flex",gap:"1rem",fontSize:"0.78rem",fontWeight:600},
  questionCard:{background:"#0f0f17",border:"1px solid #1e1e2e",borderRadius:"20px",padding:"2rem"},
  questionNum:{fontSize:"0.72rem",fontWeight:700,color:"#6ee7b7",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"0.8rem"},
  questionText:{fontSize:"1rem",fontWeight:600,lineHeight:1.6,marginBottom:"1.5rem",color:"#e2e8f0"},
  optionsGrid:{display:"flex",flexDirection:"column",gap:"0.6rem",marginBottom:"1rem"},
  option:{display:"flex",alignItems:"center",gap:"0.8rem",padding:"0.9rem 1rem",background:"#13131a",border:"1px solid #1e1e2e",borderRadius:"10px",cursor:"pointer",textAlign:"left",width:"100%"},
  optionCorrect:{background:"rgba(110,231,183,0.08)",border:"1px solid rgba(110,231,183,0.4)"},
  optionWrong:{background:"rgba(244,114,182,0.08)",border:"1px solid rgba(244,114,182,0.4)"},
  optionDim:{opacity:0.4},
  optionLetter:{width:"24px",height:"24px",background:"#1e1e2e",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.72rem",fontWeight:700,flexShrink:0},
  optionText:{fontSize:"0.88rem",flex:1,color:"#e2e8f0"},
  optionIcon:{fontSize:"1rem",flexShrink:0},
  correctBanner:{background:"rgba(110,231,183,0.1)",border:"1px solid rgba(110,231,183,0.3)",borderRadius:"10px",padding:"0.7rem 1rem",fontSize:"0.9rem",fontWeight:700,color:"#6ee7b7",textAlign:"center"},
  wrongBanner:{background:"rgba(244,114,182,0.08)",border:"1px solid rgba(244,114,182,0.3)",borderRadius:"10px",padding:"0.7rem 1rem",fontSize:"0.9rem",fontWeight:700,color:"#f472b6",textAlign:"center"},
  explanationBox:{background:"#13131a",border:"1px solid #1e1e2e",borderRadius:"10px",padding:"1rem",marginTop:"1rem"},
  explanationLabel:{fontSize:"0.72rem",fontWeight:700,color:"#fbbf24",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"0.5rem"},
  explanationText:{fontSize:"0.85rem",color:"#94a3b8",lineHeight:1.7},
  resultWrap:{display:"flex",flexDirection:"column",gap:"1.5rem"},
  resultCard:{background:"#0f0f17",border:"1px solid #1e1e2e",borderRadius:"20px",padding:"2.5rem",textAlign:"center"},
  resultEmoji:{fontSize:"3rem",marginBottom:"0.8rem"},
  resultTitle:{fontSize:"1.6rem",fontWeight:800,marginBottom:"0.3rem"},
  resultExam:{fontSize:"0.82rem",color:"#64748b",marginBottom:"1rem"},
  resultScore:{fontSize:"5rem",fontWeight:800,letterSpacing:"-3px",lineHeight:1},
  scoreSlash:{fontSize:"1.5rem",color:"#64748b",fontWeight:400},
  resultStats:{display:"flex",gap:"2rem",justifyContent:"center",margin:"1.2rem 0"},
  resultStat:{display:"flex",flexDirection:"column",alignItems:"center",gap:"0.2rem"},
  resultMsg:{fontSize:"0.88rem",color:"#64748b",lineHeight:1.6},
  actionBtns:{display:"flex",flexDirection:"column",gap:"0.8rem"},
};
