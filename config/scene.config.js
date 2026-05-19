// ─────────────────────────────────────────────────────────────────────────────
// scene.config.js — single source of truth for the scroll-driven video scene.
//
// To swap the video:
//   1. Drop the new file into /videos/
//   2. Update `video.src` (and `srcWebm` / `poster` if you have them)
//   3. Update `video.duration` (in seconds — used for initial section-height calc.
//      The scene auto-corrects this once the video reports `loadedmetadata`.)
//   4. Tweak `textBlocks` if you want different copy or timing.
//   5. That's it. No component code changes needed.
//
// Text-block timing is expressed as PERCENTAGES of scroll progress (0–100),
// so the same blocks line up correctly even when the video length changes.
// ─────────────────────────────────────────────────────────────────────────────

window.sceneConfig = {
  // ─── Video source ─────────────────────────────────────────────────────────
  // Supports a single source (string) OR per-breakpoint variants:
  //   video: { src: "videos/hero.mp4", srcWebm: "videos/hero.webm", poster: "...", duration: 12 }
  // OR
  //   video: {
  //     desktop: { src: "videos/hero-desktop.mp4", srcWebm: "...", poster: "..." },
  //     mobile:  { src: "videos/hero-mobile.mp4",  srcWebm: "...", poster: "..." },
  //     duration: 12,
  //   }
  video: {
    src: "videos/finish.mp4",
    srcWebm: null,            // e.g. "videos/finish.webm" — null = skip
    poster: null,             // e.g. "videos/finish-poster.jpg" — null = skip
    duration: 12,             // seconds (initial estimate, auto-corrected on load)
  },

  // ─── Scroll calibration ───────────────────────────────────────────────────
  // sectionHeight = duration * scrollSpeedVhPerSec
  // 60vh/sec feels good. Lower = faster scrub. Higher = slower / more "weighty".
  scrollSpeedVhPerSec: 70,

  // ─── Text blocks ──────────────────────────────────────────────────────────
  // start/end are PERCENTS of scroll progress (0–100).
  // Each block also has an EN/HE pair so the page language toggle works.
  // `kind` is a hint to the renderer — "intro" / "stat" / "skills" / "project" / "cta".
  textBlocks: [
    {
      start: 0, end: 14,
      kind: "intro",
      eyebrow: { en: "01 — INTRO",         he: "01 — היכרות" },
      title:   { en: "Hi, I'm Yossi.",      he: "שלום, אני יוסי." },
      body:    { en: "Full-stack developer building end-to-end systems that actually ship.",
                 he: "מפתח Full-Stack שבונה מערכות מקצה לקצה." },
    },
    {
      start: 16, end: 30,
      kind: "stat",
      eyebrow: { en: "02 — Personal Info",  he: "02 — פרטים אישיים" },
      title:   { en: "Personal Info",       he: "פרטים אישיים" },
      body:    { en: "Junior Full-Stack Developer with hands-on experience across TypeScript, .NET, C#, and modern data infrastructure (PostgreSQL, Redis). I build end-to-end web systems on a strong CS foundation from HIT (graduating 2026), comfortable owning a feature from database schema to UI implementation.",
                 he: "מפתח Full-Stack עם ניסיון מעשי ב-TypeScript, .NET ובתשתיות דאטה מודרניות (PostgreSQL, Redis). בונה מערכות ווב שלמות מקצה לקצה על בסיס לימודים אקדמיים במדמ״ח ב-HIT (סיום ב-2026). נוח לי להחזיק פיצ׳ר מסכמת המסד ועד מימוש ה-UI." },
    },
    {
      start: 32, end: 50,
      kind: "skills",
      eyebrow: { en: "03 — STACK",         he: "03 — סטאק" },
      title:   { en: "TypeScript, .NET, and the messy parts in between.",
                 he: "TypeScript, ‎.NET, וכל החיבורים באמצע." },
      body:    { en: "Backend & full-stack: Node, Express, .NET / C#, REST, Socket.IO. Data: PostgreSQL + Prisma / Drizzle, Redis, BullMQ. Frontend: React, Vite, TanStack, Zustand.",
                 he: "בק וצד שרת: Node, Express, ‎.NET / C#, REST, Socket.IO. דאטה: PostgreSQL עם Prisma / Drizzle, Redis, BullMQ. צד לקוח: React, Vite, TanStack, Zustand." },
      chips: ["TypeScript", "C# / .NET", "Node.js", "React", "PostgreSQL", "Redis", "Docker"],
    },
    {
      start: 52, end: 70,
      kind: "project",
      eyebrow: { en: "04 — PROJECT",       he: "04 — פרויקט" },
      title:   { en: "Holdie - AI virtual hold assistant.",
                 he: "Holdie - סוכן AI שמחכה במקומך בקו." },
      body:    { en: "Calls customer-service lines, navigates IVR with an LLM, and bridges you in when a real human answers. pnpm monorepo over PostgreSQL + Redis + BullMQ, Whisper STT, Groq Llama 3.3 70B, Telnyx voice, Stripe, native iOS/Android via Capacitor.",
                 he: "מתקשר למוקדי שירות, מנווט בתפריט הקולי עם LLM, ומחבר אותך כשעונה אדם אמיתי. ארכיטקטורת מונורפו (pnpm) מעל PostgreSQL, Redis, BullMQ, Whisper STT, Groq Llama 3.3 70B, Telnyx, Stripe ואפליקציות נייטיב ל-iOS ול-Android עם Capacitor." },
      meta:    { en: "Full-stack · TypeScript · Solo build",
                 he: "פול-סטאק · TypeScript · בנייה עצמאית" },
    },
    {
      start: 72, end: 86,
      kind: "project",
      eyebrow: { en: "05 — PROJECT",       he: "05 — פרויקט" },
      title:   { en: "Orbit AI - judging & event platform.",
                 he: "Orbit AI - פלטפורמת שיפוט ואירועים." },
      body:    { en: "Role-based dashboards for admins, managers and judges. Schedules, station/rubric config, live scoring, leaderboards. Postgres + Drizzle + Zod, Passport.js with Google OAuth, Express REST, React + Vite.",
                 he: "דשבורדים מבוססי-תפקיד למנהלי מערכת, מנהלי אירוע ושופטים. תזמון, הגדרת רובריקות ועמדות, ניקוד חי ולוחות תוצאות. Postgres עם Drizzle ו-Zod, אימות עם Passport.js ו-Google OAuth, API ב-Express, ו-React עם Vite." },
      meta:    { en: "Full-stack · TypeScript · Team product",
                 he: "פול-סטאק · TypeScript · מוצר צוותי" },
    },
    {
      start: 88, end: 100,
      kind: "cta",
      eyebrow: { en: "06 — SAY HI",        he: "06 — נדבר?" },
      title:   { en: "Looking for a Backend, full-stack, or .NET role.",
                 he: "מחפש תפקיד Backend, פול-סטאק, או ‎.NET." },
      body:    { en: "I move fast on greenfield problems and I'm comfortable owning a feature from schema to UI. Open to remote or Israel-based teams.",
                 he: "מתקדם מהר בבעיות חדשות ונוח לי להחזיק פיצ׳ר משכמת ה-DB ועד ה-UI. פתוח לעבודה מרחוק או בצוותים בארץ." },
      contacts: [
        { label: "yadgar360@gmail.com", href: "mailto:yadgar360@gmail.com", kind: "email" },
        { label: "050-7626144",         href: "tel:+972507626144",          kind: "phone" },
        { label: "LinkedIn",            href: "https://www.linkedin.com/in/yossi-yadgar", kind: "linkedin" },
        { label: "GitHub",              href: "https://github.com/YossiYad", kind: "github" },
      ],
    },
  ],
};

// ─── Validation (fails loudly in console, doesn't break the page) ──────────
(function validateSceneConfig() {
  const c = window.sceneConfig;
  const err = (m) => console.error("[scene.config] " + m);
  if (!c) return err("window.sceneConfig is missing.");
  if (!c.video) return err("video block missing.");

  const hasFlat = typeof c.video.src === "string";
  const hasBP   = c.video.desktop || c.video.mobile;
  if (!hasFlat && !hasBP) err("video.src missing — provide either { src } or { desktop, mobile }.");

  if (typeof c.video.duration !== "number" || c.video.duration <= 0)
    err("video.duration must be a positive number (seconds).");
  if (typeof c.scrollSpeedVhPerSec !== "number" || c.scrollSpeedVhPerSec <= 0)
    err("scrollSpeedVhPerSec must be a positive number.");
  if (!Array.isArray(c.textBlocks) || c.textBlocks.length === 0)
    err("textBlocks must be a non-empty array.");

  (c.textBlocks || []).forEach((b, i) => {
    if (typeof b.start !== "number" || typeof b.end !== "number")
      err("textBlocks[" + i + "] needs numeric start/end (0–100).");
    if (b.start >= b.end) err("textBlocks[" + i + "] start must be < end.");
    if (b.start < 0 || b.end > 100) err("textBlocks[" + i + "] start/end out of 0–100 range.");
  });
})();
