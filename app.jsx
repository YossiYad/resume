// app.jsx — mounts the topbar (brand + lang toggle), scene, and footer.
// Layout / scroll-speed / etc. are locked to the values picked during design.
// To update content, edit config/scene.config.js — not this file.

const { useEffect, useState, useCallback } = React;

const SCENE_DEFAULTS = {
  variant: "editorial",
  scrollSpeed: 70,
  showRail: true,
  videoFit: "contain",
};

const STRINGS = {
  en: { role: "Full-Stack Developer", langEN: "EN", langHE: "HE" },
  he: { role: "מפתח פול-סטאק",       langEN: "EN", langHE: "עב" },
};

function Topbar({ lang, setLang }) {
  const s = STRINGS[lang];
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="glyph">Y</span>
        <span>Yossi Yadgar</span>
        <span className="role">{s.role}</span>
      </div>
      <div className="lang-toggle" role="tablist" aria-label="Language">
        <button
          role="tab"
          aria-selected={lang === "en"}
          className={lang === "en" ? "is-active" : ""}
          onClick={() => setLang("en")}
        >{STRINGS.en.langEN}</button>
        <button
          role="tab"
          aria-selected={lang === "he"}
          className={lang === "he" ? "is-active" : ""}
          onClick={() => setLang("he")}
        >{STRINGS.he.langHE}</button>
      </div>
    </header>
  );
}

function App() {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem("yy-lang") || "en"; } catch (e) { return "en"; }
  });
  const setLang = useCallback((v) => {
    setLangState(v);
    try { localStorage.setItem("yy-lang", v); } catch (e) {}
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-lang", lang);
    document.body.setAttribute("dir", lang === "he" ? "rtl" : "ltr");
  }, [lang]);

  return (
    <>
      <Topbar lang={lang} setLang={setLang} />

      <Scene
        variant={SCENE_DEFAULTS.variant}
        lang={lang}
        scrollSpeedVhPerSec={SCENE_DEFAULTS.scrollSpeed}
        showRail={SCENE_DEFAULTS.showRail}
        videoFit={SCENE_DEFAULTS.videoFit}
      />

      <footer className="scene-footer">
        {lang === "he"
          ? "תודה על הצפייה · yadgar360@gmail.com"
          : "Thanks for scrolling · yadgar360@gmail.com"}
      </footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
