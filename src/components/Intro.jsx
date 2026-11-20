import { useState, useEffect, useRef } from 'react';

/* Opening intro — the EC "AURELIA Intro v2" beats rebuilt for the web:
   porcelain title card (wordmark letters rise from behind a mask, gold
   hairline draws), then an ink curtain rises over the card and lifts away,
   revealing the hero exactly as it lives. The animation is only the
   transition; nothing in the page itself changes. Timings mirror the EC
   comp (2.75s total). Click anywhere to skip. Skipped entirely under
   prefers-reduced-motion (App renders it only when !REDUCED). */
export default function Intro() {
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const doneRef = useRef(false);

  function finish() {
    if (doneRef.current) return;
    doneRef.current = true;
    document.documentElement.classList.remove('intro-lock');
    setDone(true);
  }

  useEffect(() => {
    document.documentElement.classList.add('intro-lock');
    let alive = true;
    /* Start only once Marcellus is in, so the letters never swap fonts
       mid-rise — with a hard fallback so a slow font can never stall it. */
    const fallback = setTimeout(() => {
      if (alive) setStarted(true);
    }, 700);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (alive) {
          clearTimeout(fallback);
          setStarted(true);
        }
      });
    }
    /* Safety: whatever happens, the intro never outlives 5s. */
    const hard = setTimeout(finish, 5000);
    return () => {
      alive = false;
      clearTimeout(fallback);
      clearTimeout(hard);
      document.documentElement.classList.remove('intro-lock');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!started) return undefined;
    const t = setTimeout(finish, 2900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  if (done) return null;

  const letters = 'AURELIA'.split('');
  return (
    <div className={'intro' + (started ? ' intro--on' : '')} onClick={finish} aria-hidden="true">
      <div className="intro-porcelain">
        <div className="intro-mark">
          {letters.map((ch, i) => (
            <span className="intro-lmask" key={i}>
              <span className="intro-letter" style={{ animationDelay: 0.15 + i * 0.06 + 's' }}>
                {ch}
              </span>
            </span>
          ))}
        </div>
        <div className="intro-hairline" />
      </div>
      <div className="intro-ink" />
    </div>
  );
}
