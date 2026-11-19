import { inr } from '../lib';
import { DEALS, POPULAR } from '../data';
import { IcoStar, IcoHeart, IcoBag, IcoArrL, IcoArrR, IcoArrUR, IcoTag } from './icons';

/* 3 · THE COLLECTION — the bento: New Deals slider, sale panel, customize
   panel and Popular Items, all sharing the one bag. */
export default function Collection({
  collHi,
  deal,
  nextDeal,
  dealIdx,
  dealFav,
  bagCount,
  popFavs,
  onPrevDeal,
  onNextDeal,
  onToggleDealFav,
  onTogglePopFav,
  onAddToBag,
  onOpenBag,
  onOpenSaleList,
  onOpenAllList,
  onOpenCustom,
  onToast,
}) {
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
                <article className="deal-card" key={deal.id}>
                  <div className="deal-top">
                    <div>
                      <div className="deal-price">{inr(deal.price)}</div>
                      <div className="deal-title">{deal.title}</div>
                      <span className="gv-badge">Great Value</span>
                    </div>
                    <span className="rating-pill">
                      <IcoStar />
                      {deal.rating}
                    </span>
                  </div>
                  <div className="deal-img-wrap">
                    <img className="deal-img" src={deal.img} alt={deal.alt} loading="lazy" />
                  </div>
                  <div className="deal-actions">
                    <button
                      className="circle-btn fav"
                      aria-pressed={dealFav}
                      aria-label={dealFav ? 'Remove ' + deal.title + ' from saved' : 'Save ' + deal.title}
                      onClick={() => {
                        onToggleDealFav(deal);
                        onToast(dealFav ? 'Removed ' + deal.title + ' from saved' : 'Saved ' + deal.title);
                      }}
                    >
                      <IcoHeart />
                    </button>
                    <button className="circle-btn bagadd" aria-label={'Add ' + deal.title + ' to bag'} onClick={() => onAddToBag(deal)}>
                      <IcoBag />
                    </button>
                  </div>
                </article>
                <div className="deal-peek" aria-hidden="true">
                  <span className="peek-ico">
                    <IcoHeart />
                  </span>
                  <span className="peek-ico bag">
                    <IcoBag />
                  </span>
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
                <div className="pop-grid">
                  {POPULAR.map((item) => {
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
                        <img className="pop-img" src={item.img} alt={item.alt} loading="lazy" />
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
