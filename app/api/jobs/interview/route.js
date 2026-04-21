import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { action, setup, answer, questionNum, history } = await req.json();

    if (action === "start") {
      const prompt = `
You are a strict but fair interviewer at ${setup.company} conducting a ${setup.round}.
You are interviewing an Indian fresher (recent graduate).
Language: ${setup.language} (if Hinglish, mix Hindi and English naturally)

Ask the FIRST interview question only. No introduction needed.
Make it appropriate for ${setup.round} at ${setup.company}.
Ask only ONE question. Keep it under 2 sentences.
`;
      const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.8,
      });
      return NextResponse.json({ question: res.choices[0].message.content.trim() });
    }

    if (action === "answer") {
      const isLast = questionNum >= 8;

      const prompt = `
You are interviewing an Indian fresher at ${setup.company} for ${setup.round}.
Language: ${setup.language}

Question ${questionNum}: [The question you just asked]
Candidate's Answer: "${answer}"

${isLast ? `
This was the LAST question (8/8).
Give a detailed overall feedback summary (3-4 sentences) and a final score out of 100.
Respond in JSON: { "done": true, "feedback": "<overall feedback>", "score": <number> }
` : `
Give brief feedback on this answer (2-3 sentences) — what was good, what was missing.
Then ask the next question (Question ${questionNum + 1} of 8).
Be specific and honest. Language: ${setup.language}

Respond in JSON: {
  "done": false,
  "feedback": "<feedback on this answer>",
  "nextQuestion": "<next interview question>"
}
`}

Rules:
- Feedback must be honest and specific, not generic
- In Hinglish if language is Hinglish
- No markdown, just JSON
`;

      const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 0.7,
      });

      const raw = res.choices[0].message.content.trim();
      const clean = raw.replace(/```json|```/g, "").trim();
      const result = JSON.parse(clean);

      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Interview API error:", error);
    return NextResponse.json({ error: "Kuch gadbad ho gayi." }, { status: 500 });
  }
}
