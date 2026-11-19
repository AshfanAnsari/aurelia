import { useEffect, useRef } from 'react';
import { inr, REDUCED } from '../lib';
import { DEALS, POPULAR } from '../data';
import { IcoStar, IcoHeart, IcoBag, IcoArrL, IcoArrR, IcoArrUR, IcoTag } from './icons';

/* Popular Items track = the full six-piece collection: the three Popular
   cards plus the three deal pieces in pop-card dress (same titles, prices
   and images — bag wiring identical). */
const DEAL_POP_STYLE = {
  choker: { bg: '#7A4A3A', text: '#FFFFFF', pill: 'rgba(255,255,255,.22)', buy: 'rgba(255,255,255,.28)' },
  'ruby-cuff': { bg: '#6E1E28', text: '#FFFFFF', pill: 'rgba(255,255,255,.22)', buy: 'rgba(255,255,255,.28)' },
  'eternity-bands': { bg: '#2E4038', text: '#FFFFFF', pill: 'rgba(255,255,255,.22)', buy: 'rgba(255,255,255,.28)' },
};
const POP_TRACK = POPULAR.concat(DEALS.map((d) => Object.assign({}, d, DEAL_POP_STYLE[d.id])));

/* Mouse drag-to-scroll for the swipe tracks (touch uses native scrolling).
   A drag past 6px suppresses the click that follows it, so card buttons
   never fire after a drag. */
function useDragScroll(ref) {
  const drag = useRef(null);
  return {
    onPointerDown(e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      const el = ref.current;
      if (!el) return;
      drag.current = { x: e.clientX, left: el.scrollLeft, moved: false };
      el.classList.add('dragging');
    },
    onPointerMove(e) {
      const d = drag.current;
      const el = ref.current;
      if (!d || !el) return;
      const dx = e.clientX - d.x;
      if (Math.abs(dx) > 6) d.moved = true;
      if (d.moved) el.scrollLeft = d.left - dx;
    },
    onPointerUp() {
      const el = ref.current;
      if (el) el.classList.remove('dragging');
      setTimeout(() => {
        drag.current = null;
      }, 0);
    },
    onPointerCancel() {
      const el = ref.current;
      if (el) el.classList.remove('dragging');
      drag.current = null;
    },
    onClickCapture(e) {
      if (drag.current && drag.current.moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    onDragStart(e) {
      e.preventDefault();
    },
  };
}

/* 3 · THE COLLECTION — the bento: New Deals swipe slider, sale panel,
   customize panel and the Popular Items swipe track, all sharing the bag. */
export default function Collection({
  collHi,
  deal,
  nextDeal,
  dealIdx,
  dealFavs,
  bagCount,
  popFavs,
  onPrevDeal,
  onNextDeal,
  onDealIdxChange,
  onToggleDealFav,
  onTogglePopFav,
  onAddToBag,
  onOpenBag,
  onOpenSaleList,
  onOpenAllList,
  onOpenCustom,
  onToast,
}) {
  const dealTrackRef = useRef(null);
  const popTrackRef = useRef(null);
  const dealDrag = useDragScroll(dealTrackRef);
  const popDrag = useDragScroll(popTrackRef);
  const scrollRaf = useRef(0);

  /* Buttons / state changes scroll the deal track to the active deal. */
  useEffect(() => {
    const t = dealTrackRef.current;
    if (!t) return;
    const card = t.children[dealIdx];
    if (!card) return;
    const target = card.offsetLeft - t.offsetLeft - (t.clientWidth - card.clientWidth) / 2;
    if (Math.abs(t.scrollLeft - target) > 4) {
      t.scrollTo({ left: target, behavior: REDUCED ? 'auto' : 'smooth' });
    }
  }, [dealIdx]);

  /* Swiping the deal track drives the shared deal index (and the backdrop). */
  function onDealScroll() {
    const t = dealTrackRef.current;
    if (!t || scrollRaf.current) return;
    scrollRaf.current = requestAnimationFrame(() => {
      scrollRaf.current = 0;
      const mid = t.scrollLeft + t.clientWidth / 2;
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i < t.children.length; i++) {
        const c = t.children[i];
        const center = c.offsetLeft - t.offsetLeft + c.clientWidth / 2;
        const d = Math.abs(center - mid);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      if (best !== dealIdx) onDealIdxChange(best);
    });
  }

  return (
    <section className={'section collection-sec' + (collHi ? ' collection-hi' : '')} id="collection" aria-label="The Collection">
      <div className="wrap">
        <div className="collection-head rv">
          <p className="eyebrow">Shop Aurelia</p>
          <h2 className="sec-title">THE COLLECTION</h2>
        </div>
        <div className="bento-shell rv">
          <div className="bento-grid">
            <section className="bento-panel bento-deals" aria-label="New Deals">
              <img className="deal-bg" src={nextDeal.img} alt="" aria-hidden="true" loading="lazy" />
              <h3 className="bento-h">New Deals</h3>
              <div className="deal-stack">
                <div className="deal-track" ref={dealTrackRef} onScroll={onDealScroll} {...dealDrag}>
                  {DEALS.map((d) => {
                    const fav = !!dealFavs[d.id];
                    return (
                      <article className="deal-card" key={d.id}>
                        <div className="deal-top">
                          <div>
                            <div className="deal-price">{inr(d.price)}</div>
                            <div className="deal-title">{d.title}</div>
                            <span className="gv-badge">Great Value</span>
                          </div>
                          <span className="rating-pill">
                            <IcoStar />
                            {d.rating}
                          </span>
                        </div>
                        <div className="deal-img-wrap">
                          <img className="deal-img" src={d.img} alt={d.alt} loading="lazy" draggable="false" />
                        </div>
                        <div className="deal-actions">
                          <button
                            className="circle-btn fav"
                            aria-pressed={fav}
                            aria-label={fav ? 'Remove ' + d.title + ' from saved' : 'Save ' + d.title}
                            onClick={() => {
                              onToggleDealFav(d);
                              onToast(fav ? 'Removed ' + d.title + ' from saved' : 'Saved ' + d.title);
                            }}
                          >
                            <IcoHeart />
                          </button>
                          <button className="circle-btn bagadd" aria-label={'Add ' + d.title + ' to bag'} onClick={() => onAddToBag(d)}>
                            <IcoBag />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
              <div className="deal-controls">
                <button className="ctrl-btn" aria-label="Previous deal" onClick={onPrevDeal}>
                  <IcoArrL />
                </button>
                <span className="lbl">
                  Slide left and right · <b>{dealIdx + 1 + ' / ' + DEALS.length}</b>
                </span>
                <button className="ctrl-btn next" aria-label="Next deal" onClick={onNextDeal}>
                  <IcoArrR />
                </button>
              </div>
            </section>
            <div className="bento-right">
              <div className="bento-toprow">
                <section className="bento-panel bento-sale lift" aria-label="Great Value Deals">
                  <div className="sale-copy">
                    <h3 className="bento-h">
                      Great Value
                      <br />
                      Deals
                    </h3>
                    <p>
                      Find Items On Sale
                      <br />
                      With 50 – 75%
                    </p>
                  </div>
                  <button className="sale-badge" onClick={onOpenSaleList}>
                    <IcoTag />
                    75% off
                  </button>
                  <img className="sale-img" src={DEALS[1].img} alt="" aria-hidden="true" loading="lazy" />
                </section>
                <section className="bento-panel bento-custom lift" aria-label="Customize your products">
                  <h3>
                    Customize your
                    <br />
                    products
                  </h3>
                  <img className="custom-img" src={DEALS[2].img} alt="Custom diamond eternity bands" loading="lazy" />
                  <button className="get-started" onClick={onOpenCustom}>
                    <span>Get Started</span>
                    <span className="go" aria-hidden="true">
                      <IcoArrUR />
                    </span>
                  </button>
                </section>
              </div>
              <section className="bento-popular" aria-label="Popular Items">
                <div className="pop-head">
                  <h3 className="bento-h">Popular Items</h3>
                  <div className="pop-actions">
                    <button className="bag-open-btn" onClick={onOpenBag}>
                      <IcoBag />
                      {'Bag' + (bagCount ? ' (' + bagCount + ')' : '')}
                    </button>
                    <button className="view-all" onClick={onOpenAllList}>
                      View all
                      <IcoArrR />
                    </button>
                  </div>
                </div>
                <div className="pop-track" ref={popTrackRef} {...popDrag}>
                  {POP_TRACK.map((item) => {
                    const fav = !!popFavs[item.id];
                    return (
                      <article className="pop-card" key={item.id} style={{ background: item.bg, color: item.text }}>
                        <div className="pop-top">
                          <h4 className="pop-name">{item.title}</h4>
                          <div className="pop-side">
                            <span className="pop-rating" style={{ background: item.pill, color: item.text }}>
                              <IcoStar />
                              {item.rating}
                            </span>
                            <button
                              className="pop-fav"
                              aria-pressed={fav}
                              aria-label={fav ? 'Remove ' + item.title + ' from saved' : 'Save ' + item.title}
                              onClick={() => {
                                onTogglePopFav(item);
                                onToast(fav ? 'Removed ' + item.title + ' from saved' : 'Saved ' + item.title);
                              }}
                            >
                              <IcoHeart />
                            </button>
                          </div>
                        </div>
                        <img className="pop-img" src={item.img} alt={item.alt} loading="lazy" draggable="false" />
                        <div className="pop-buy-row">
                          <button
                            className="buy-pill"
                            style={{ background: item.buy }}
                            aria-label={'Buy ' + item.title + ' for ' + inr(item.price)}
                            onClick={() => onAddToBag(item)}
                          >
                            <span className="bp-txt" style={{ color: item.text }}>
                              {'Buy ' + inr(item.price)}
                            </span>
                            <span className="bp-ico" aria-hidden="true">
                              <IcoBag />
                            </span>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
