import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { flights, filter } = await req.json();

    if (!flights || flights.length === 0) {
      return Response.json({ top4: [] });
    }

    const prompt = `
You are a flight comparison AI.

User priority: ${filter}

Analyze the flights and return ONLY valid JSON.

Required format:
{
  "top4": [
    {
      "airline": "AI",
      "price": 5000,
      "duration": 120,
      "stops": 0,
      "rating": 4.3,
      "onTime": 92
    }
  ]
}

Flights:
${JSON.stringify(flights)}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const raw = completion.choices[0]?.message?.content;

    if (!raw) {
      return Response.json({ top4: [] });
    }

    // 🔒 SAFE PARSE
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}") + 1;

    const safeJson = raw.slice(jsonStart, jsonEnd);

    return Response.json(JSON.parse(safeJson));
  } catch (err) {
    console.error("AI ERROR:", err);
    return Response.json(
      { top4: [], error: "AI failed" },
      { status: 500 }
    );
  }
}
