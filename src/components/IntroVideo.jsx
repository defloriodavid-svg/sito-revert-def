import { useEffect, useRef, useState } from "react";

const INTRO_KEY = "revert-intro-seen-v4";
const MOBILE_QUERY = "(max-width: 768px)";
const SAFETY_TIMEOUT_MS = 14000;

export default function IntroVideo() {
  const videoRef = useRef(null);
  const closeTimer = useRef(null);
  const safetyTimer = useRef(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches
  );
  const [visible, setVisible] = useState(() => {
    try {
      return sessionStorage.getItem(INTRO_KEY) !== "true";
    } catch {
      return true;
    }
  });
  const [leaving, setLeaving] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const videoSrc = isMobile
    ? "/videos/revert-intro-mobile.mp4"
    : "/videos/revert-intro-desktop.mp4";

  const finishIntro = () => {
    if (leaving) return;
    try { sessionStorage.setItem(INTRO_KEY, "true"); } catch {}
    setLeaving(true);
    closeTimer.current = window.setTimeout(() => setVisible(false), 350);
  };

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const update = (event) => setIsMobile(event.matches);
    setIsMobile(media.matches);
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (!visible) return;
    document.body.classList.add("intro-is-open");
    safetyTimer.current = window.setTimeout(finishIntro, SAFETY_TIMEOUT_MS);

    const video = videoRef.current;
    if (video) {
      video.load();
      video.play().catch(() => {});
    }

    return () => {
      document.body.classList.remove("intro-is-open");
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      if (safetyTimer.current) window.clearTimeout(safetyTimer.current);
    };
  }, [visible, videoSrc]);

  if (!visible) return null;

  return (
    <div className={`intro-video-screen ${leaving ? "is-leaving" : ""}`} aria-label="Intro REVERT">
      <video
        key={videoSrc}
        ref={videoRef}
        className={`intro-video ${isMobile ? "intro-video-mobile" : "intro-video-desktop"}`}
        src={videoSrc}
        autoPlay
        muted
        playsInline
        preload="metadata"
        onLoadedData={(event) => event.currentTarget.play().catch(() => {})}
        onEnded={finishIntro}
        onError={() => setVideoError(true)}
      />
      {videoError && <div className="intro-video-error">Video non disponibile</div>}
      <button className="intro-skip-button" type="button" onClick={finishIntro} aria-label="Entra nel sito">
        ENTRA
      </button>
    </div>
  );
}
