# CallReady 🎯

**עוזר AI להכנה לשיחת סינון עם גורמי גיוס**

מערכת מותאמת לשוק הישראלי — עברית מלאה, RTL, שפה מקצועית לפי תחום.

---

## 🚀 התקנה מהירה

```bash
# 1. שכפול הפרויקט
git clone https://github.com/YOUR_USERNAME/callready.git
cd callready

# 2. התקנת dependencies
npm install

# 3. הגדרת משתני סביבה
cp .env.local.example .env.local
# ערוך את .env.local והוסף את המפתחות

# 4. הרצה מקומית
npm run dev
```

פתחי http://localhost:3000

---

## 🔑 משתני סביבה

| משתנה | מה עושה | איפה להשיג |
|---|---|---|
| `ANTHROPIC_API_KEY` | יצירת בריפים עם AI | [console.anthropic.com](https://console.anthropic.com) |
| `SERPER_API_KEY` | מחקר חברות בגוגל | [serper.dev](https://serper.dev) |
| `TAVILY_API_KEY` | מחקר מעמיק | [tavily.com](https://tavily.com) |

**לעבוד בלי API?** האפליקציה עובדת עם mock מלא — לא חובה.

---

## 📁 מבנה הפרויקט

```
callready/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout — עברית RTL
│   │   ├── page.tsx            # דף ראשי
│   │   ├── globals.css         # CSS variables
│   │   └── api/
│   │       └── generate-brief/
│   │           └── route.ts    # API route — Anthropic
│   ├── components/
│   │   └── CallReadyApp.tsx    # הרכיב הראשי — כל המסכים
│   ├── lib/
│   │   ├── generateBrief.ts    # לוגיקת יצירת הבריף
│   │   ├── industryVocab.ts    # מילון מונחים לפי תחום
│   │   └── mockData.ts         # נתוני דוגמה
│   └── types/
│       └── index.ts            # טיפוסי TypeScript
├── .env.local.example          # תבנית משתני סביבה
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## 🔧 חיבור Anthropic API (אמיתי)

### שלב 1 — התקנת ה-SDK
```bash
npm install @anthropic-ai/sdk
```

### שלב 2 — עדכון route.ts
פתחי `src/app/api/generate-brief/route.ts` ובטלי את ה-comment מהקוד.

### שלב 3 — עדכון generateBrief.ts
החליפי את `buildBriefFromProfile` בקריאה ל-API:
```ts
const res = await fetch("/api/generate-brief", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ candidate, company, role, jd }),
});
return res.json();
```

---

## 🌐 דפלוי ל-Vercel

```bash
npx vercel
```

או: Push ל-GitHub → חבר ל-Vercel → הוסף משתני סביבה → Deploy אוטומטי.

---

## ✅ פיצ'רים קיימים (MVP)

- [x] העלאת קורות חיים (mock parser)
- [x] יצירת בריף שיחה מותאם אישית
- [x] זיהוי שפת תחום אוטומטי (נדל"ן, הייטק, בריאות, HR...)
- [x] בנק שאלות + תשובות מותאמות
- [x] מצב חירום (Panic Mode)
- [x] כפתורי העתקה לכל תשובה
- [x] עברית מלאה + RTL
- [x] Mobile-first

## 📋 TODO — השלבים הבאים

- [ ] חיבור Anthropic API אמיתי
- [ ] Parser אמיתי לקורות חיים (pdf.js)
- [ ] חיבור Serper/Tavily למחקר חברות
- [ ] אחסון מקומי (localStorage) לשמירת פרופיל
- [ ] תמיכה באנגלית
- [ ] ייצוא בריף ל-PDF

---

## 📄 רישיון

MIT
