// ============================================================
// CallReady — טיפוסי TypeScript
// ============================================================

export interface Experience {
  company: string;
  title: string;
  period: string;
  bullets: string[];
}

export interface Education {
  degree: string;
  school: string;
  year: string;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

export interface CandidateProfile {
  name: string;
  title: string;
  email: string;
  summary: string;
  experience: Experience[];
  skills: string[];
  education: Education[];
  achievements: string[];
  salary: SalaryRange;
  weakSpots: string[];
  languages: string[];
}

export interface TalkingPoint {
  point: string;
  context: string;
}

export interface RecruiterQA {
  q: string;
  short: string;
  detailed: string;
}

export interface WeakSpot {
  spot: string;
  handle: string;
}

export interface SalaryAnswer {
  anchor: string;
  script: string;
  tip: string;
}

export interface PanicItem {
  trigger: string;
  say: string;
}

export interface IndustryTip {
  tip: string;
  why: string;
}

export interface CallBrief {
  industryVocab: string[];
  industryTips: IndustryTip[];
  openingPitch: { short: string; detailed: string };
  roleMatch: { headline: string; points: string[] };
  companyFit: { headline: string; points: string[] };
  talkingPoints: TalkingPoint[];
  recruiterQA: RecruiterQA[];
  weakSpots: WeakSpot[];
  salary: SalaryAnswer;
  questionsToAsk: string[];
  closingLine: { short: string; detailed: string };
  panicMode: PanicItem[];
  redFlags: string[];
}

export interface BriefData {
  company: string;
  role: string;
  jd?: string;
  brief: CallBrief;
}

export interface SavedBrief {
  id: number;
  company: string;
  role: string;
  date: string;
  score: number;
}

export type IndustryKey =
  | "נדלן"
  | "סטארטאפ"
  | "פיתוח_עסקי"
  | "ניהול"
  | "כספים"
  | "hr"
  | "קמעונאות"
  | "בריאות";
