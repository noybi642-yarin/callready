import { useState, useRef } from "react";

// ============================================================
// מילון סלנג מקצועי ישראלי לפי תחום — INDUSTRY LANGUAGE MAP
// כאן מוגדרים המונחים שה-AI ישתמש בהם לפי סוג התפקיד והחברה
// ============================================================
const INDUSTRY_VOCAB = {
  נדלן: ["עבודה מול ממשקים", "תפעול נכסים", "ריבוי ממשקים", "ביצוע בפועל", "עמידה בלוחות זמנים", "תיאום שטח", "בעלי עניין", "עבודה מול קבלנים", "ניהול תיק נכסים", "שיעור אכלוס"],
  סטארטאפ: ["ownership", "hands-on", "end-to-end", "עבודה בקצב גבוה", "יוזמה", "multitasking", "impact", "סביבה דינמית", "הסתגלות מהירה", "פתרון בעיות"],
  פיתוח_עסקי: ["יצירת הזדמנויות", "pipeline", "שותפויות", "צמיחה עסקית", "משא ומתן", "הרחבת פעילות", "ניהול קשרי לקוחות", "זיהוי צרכים עסקיים"],
  ניהול: ["ניהול מטריציוני", "הנעת עובדים", "עמידה ביעדים", "הובלת תהליכים", "אופרציה", "עבודה מול ממשקים", "ניהול שינוי", "קידום צוות"],
  כספים: ["תמחור", "ניתוח P&L", "תקציב", "ביצוע מול תוכנית", "חיזוי", "ניהול סיכונים", "עמידה ביעדי הכנסה", "ROI"],
  hr: ["גיוס end-to-end", "תהליכי onboarding", "פיתוח ארגוני", "שימור עובדים", "תרבות ארגונית", "ניהול ביצועים", "employer branding"],
  קמעונאות: ["P&L של חנות", "עמידה ביעדי מכירות", "ניהול מלאי", "חווית לקוח", "ניהול צוות שטח", "KPI-ים", "תהליכי עבודה"],
  בריאות: ["עבודת צוות רב-מקצועי", "פרוטוקולים", "ממשקים פנים-ארגוניים", "עבודה תחת לחץ", "רגולציה", "תיאום טיפול", "קבלת החלטות בשטח"],
};

function detectIndustry(role, company, jd) {
  const text = `${role} ${company} ${jd}`.toLowerCase();
  if (text.match(/נדל|נכס|שכיר|מקרקעין|דירה|בנייה/)) return "נדלן";
  if (text.match(/סטארטאפ|startup|tech|הייטק|פיתוח|software|app/)) return "סטארטאפ";
  if (text.match(/פיתוח עסקי|business dev|bd |partnerships|שותפויות/)) return "פיתוח_עסקי";
  if (text.match(/מנהל|ניהול|ראש צוות|team lead|coo|vp|director/)) return "ניהול";
  if (text.match(/כספים|finance|cfo|רואה חשבון|חשב|תקציב|כלכלן/)) return "כספים";
  if (text.match(/hr|גיוס|משאבי אנוש|people|talent|recruiter/)) return "hr";
  if (text.match(/קמעונאות|retail|חנות|supermarket|סופר|מותג|fashion/)) return "קמעונאות";
  if (text.match(/רפואה|בריאות|אחות|רופא|hospital|קופת חולים|בית חולים/)) return "בריאות";
  return "ניהול"; // ברירת מחדל
}

// ============================================================
// נתוני דוגמה — פרופיל אגנוסטי לתעשייה
// ============================================================
const MOCK_CANDIDATE_PROFILE = {
  name: "מיכל לוי",
  title: "מנהלת נכסים ונדל\"ן מסחרי",
  email: "michal.levi@email.com",
  summary: "מנהלת נכסים בכירה עם 8 שנות ניסיון בנדל\"ן מסחרי ומגורים. ניהלתי תיק נכסים בשווי 120 מיליון ₪, הובלתי מכירות ועסקאות שכירות, ובניתי קשרים ארוכי-טווח עם משקיעים ודיירים.",
  experience: [
    { company: "קבוצת אמות השקעות", title: "מנהלת נכסים בכירה", period: "2020–2024", bullets: ["ניהול תיק של 15 נכסים מסחריים בשווי 120M ₪", "הגדלת שיעור האכלוס מ-78% ל-96% תוך שנתיים", "חידוש 90% מחוזי השכירות בתנאים משופרים"] },
    { company: "נכסים ובנייה", title: "סוכנת נדל\"ן ומנהלת נכסים", period: "2017–2020", bullets: ["סגירת 40+ עסקאות מכירה ושכירות לשנה", "ניהול ריבוי ממשקים מול בעלי נכסים, קבלנים ודיירים", "הכשרת 3 סוכנים חדשים והובלת תהליכי עבודה"] },
    { company: "RE/MAX ישראל", title: "סוכנת נדל\"ן", period: "2015–2017", bullets: ["מקום ראשון במחוז בנפח מכירות ב-2016", "80+ לקוחות פעילים ברשת הפניות"] },
  ],
  skills: ["ניהול נכסים", "משא ומתן", "הערכת שווי נכסים", "ניהול חוזים", "תפעול נכסים", "שיווק נדל\"ן", "ניתוח שוק", "עבודה מול ממשקים", "ניהול תיקי השקעות", "Excel ו-CRM"],
  education: [{ degree: "תואר ראשון במנהל עסקים", school: "אוניברסיטת בר-אילן", year: "2015" }],
  achievements: [
    "תיק נכסים בשווי 120M ₪ תחת ניהול",
    "שיעור אכלוס 96% — מהגבוהים בתחום",
    "90% חידוש חוזים בתנאים משופרים",
    "מקום ראשון במחוז RE/MAX ב-2016",
    "הכשרת 3 סוכנים וביצוע בפועל של תהליכי עבודה"
  ],
  salary: { min: 18000, max: 28000, currency: "₪ לחודש + בונוסים" },
  weakSpots: [
    "ניסיון מוגבל בנדל\"ן לוגיסטי ותעשייתי",
    "לא עבדתי מול קרנות השקעה זרות עד כה",
    "פחות חשיפה לפרויקטי התחדשות עירונית (תמ\"א 38)"
  ],
  languages: ["עברית (שפת אם)", "אנגלית (עסקי)", "רוסית (בסיסי)"],
};

const MOCK_RECENT_BRIEFS = [
  { id: 1, company: "מליסרון", role: "מנהלת נכסים — מרכזי קניות", date: "15/01/2024", score: 91 },
  { id: 2, company: "אפריקה ישראל נכסים", role: "מנהלת תיק נכסים מסחרי", date: "10/01/2024", score: 87 },
];

const RECRUITER_QUESTIONS = [
  { id: 1, q: "ספרי לי על עצמך", tag: "פתיחה" },
  { id: 2, q: "למה הפוזיציה הזאת מעניינת אותך?", tag: "מוטיבציה" },
  { id: 3, q: "למה דווקא אצלנו?", tag: "התאמה לחברה" },
  { id: 4, q: "מה הציפיות שלך לשכר?", tag: "שכר" },
  { id: 5, q: "למה אתה עוזב את המקום הנוכחי?", tag: "מעבר" },
  { id: 6, q: "מה החוזקות הכי גדולות שלך?", tag: "חוזקות" },
  { id: 7, q: "מה החולשה הכי גדולה שלך?", tag: "מודעות עצמית" },
  { id: 8, q: "תביא דוגמה לאתגר שהתמודדת איתו", tag: "STAR" },
  { id: 9, q: "מתי אפשר לצפות לתחילת עבודה?", tag: "לוגיסטיקה" },
  { id: 10, q: "יש לך ניסיון עם [X]?", tag: "כישורים" },
  { id: 11, q: "מה אתה מחפש בתפקיד הבא?", tag: "ערכים" },
  { id: 12, q: "האם זה בסדר לעבוד היברידי / פרונטאלי?", tag: "לוגיסטיקה" },
  { id: 13, q: "יש לך שאלות אליי?", tag: "סגירה" },
];

// ============================================================
// MOCK FUNCTIONS — להחליף עם API אמיתי
// ============================================================

async function mockResearchCompany(companyName, roleTitle) {
  // TODO: להחליף עם Serper / Tavily / Perplexity API
  await new Promise(r => setTimeout(r, 1200));
  return { companyName, roleTitle };
}

async function mockGenerateBrief(candidate, company, role, jd) {
  // TODO: להחליף עם Anthropic claude-sonnet-4-20250514 API
  // כאן יש לשלוח: פרופיל המועמד + מחקר החברה + כותרת התפקיד + תיאור משרה
  await new Promise(r => setTimeout(r, 2000));

  const p = candidate;
  const industry = detectIndustry(role, company, jd || "");
  const vocab = INDUSTRY_VOCAB[industry] || INDUSTRY_VOCAB["ניהול"];
  const v1 = vocab[0], v2 = vocab[1], v3 = vocab[2];

  const topAchievement = p.achievements[0] || "תוצאה משמעותית";
  const topSkills = p.skills.slice(0, 3).join(", ");
  const lastCompany = p.experience[0]?.company || "המקום הנוכחי";
  const lastTitle = p.experience[0]?.title || p.title;
  const lastBullet = p.experience[0]?.bullets?.[0] || "הובלתי תהליכים end-to-end";
  const yearsLabel = p.experience.length >= 3 ? `${p.experience.length * 2}+` : "5+";

  return {
    industryVocab: vocab.slice(0, 8),
    openingPitch: {
      short: `${lastTitle} עם ${yearsLabel} שנות ניסיון. מוכיח/ה תוצאות — ${topAchievement}. מחפש/ת תפקיד עם ${v1} ו-${v2}, ו-${company} נשמע לי כמו המקום הנכון לשלב הבא.`,
      detailed: `אני ${p.name}, ${lastTitle} עם ${yearsLabel} שנים בתחום. ב-${lastCompany} ${lastBullet}. מה שמייחד אותי — שילוב של ${v1}, ${v2}, ו-${v3}. עכשיו מחפש/ת סביבה שבה אפשר לקחת ${v1} ולהוביל תהליכים end-to-end, כמו ב-${company}.`,
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
      context: [
        "תפתח/י עם זה — פותח שיחה",
        "לשאלות על ניסיון מקצועי",
        "לשאלות על חוזקות",
        "לשאלות על ניהול ומנהיגות",
        "לסיכום — מה הבאת לשולחן",
      ][i] || "להשתמש לפי הקשר",
    })),
    industryTips: [
      { tip: `השתמש/י ב-"${v1}"`, why: "זאת השפה שמגייסות מחפשות בתחום הזה" },
      { tip: `ציין/י "${v2}" כשמדברים על אחריות`, why: "מראה שאתה/את חושב/ת בצורה שלהם" },
      { tip: `אמור/י "${v3}" ולא רק 'עבדתי על X'`, why: "נשמע מקצועי ומוכן/ה לתפקיד" },
    ],
    recruiterQA: [
      {
        q: "ספר/י לי על עצמך",
        short: `${lastTitle} עם ${yearsLabel} שנות ניסיון ו-${v1}. הישג עיקרי: ${topAchievement}. מחפש/ת תפקיד עם ${v2} ב-${company}.`,
        detailed: `${p.summary} ב-${lastCompany} — ${lastBullet}. אני מביא/ה ניסיון ב-${v1}, ${v2}, ו-${v3}. עכשיו מחפש/ת את השלב הבא שבו אוכל לקחת ownership על תהליכים גדולים יותר — כמו ב-${company}.`,
      },
      {
        q: `למה דווקא ${company}?`,
        short: `${company} מתאימה לשלב הבא שלי — ${v1} ו-${v2} ברמה שמעניינת אותי.`,
        detailed: `שתי סיבות עיקריות: ראשית, ${company} עובדת בצורה שדורשת ${v1} ו-${v2} — וזה בדיוק מה שאני עושה כבר שנים. שנית, אני מחפש/ת סביבה שמאפשרת לי להוביל תהליכים end-to-end ולראות impact אמיתי. שמעתי דברים טובים על הצוות והאופן שעובדים כאן — וזה מדבר אליי.`,
      },
      {
        q: "מה הציפיות שלך לשכר?",
        short: `המטרה שלי היא ₪${p.salary.min.toLocaleString()}–₪${p.salary.max.toLocaleString()}. מה הטווח אצלכם?`,
        detailed: `על בסיס הניסיון שלי ותנאי השוק, אני מכוון/ת ל-₪${p.salary.min.toLocaleString()}–₪${p.salary.max.toLocaleString()} ${p.salary.currency}. אני מסתכל/ת על התמונה המלאה — לא רק שכר בסיס. מה הטווח אצלכם?`,
      },
      {
        q: "למה אתה/את עוזב/ת?",
        short: `הגעתי לתקרה ב-${lastCompany}. רוצה ${v1} ו-${v2} בקנה מידה גדול יותר.`,
        detailed: `אני גאה/ה בכל מה שעשיתי ב-${lastCompany}. אחרי שהצלחתי ב-${lastBullet}, אני מרגיש/ת מוכן/ה לאתגר הבא. מחפש/ת מקום שבו אפשר לקחת יותר אחריות, לנהל יותר ממשקים, ולהוביל תהליכים end-to-end — וזה מה שמושך אותי ל-${company}.`,
      },
      {
        q: "מה החולשה הכי גדולה שלך?",
        short: p.weakSpots[0] ? `${p.weakSpots[0]} — תחום שאני עובד/ת עליו, וגם אחת הסיבות שהתפקיד הזה מעניין אותי.` : `לפעמים אני יורד/ת לפרטים הקטנים יותר מדי. למדתי לאזן בין דיוק לבין קצב.`,
        detailed: p.weakSpots[0]
          ? `אם אני כנה/ה — ${p.weakSpots[0]}. אני מודע/ת לזה ועובד/ת על זה: [קורס / שיחות עם אנשים בתחום / ניסיון מעשי]. בפועל, זאת אחת הסיבות שהתפקיד ב-${company} מעניין אותי — הוא ייתן לי חשיפה ישירה לתחום הזה.`
          : `לפעמים אני שואפ/ת לשלמות יתר על חשבון מהירות. למדתי לשאול את עצמי: 'מה הציפייה האמיתית כאן?' — ומאז אני מצליח/ה לאזן הרבה יותר טוב.`,
      },
    ],
    weakSpots: p.weakSpots.slice(0, 3).map((ws, i) => ({
      spot: ws,
      handle: i === 0
        ? `תסגר/י את זה בתור "תחום שאני פותח/ת עכשיו" — תגיד/י שאתה/את עובד/ת על זה: [קורס / קריאה / שיחות עם אנשי מקצוע]. הדגש/י שזה בדיוק אחד הדברים שמושכים אותך לתפקיד הזה.`
        : i === 1
        ? `אל תתנצל/י. תגיד/י ישר: "עדיין לא עבדתי עם זה ישירות, אבל יש לי בסיס רלוונטי — ואני לומד/ת מהר. תוכל/י לספר לי יותר על ההקשר?"`
        : `הכר/י בפער בשנייה ומיד תסב/י ל'אבל': "זה נכון, אבל הניסיון שלי ב-${lastCompany} עם ${v1} נותן לי בסיס מוצק — ומשם אפשר לגשר מהר."`,
    })),
    salary: {
      anchor: `₪${p.salary.min.toLocaleString()} – ₪${p.salary.max.toLocaleString()} ${p.salary.currency}`,
      script: `"על בסיס הניסיון שלי ותנאי השוק, אני מכוון/ת ל-₪${p.salary.min.toLocaleString()}–₪${p.salary.max.toLocaleString()}. אני פתוח/ה לשוחח על החבילה המלאה. מה הטווח אצלכם?"`,
      tip: "תשאל/י את הטווח שלהם מיד אחרי שנתת את שלך. אל תעגן/י נמוך מדי — זה כמעט בלתי הפיך. אם לוחצים עוד: 'בואו נוודא תחילה שהתפקיד מתאים ואז נדבר על המספרים.'",
    },
    questionsToAsk: [
      `מה נראה כמו הצלחה ב-90 הימים הראשונים?`,
      `מה האתגר הכי גדול שמחכה לאדם שנכנס לתפקיד?`,
      `איך נראה יום-יום בתפקיד הזה מבחינת ${v1}?`,
      `מה מסלול הצמיחה מכאן?`,
      `מה הדבר שהצוות הכי גאה בו מהשנה האחרונה?`,
    ],
    closingLine: {
      short: `נשמע כמו התאמה חזקה. אשמח להמשיך — מה הצעדים הבאים?`,
      detailed: `בהתבסס על כל מה שסיפרת, אני ממש נרגש/ת מהתפקיד. הניסיון שלי ב-${v1} ו-${v2}, ביחד עם הרקע ב-${lastCompany}, מתחברים ישירות למה שאתם מחפשים. אשמח לפגוש את מנהל הגיוס ולהמשיך — מה הצעד הבא?`,
    },
    panicMode: [
      { trigger: "נתקעת על שאלה", say: `"שאלה טובה — תן/י לי שנייה."` },
      { trigger: "לחץ על שכר", say: `"מכוון/ת ל-₪${p.salary.min.toLocaleString()}–₪${p.salary.max.toLocaleString()}. מה הטווח אצלכם?"` },
      { trigger: "שואלים על X שאין לך", say: `"לא עבדתי עם זה ישירות, אבל אני לומד/ת מהר — ספר/י לי יותר?"` },
      { trigger: "למה אתה עוזב?", say: `"הגעתי לתקרה. מחפש/ת ${v1} בקנה מידה גדול יותר."` },
      { trigger: "שתיקה מביכה", say: `"אגב, יש לי שאלה — מה הכי חשוב לכם לראות בחודשים הראשונים?"` },
    ],
    redFlags: [
      `אל תפתח/י בשכר — תחכה/י שיישאלו`,
      `אל תגיד/י רע על מעסיק קודם — לא כדאי בשום תעשייה`,
      `אל תגיד/י "אני רק מסתכל/ת" — תראה/י כוונה אמיתית`,
      `תשובות מעל דקה — אסור. 45 שניות זה האידיאל`,
      `אל תשכח/י לשאול שאלות — מי שלא שואל נראה לא מתעניין`,
      `אל תשקר/י על ניסיון — זה יתגלה תמיד`,
    ],
  };
}

// ============================================================
// CSS — ממשק בעברית, RTL מלא, פונט Rubik
// ============================================================
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #F5F4F0; --surface: #FFFFFF; --surface2: #EEECEA;
    --border: rgba(0,0,0,0.08); --border2: rgba(0,0,0,0.15);
    --navy: #0F1C3F; --navy2: #1E3160;
    --muted: #6B6E7A; --muted2: #A3A5AE;
    --accent: #1A56DB; --accent-bg: #EEF3FD;
    --green: #0D7252; --green-bg: #E6F5EF;
    --amber: #975500; --amber-bg: #FEF2E0;
    --red: #C02A2A; --red-bg: #FFF0EE;
    --purple: #6D28D9; --purple-bg: #F3F0FF;
    --teal: #0D7272; --teal-bg: #E6F5F5;
    --radius: 12px; --shadow: 0 1px 3px rgba(0,0,0,0.07);
    --font: 'Rubik', 'Arial Hebrew', sans-serif;
    --mono: 'DM Mono', monospace;
  }
  body { font-family: var(--font); background: var(--bg); color: var(--navy); font-size: 15px; line-height: 1.65; direction: rtl; }
  .app { min-height: 100vh; max-width: 430px; margin: 0 auto; background: var(--bg); }
  .nav { background: var(--surface); border-bottom: 1px solid var(--border); padding: 0 16px; display: flex; align-items: center; height: 56px; position: sticky; top: 0; z-index: 100; flex-direction: row-reverse; }
  .nav-logo { font-weight: 700; font-size: 18px; color: var(--navy); flex: 1; text-align: right; letter-spacing: -0.3px; }
  .nav-logo span { color: var(--accent); }
  .nav-btn { width: 36px; height: 36px; border-radius: 8px; border: none; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--muted); font-size: 20px; }
  .nav-btn:hover { background: var(--surface2); }
  .tab-bar { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: var(--surface); border-top: 1px solid var(--border); display: flex; z-index: 100; padding-bottom: env(safe-area-inset-bottom,0); direction: rtl; }
  .tab { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; padding: 10px 0; border: none; background: transparent; color: var(--muted2); font-size: 10px; font-family: var(--font); cursor: pointer; transition: color 0.15s; }
  .tab.active { color: var(--accent); }
  .tab i { font-size: 22px; }
  .page { padding: 16px 16px 90px; }
  .card { background: var(--surface); border-radius: var(--radius); border: 1px solid var(--border); padding: 16px; box-shadow: var(--shadow); margin-bottom: 10px; }
  .card-hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-direction: row-reverse; }
  .card-title { font-weight: 600; font-size: 14px; color: var(--navy); }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border-radius: 10px; border: none; font-family: var(--font); font-weight: 500; cursor: pointer; transition: all 0.15s; font-size: 15px; }
  .btn-primary { background: var(--accent); color: #fff; padding: 14px 20px; width: 100%; }
  .btn-primary:hover { filter: brightness(0.9); }
  .btn-primary:active { transform: scale(0.98); }
  .btn-secondary { background: var(--surface2); color: var(--navy); padding: 10px 16px; border: 1px solid var(--border); }
  .btn-ghost { background: transparent; color: var(--accent); padding: 8px 12px; font-size: 13px; }
  .btn-copy { background: var(--surface2); color: var(--navy); padding: 5px 11px; border-radius: 6px; font-size: 12px; border: 1px solid var(--border); font-family: var(--mono); cursor: pointer; }
  .btn-copy:hover { background: var(--accent-bg); color: var(--accent); border-color: var(--accent); }
  .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; }
  .b-blue { background: var(--accent-bg); color: var(--accent); }
  .b-green { background: var(--green-bg); color: var(--green); }
  .b-amber { background: var(--amber-bg); color: var(--amber); }
  .b-red { background: var(--red-bg); color: var(--red); }
  .b-gray { background: var(--surface2); color: var(--muted); }
  .b-purple { background: var(--purple-bg); color: var(--purple); }
  .b-teal { background: var(--teal-bg); color: var(--teal); }
  .input { width: 100%; padding: 12px 14px; border-radius: 10px; border: 1.5px solid var(--border2); background: var(--surface); font-family: var(--font); font-size: 15px; color: var(--navy); outline: none; transition: border-color 0.15s; text-align: right; direction: rtl; }
  .input:focus { border-color: var(--accent); }
  .input::placeholder { color: var(--muted2); }
  .lbl { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px; display: block; text-align: right; }
  .pg-title { font-size: 20px; font-weight: 700; color: var(--navy); letter-spacing: -0.5px; margin-bottom: 4px; text-align: right; }
  .pg-sub { font-size: 13px; color: var(--muted); margin-bottom: 16px; text-align: right; }
  .upload-zone { border: 2px dashed var(--border2); border-radius: var(--radius); padding: 36px 20px; text-align: center; cursor: pointer; transition: all 0.2s; background: var(--surface); }
  .upload-zone:hover, .upload-zone.drag { border-color: var(--accent); background: var(--accent-bg); }
  .upload-zone i { font-size: 40px; color: var(--muted2); margin-bottom: 10px; display: block; }
  .divider { height: 1px; background: var(--border); margin: 14px 0; }
  .acc { background: var(--surface); border-radius: var(--radius); border: 1px solid var(--border); overflow: hidden; margin-bottom: 8px; }
  .acc-hd { display: flex; align-items: center; justify-content: space-between; padding: 13px 16px; cursor: pointer; user-select: none; flex-direction: row-reverse; }
  .acc-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px; margin-left: 10px; flex-shrink: 0; }
  .acc-title { font-weight: 600; font-size: 14px; color: var(--navy); text-align: right; flex: 1; }
  .acc-body { padding: 0 16px 14px; border-top: 1px solid var(--border); }
  .ans-box { background: var(--surface2); border-radius: 10px; padding: 14px; margin-top: 10px; text-align: right; line-height: 1.7; }
  .ans-box.short { font-size: 15px; font-weight: 500; color: var(--navy); }
  .ans-box.detailed { font-size: 14px; color: var(--navy2); }
  .ans-lbl { font-size: 10px; color: var(--muted); font-weight: 700; letter-spacing: 0.5px; margin-bottom: 6px; text-align: right; }
  .ans-actions { display: flex; gap: 6px; margin-top: 8px; justify-content: flex-end; }
  .panic-box { background: #FFF8F0; border: 1px solid #FFCF87; border-radius: 10px; padding: 13px; margin-bottom: 8px; text-align: right; }
  .panic-if { font-size: 11px; color: var(--amber); font-weight: 700; margin-bottom: 3px; }
  .panic-say { font-size: 15px; font-weight: 600; color: var(--navy); }
  .toggle-g { display: flex; background: var(--surface2); border-radius: 8px; padding: 3px; gap: 2px; margin-bottom: 16px; flex-direction: row-reverse; }
  .toggle-btn { flex: 1; padding: 7px 4px; border: none; border-radius: 6px; background: transparent; font-family: var(--font); font-size: 13px; font-weight: 500; color: var(--muted); cursor: pointer; transition: all 0.15s; }
  .toggle-btn.on { background: var(--surface); color: var(--navy); box-shadow: var(--shadow); }
  .loading-overlay { position: fixed; inset: 0; background: rgba(245,244,240,0.96); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 200; gap: 16px; }
  .spin { width: 44px; height: 44px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .tag-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .skill-tag { background: var(--surface2); color: var(--navy2); border: 1px solid var(--border); border-radius: 100px; padding: 4px 12px; font-size: 12px; font-weight: 500; }
  .pts { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .pt { display: flex; gap: 10px; align-items: flex-start; font-size: 14px; line-height: 1.55; flex-direction: row-reverse; }
  .dot { width: 6px; height: 6px; border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
  .dot.accent { background: var(--accent); }
  .dot.green { background: var(--green); }
  .dot.red { background: var(--red); }
  .dot.amber { background: var(--amber); }
  .dot.purple { background: var(--purple); }
  .call-hd { background: var(--navy); color: #fff; border-radius: var(--radius); padding: 16px; margin-bottom: 12px; text-align: right; }
  .call-co { font-size: 21px; font-weight: 700; letter-spacing: -0.3px; }
  .call-role { font-size: 13px; color: rgba(255,255,255,0.6); font-family: var(--mono); margin-top: 2px; }
  .call-meta { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; justify-content: flex-end; }
  .avatar { border-radius: 50%; background: var(--accent-bg); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--accent); flex-shrink: 0; }
  .chip { flex-shrink: 0; padding: 6px 12px; border-radius: 100px; font-size: 12px; font-weight: 500; border: 1.5px solid var(--border2); background: var(--surface); color: var(--muted); cursor: pointer; transition: all 0.15s; }
  .chip.on { background: var(--navy); color: #fff; border-color: var(--navy); }
  .toast { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: var(--navy); color: #fff; padding: 10px 20px; border-radius: 100px; font-size: 13px; z-index: 300; animation: fadeUp 0.25s ease; white-space: nowrap; }
  .empty { text-align: center; padding: 48px 20px; }
  .empty i { font-size: 44px; color: var(--muted2); margin-bottom: 12px; display: block; }
  .empty h3 { font-size: 16px; font-weight: 600; margin-bottom: 6px; }
  .empty p { font-size: 13px; color: var(--muted); }
  .set-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--border); flex-direction: row-reverse; }
  .set-row:last-child { border-bottom: none; }
  .qb-item { padding: 14px 0; border-bottom: 1px solid var(--border); text-align: right; }
  .qb-item:last-child { border-bottom: none; }
  .vocab-strip { display: flex; flex-wrap: wrap; gap: 6px; padding: 12px 0 4px; }
  .vocab-tag { background: var(--teal-bg); color: var(--teal); border: 1px solid rgba(13,114,114,0.2); border-radius: 100px; padding: 4px 12px; font-size: 12px; font-weight: 500; }
  .chevron { transition: transform 0.2s; }
  .chevron.open { transform: rotate(180deg); }
  textarea.input { resize: vertical; }
`;

// ============================================================
// COMPONENTS
// ============================================================

function Toast({ msg, onDone }) {
  useState(() => { const t = setTimeout(onDone, 2000); return () => clearTimeout(t); });
  return <div className="toast">✓ {msg}</div>;
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button className="btn-copy" onClick={copy}>
      <i className={`ti ${copied ? "ti-check" : "ti-copy"}`} style={{ fontSize: 12, marginLeft: 4 }} aria-hidden />
      {copied ? "הועתק" : "העתק"}
    </button>
  );
}

function Acc({ icon, iconBg, title, badge, children, open: initOpen = false }) {
  const [open, setOpen] = useState(initOpen);
  return (
    <div className="acc">
      <div className="acc-hd" onClick={() => setOpen(o => !o)}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {badge}
          <i className={`ti ti-chevron-down chevron ${open ? "open" : ""}`} style={{ fontSize: 17, color: "var(--muted)" }} aria-hidden />
        </div>
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <span className="acc-title">{title}</span>
          <div className="acc-icon" style={{ background: iconBg }}>{icon}</div>
        </div>
      </div>
      {open && <div className="acc-body">{children}</div>}
    </div>
  );
}

function AnsBlock({ short, detailed, showDetailed }) {
  const text = showDetailed ? detailed : short;
  return (
    <div>
      <div className={`ans-box ${showDetailed ? "detailed" : "short"}`}>
        <div className="ans-lbl">{showDetailed ? "תשובה מפורטת" : "תשובה מהירה"}</div>
        {text}
      </div>
      <div className="ans-actions"><CopyBtn text={text} /></div>
    </div>
  );
}

// ============================================================
// SCREENS
// ============================================================

function Dashboard({ profile, briefs, onStartCall, onUpload }) {
  const p = profile || MOCK_CANDIDATE_PROFILE;
  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexDirection: "row-reverse" }}>
        <div className="avatar" style={{ width: 52, height: 52, fontSize: 18 }}>
          {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 700, fontSize: 17 }}>{p.name}</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>{p.title}</div>
        </div>
      </div>

      <button className="btn btn-primary" style={{ marginBottom: 10 }} onClick={onStartCall}>
        <i className="ti ti-phone" style={{ fontSize: 19 }} aria-hidden />
        התחל בריף שיחה חדש
      </button>
      <button className="btn btn-secondary" style={{ width: "100%", marginBottom: 20 }} onClick={onUpload}>
        <i className="ti ti-upload" style={{ fontSize: 17 }} aria-hidden />
        העלה / עדכן קורות חיים
      </button>

      <div className="card">
        <div className="card-hd">
          <span className="badge b-green">פרופיל מוכן</span>
          <span className="card-title">הפרופיל שלך</span>
        </div>
        <div style={{ fontSize: 13, color: "var(--navy2)", marginBottom: 12, lineHeight: 1.7 }}>{p.summary}</div>
        <div className="tag-list" style={{ justifyContent: "flex-end" }}>
          {p.skills.slice(0, 5).map(s => <span key={s} className="skill-tag">{s}</span>)}
          {p.skills.length > 5 && <span className="skill-tag">+{p.skills.length - 5}</span>}
        </div>
      </div>

      <div style={{ fontWeight: 700, marginBottom: 8, textAlign: "right", fontSize: 14, marginTop: 4 }}>בריפים אחרונים</div>
      {briefs.length === 0
        ? <div style={{ textAlign: "center", padding: 24, color: "var(--muted)", fontSize: 13 }}>עדיין אין בריפים — לחץ/י על "התחל שיחה" כדי ליצור את הראשון.</div>
        : briefs.map(b => (
          <div key={b.id} className="card">
            <div className="card-hd" style={{ marginBottom: 4 }}>
              <span className="badge b-green">{b.score}/100</span>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{b.company}</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)", fontFamily: "var(--mono)", textAlign: "right" }}>{b.role}</div>
            <div style={{ fontSize: 11, color: "var(--muted2)", fontFamily: "var(--mono)", marginTop: 4, textAlign: "right" }}>{b.date}</div>
          </div>
        ))}
    </div>
  );
}

function Upload({ onReady }) {
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(null);
  const ref = useRef();

  const handleFile = async (f) => {
    setFile(f); setParsing(true);
    // TODO: pdf.js + Claude API לחילוץ קורות חיים
    await new Promise(r => setTimeout(r, 1800));
    setParsed(MOCK_CANDIDATE_PROFILE); setParsing(false);
  };

  return (
    <div className="page">
      <div className="pg-title">העלאת קורות חיים</div>
      <div className="pg-sub">נחלץ את הפרופיל שלך ונשמור אותו מוכן לכל שיחה.</div>

      {!parsed && (
        <>
          <div
            className={`upload-zone ${drag ? "drag" : ""}`}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            onClick={() => ref.current.click()}
          >
            <i className="ti ti-upload" aria-hidden />
            <div style={{ fontWeight: 600, marginBottom: 4 }}>גרור לכאן את קורות החיים</div>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>PDF או DOCX · עד 10MB</div>
            {file && <div style={{ marginTop: 10, fontSize: 13, color: "var(--accent)", fontFamily: "var(--mono)" }}>{file.name}</div>}
          </div>
          <input ref={ref} type="file" accept=".pdf,.docx" style={{ display: "none" }} onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />

          {parsing && (
            <div style={{ textAlign: "center", padding: "28px 0" }}>
              <div className="spin" style={{ margin: "0 auto 14px" }} />
              <div style={{ color: "var(--muted)", fontSize: 13 }}>מנתח קורות חיים...</div>
            </div>
          )}

          <div className="divider" />
          <div style={{ fontWeight: 600, marginBottom: 10, textAlign: "right" }}>פרופיל לדוגמה</div>
          <button className="btn btn-secondary" style={{ width: "100%" }} onClick={() => setParsed(MOCK_CANDIDATE_PROFILE)}>
            <i className="ti ti-user" style={{ fontSize: 17 }} aria-hidden />
            טען פרופיל לדוגמה — מיכל לוי, ניהול נכסים
          </button>
        </>
      )}

      {parsed && (
        <>
          <div className="card">
            <div className="card-hd">
              <span className="badge b-green">✓ חולץ</span>
              <span className="card-title">הפרופיל שחולץ</span>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 12, flexDirection: "row-reverse" }}>
              <div className="avatar" style={{ width: 44, height: 44, fontSize: 15 }}>
                {parsed.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700 }}>{parsed.name}</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>{parsed.title}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "var(--navy2)", marginBottom: 12, lineHeight: 1.7 }}>{parsed.summary}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", marginBottom: 8 }}>כישורים וניסיון</div>
            <div className="tag-list" style={{ marginBottom: 12, justifyContent: "flex-end" }}>
              {parsed.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", marginBottom: 8 }}>הישגים עיקריים</div>
            <ul className="pts">
              {parsed.achievements.map(a => (
                <li key={a} className="pt">
                  <span style={{ flex: 1, textAlign: "right" }}>{a}</span>
                  <span className="dot green" />
                </li>
              ))}
            </ul>
            {parsed.weakSpots.length > 0 && (
              <>
                <div className="divider" />
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--amber)", marginBottom: 8 }}>נקודות לחיזוק — כדאי להתכונן</div>
                <ul className="pts">
                  {parsed.weakSpots.map(w => (
                    <li key={w} className="pt">
                      <span style={{ flex: 1, textAlign: "right", fontSize: 13, color: "var(--navy2)" }}>{w}</span>
                      <span className="dot amber" />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <button className="btn btn-primary" onClick={() => onReady(parsed)}>
            <i className="ti ti-check" style={{ fontSize: 17 }} aria-hidden />
            אשר ושמור פרופיל
          </button>
          <button className="btn btn-ghost" style={{ width: "100%", marginTop: 8 }} onClick={() => setParsed(null)}>
            העלה קובץ אחר
          </button>
        </>
      )}
    </div>
  );
}

function StartCall({ profile, onReady }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const steps = ["בודק קורות חיים...", "חוקר את החברה...", "מזהה שפת התחום...", "בונה בריף מותאם..."];

  const go = async () => {
    if (!company.trim() || !role.trim()) return;
    setLoading(true);
    for (let i = 0; i < steps.length; i++) { setStep(i); await new Promise(r => setTimeout(r, 650)); }
    const brief = await mockGenerateBrief(profile || MOCK_CANDIDATE_PROFILE, company, role, jd);
    setLoading(false);
    onReady({ company, role, jd, brief });
  };

  const detectedIndustry = company || role ? detectIndustry(role, company, jd) : null;
  const vocab = detectedIndustry ? INDUSTRY_VOCAB[detectedIndustry] : null;

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="spin" />
          <div key={step} style={{ color: "var(--muted)", fontSize: 14, animation: "fadeUp 0.4s ease" }}>{steps[step]}</div>
          <div style={{ fontSize: 11, color: "var(--muted2)", fontFamily: "var(--mono)" }}>שלב {step + 1}/{steps.length}</div>
        </div>
      )}
      <div className="page">
        <div className="pg-title">בריף שיחה חדש</div>
        <div className="pg-sub">תכנס/י חברה ותפקיד — ניבנה לך בריף מותאם תוך שניות.</div>

        <div className="card">
          <div style={{ marginBottom: 14 }}>
            <label className="lbl">שם החברה *</label>
            <input className="input" placeholder="לדוגמה: מליסרון, בנק הפועלים, כללית, רמי לוי..." value={company} onChange={e => setCompany(e.target.value)} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="lbl">כותרת התפקיד *</label>
            <input className="input" placeholder="לדוגמה: מנהל/ת נכסים, רכז/ת גיוס, מנהל/ת מכירות, מנהל/ת סניף..." value={role} onChange={e => setRole(e.target.value)} />
          </div>
          <div>
            <label className="lbl">תיאור משרה <span style={{ textTransform: "none", fontWeight: 400, color: "var(--muted2)" }}>(אופציונלי — מגדיל דיוק)</span></label>
            <textarea className="input" placeholder="הדבק את תיאור המשרה מלינקדאין / דרושים / גוגל..." value={jd} onChange={e => setJd(e.target.value)} rows={3} />
          </div>

          {vocab && (
            <div style={{ marginTop: 14, padding: "12px 14px", background: "var(--teal-bg)", borderRadius: 10, border: "1px solid rgba(13,114,114,0.2)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--teal)", marginBottom: 8, textAlign: "right" }}>
                💡 מונחים מקצועיים לדגש בשיחה הזאת
              </div>
              <div className="vocab-strip">
                {vocab.slice(0, 6).map(v => <span key={v} className="vocab-tag">{v}</span>)}
              </div>
            </div>
          )}
        </div>

        {!profile && (
          <div className="card" style={{ background: "var(--amber-bg)", borderColor: "#FFCF87", marginBottom: 0 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexDirection: "row-reverse" }}>
              <i className="ti ti-alert-triangle" style={{ color: "var(--amber)", fontSize: 20, flexShrink: 0 }} aria-hidden />
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "var(--amber)", marginBottom: 2 }}>לא הועלו קורות חיים</div>
                <div style={{ fontSize: 13, color: "var(--navy2)" }}>הבריף ייבנה על פרופיל לדוגמה. העלה קורות חיים לתשובות אישיות ומדויקות.</div>
              </div>
            </div>
          </div>
        )}

        <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={go} disabled={!company.trim() || !role.trim()} style={{ opacity: (!company.trim() || !role.trim()) ? 0.5 : 1, marginTop: 14 }}>
          <i className="ti ti-sparkles" style={{ fontSize: 19 }} aria-hidden />
          צור בריף שיחה
        </button>

        <div style={{ marginTop: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 13, textAlign: "right", marginBottom: 10, color: "var(--muted)" }}>התחל מהר — דוגמאות מגוונות</div>
          {[
            { company: "מליסרון", role: "מנהל/ת נכסים — מרכזי קניות" },
            { company: "בנק לאומי", role: "מנהל/ת סניף בכיר/ה" },
            { company: "כללית שירותי בריאות", role: "רכז/ת גיוס ומשאבי אנוש" },
            { company: "רמי לוי שיווק השקמה", role: "מנהל/ת רכש ולוגיסטיקה" },
            { company: "אלביט מערכות", role: "מנהל/ת פיתוח עסקי" },
          ].map(item => (
            <button key={item.company} className="btn btn-secondary" style={{ width: "100%", justifyContent: "space-between", marginBottom: 8, flexDirection: "row-reverse" }} onClick={() => { setCompany(item.company); setRole(item.role); }}>
              <i className="ti ti-bolt" style={{ fontSize: 15, color: "var(--accent)" }} aria-hidden />
              <span style={{ flex: 1, textAlign: "right", fontSize: 14 }}>{item.company} — {item.role}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function BriefView({ data }) {
  const [mode, setMode] = useState("short");
  const [toast, setToast] = useState(null);
  const { company, role, brief } = data;
  const detailed = mode === "detailed";

  if (!brief) return (
    <div className="empty page">
      <i className="ti ti-notes" aria-hidden />
      <h3>אין בריף פעיל</h3>
      <p>צור בריף לפני השיחה.</p>
    </div>
  );

  return (
    <div>
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      <div className="page" style={{ paddingTop: 8 }}>

        <div className="call-hd">
          <div className="call-co">{company}</div>
          <div className="call-role">{role}</div>
          <div className="call-meta">
            <span className="badge" style={{ background: "rgba(255,255,255,0.14)", color: "#fff" }}>
              <i className="ti ti-sparkles" style={{ fontSize: 11 }} aria-hidden /> בריף מוכן
            </span>
            <span className="badge" style={{ background: "rgba(26,86,219,0.35)", color: "#A5C8FF" }}>
              {brief.roleMatch.headline}
            </span>
          </div>
        </div>

        {/* שפת התחום */}
        {brief.industryVocab?.length > 0 && (
          <div className="card" style={{ borderColor: "rgba(13,114,114,0.25)", background: "var(--teal-bg)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--teal)", marginBottom: 8, textAlign: "right" }}>
              💡 השפה של התחום הזה — תשתמש/י במונחים האלה
            </div>
            <div className="vocab-strip" style={{ padding: 0 }}>
              {brief.industryVocab.map(v => <span key={v} className="vocab-tag">{v}</span>)}
            </div>
          </div>
        )}

        <div className="toggle-g">
          <button className={`toggle-btn ${mode === "panic" ? "on" : ""}`} onClick={() => setMode("panic")} style={mode === "panic" ? { background: "var(--amber-bg)", color: "var(--amber)" } : {}}>🚨 חירום</button>
          <button className={`toggle-btn ${mode === "detailed" ? "on" : ""}`} onClick={() => setMode("detailed")}>מפורט</button>
          <button className={`toggle-btn ${mode === "short" ? "on" : ""}`} onClick={() => setMode("short")}>מהיר</button>
        </div>

        {mode === "panic" && (
          <div>
            <div style={{ padding: "10px 14px", background: "var(--amber-bg)", borderRadius: 10, border: "1px solid #FFCF87", fontSize: 13, color: "var(--amber)", fontWeight: 600, textAlign: "right", marginBottom: 10 }}>
              🚨 מצב חירום — תשובות על הדרך, לרגעי לחץ
            </div>
            {brief.panicMode.map((p, i) => (
              <div key={i} className="panic-box">
                <div className="panic-if">אם: {p.trigger}</div>
                <div className="panic-say">{p.say}</div>
                <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}><CopyBtn text={p.say} /></div>
              </div>
            ))}
            <div className="card" style={{ borderColor: "#FFCDC9", background: "var(--red-bg)", marginTop: 4 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexDirection: "row-reverse", justifyContent: "flex-end", marginBottom: 10 }}>
                <span className="card-title" style={{ color: "var(--red)" }}>🚫 אל תגיד/י אף פעם</span>
              </div>
              <ul className="pts">
                {brief.redFlags.map((r, i) => (
                  <li key={i} className="pt">
                    <span style={{ flex: 1, textAlign: "right", fontSize: 13 }}>{r}</span>
                    <span className="dot red" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {mode !== "panic" && (
          <>
            <Acc icon={<i className="ti ti-microphone" style={{ color: "var(--accent)", fontSize: 15 }} aria-hidden />} iconBg="var(--accent-bg)" title="פיץ' פתיחה — 30 שניות" open>
              <AnsBlock short={brief.openingPitch.short} detailed={brief.openingPitch.detailed} showDetailed={detailed} />
            </Acc>

            <Acc icon={<i className="ti ti-target" style={{ color: "var(--green)", fontSize: 15 }} aria-hidden />} iconBg="var(--green-bg)" title="התאמה לתפקיד" badge={<span className="badge b-green">{brief.roleMatch.headline}</span>}>
              <ul className="pts">
                {brief.roleMatch.points.map((p, i) => (
                  <li key={i} className="pt"><span style={{ flex: 1, textAlign: "right" }}>{p}</span><span className="dot green" /></li>
                ))}
              </ul>
            </Acc>

            <Acc icon={<i className="ti ti-building" style={{ color: "var(--purple)", fontSize: 15 }} aria-hidden />} iconBg="var(--purple-bg)" title={`למה ${company}?`}>
              <ul className="pts">
                {brief.companyFit.points.map((p, i) => (
                  <li key={i} className="pt"><span style={{ flex: 1, textAlign: "right" }}>{p}</span><span className="dot purple" /></li>
                ))}
              </ul>
            </Acc>

            <Acc icon={<i className="ti ti-list-check" style={{ color: "var(--accent)", fontSize: 15 }} aria-hidden />} iconBg="var(--accent-bg)" title="5 נקודות מפתח לדגש" open>
              {brief.talkingPoints.map((tp, i) => (
                <div key={i} style={{ padding: "9px 0", borderBottom: i < brief.talkingPoints.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexDirection: "row-reverse" }}>
                    <span style={{ background: "var(--accent)", color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 2, fontFamily: "var(--mono)" }}>{i + 1}</span>
                    <div style={{ flex: 1, textAlign: "right" }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{tp.point}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 1 }}>{tp.context}</div>
                    </div>
                    <CopyBtn text={tp.point} />
                  </div>
                </div>
              ))}
            </Acc>

            {brief.industryTips?.length > 0 && (
              <Acc icon={<i className="ti ti-language" style={{ color: "var(--teal)", fontSize: 15 }} aria-hidden />} iconBg="var(--teal-bg)" title="איך לדבר בשפה של התחום">
                {brief.industryTips.map((tip, i) => (
                  <div key={i} style={{ padding: "10px 0", borderBottom: i < brief.industryTips.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "var(--teal)" }}>"{tip.tip}"</div>
                      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>{tip.why}</div>
                    </div>
                  </div>
                ))}
              </Acc>
            )}

            <Acc icon={<i className="ti ti-message-question" style={{ color: "var(--green)", fontSize: 15 }} aria-hidden />} iconBg="var(--green-bg)" title="שאלות מגייס/ת ותשובות" open>
              {brief.recruiterQA.map((qa, i) => (
                <div key={i} style={{ paddingBottom: 14, marginBottom: 14, borderBottom: i < brief.recruiterQA.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, display: "flex", gap: 8, alignItems: "flex-start", flexDirection: "row-reverse" }}>
                    <i className="ti ti-question-mark" style={{ fontSize: 14, color: "var(--accent)", flexShrink: 0, marginTop: 2 }} aria-hidden />
                    <span>{qa.q}</span>
                  </div>
                  <AnsBlock short={qa.short} detailed={qa.detailed} showDetailed={detailed} />
                </div>
              ))}
            </Acc>

            <Acc icon={<i className="ti ti-shield" style={{ color: "var(--amber)", fontSize: 15 }} aria-hidden />} iconBg="var(--amber-bg)" title="נקודות רגישות — איך להתמודד" badge={<span className="badge b-amber">{brief.weakSpots.length} נקודות</span>}>
              {brief.weakSpots.map((ws, i) => (
                <div key={i} style={{ marginBottom: i < brief.weakSpots.length - 1 ? 14 : 0 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexDirection: "row-reverse" }}>
                    <span style={{ flex: 1, fontWeight: 600, fontSize: 13, textAlign: "right" }}>{ws.spot}</span>
                    <span className="badge b-amber">⚠ פער</span>
                  </div>
                  <div style={{ background: "var(--surface2)", borderRadius: 8, padding: "10px 12px", fontSize: 13, lineHeight: 1.7, color: "var(--navy2)", textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: "var(--amber)", marginBottom: 4, fontWeight: 700 }}>איך לסגור את זה</div>
                    {ws.handle}
                  </div>
                </div>
              ))}
            </Acc>

            <Acc icon={<i className="ti ti-coins" style={{ color: "var(--green)", fontSize: 15 }} aria-hidden />} iconBg="var(--green-bg)" title="איך לענות על שכר">
              <div style={{ textAlign: "right", marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 4, fontWeight: 700 }}>עוגן שכר</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "var(--green)", fontFamily: "var(--mono)" }}>{brief.salary.anchor}</div>
              </div>
              <div className="ans-box detailed">
                <div className="ans-lbl">תגיד/י ככה</div>
                {brief.salary.script}
              </div>
              <div style={{ marginTop: 10, padding: "10px 12px", background: "var(--amber-bg)", borderRadius: 8, fontSize: 13, color: "var(--amber)", display: "flex", gap: 8, flexDirection: "row-reverse", textAlign: "right" }}>
                <i className="ti ti-bulb" style={{ fontSize: 16, flexShrink: 0 }} aria-hidden />
                <span>{brief.salary.tip}</span>
              </div>
              <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}><CopyBtn text={brief.salary.script} /></div>
            </Acc>

            <Acc icon={<i className="ti ti-help" style={{ color: "var(--accent)", fontSize: 15 }} aria-hidden />} iconBg="var(--accent-bg)" title="שאלות חכמות למגייס/ת">
              {brief.questionsToAsk.map((q, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", borderBottom: i < brief.questionsToAsk.length - 1 ? "1px solid var(--border)" : "none", flexDirection: "row-reverse" }}>
                  <i className="ti ti-arrow-left" style={{ color: "var(--accent)", fontSize: 13, flexShrink: 0, marginTop: 3 }} aria-hidden />
                  <span style={{ fontSize: 14, flex: 1, textAlign: "right" }}>{q}</span>
                  <CopyBtn text={q} />
                </div>
              ))}
            </Acc>

            <Acc icon={<i className="ti ti-trophy" style={{ color: "var(--accent)", fontSize: 15 }} aria-hidden />} iconBg="var(--accent-bg)" title="משפט סגירה חזק">
              <AnsBlock short={brief.closingLine.short} detailed={brief.closingLine.detailed} showDetailed={detailed} />
            </Acc>

            <div className="card" style={{ borderColor: "#FFCDC9", background: "var(--red-bg)" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexDirection: "row-reverse", justifyContent: "flex-end", marginBottom: 10 }}>
                <span className="card-title" style={{ color: "var(--red)" }}>🚫 אסור לגמרי לאמר</span>
              </div>
              <ul className="pts">
                {brief.redFlags.map((r, i) => (
                  <li key={i} className="pt"><span style={{ flex: 1, textAlign: "right", fontSize: 13 }}>{r}</span><span className="dot red" /></li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function QuestionBank({ profile }) {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("הכל");
  const tags = ["הכל", ...Array.from(new Set(RECRUITER_QUESTIONS.map(q => q.tag)))];
  const filtered = filter === "הכל" ? RECRUITER_QUESTIONS : RECRUITER_QUESTIONS.filter(q => q.tag === filter);
  const p = profile || MOCK_CANDIDATE_PROFILE;

  const getAns = (q) => ({
    "ספרי לי על עצמך": `${p.title} עם ניסיון מוכח — ${p.achievements[0]}. מחפש/ת עכשיו תפקיד שבו אפשר לקחת ownership ולהוביל end-to-end.`,
    "למה הפוזיציה הזאת מעניינת אותך?": "אני מחפש/ת תפקיד עם יותר אחריות, ריבוי ממשקים, ועבודה בסביבה שמאפשרת לי להוביל תהליכים בפועל — לא רק לייעץ.",
    "מה הציפיות שלך לשכר?": `המטרה שלי היא ₪${p.salary.min.toLocaleString()}–₪${p.salary.max.toLocaleString()} ${p.salary.currency}. מה הטווח אצלכם?`,
    "למה אתה עוזב את המקום הנוכחי?": `הגעתי לתקרה ב-${p.experience[0]?.company || "המקום הנוכחי"} — רוצה אתגר גדול יותר, יותר ממשקים, ועבודה עם צוות חזק יותר.`,
    "מה החוזקות הכי גדולות שלך?": `${p.skills[0]}, ${p.skills[1]}, ו-${p.skills[2]}. הדוגמה הטובה ביותר: ${p.achievements[0]}.`,
    "מה החולשה הכי גדולה שלך?": p.weakSpots[0] ? `${p.weakSpots[0]} — אני עובד/ת על זה באופן פעיל.` : "לפעמים אני יורד/ת לפרטים יותר מדי — למדתי לאזן.",
    "תביא דוגמה לאתגר שהתמודדת איתו": `ב-${p.experience[0]?.company || "התפקיד הקודם"} — ${p.experience[0]?.bullets?.[0] || "הובלתי תהליך מורכב end-to-end שהניב תוצאות"}. הדגש היה על עמידה בלוחות זמנים ועבודה מול ממשקים מרובים.`,
    "מתי אפשר לצפות לתחילת עבודה?": "אני יכול/ה לתת הודעה של 30 יום. גמיש/ה על התזמון אם יש צורך.",
    "האם זה בסדר לעבוד היברידי / פרונטאלי?": "גמיש/ה לחלוטין — עובד/ת טוב גם בשטח וגם מרחוק. מה הפורמט אצלכם?",
    "יש לך שאלות אליי?": "מה נראה כמו הצלחה ב-90 הימים הראשונים? ומה האתגר הכי גדול שמחכה למי שנכנס לתפקיד?",
  })[q] || "שתף/י דוגמה קונקרטית מהניסיון שלך. תישאר/י ממוקד/ת — 45 שניות זה האידיאל.";

  return (
    <div className="page">
      <div className="pg-title">בנק שאלות</div>
      <div className="pg-sub">שאלות נפוצות בשיחת סינון — עם תשובות בשפה ישראלית.</div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 14, paddingBottom: 4, scrollbarWidth: "none", flexDirection: "row-reverse" }}>
        {tags.map(t => (
          <button key={t} className={`chip ${filter === t ? "on" : ""}`} onClick={() => setFilter(t)}>{t}</button>
        ))}
      </div>
      <div className="card">
        {filtered.map((item, i) => (
          <div key={item.id} className="qb-item" style={i === 0 ? { paddingTop: 0 } : {}}>
            <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 6 }}>{item.q}</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", alignItems: "center" }}>
              <span className="badge b-gray">{item.tag}</span>
              <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, cursor: "pointer" }} onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
                {expanded === item.id ? "הסתר ↑" : "הצג תשובה ↓"}
              </span>
            </div>
            {expanded === item.id && (
              <div style={{ marginTop: 10 }}>
                <div className="ans-box short">
                  <div className="ans-lbl">תשובה מומלצת</div>
                  {getAns(item.q)}
                </div>
                <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}><CopyBtn text={getAns(item.q)} /></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Settings({ profile }) {
  const [lang, setLang] = useState("עברית");
  const [tone, setTone] = useState("ישיר");
  const p = profile || MOCK_CANDIDATE_PROFILE;

  return (
    <div className="page">
      <div className="pg-title">הגדרות</div>
      <div className="pg-sub">התאם/י את אופן הפעולה של CallReady.</div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 12 }}>העדפות שפה וסגנון</div>
        <div className="set-row">
          <div style={{ display: "flex", gap: 6 }}>
            {["עברית", "אנגלית", "דו-לשוני"].map(l => (
              <button key={l} className="btn" style={{ padding: "6px 10px", fontSize: 12, background: lang === l ? "var(--navy)" : "var(--surface2)", color: lang === l ? "#fff" : "var(--muted)", border: "1px solid var(--border)", borderRadius: 8 }} onClick={() => setLang(l)}>{l}</button>
            ))}
          </div>
          <span style={{ fontSize: 14, fontWeight: 500 }}>שפת ממשק</span>
        </div>
        <div className="set-row">
          <div style={{ display: "flex", gap: 6 }}>
            {["ישיר", "חם", "מנהלי"].map(t => (
              <button key={t} className="btn" style={{ padding: "6px 10px", fontSize: 12, background: tone === t ? "var(--navy)" : "var(--surface2)", color: tone === t ? "#fff" : "var(--muted)", border: "1px solid var(--border)", borderRadius: 8 }} onClick={() => setTone(t)}>{t}</button>
            ))}
          </div>
          <span style={{ fontSize: 14, fontWeight: 500 }}>טון התשובות</span>
        </div>
        <div className="set-row">
          <span style={{ fontSize: 13, color: "var(--muted)", fontFamily: "var(--mono)" }}>₪{p.salary.min.toLocaleString()}–₪{p.salary.max.toLocaleString()}/חודש</span>
          <span style={{ fontSize: 14, fontWeight: 500 }}>טווח שכר</span>
        </div>
        <div className="set-row">
          <span style={{ fontSize: 13, color: "var(--muted)" }}>גמיש/ה · היברידי מועדף</span>
          <span style={{ fontSize: 14, fontWeight: 500 }}>זמינות ומיקום</span>
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 10 }}>תפקידי יעד</div>
        <div className="tag-list" style={{ justifyContent: "flex-end" }}>
          {["מנהל/ת נכסים בכיר/ה", "מנהל/ת תיק נכסים", "ראש צוות שיווק", "מנהל/ת מכירות"].map(r => <span key={r} className="skill-tag">{r}</span>)}
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 10 }}>תעשיות יעד</div>
        <div className="tag-list" style={{ justifyContent: "flex-end" }}>
          {["נדל\"ן מסחרי", "פיננסים", "קמעונאות", "בריאות", "תעשייה", "הייטק", "ממשלה וציבורי"].map(i => <span key={i} className="skill-tag">{i}</span>)}
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 4, display: "flex", gap: 8, alignItems: "center", flexDirection: "row-reverse", justifyContent: "flex-end" }}>
          <i className="ti ti-plug" style={{ fontSize: 15, color: "var(--muted)" }} aria-hidden /> חיבורי API
        </div>
        <div style={{ fontSize: 