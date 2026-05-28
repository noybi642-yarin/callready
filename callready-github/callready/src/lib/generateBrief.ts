import type { CandidateProfile, CallBrief } from "@/types";
import { detectIndustry, INDUSTRY_VOCAB } from "./industryVocab";

// ============================================================
// generateBrief — יצירת בריף שיחה
//
// כרגע: Mock מקומי
// TODO: להחליף את ה-return של buildBriefFromProfile
//       בקריאה ל-API route שלך:
//
//   const res = await fetch("/api/generate-brief", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ candidate, company, role, jd }),
//   });
//   return res.json();
// ============================================================

export async function generateBrief(
  candidate: CandidateProfile,
  company: string,
  role: string,
  jd = ""
): Promise<CallBrief> {
  // סימולציה של עיכוב רשת
  await new Promise((r) => setTimeout(r, 2000));
  return buildBriefFromProfile(candidate, company, role, jd);
}

function buildBriefFromProfile(
  p: CandidateProfile,
  company: string,
  role: string,
  jd: string
): CallBrief {
  const industry = detectIndustry(role, company, jd);
  const vocab = INDUSTRY_VOCAB[industry] ?? INDUSTRY_VOCAB["ניהול"];
  const [v1, v2, v3] = vocab;

  const topAchievement = p.achievements[0] ?? "תוצאה משמעותית";
  const topSkills = p.skills.slice(0, 3).join(", ");
  const lastCompany = p.experience[0]?.company ?? "המקום הנוכחי";
  const lastTitle = p.experience[0]?.title ?? p.title;
  const lastBullet = p.experience[0]?.bullets?.[0] ?? "הובלתי תהליכים end-to-end";
  const yearsLabel =
    p.experience.length >= 3
      ? `${p.experience.length * 2}+`
      : p.experience.length >= 2
      ? "5+"
      : "3+";

  return {
    industryVocab: vocab.slice(0, 8),
    industryTips: [
      { tip: v1, why: "זאת השפה שמגייסות מחפשות בתחום הזה" },
      { tip: v2, why: "מראה שאתה/את חושב/ת בצורה שלהם" },
      { tip: v3, why: "נשמע מקצועי ומוכן/ה לתפקיד" },
    ],
    openingPitch: {
      short: `${lastTitle} עם ${yearsLabel} שנות ניסיון. מוכיח/ה תוצאות — ${topAchievement}. מחפש/ת תפקיד עם ${v1} ו-${v2}, ו-${company} נשמע לי כמו המקום הנכון לשלב הבא.`,
      detailed: `אני ${p.name}, ${lastTitle} עם ${yearsLabel} שנים בתחום. ב-${lastCompany} ${lastBullet}. מה שמייחד אותי — שילוב של ${v1}, ${v2}, ו-${v3}. עכשיו מחפש/ת סביבה שבה אפשר לקחת ownership ולהוביל תהליכים end-to-end, כמו ב-${company}.`,
    },
    roleMatch: {
      headline: "התאמה גבוהה — 8/10",
      points: [
        `${yearsLabel} שנות ניסיון עם ${v1} — ממש מה שמחפשים`,
        `הישג מוכח: ${topAchievement}`,
        `כישורי ליבה: ${topSkills}`,
        `ניסיון ב-${lastCompany} — ${lastBullet}`,
      ],
    },
    companyFit: {
      headline: `למה אתה/את מתאים/ה ל-${company}`,
      points: [
        `הרקע שלך ב-${v1} ו-${v2} — בדיוק השפה של ${company}`,
        `הישג: ${topAchievement} — ממש מה שהם מחפשים`,
        `${lastTitle} ב-${lastCompany} נותן פרספקטיבה שרק כמה אנשים מביאים לשולחן`,
        `המעבר ל-${company} הוא צעד טבעי — לא לרוח, אלא לשלב הבא`,
      ],
    },
    talkingPoints: p.achievements.slice(0, 5).map((a, i) => ({
      point: a,
      context: (
        [
          "תפתח/י עם זה — פותח שיחה",
          "לשאלות על ניסיון מקצועי",
          "לשאלות על חוזקות",
          "לשאלות על ניהול ומנהיגות",
          "לסיכום — מה הבאת לשולחן",
        ] as string[]
      )[i] ?? "להשתמש לפי הקשר",
    })),
    recruiterQA: [
      {
        q: "ספר/י לי על עצמך",
        short: `${lastTitle} עם ${yearsLabel} שנות ניסיון ו-${v1}. הישג עיקרי: ${topAchievement}. מחפש/ת תפקיד עם ${v2} ב-${company}.`,
        detailed: `${p.summary} ב-${lastCompany} — ${lastBullet}. אני מביא/ה ניסיון ב-${v1}, ${v2}, ו-${v3}. עכשיו מחפש/ת את השלב הבא שבו אוכל לקחת ownership על תהליכים גדולים יותר — כמו ב-${company}.`,
      },
      {
        q: `למה דווקא ${company}?`,
        short: `${company} מתאימה לשלב הבא שלי — ${v1} ו-${v2} ברמה שמעניינת אותי.`,
        detailed: `שתי סיבות עיקריות: ראשית, ${company} עובדת בצורה שדורשת ${v1} ו-${v2} — וזה בדיוק מה שאני עושה כבר שנים. שנית, אני מחפש/ת סביבה שמאפשרת לי להוביל תהליכים end-to-end ולראות impact אמיתי. שמעתי דברים טובים על הצוות — וזה מדבר אליי.`,
      },
      {
        q: "מה הציפיות שלך לשכר?",
        short: `המטרה שלי היא ₪${p.salary.min.toLocaleString()}–₪${p.salary.max.toLocaleString()}. מה הטווח אצלכם?`,
        detailed: `על בסיס הניסיון שלי ותנאי השוק, אני מכוון/ת ל-₪${p.salary.min.toLocaleString()}–₪${p.salary.max.toLocaleString()} ${p.salary.currency}. אני מסתכל/ת על התמונה המלאה — לא רק שכר בסיס. מה הטווח אצלכם?`,
      },
      {
        q: "למה אתה/את עוזב/ת?",
        short: `הגעתי לתקרה ב-${lastCompany}. רוצה ${v1} ו-${v2} בקנה מידה גדול יותר.`,
        detailed: `אני גאה/ה בכל מה שעשיתי ב-${lastCompany}. אחרי שהצלחתי ב-${lastBullet}, אני מרגיש/ת מוכן/ה לאתגר הבא — יותר אחריות, יותר ממשקים, ותהליכים גדולים יותר.`,
      },
      {
        q: "מה החולשה הכי גדולה שלך?",
        short: p.weakSpots[0]
          ? `${p.weakSpots[0]} — תחום שאני עובד/ת עליו, וגם אחת הסיבות שהתפקיד הזה מעניין אותי.`
          : "לפעמים אני יורד/ת לפרטים הקטנים יותר מדי. למדתי לאזן בין דיוק לבין קצב.",
        detailed: p.weakSpots[0]
          ? `אם אני כנה/ה — ${p.weakSpots[0]}. אני מודע/ת לזה ועובד/ת על זה. בפועל, זאת אחת הסיבות שהתפקיד ב-${company} מעניין אותי — הוא ייתן לי חשיפה ישירה לתחום.`
          : "לפעמים אני שואפ/ת לשלמות על חשבון מהירות. למדתי לשאול: 'מה הציפייה האמיתית כאן?' — ומאז אני מצליח/ה לאזן הרבה יותר טוב.",
      },
    ],
    weakSpots: p.weakSpots.slice(0, 3).map((ws, i) => ({
      spot: ws,
      handle:
        i === 0
          ? `תסגר/י את זה בתור "תחום שאני פותח/ת עכשיו" — תגיד/י שאתה/את עובד/ת על זה: קורס, קריאה, שיחות עם אנשי מקצוע. הדגש/י שזה בדיוק אחד הדברים שמושכים אותך לתפקיד.`
          : i === 1
          ? `אל תתנצל/י. תגיד/י ישר: "עדיין לא עבדתי עם זה ישירות, אבל יש לי בסיס רלוונטי — ואני לומד/ת מהר."`
          : `הכר/י בפער בשנייה ומיד תסב/י ל-'אבל': "זה נכון, אבל הניסיון שלי ב-${lastCompany} עם ${v1} נותן לי בסיס מוצק — ומשם אפשר לגשר מהר."`,
    })),
    salary: {
      anchor: `₪${p.salary.min.toLocaleString()} – ₪${p.salary.max.toLocaleString()} ${p.salary.currency}`,
      script: `"על בסיס הניסיון שלי ותנאי השוק, אני מכוון/ת ל-₪${p.salary.min.toLocaleString()}–₪${p.salary.max.toLocaleString()}. אני פתוח/ה לשוחח על החבילה המלאה. מה הטווח אצלכם?"`,
      tip: "תשאל/י את הטווח שלהם מיד אחרי שנתת את שלך. אל תעגן/י נמוך מדי — זה כמעט בלתי הפיך. אם לוחצים עוד: 'בואו נוודא שהתפקיד מתאים ואז נדבר על המספרים.'",
    },
    questionsToAsk: [
      "מה נראה כמו הצלחה ב-90 הימים הראשונים?",
      "מה האתגר הכי גדול שמחכה לאדם שנכנס לתפקיד?",
      `איך נראה יום-יום בתפקיד הזה מבחינת ${v1}?`,
      "מה מסלול הצמיחה מכאן?",
      "מה הדבר שהצוות הכי גאה בו מהשנה האחרונה?",
    ],
    closingLine: {
      short: "נשמע כמו התאמה חזקה. אשמח להמשיך — מה הצעדים הבאים?",
      detailed: `בהתבסס על כל מה שסיפרת, אני ממש נרגש/ת מהתפקיד. הניסיון שלי ב-${v1} ו-${v2}, ביחד עם הרקע ב-${lastCompany}, מתחברים ישירות למה שאתם מחפשים. אשמח לפגוש את מנהל הגיוס — מה הצעד הבא?`,
    },
    panicMode: [
      { trigger: "נתקעת על שאלה", say: '"שאלה טובה — תן/י לי שנייה."' },
      {
        trigger: "לחץ על שכר",
        say: `"מכוון/ת ל-₪${p.salary.min.toLocaleString()}–₪${p.salary.max.toLocaleString()}. מה הטווח אצלכם?"`,
      },
      {
        trigger: "שואלים על X שאין לך",
        say: '"לא עבדתי עם זה ישירות, אבל אני לומד/ת מהר — ספר/י לי יותר?"',
      },
      {
        trigger: "למה אתה עוזב?",
        say: `"הגעתי לתקרה. מחפש/ת ${v1} בקנה מידה גדול יותר."`,
      },
      {
        trigger: "שתיקה מביכה",
        say: '"אגב, יש לי שאלה — מה הכי חשוב לכם לראות בחודשים הראשונים?"',
      },
    ],
    redFlags: [
      "אל תפתח/י בשכר — תחכה/י שיישאלו",
      "אל תגיד/י רע על מעסיק קודם — לא כדאי בשום תעשייה",
      "אל תגיד/י 'אני רק מסתכל/ת' — תראה/י כוונה אמיתית",
      "תשובות מעל דקה — אסור. 45 שניות זה האידיאל",
      "אל תשכח/י לשאול שאלות — מי שלא שואל נראה לא מתעניין",
      "אל תשקר/י על ניסיון — זה יתגלה תמיד",
    ],
  };
}
