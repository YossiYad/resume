// scene.jsx
// Scroll-driven video scene. Reads everything from window.sceneConfig.
// The video.currentTime is driven by the scroll progress within the section.
// All variant-specific styling lives in CSS via [data-variant] selectors.

const { useEffect, useRef, useState, useMemo, useCallback } = React;

// ─── Helpers ────────────────────────────────────────────────────────────────

function pickVideoSource(cfg) {
  const v = cfg.video || {};
  if (typeof v.src === "string") {
    return { src: v.src, srcWebm: v.srcWebm || null, poster: v.poster || null };
  }
  // Per-breakpoint variants
  const isMobile = window.matchMedia("(max-width: 720px)").matches;
  const variant = isMobile && v.mobile ? v.mobile : v.desktop || v.mobile || {};
  return {
    src: variant.src || "",
    srcWebm: variant.srcWebm || null,
    poster: variant.poster || null
  };
}

function localized(field, lang) {
  if (field == null) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.en || field.he || "";
}

// 0..1 visibility for a block, with `fade` edges (in percent units)
function blockOpacity(progress, block, fade = 3) {
  const p = progress * 100;
  const { start, end } = block;
  if (p < start - fade || p > end + fade) return 0;
  if (p < start) return Math.max(0, (p - (start - fade)) / fade);
  if (p > end) return Math.max(0, 1 - (p - end) / fade);
  return 1;
}

// ─── Icons ──────────────────────────────────────────────────────────────────

function Icon({ kind }) {
  const props = { className: "ico", width: 14, height: 14, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  if (kind === "email") return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
  if (kind === "phone") return <svg {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.91.34 1.81.66 2.66a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.42-1.42a2 2 0 0 1 2.11-.45c.85.32 1.75.54 2.66.66A2 2 0 0 1 22 16.92Z" /></svg>;
  if (kind === "linkedin") return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10v7" /><circle cx="8" cy="7" r="0.5" fill="currentColor" /><path d="M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" /></svg>;
  if (kind === "github") return <svg {...props}><path d="M9 19c-4 1.5-4-2-6-2m12 5v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7a5.44 5.44 0 0 0-1.5-3.75 5.07 5.07 0 0 0-.09-3.77S17.68 1.6 14 4.06a13.4 13.4 0 0 0-7 0C3.32 1.6 2.09 2 2.09 2a5.07 5.07 0 0 0-.09 3.77 5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 6 19.13V23" /></svg>;
  if (kind === "arrow") return <svg {...props}><path d="M5 12h14M13 5l7 7-7 7" /></svg>;
  return null;
}

// ─── Video layer (memoized so changes to progress don't rebuild it) ─────────

const VideoLayer = React.memo(function VideoLayer({ videoRef, src, srcWebm, poster }) {
  return (
    <div className="scene-video-wrap">
      <video
        ref={videoRef}
        muted
        defaultMuted
        autoPlay
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        x5-video-player-type="h5"
        disableRemotePlayback
        preload="auto"
        poster={poster || undefined}
        // muted + playsInline + autoPlay is the iOS-Safari combo that lets the
        // first frame paint on page load WITHOUT a user gesture. The scroll
        // loop below pauses it immediately and drives currentTime from scroll.
      >
        {srcWebm && <source src={srcWebm} type="video/webm" />}
        <source src={src} type="video/mp4" />
      </video>
      <div className="scene-scrim" aria-hidden="true" />
    </div>);

});

// ─── Text block ─────────────────────────────────────────────────────────────

function TextBlock({ block, lang, opacity, index, total }) {
  if (opacity <= 0.001) return null; // skip render when fully hidden
  const eyebrow = localized(block.eyebrow, lang);
  const title = localized(block.title, lang);
  const body = localized(block.body, lang);
  const meta = localized(block.meta, lang);

  const lift = (1 - opacity) * 14; // slide up as it fades in
  // --tb-lift is composed into each variant's CSS transform so we don't clobber.
  const style = { opacity, "--tb-lift": `${lift}px` };

  return (
    <div className="tb" data-kind={block.kind} style={style}>
      <div className="tb-card">
        {eyebrow && <div className="tb-eyebrow">{eyebrow}</div>}
        {title && <h2 className="tb-title" style={{ fontFamily: '"Instrument Serif", "Frank Ruhl Libre", Georgia, serif', fontWeight: "500" }}>{title}</h2>}
        {body && <p className="tb-body" style={{ fontFamily: '"Instrument Serif", "Frank Ruhl Libre", Georgia, serif', fontWeight: "400", fontSize: "25px" }}>{body}</p>}

        {block.kind === "skills" && Array.isArray(block.chips) &&
        <div className="tb-chips">
            {block.chips.map((c) => <span key={c} className="tb-chip">{c}</span>)}
          </div>
        }

        {meta && <div className="tb-meta">{meta}</div>}

        {block.kind === "cta" && Array.isArray(block.contacts) &&
        <div className="tb-contacts">
            {block.contacts.map((c, i) =>
          <a key={i}
          href={c.href}
          target={c.href && c.href.startsWith("http") ? "_blank" : undefined}
          rel="noopener"
          className={"tb-contact" + (i === 0 ? " is-primary" : "")}>
                <Icon kind={c.kind} />
                <span>{c.label}</span>
              </a>
          )}
          </div>
        }

        {Array.isArray(block.links) && block.links.length > 0 &&
        <div className="tb-contacts">
            {block.links.map((c, i) =>
          <a key={i}
          href={c.href}
          target={c.href && c.href.startsWith("http") ? "_blank" : undefined}
          rel="noopener"
          className={"tb-contact" + (i === 0 ? " is-primary" : "")}>
                <Icon kind={c.kind || "arrow"} />
                <span>{c.label}</span>
              </a>
          )}
          </div>
        }
      </div>
    </div>);

}

// ─── Progress rail ──────────────────────────────────────────────────────────

function ProgressRail({ progress, blocks, lang }) {
  return (
    <div className="scene-rail" aria-hidden="true">
      <div className="scene-rail-track">
        <div className="scene-rail-fill" style={{ height: `${Math.max(0, Math.min(100, progress * 100))}%` }} />
      </div>
      <div className="scene-rail-marks">
        {blocks.map((b, i) => {
          const center = (b.start + b.end) / 2;
          const p100 = progress * 100;
          const active = p100 >= b.start - 2 && p100 <= b.end + 2;
          return (
            <div key={i}
            className={"scene-rail-mark" + (active ? " is-active" : "")}
            style={{ top: `${center}%` }}>
              <span className="dot" />
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
            </div>);

        })}
      </div>
    </div>);

}

// ─── Scroll hint ────────────────────────────────────────────────────────────

function ScrollHint({ progress, lang }) {
  // Context-aware: at the very top, hint points DOWN from the bottom of the
  // viewport; at the very bottom, it sits below the topbar and points UP.
  const atTop = progress < 0.015;
  const atBottom = progress > 0.985;
  if (!atTop && !atBottom) return null;

  const dir = atTop ? "down" : "up";
  const label = lang === "he" ? "גלול" : "Scroll";

  return (
    <div className={`scroll-hint scroll-hint-${dir}`}>
      {dir === "up" && <span className="bar" />}
      <span className="lbl">{label}</span>
      {dir === "down" && <span className="bar" />}
    </div>);

}

// ─── Main scene ─────────────────────────────────────────────────────────────

function Scene({ variant = "glass", lang = "en", scrollSpeedVhPerSec, showRail = true, videoFit = "contain" }) {
  const cfg = window.sceneConfig;
  if (!cfg) {
    return <div style={{ padding: 24, color: "#c00" }}>[scene] window.sceneConfig is missing.</div>;
  }

  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const targetTimeRef = useRef(0);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(cfg.video.duration || 12);

  const sourceInfo = useMemo(() => pickVideoSource(cfg), []);
  const speed = scrollSpeedVhPerSec || cfg.scrollSpeedVhPerSec || 60;
  const sectionHeightVh = duration * speed;

  // ─── Scroll → progress ───────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = sec.offsetHeight - vh;
      const scrolled = -rect.top;
      let p = total > 0 ? scrolled / total : 0;
      p = Math.max(0, Math.min(1, p));
      setProgress(p);
      targetTimeRef.current = p * duration;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [duration]);

  // ─── RAF: smoothly approach target currentTime ───────────────────────────
  useEffect(() => {
    let raf;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const v = videoRef.current;
      if (v && v.readyState >= 2 && duration > 0) {
        const cur = v.currentTime;
        const tgt = targetTimeRef.current;
        const diff = tgt - cur;
        // jump if huge, ease in otherwise
        const next = Math.abs(diff) > 0.8 ? tgt : cur + diff * Math.min(1, dt * 14);
        const clamped = Math.max(0, Math.min(duration - 0.02, next));
        if (Math.abs(clamped - cur) > 0.005) {
          try {v.currentTime = clamped;} catch (e) {}
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration]);

  // ─── On metadata: correct duration ───────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onMeta = () => {
      const real = v.duration;
      if (real && isFinite(real) && Math.abs(real - duration) > 0.2) {
        setDuration(real);
      }
    };
    if (v.readyState >= 1) onMeta();
    v.addEventListener("loadedmetadata", onMeta);
    return () => v.removeEventListener("loadedmetadata", onMeta);
  }, []); // mount only

  // ─── Autoplay-driven first-frame paint: muted + playsInline + autoPlay
  // is the iOS Safari combo that lets the video paint frame 0 on load,
  // without waiting for a user gesture. As soon as it starts playing we
  // pause it and seek to the scroll-driven target so the scroll loop
  // takes over without a visible flash of forward playback.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let snapped = false;
    const snap = () => {
      if (snapped) return;
      snapped = true;
      try {
        v.pause();
        v.currentTime = targetTimeRef.current || 0;
      } catch (e) {}
    };
    v.addEventListener("playing", snap, { once: true });
    v.addEventListener("timeupdate", snap, { once: true });
    return () => {
      v.removeEventListener("playing", snap);
      v.removeEventListener("timeupdate", snap);
    };
  }, []); // mount only

  // ─── Gesture fallback: if autoplay was blocked (older WebViews, strict
  // power-saving modes), this still kicks play()→pause() on the first
  // touch/scroll/click so the scroll-scrub works.
  useEffect(() => {
    let unlocked = false;
    const unlock = () => {
      if (unlocked) return;
      const v = videoRef.current;
      if (!v) return;
      unlocked = true;
      try {
        const p = v.play();
        if (p && typeof p.then === "function") {
          p.then(() => { try { v.pause(); v.currentTime = targetTimeRef.current || 0; } catch(e){} })
           .catch(() => {});
        } else {
          try { v.pause(); } catch(e) {}
        }
      } catch(e) {}
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("touchend",   unlock);
      window.removeEventListener("scroll",     unlock);
      window.removeEventListener("click",      unlock);
      window.removeEventListener("pointerdown",unlock);
    };
    window.addEventListener("touchstart",  unlock, { passive:true });
    window.addEventListener("touchend",    unlock, { passive:true });
    window.addEventListener("scroll",      unlock, { passive:true });
    window.addEventListener("click",       unlock);
    window.addEventListener("pointerdown", unlock);
    return () => {
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("touchend",   unlock);
      window.removeEventListener("scroll",     unlock);
      window.removeEventListener("click",      unlock);
      window.removeEventListener("pointerdown",unlock);
    };
  }, []); // mount only

  return (
    <section
      ref={sectionRef}
      className="scene-section"
      data-variant={variant}
      data-lang={lang}
      data-fit={videoFit}
      data-screen-label="Scene"
      style={{ height: `${sectionHeightVh}vh` }}>
      
      <div className="scene-sticky">
        <VideoLayer videoRef={videoRef} {...sourceInfo} />

        <div className="scene-content">
          {cfg.textBlocks.map((b, i) =>
          <TextBlock
            key={i}
            block={b}
            lang={lang}
            index={i}
            total={cfg.textBlocks.length}
            opacity={blockOpacity(progress, b)} />

          )}
        </div>

        {showRail && <ProgressRail progress={progress} blocks={cfg.textBlocks} lang={lang} />}
        <ScrollHint progress={progress} lang={lang} />
      </div>
    </section>);

}

window.Scene = Scene;