import { media, img } from '../lib';
import { DUST } from '../data';
import { IcoBurger, IcoSearch, IcoHeart, IcoUser, IcoBag } from './icons';

/* 1 · HERO — the pendant film (poster-first), brand lockup, headline, CTA. */
export default function Hero({
  noFilm,
  mobile,
  wish,
  bagCount,
  heroVideoRef,
  onOpenDrawer,
  onOpenSearch,
  onToggleWish,
  onOpenConcierge,
  onOpenBag,
}) {
  const poster = mobile ? img('hero-poster-mobile.jpg') : img('hero-poster.jpg');
  return (
    <section className={'hero' + (noFilm ? ' no-video' : '')} id="hero">
      <span id="top" />
      <div className="hero-media" aria-hidden="true">
        {noFilm ? (
          <img src={poster} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <video
            ref={(el) => {
              heroVideoRef.current = el;
              if (el) el.muted = true;
            }}
            src={mobile ? media('hero-mobile.mp4') : media('hero.mp4')}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={(e) => {
              e.currentTarget.classList.add('is-ready');
            }}
            onLoadedData={(e) => {
              const p = e.currentTarget.play();
              if (p && p.catch) p.catch(() => {});
            }}
          />
        )}
      </div>
      <div className="vignette" aria-hidden="true" />
      <div className="dust" aria-hidden="true">
        {DUST.map((d, i) => (
          <i key={i} style={{ left: d[0] + '%', top: d[1] + '%', animationDelay: d[2] + 's' }} />
        ))}
      </div>
      <header className="hero-head">
        <div className="head-left">
          <button className="burger" onClick={onOpenDrawer} aria-label="Open menu">
            <IcoBurger />
          </button>
          <nav className="head-nav" aria-label="Primary">
            <a href="#explore">Explore</a>
            <a href="#collection">Collection</a>
            <a href="#heritage">Heritage</a>
          </nav>
        </div>
        <div className="brand">
          <div className="brand-name">AURELIA</div>
          <div className="brand-sub">Haute Joaillerie</div>
        </div>
        <div className="head-right">
          <button className="head-action" onClick={onOpenSearch} aria-label="Search">
            <IcoSearch />
            <span className="lbl">Search</span>
          </button>
          <span className="wish-wrap">
            <button className="head-action wish-btn" aria-label="Wishlist" aria-pressed={wish} onClick={onToggleWish}>
              <IcoHeart />
              <span className="lbl">Wishlist</span>
              <span className={'count' + (wish ? ' on' : '')}>1</span>
            </button>
          </span>
          <span className="wish-wrap">
            <button className="head-action" onClick={onOpenConcierge} aria-label="Account">
              <IcoUser />
              <span className="lbl">Account</span>
            </button>
          </span>
          <button className="head-action" onClick={onOpenBag} aria-label="Shopping bag">
            <IcoBag />
            <span className="lbl">Bag</span>
            <span className={'count' + (bagCount ? ' on' : '')}>{String(bagCount)}</span>
          </button>
        </div>
      </header>
      <div className="hero-copy">
        <h1>Elegance Redefined</h1>
        <p className="hero-lede">Discover bespoke fine jewellery, made to be inherited.</p>
        <div className="cta-row">
          <a className="cta" href="#explore">
            Explore Collection
          </a>
        </div>
      </div>
      <div className="hero-scroll-hint" aria-hidden="true">
        Scroll
      </div>
    </section>
  );
}
