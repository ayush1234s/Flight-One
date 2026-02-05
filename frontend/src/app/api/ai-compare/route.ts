import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { flights } = await req.json();

    const prompt = `
You are a flight comparison expert.

Compare these flights and return the BEST 4 based on:
- Lowest price
- Shortest duration
- Higher rating
- Better on-time performance

Flights JSON:
${JSON.stringify(flights, null, 2)}

Return ONLY valid JSON array (no markdown, no text, no explanation):
[
  {
    "airline": "",
    "price": 0,
    "duration": 0,
    "rating": 0,
    "onTime": 0,
    "site": "",
    "reason": ""
  }
]
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "Return ONLY valid JSON. No markdown." },
        { role: "user", content: prompt },
      ],
      temperature: 0,
    });

    const raw = completion.choices[0]?.message?.content;

    if (!raw) {
      return NextResponse.json({ error: "Empty AI response" }, { status: 500 });
    }

    // Try parsing on server itself
    const parsed = JSON.parse(raw);

    return NextResponse.json({ result: parsed });
  } catch (e: any) {
    console.error("AI Compare Error:", e);
    return NextResponse.json(
      { error: "AI comparison failed", details: String(e) },
      { status: 500 }
    );
  }
}
