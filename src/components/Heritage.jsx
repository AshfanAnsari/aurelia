import { img } from '../lib';
import { IcoArrR } from './icons';

/* 5 · HERITAGE — editorial split + animated stat row. */
export default function Heritage() {
  return (
    <section className="section heritage-sec" id="heritage" aria-label="Heritage">
      <div className="wrap">
        <div className="heritage-grid">
          <div className="heritage-copy rv">
            <p className="eyebrow">Heritage</p>
            <h2 className="serif-head">A Legacy of Excellence</h2>
            <p className="body">
              Handcrafted perfection since 1924 — every AURELIA piece begins in our atelier, where master jewellers shape, set and polish by hand, as they have for a hundred years.
            </p>
            <a className="text-link" href="#voices">
              Discover More
              <IcoArrR />
            </a>
          </div>
          <div className="heritage-photo rv rv-d1">
            <img src={img('heritage.jpg')} alt="Emerald and diamond necklace, earrings and ring presented in an open jewellery box" loading="lazy" decoding="async" />
          </div>
        </div>
        <div className="stat-row rv">
          <div className="stat">
            <div className="num" data-count="100" data-suffix="+">
              100+
            </div>
            <div className="lbl">Years</div>
          </div>
          <div className="stat">
            <div className="num" data-count="40" data-suffix="">
              40
            </div>
            <div className="lbl">Artisans</div>
          </div>
          <div className="stat">
            <div className="num" data-count="25" data-suffix="k">
              25k
            </div>
            <div className="lbl">Pieces</div>
          </div>
        </div>
      </div>
    </section>
  );
}
