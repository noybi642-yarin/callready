import { NextRequest, NextResponse } from "next/server";
// import Anthropic from "@anthropic-ai/sdk"; // npm install @anthropic-ai/sdk

// ============================================================
// POST /api/generate-brief
//
// כרגע: מחזיר שגיאה כי ANTHROPIC_API_KEY לא מוגדר
// TODO:
//   1. npm install @anthropic-ai/sdk
//   2. הגדר ANTHROPIC_API_KEY ב-.env.local
//   3. בטל את ה-comment מהקוד למטה
// ============================================================

export async function POST(req: NextRequest) {
  const { candidate, company, role, jd } = await req.json();

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY לא מוגדר. הוסף אותו ל-.env.local" },
      { status: 500 }
    );
  }

  // ---- הסר את ה-comment כשמוכן ----
  //
  // const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  //
  // const prompt = `
  // אתה מאמן קריירה ישראלי מנוסה. צור בריף שיחה מותאם אישית.
  //
  // פרופיל מועמד:
  // ${JSON.stringify(candidate, null, 2)}
  //
  // חברה: ${company}
  // תפקיד: ${role}
  // תיאור משרה: ${jd || "לא סופק"}
  //
  // החזר JSON בדיוק לפי הסכמה של CallBrief.
  // השתמש בעברית דוגרית, מקצועית, בסגנון ישראלי אמיתי.
  // `;
  //
  // const message = await client.messages.create({
  //   model: "claude-sonnet-4-20250514",
  //   max_tokens: 4096,
  //   messages: [{ role: "user", content: prompt }],
  // });
  //
  // const text = message.content[0].type === "text" ? message.content[0].text : "";
  // const brief = JSON.parse(text);
  // return NextResponse.json(brief);
  // ---- סוף הקוד האמיתי ----

  return NextResponse.json({ error: "API לא מחובר עדיין" }, { status: 501 });
}
