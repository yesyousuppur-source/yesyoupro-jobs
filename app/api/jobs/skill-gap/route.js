import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { role, company, skills } = await req.json();

    const prompt = `
You are a career expert for Indian job market. Analyze this fresher's skills for the given role.

Target Role: ${role}
Target Company: ${company || "General"}
Current Skills: ${skills}

Respond ONLY in this exact JSON format (no extra text, no markdown):
{
  "score": <number 0-100>,
  "strong": [
    { "name": "<skill name>", "note": "<why it's strong>" }
  ],
  "missing": [
    { "name": "<skill name>", "note": "<why needed>", "resource": "<free learning URL like youtube/coursera>" }
  ],
  "improve": [
    { "name": "<skill name>", "note": "<what to improve>" }
  ],
  "timeline": "<realistic time estimate like '3-4 hafte mein ready ho sakte ho'>",
  "advice": "<2-3 sentences of honest career advice in Hinglish>"
}

Rules:
- Be honest, not just positive
- Give real free resource URLs (YouTube, freeCodeCamp, etc.)
- Timeline should be realistic
- Advice in Hinglish (mix of Hindi and English)
- Score should reflect actual market readiness
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const raw = completion.choices[0].message.content.trim();
    const clean = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Skill gap error:", error);
    return NextResponse.json({ error: "Analysis fail ho gayi. Dobara try karo." }, { status: 500 });
  }
}
