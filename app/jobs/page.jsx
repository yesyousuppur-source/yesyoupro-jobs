"use client";
import Link from "next/link";
import { useState } from "react";

export default function JobsHome() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = (e) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <main style={styles.main}>
      <nav style={styles.nav}>
        <div style={styles.logo}>
          YesYouPro <span style={styles.logoBadge}>Jobs</span>
        </div>
        <Link href="/jobs/skill-gap">
          <button style={styles.navBtn}>Free Mein Try Karo →</button>
        </Link>
      </nav>

      <section style={styles.hero}>
        <div style={styles.badge}>🇮🇳 India Ka Job Prep Platform</div>
        <h1 style={styles.h1}>
          Interview Mein{" "}
          <span style={styles.highlight}>Confident Bano.</span>
        </h1>
        <p style={styles.heroSub}>
          Skill gap dhundho. AI se practice karo.{" "}
          <strong>Tier 2-3 cities ke freshers ke liye — Hindi mein.</strong>
        </p>
        <div style={styles.heroBtns}>
          <Link href="/jobs/skill-gap">
            <button style={styles.btnPrimary}>Skill Gap Check Karo</button>
          </Link>
          <Link href="/jobs/interview">
            <button style={styles.btnSecondary}>Mock Interview Do →</button>
          </Link>
        </div>
        <div style={styles.stats}>
          {[
            { num: "1.5Cr+", label: "Indian Freshers Har Saal" },
            { num: "80%", label: "Tier 2-3 Cities Se" },
            { num: "₹0", label: "Shuru Karne Ki Cost" },
          ].map((s) => (
            <div key={s.num} style={styles.stat}>
              <div style={styles.statNum}>{s.num}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionTag}>Features</div>
        <h2 style={styles.sectionTitle}>2 Tools Jo Job Dilaayenge</h2>
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🔍</div>
            <h3 style={styles.featureTitle}>Skill Gap Analyzer</h3>
            <p style={styles.featureDesc}>
              Job role daal do — AI batayega exactly kaunse skills miss hain,
              kitna time lagega, aur kahan se seekho.
            </p>
            <ul style={styles.featureList}>
              {["Role-specific skill checklist","Job readiness score 0-100","Free learning resources","Timeline estimate"].map((f) => (
                <li key={f} style={styles.featureLi}>✓ {f}</li>
              ))}
            </ul>
            <Link href="/jobs/skill-gap">
              <button style={styles.btnPrimary}>Try Karo →</button>
            </Link>
          </div>

          <div style={{ ...styles.featureCard, ...styles.featureCardAlt }}>
            <div style={styles.featureIcon}>🎤</div>
            <h3 style={styles.featureTitle}>AI Mock Interview</h3>
            <p style={styles.featureDesc}>
              Real interviewer jaisa AI — jo tere jawab sunke honest feedback
              deta hai. Hindi mein baat karo, English mein baat karo.
            </p>
            <ul style={styles.featureList}>
              {["TCS, Infosys, Wipro — company-wise","Har jawab pe detailed feedback","Progress tracker","Hindi + English dono mein"].map((f) => (
                <li key={f} style={styles.featureLi}>✓ {f}</li>
              ))}
            </ul>
            <Link href="/jobs/interview">
              <button style={{ ...styles.btnPrimary, background: "#818cf8" }}>
                Interview Do →
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section style={styles.ctaSection}>
        <div style={styles.ctaBox}>
          <h2 style={styles.ctaTitle}>Aaj Se Shuru Karo. Free Mein.</h2>
          <p style={styles.ctaSub}>Pehle access pao — bilkul free.</p>
          {submitted ? (
            <div style={styles.successMsg}>✅ Done! Launch hone pe tumhe sabse pehle batayenge.</div>
          ) : (
            <form onSubmit={handleWaitlist} style={styles.inputGroup}>
              <input
                type="email"
                placeholder="tumhara@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.emailInput}
                required
              />
              <button type="submit" style={styles.btnPrimary}>Join Waitlist →</button>
            </form>
          )}
        </div>
      </section>

      <footer style={styles.footer}>
        <p>© 2025 <strong>YesYouPro Jobs</strong> — Made for Indian Freshers ❤️</p>
      </footer>
    </main>
  );
}

const styles = {
  main: { background: "#0a0a0f", color: "#e2e8f0", minHeight: "100vh", fontFamily: "sans-serif" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.2rem 2rem", borderBottom: "1px solid #1e1e2e", position: "sticky", top: 0, background: "rgba(10,10,15,0.9)", backdropFilter: "blur(20px)", zIndex: 100 },
  logo: { fontWeight: 800, fontSize: "1.2rem", color: "#e2e8f0" },
  logoBadge: { background: "#6ee7b7", color: "#0a0a0f", padding: "0.1rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", marginLeft: "0.4rem" },
  navBtn: { background: "#6ee7b7", color: "#0a0a0f", border: "none", padding: "0.6rem 1.2rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" },
  hero: { padding: "5rem 2rem", textAlign: "center", maxWidth: "800px", margin: "0 auto" },
  badge: { display: "inline-block", background: "rgba(110,231,183,0.1)", border: "1px solid rgba(110,231,183,0.2)", color: "#6ee7b7", padding: "0.35rem 1rem", borderRadius: "100px", fontSize: "0.8rem", marginBottom: "1.5rem" },
  h1: { fontSize: "clamp(2.2rem,5vw,4rem)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.05, marginBottom: "1.2rem" },
  highlight: { background: "linear-gradient(135deg,#6ee7b7,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroSub: { fontSize: "1rem", color: "#64748b", marginBottom: "2rem", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto 2rem" },
  heroBtns: { display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" },
  stats: { display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap" },
  stat: { textAlign: "center" },
  statNum: { fontSize: "1.8rem", fontWeight: 800, background: "linear-gradient(135deg,#6ee7b7,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  statLabel: { fontSize: "0.75rem", color: "#64748b" },
  section: { padding: "4rem 2rem", maxWidth: "1100px", margin: "0 auto" },
  sectionTag: { fontSize: "0.72rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#6ee7b7", marginBottom: "0.5rem" },
  sectionTitle: { fontSize: "clamp(1.8rem,4vw,2.5rem)", fontWeight: 800, letterSpacing: "-1px", marginBottom: "2.5rem" },
  featureGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.5rem" },
  featureCard: { background: "#0f0f17", border: "1px solid #1e1e2e", borderRadius: "20px", padding: "2rem" },
  featureCardAlt: { borderColor: "rgba(129,140,248,0.3)" },
  featureIcon: { fontSize: "2rem", marginBottom: "1rem" },
  featureTitle: { fontWeight: 800, fontSize: "1.2rem", marginBottom: "0.8rem" },
  featureDesc: { color: "#64748b", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "1.2rem" },
  featureList: { listStyle: "none", padding: 0, marginBottom: "1.5rem" },
  featureLi: { fontSize: "0.83rem", color: "#6ee7b7", marginBottom: "0.4rem" },
  ctaSection: { padding: "4rem 2rem", textAlign: "center" },
  ctaBox: { background: "#0f0f17", border: "1px solid #1e1e2e", borderRadius: "24px", padding: "3.5rem 2rem", maxWidth: "560px", margin: "0 auto" },
  ctaTitle: { fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 800, letterSpacing: "-1px", marginBottom: "0.8rem" },
  ctaSub: { color: "#64748b", fontSize: "0.95rem", marginBottom: "1.8rem" },
  inputGroup: { display: "flex", gap: "0.8rem", maxWidth: "400px", margin: "0 auto", flexWrap: "wrap", justifyContent: "center" },
  emailInput: { flex: 1, minWidth: "180px", padding: "0.85rem 1.1rem", background: "#13131a", border: "1px solid #1e1e2e", borderRadius: "10px", color: "#e2e8f0", fontSize: "0.9rem", outline: "none" },
  successMsg: { color: "#6ee7b7", fontWeight: 600, fontSize: "1rem" },
  btnPrimary: { background: "#6ee7b7", color: "#0a0a0f", border: "none", padding: "0.85rem 1.8rem", borderRadius: "10px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" },
  btnSecondary: { background: "transparent", color: "#e2e8f0", border: "1px solid #1e1e2e", padding: "0.85rem 1.8rem", borderRadius: "10px", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" },
  footer: { borderTop: "1px solid #1e1e2e", padding: "1.8rem 2rem", textAlign: "center", color: "#64748b", fontSize: "0.8rem" },
};
