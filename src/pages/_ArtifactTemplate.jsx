// src/pages/_ArtifactTemplate.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ArtifactTemplate({ title, src, subtitles, poster, modelUrl }) {
  const nav = useNavigate();
  const vidRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);

  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;

    const tryAutoplay = async () => {
      try {
        v.muted = false;
        await v.play();
        setPlaying(true);
        setMuted(false);
      } catch {
        try {
          v.muted = true;
          await v.play();
          setPlaying(true);
          setMuted(true);
          setNeedsGesture(true);
        } catch {
          setNeedsGesture(true);
        }
      }
    };

    const t = setTimeout(tryAutoplay, 50);
    const onKey = (e) => { if (e.key === "Escape") nav("/"); };
    window.addEventListener("keydown", onKey);

    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [nav]);

  const togglePlay = async () => {
    const v = vidRef.current;
    if (!v) return;

    if (v.paused) {
      try {
        v.muted = false;
        await v.play();
        setPlaying(true);
        setMuted(false);
        setNeedsGesture(false);
      } catch {
        try {
          v.muted = true;
          await v.play();
          setPlaying(true);
          setMuted(true);
        } catch { /* still blocked */ }
      }
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="video-wrap" onPointerDown={togglePlay} dir="rtl">
      {/* Title bar (kept) */}
      <div className="video-head">{title}</div>

      {/* Top-left: Skip to 3D button */}
      {modelUrl && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nav("/model", { state: { modelUrl, title } });
          }}
          style={{
            position: "absolute",
            top: "calc(16px + var(--safe-top, 0px))",
            left: "calc(16px + var(--safe-left, 0px))",
            padding: "12px 20px",
            borderRadius: 12,
            fontSize: "clamp(14px, 2.5vw, 18px)",
            border: "2px solid rgba(255,255,255,.35)",
            background: "rgba(0,0,0,.65)",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(0,0,0,.4)",
            zIndex: 5
          }}
        >
          דלג למודל תלת־ממד
        </button>
      )}

      {/* Video area */}
      <div className="player">
        <video
          ref={vidRef}
          playsInline
          controls={false}
          poster={poster}
          preload="auto"
        >
          <source src={src} type="video/mp4" />

          {subtitles?.he && (
            <track
              label="עברית"
              kind="subtitles"
              srcLang="he"
              src={subtitles.he}
              default
            />
          )}
          {subtitles?.en && (
            <track
              label="English"
              kind="subtitles"
              srcLang="en"
              src={subtitles.en}
            />
          )}
          {subtitles?.ar && (
            <track
              label="العربية"
              kind="subtitles"
              srcLang="ar"
              src={subtitles.ar}
            />
          )}

          הדפדפן שלך אינו תומך בווידאו HTML5.
        </video>

        {/* Center overlay only when autoplay is blocked */}
        {needsGesture && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none"
            }}
          >
            <div
              style={{
                background: "rgba(0,0,0,.45)",
                padding: "14px 22px",
                borderRadius: 14,
                fontSize: "clamp(16px, 2.6vw, 22px)"
              }}
            >
              {playing ? (muted ? "Tap to unmute" : "") : "Tap to play"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
