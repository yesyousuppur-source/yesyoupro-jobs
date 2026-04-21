import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { action, exam, subject, question, answer } = await req.json();

    if (action === "generate") {
      const prompt = `
You are an expert coach for Indian government job exams.
Generate exactly 10 multiple choice questions for:
Exam: ${exam}
Subject: ${subject}

Rules:
- Questions must be from actual ${exam} exam pattern
- Each question must have exactly 4 options
- Questions should be mix of easy, medium and hard
- Based on real previous year questions style
- In Hindi or English as appropriate for the subject

Respond ONLY in this exact JSON (no markdown, no extra text):
{
  "questions": [
    {
      "question": "<question text>",
      "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
      "correct": <0-3 index of correct option>
    }
  ]
}
`;
      const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const raw = res.choices[0].message.content.trim();
      const clean = raw.replace(/```json|```/g, "").trim();
      const data = JSON.parse(clean);
      return NextResponse.json(data);
    }

    if (action === "explain") {
      const prompt = `
You are an expert coach for Indian government exams.
Question: ${question}
Correct Answer: ${answer}
Exam: ${exam}

Give a clear, simple explanation in Hinglish (mix of Hindi and English) in 2-3 sentences.
- Why this answer is correct
- Any important fact or trick to remember
- Keep it short and easy to understand

Just give the explanation text, no formatting.
`;
      const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.6,
      });

      return NextResponse.json({ explanation: res.choices[0].message.content.trim() });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Govt prep error:", error);
    return NextResponse.json({ error: "Kuch gadbad ho gayi." }, { status: 500 });
  }
}
