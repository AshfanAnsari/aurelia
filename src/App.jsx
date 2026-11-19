import { useState, useEffect, useRef } from 'react';
import { REDUCED, SAVE_DATA, isMobile, initVanilla, img, inr } from './lib';
import { METALS, STONES, CARATS, VIEWS, DEALS, SEARCH_ITEMS, CUSTOM_PRICE } from './data';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Explore from './components/Explore';
import Collection from './components/Collection';
import Configurator from './components/Configurator';
import Heritage from './components/Heritage';
import Voices from './components/Voices';
import InnerCircle from './components/InnerCircle';
import Footer from './components/Footer';
import Overlays from './components/Overlays';

/* ---------------- Theme pour ----------------
   The whole page exists twice during a pour: the base layer (committed
   theme, interactive, the only one with playing videos) and a reveal layer
   (target theme, inert, poster stills instead of videos) that is clipped by
   an SVG wave path while a canvas draws the falling stream, splash droplets
   and the meniscus rim — the Ortune reference technique. All app state stays
   here in App and is shared by both layers, so they can never diverge. */
const THEME_KEY = 'aurelia-theme';

function initialTheme() {
  try {
    return window.localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
  } catch (e) {
    return 'light';
  }
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function easeInQuad(t) {
  return t * t;
}

export default function App() {
  const [wish, setWish] = useState(false);
  const [concierge, setConcierge] = useState(false);
  const [conciergeMsg, setConciergeMsg] = useState('');
  const [conciergeSent, setConciergeSent] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [drawer, setDrawer] = useState(false);
  const [legal, setLegal] = useState(null);
  const heroVideoRef = useRef(null);

  /* Theme + pour state */
  const [theme, setTheme] = useState(initialTheme);
  const [pourTarget, setPourTarget] = useState(null);
  const stageRef = useRef(null);
  const clipPathRef = useRef(null);
  const fxCanvasRef = useRef(null);
  const pouringRef = useRef(false);
  const pourSourceRef = useRef(null);

  /* Configurator state */
  const [metal, setMetal] = useState(METALS[0]);
  const [stone, setStone] = useState(STONES[2]);
  const [carat, setCarat] = useState(CARATS[2]);
  const [view, setView] = useState(0);
  const [engOpen, setEngOpen] = useState(false);
  const [engraving, setEngraving] = useState('');
  const [reserved, setReserved] = useState(false);
  const targetPrice = metal.price + stone.price + carat.add;
  const [shownPrice, setShownPrice] = useState(targetPrice);
  const priceRef = useRef(targetPrice);
  const ringVideoRef = useRef(null);

  /* Inner circle */
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  /* Shared bag + bento state */
  const [bag, setBag] = useState([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);
  const bagKey = useRef(0);
  const [dealIdx, setDealIdx] = useState(0);
  const [dealFavs, setDealFavs] = useState({ choker: true });
  const [popFavs, setPopFavs] = useState({ 'pop-tennis': true });
  const [customOpen, setCustomOpen] = useState(false);
  const [customMetal, setCustomMetal] = useState('Platinum');
  const [customSize, setCustomSize] = useState('6');
  const [customEng, setCustomEng] = useState('');
  const [listMode, setListMode] = useState(null);
  const [collHi, setCollHi] = useState(false);
  const hiTimer = useRef(null);

  function showToast(msg) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2400);
  }

  function addToBag(item) {
    bagKey.current += 1;
    const entry = { key: 'b' + bagKey.current, title: item.title, price: item.price, img: item.img };
    setBag((b) => b.concat([entry]));
    showToast('Added ' + item.title + ' (' + inr(item.price) + ') to bag');
  }

  function removeFromBag(key) {
    setBag((b) => b.filter((i) => i.key !== key));
  }

  const bagTotal = bag.reduce((sum, i) => sum + i.price, 0);

  /* Viewport class — reactive: the film variant follows rotation/resize
     across the 900px breakpoint instead of freezing at first render. */
  const [mobile, setMobile] = useState(isMobile);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const onChange = () => setMobile(mq.matches);
    onChange();
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);
  const noFilm = REDUCED || SAVE_DATA;

  /* Committed theme → document tokens (body + overlays) + persistence +
     the browser chrome colour (theme-color follows the committed theme). */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const tc = document.querySelector('meta[name="theme-color"]');
    if (tc) tc.setAttribute('content', theme === 'dark' ? '#0E0E11' : '#F6F6F7');
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* private mode — theme simply won't persist */
    }
  }, [theme]);

  function toggleTheme(sourceEl) {
    if (pouringRef.current) return;
    const target = theme === 'dark' ? 'light' : 'dark';
    if (REDUCED) {
      setTheme(target);
      return;
    }
    pouringRef.current = true;
    pourSourceRef.current = sourceEl || null;
    setPourTarget(target);
  }

  /* The pour engine — runs while the reveal layer is mounted.
     Choreography (Ortune): the stream falls from the toggle (~200ms), the
     pool then rises and fills the page behind a sloshing wave (~1000ms),
     the stream pinches off and droplets settle (~150ms). Total ≈ 1.35s. */
  useEffect(() => {
    if (!pourTarget) return undefined;
    const target = pourTarget;
    const stage = stageRef.current;
    const pathEl = clipPathRef.current;
    const canvas = fxCanvasRef.current;
    if (!stage || !pathEl || !canvas || !canvas.getContext) {
      pouringRef.current = false;
      setTheme(target);
      setPourTarget(null);
      return undefined;
    }
    const fxCtx = canvas.getContext ? canvas.getContext('2d') : null;
    if (!fxCtx) {
      pouringRef.current = false;
      setTheme(target);
      setPourTarget(null);
      return undefined;
    }
    const pouringLight = target === 'light';
    const W = window.innerWidth;
    const H = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    fxCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const scrollY = window.scrollY || 0;
    const stageDocTop = stage.getBoundingClientRect().top + scrollY;
    const stageH = stage.offsetHeight;

    /* Spout origin — measured from the toggle that was clicked */
    let src = pourSourceRef.current;
    pourSourceRef.current = null;
    if (!src) src = stage.querySelector('.theme-layer--base .theme-toggle');
    let spoutX = W - 60;
    let spoutYViewport = 32;
    if (src) {
      const rect = src.getBoundingClientRect();
      spoutX = pouringLight ? rect.right - 16 : rect.left + 16;
      spoutYViewport = rect.top + rect.height * 0.52;
    }

    const liquidColor = pouringLight ? '#F5F5F7' : '#0C0C0F';
    const liquidHighlight = pouringLight ? 'rgba(255,255,255,0.92)' : 'rgba(217,184,120,0.42)';
    const streamGlow = pouringLight ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)';

    document.documentElement.classList.add('pour-lock');
    pathEl.setAttribute('d', `M 0 ${stageH + 60} L ${W} ${stageH + 60} L ${W} ${stageH + 80} L 0 ${stageH + 80} Z`);

    const FALL_MS = 200;
    const FILL_MS = 1000;
    const SETTLE_MS = 150;
    const TOTAL_MS = FALL_MS + FILL_MS + SETTLE_MS;

    const droplets = [];
    let splashBurstDone = false;
    function spawnSplash(x, y, count, speedScale) {
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI * (0.15 + Math.random() * 0.7);
        const speed = (120 + Math.random() * 240) * speedScale;
        droplets.push({
          x: x + (Math.random() - 0.5) * 14,
          y: y - Math.random() * 4,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 1.6 + Math.random() * 3.1,
          life: 1.0,
        });
      }
    }

    let raf = 0;
    let finished = false;
    const startTime = performance.now();
    let prevTime = startTime;

    function teardown() {
      cancelAnimationFrame(raf);
      fxCtx.clearRect(0, 0, W, H);
      document.documentElement.classList.remove('pour-lock');
      pouringRef.current = false;
    }
    function finish() {
      if (finished) return;
      finished = true;
      teardown();
      setTheme(target);
      setPourTarget(null);
    }

    function tick(now) {
      const elapsed = now - startTime;
      const dt = Math.min(0.04, (now - prevTime) / 1000);
      prevTime = now;

      fxCtx.clearRect(0, 0, W, H);

      /* Phase 1 — the falling stream tip */
      const fallP = Math.min(1, elapsed / FALL_MS);
      const streamBottomY = spoutYViewport + (H - spoutYViewport) * easeInQuad(fallP);

      /* Phase 2 — the rising pool level */
      const fillElapsed = Math.max(0, elapsed - FALL_MS);
      const fillP = Math.min(1, fillElapsed / FILL_MS);
      const easedFill = easeInOutCubic(fillP);
      const baseSurfaceYViewport = H + 18 - (H + 64) * easedFill;

      if (fallP >= 1 && !splashBurstDone) {
        splashBurstDone = true;
        spawnSplash(spoutX, H - 4, 16, 1.0);
      }
      if (fillP > 0.02 && fillP < 0.88 && Math.random() < 0.38) {
        spawnSplash(spoutX, baseSurfaceYViewport, 1, 0.45);
      }

      /* The sloshing surface — multi-harmonic (Ortune). Quality knob:
         small screens draw fewer wave segments (30 vs 52) so the dual-layer
         pour stays smooth on phone GPUs; the shape is indistinguishable. */
      const segments = W <= 600 ? 30 : 52;
      const waveAmp = fillP <= 0 ? 0 : Math.sin(fillP * Math.PI) * 16 + 4 * (1 - fillP);
      const tSec = elapsed * 0.0058;
      const wavePoints = [];
      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * W;
        const nx = i / segments;
        const w1 = Math.sin(nx * Math.PI * 3.2 - tSec * 1.6) * waveAmp * 0.62;
        const w2 = Math.cos(nx * Math.PI * 5.8 + tSec * 2.3) * waveAmp * 0.28;
        const w3 = Math.sin(nx * Math.PI * 1.5 + tSec * 0.9) * waveAmp * 0.35;
        const distToSpout = Math.abs(x - spoutX);
        const impactRipple =
          Math.exp(-(distToSpout * distToSpout) / 2600) * Math.sin(distToSpout * 0.14 - tSec * 5.5) * (fillP < 0.92 ? 7 : 0);
        wavePoints.push({ x, y: baseSurfaceYViewport + w1 + w2 + w3 + impactRipple });
      }

      /* Clip path — wave points converted into reveal-layer coordinates */
      if (fillP > 0) {
        const toPathY = (yViewport) => (yViewport + scrollY - stageDocTop).toFixed(1);
        let d = `M 0 ${toPathY(wavePoints[0].y)}`;
        for (let i = 1; i < wavePoints.length; i++) {
          const pPrev = wavePoints[i - 1];
          const pCurr = wavePoints[i];
          const midX = ((pPrev.x + pCurr.x) / 2).toFixed(1);
          const midY = toPathY((pPrev.y + pCurr.y) / 2);
          d += ` Q ${pPrev.x.toFixed(1)} ${toPathY(pPrev.y)} ${midX} ${midY}`;
        }
        const last = wavePoints[wavePoints.length - 1];
        d += ` L ${W} ${toPathY(last.y)} L ${W} ${stageH + 40} L 0 ${stageH + 40} Z`;
        pathEl.setAttribute('d', d);

        /* Meniscus rim highlight along the crest */
        if (fillP < 0.98) {
          fxCtx.save();
          fxCtx.beginPath();
          fxCtx.moveTo(wavePoints[0].x, wavePoints[0].y);
          for (let i = 1; i < wavePoints.length; i++) {
            fxCtx.lineTo(wavePoints[i].x, wavePoints[i].y);
          }
          fxCtx.strokeStyle = liquidHighlight;
          fxCtx.lineWidth = pouringLight ? 2.2 : 1.5;
          fxCtx.stroke();
          fxCtx.restore();
        }
      }

      /* The pouring stream — tapered column with wobble, pinching off late */
      const streamEndY = fillP > 0 ? Math.min(H, Math.max(spoutYViewport, baseSurfaceYViewport + 4)) : streamBottomY;
      const streamActive = streamEndY > spoutYViewport + 2 && fillP < 0.94;
      if (streamActive) {
        const pinchFactor = fillP > 0.8 ? Math.max(0, 1 - (fillP - 0.8) / 0.14) : 1;
        const topHalfW = 5.4 * pinchFactor;
        const midHalfW = 3.1 * pinchFactor;
        const botHalfW = (fillP > 0 ? 5.0 : 3.6) * pinchFactor;
        fxCtx.save();
        fxCtx.fillStyle = liquidColor;
        fxCtx.shadowColor = streamGlow;
        fxCtx.shadowBlur = pouringLight ? 14 : 8;
        const wobble = Math.sin(tSec * 4.5) * 1.1;
        const midY = (spoutYViewport + streamEndY) * 0.5;
        fxCtx.beginPath();
        fxCtx.moveTo(spoutX - topHalfW, spoutYViewport);
        fxCtx.quadraticCurveTo(spoutX - midHalfW + wobble, midY, spoutX - botHalfW, streamEndY);
        fxCtx.lineTo(spoutX + botHalfW, streamEndY);
        fxCtx.quadraticCurveTo(spoutX + midHalfW + wobble, midY, spoutX + topHalfW, spoutYViewport);
        fxCtx.closePath();
        fxCtx.fill();
        fxCtx.beginPath();
        fxCtx.arc(spoutX, spoutYViewport, 6.2 * pinchFactor, 0, Math.PI * 2);
        fxCtx.fill();
        if (fillP === 0) {
          fxCtx.beginPath();
          fxCtx.arc(spoutX, streamEndY, botHalfW * 1.25, 0, Math.PI * 2);
          fxCtx.fill();
        }
        fxCtx.restore();
      }

      /* Splash droplets */
      fxCtx.save();
      fxCtx.fillStyle = liquidColor;
      for (let i = droplets.length - 1; i >= 0; i--) {
        const p = droplets[i];
        p.vy += 680 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt * 1.75;
        if (p.life <= 0 || p.y > H + 12) {
          droplets.splice(i, 1);
          continue;
        }
        fxCtx.globalAlpha = Math.max(0, Math.min(1, p.life));
        fxCtx.beginPath();
        fxCtx.arc(p.x, p.y, p.r * (0.4 + 0.6 * p.life), 0, Math.PI * 2);
        fxCtx.fill();
      }
      fxCtx.restore();

      if (elapsed < TOTAL_MS) {
        raf = requestAnimationFrame(tick);
      } else {
        finish();
      }
    }

    raf = requestAnimationFrame(tick);
    return () => {
      finished = true;
      teardown();
    };
  }, [pourTarget]);

  /* Force hero playback (autoplay policies: muted + playsinline set) */
  useEffect(() => {
    const v = heroVideoRef.current;
    if (v && !noFilm) {
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Animated configurator price */
  useEffect(() => {
    const from = priceRef.current;
    const to = targetPrice;
    if (from === to) return;
    if (REDUCED) {
      priceRef.current = to;
      setShownPrice(to);
      return;
    }
    let start = null;
    let raf;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 650, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = from + (to - from) * eased;
      priceRef.current = val;
      setShownPrice(val);
      if (p < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [targetPrice]);

  useEffect(() => {
    initVanilla();
  }, []);

  function jumpView(i) {
    setView(i);
    const v = ringVideoRef.current;
    if (v) {
      try {
        v.currentTime = VIEWS[i].t;
      } catch (e) {
        /* metadata not loaded yet */
      }
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    }
  }

  function goCategory(cat) {
    const el = document.getElementById('collection');
    if (el) el.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
    setCollHi(true);
    if (hiTimer.current) clearTimeout(hiTimer.current);
    hiTimer.current = setTimeout(() => setCollHi(false), 1750);
    showToast(cat.label + ' — in The Collection below');
  }

  const deal = DEALS[dealIdx];
  const nextDeal = DEALS[(dealIdx + 1) % DEALS.length];
  const dealFav = !!dealFavs[deal.id];

  const q = query.trim().toLowerCase();
  const results = q
    ? SEARCH_ITEMS.filter((i) => (i.title + ' ' + (i.cat || '')).toLowerCase().indexOf(q) !== -1)
    : SEARCH_ITEMS;

  /* The full page, rendered once per layer. In the reveal (static) layer the
     films become poster stills and the toggle already names the theme it
     will commit — everything else is the same tree over the same state. */
  function renderPage(staticMode) {
    const layerTheme = staticMode && pourTarget ? pourTarget : theme;
    return (
      <>
        <Nav
          bagCount={bag.length}
          onOpenDrawer={() => setDrawer(true)}
          onOpenSearch={() => setSearch(true)}
          onOpenBag={() => setBagOpen(true)}
          onNavClick={() => setDrawer(false)}
          theme={layerTheme}
          onToggleTheme={toggleTheme}
        />

        <Hero
          noFilm={noFilm}
          mobile={mobile}
          wish={wish}
          bagCount={bag.length}
          heroVideoRef={heroVideoRef}
          onOpenDrawer={() => setDrawer(true)}
          onOpenSearch={() => setSearch(true)}
          onToggleWish={() => setWish(!wish)}
          onOpenConcierge={() => setConcierge(true)}
          onOpenBag={() => setBagOpen(true)}
          theme={layerTheme}
          onToggleTheme={toggleTheme}
          staticMedia={staticMode}
        />

        <main>
          <Explore onCategory={goCategory} />

          <Collection
            collHi={collHi}
            deal={deal}
            nextDeal={nextDeal}
            dealIdx={dealIdx}
            dealFav={dealFav}
            dealFavs={dealFavs}
            bagCount={bag.length}
            popFavs={popFavs}
            onPrevDeal={() => setDealIdx((dealIdx + DEALS.length - 1) % DEALS.length)}
            onNextDeal={() => setDealIdx((dealIdx + 1) % DEALS.length)}
            onDealIdxChange={setDealIdx}
            onToggleDealFav={(d) => {
              const next = Object.assign({}, dealFavs);
              next[d.id] = !dealFavs[d.id];
              setDealFavs(next);
            }}
            onTogglePopFav={(item) => {
              const next = Object.assign({}, popFavs);
              next[item.id] = !popFavs[item.id];
              setPopFavs(next);
            }}
            onAddToBag={addToBag}
            onOpenBag={() => setBagOpen(true)}
            onOpenSaleList={() => setListMode('sale')}
            onOpenAllList={() => setListMode('all')}
            onOpenCustom={() => setCustomOpen(true)}
            onToast={showToast}
          />

          <Configurator
            noFilm={noFilm}
            staticMedia={staticMode}
            mobile={mobile}
            ringVideoRef={ringVideoRef}
            view={view}
            onJumpView={jumpView}
            metal={metal}
            stone={stone}
            carat={carat}
            onSelectMetal={(m) => {
              setMetal(m);
              setReserved(false);
            }}
            onSelectStone={(s) => {
              setStone(s);
              setReserved(false);
            }}
            onSelectCarat={(c) => {
              setCarat(c);
              setReserved(false);
            }}
            engOpen={engOpen}
            onToggleEng={() => setEngOpen(!engOpen)}
            engraving={engraving}
            onEngravingChange={setEngraving}
            shownPrice={shownPrice}
            reserved={reserved}
            onReserve={() => {
              if (reserved) return;
              setReserved(true);
              addToBag({
                title:
                  'Configured Solitaire — ' +
                  metal.name +
                  ' · ' +
                  stone.name +
                  ' · ' +
                  carat.label +
                  (engraving.trim() ? ' — “' + engraving.trim() + '”' : ''),
                price: targetPrice,
                img: img('view-three-quarter.jpg'),
              });
            }}
          />

          <Heritage />

          <Voices />

          <InnerCircle
            subscribed={subscribed}
            email={email}
            onEmailChange={setEmail}
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setSubscribed(true);
            }}
          />
        </main>

        <Footer onOpenLegal={setLegal} onOpenConcierge={() => setConcierge(true)} />
      </>
    );
  }

  return (
    <div>
      <div className="stage" ref={stageRef}>
        <div className={'theme-layer theme-layer--base theme-' + theme}>{renderPage(false)}</div>
        {pourTarget ? (
          <div className={'theme-layer layer-reveal theme-' + pourTarget} aria-hidden="true">
            {renderPage(true)}
          </div>
        ) : null}
      </div>

      {/* Hidden SVG clipPath driven per-frame by the pour engine */}
      <svg id="pour-svg-defs" aria-hidden="true">
        <defs>
          <clipPath id="aurelia-pour-clip" clipPathUnits="userSpaceOnUse">
            <path ref={clipPathRef} d="M 0 0 Z" />
          </clipPath>
        </defs>
      </svg>
      {/* Canvas overlay: pour stream, splash droplets, meniscus shimmer */}
      <canvas id="pour-fx" ref={fxCanvasRef} aria-hidden="true" />

      {/* Liquid Glass refraction filter (trial): chained into backdrop-filter
          by .bento-shell / .bento-panel / .panel / .cfg-pricebar in Chromium —
          real glass bends the backdrop instead of only blurring it.
          Safari/Firefox cannot parse url() in backdrop-filter, drop that
          declaration and keep the plain blur declared before it. */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <filter id="lg-refract">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="20" />
          </filter>
        </defs>
      </svg>

      <Overlays
        concierge={concierge}
        conciergeMsg={conciergeMsg}
        conciergeSent={conciergeSent}
        onToggleConcierge={() => {
          setConcierge(!concierge);
          setConciergeSent(false);
        }}
        onCloseConcierge={() => setConcierge(false)}
        onConciergeMsgChange={setConciergeMsg}
        onConciergeSend={() => setConciergeSent(true)}
        search={search}
        query={query}
        results={results}
        onCloseSearch={() => setSearch(false)}
        onQueryChange={setQuery}
        drawer={drawer}
        onCloseDrawer={() => setDrawer(false)}
        onDrawerContact={() => setConcierge(true)}
        legal={legal}
        onCloseLegal={() => setLegal(null)}
        bagOpen={bagOpen}
        bag={bag}
        bagTotal={bagTotal}
        onCloseBag={() => setBagOpen(false)}
        onRemoveFromBag={removeFromBag}
        customOpen={customOpen}
        customMetal={customMetal}
        customSize={customSize}
        customEng={customEng}
        onCloseCustom={() => setCustomOpen(false)}
        onCustomMetalChange={setCustomMetal}
        onCustomSizeChange={setCustomSize}
        onCustomEngChange={setCustomEng}
        onCustomAdd={() => {
          addToBag({
            title: 'Custom Eternity Band (' + customMetal + ', Size ' + customSize + (customEng.trim() ? ', "' + customEng.trim() + '"' : '') + ')',
            price: CUSTOM_PRICE,
            img: img('eternity-bands.jpg'),
          });
          setCustomOpen(false);
        }}
        listMode={listMode}
        onCloseList={() => setListMode(null)}
        onAddToBag={addToBag}
        toast={toast}
      />
    </div>
  );
}
