export const metadata = {
  title: "YesYouPro Jobs — AI Mock Interview & Skill Gap Analyzer",
  description: "India ka pehla AI-powered job preparation platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#0a0a0f" }}>
        {children}
      </body>
    </html>
  );
}
