import { inr, REDUCED } from '../lib';
import { DEALS, POPULAR, CUSTOM_METALS, CUSTOM_PRICE } from '../data';
import { IcoChat } from './icons';

const SEARCH_TAGS = [
  ['Explore', '#explore'],
  ['The Collection', '#collection'],
  ['The Configurator', '#configurator'],
  ['Heritage', '#heritage'],
  ['Voices', '#voices'],
  ['Inner Circle', '#circle'],
];

const DRAWER_LINKS = [
  ['Home', '#top'],
  ['Explore', '#explore'],
  ['The Collection', '#collection'],
  ['The Configurator', '#configurator'],
  ['Heritage', '#heritage'],
  ['Voices', '#voices'],
  ['Inner Circle', '#circle'],
];

/* Global overlays: concierge chat, search, menu drawer, legal panels,
   shopping bag, customize modal, sale/all list modal, toast. */
export default function Overlays({
  concierge,
  conciergeMsg,
  conciergeSent,
  onToggleConcierge,
  onCloseConcierge,
  onConciergeMsgChange,
  onConciergeSend,
  search,
  query,
  results,
  onCloseSearch,
  onQueryChange,
  drawer,
  onCloseDrawer,
  onDrawerContact,
  legal,
  onCloseLegal,
  bagOpen,
  bag,
  bagTotal,
  onCloseBag,
  onRemoveFromBag,
  customOpen,
  customMetal,
  customSize,
  customEng,
  onCloseCustom,
  onCustomMetalChange,
  onCustomSizeChange,
  onCustomEngChange,
  onCustomAdd,
  listMode,
  onCloseList,
  onAddToBag,
  toast,
}) {
  return (
    <>
      <button
        className="chat-btn"
        aria-label="Open the AURELIA concierge"
        aria-expanded={concierge}
        onClick={onToggleConcierge}
      >
        <IcoChat />
      </button>

      <div className={'concierge' + (concierge ? ' open' : '')} role="dialog" aria-label="AURELIA concierge" aria-hidden={!concierge}>
        <button className="close-x" onClick={onCloseConcierge} aria-label="Close concierge">
          ✕
        </button>
        <h2>The Concierge</h2>
        <p>Appointments, commissions, care — tell us what you are dreaming of and the atelier will reply by email.</p>
        <label htmlFor="concierge-msg">Your message</label>
        <textarea
          id="concierge-msg"
          value={conciergeMsg}
          placeholder="A solitaire for an anniversary in June…"
          onChange={(e) => onConciergeMsgChange(e.target.value)}
        />
        <a
          className="send"
          href={'mailto:care@aurelia.example?subject=' + encodeURIComponent('AURELIA Concierge') + '&body=' + encodeURIComponent(conciergeMsg)}
          onClick={onConciergeSend}
        >
          Send via Email
        </a>
        <p className={'sent-note' + (conciergeSent ? ' on' : '')}>Opening your email app — your message is addressed to our client care team.</p>
      </div>

      <div className={'search-overlay' + (search ? ' open' : '')} role="dialog" aria-label="Search AURELIA" aria-hidden={!search}>
        <button className="close-x" onClick={onCloseSearch} aria-label="Close search">
          ✕
        </button>
        <div className="search-box">
          <label htmlFor="search-input">Search AURELIA</label>
          <input
            id="search-input"
            type="search"
            placeholder="Emerald, solitaire, choker…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
          <div className="search-results">
            {results.length ? (
              results.map((item) => (
                <button
                  key={item.id}
                  className="search-result"
                  onClick={() => {
                    onCloseSearch();
                    const target = item.href || '#collection';
                    const el = document.querySelector(target);
                    if (el) el.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
                  }}
                >
                  <img src={item.img} alt="" loading="lazy" decoding="async" />
                  <span>
                    <span className="sr-name">{item.title}</span>
                    <br />
                    <span className="sr-cat">{item.cat || ''}</span>
                  </span>
                  <span className="sr-price">{inr(item.price)}</span>
                </button>
              ))
            ) : (
              <p className="search-none">{'No pieces match “' + query + '” — try “ring”, “emerald” or “bracelet”.'}</p>
            )}
          </div>
          <div className="search-tags">
            {SEARCH_TAGS.map((t) => (
              <a key={t[1]} href={t[1]} onClick={onCloseSearch}>
                {t[0]}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className={'scrim' + (drawer ? ' on' : '')} onClick={onCloseDrawer} aria-hidden="true" />
      <aside className={'drawer' + (drawer ? ' open' : '')} aria-label="Menu" aria-hidden={!drawer}>
        <button className="close-x" onClick={onCloseDrawer} aria-label="Close menu">
          ✕
        </button>
        <div className="brand-name">AURELIA</div>
        <div className="brand-sub">Haute Joaillerie</div>
        <nav>
          {DRAWER_LINKS.map((n) => (
            <a key={n[1] + n[0]} href={n[1]} onClick={onCloseDrawer}>
              {n[0]}
            </a>
          ))}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onCloseDrawer();
              onDrawerContact();
            }}
          >
            Contact the Concierge
          </a>
        </nav>
      </aside>

      {legal ? (
        <div className="legal open" role="dialog" aria-modal="true" aria-label={legal === 'terms' ? 'Terms of Service' : 'Privacy Policy'}>
          <div className="scrim2" onClick={onCloseLegal} />
          <div className="legal-panel">
            <button className="close-x" onClick={onCloseLegal} aria-label="Close">
              ✕
            </button>
            {legal === 'terms' ? (
              <div>
                <h2>TERMS OF SERVICE</h2>
                <h3>Bespoke commissions</h3>
                <p>
                  Pieces configured on this site are previews. A commission is confirmed only when the atelier accepts it in writing and issues an order reference; quoted prices are in Indian Rupees and include applicable taxes unless stated otherwise.
                </p>
                <h3>Reservations</h3>
                <p>Reserving a piece holds it for seven days while our client care team confirms stone availability and sizing with you. No payment is taken at reservation.</p>
                <h3>Returns &amp; care</h3>
                <p>
                  Unworn, non-engraved pieces may be returned within 15 days of delivery. Engraved and made-to-order pieces are final sale. Every AURELIA piece includes lifetime cleaning and an annual inspection at our atelier.
                </p>
                <h3>Contact</h3>
                <p>Grievance Officer — AURELIA Client Care, care@aurelia.example. We respond to grievances within 48 hours, as required under Indian consumer law.</p>
              </div>
            ) : (
              <div>
                <h2>PRIVACY POLICY</h2>
                <h3>What we collect</h3>
                <p>Your email address when you join the Inner Circle, and the details you share when you contact the concierge or reserve a piece (name, message, and the configuration you chose).</p>
                <h3>Why we collect it</h3>
                <p>Only to send the monthly letter you asked for, answer your enquiry, and fulfil your reservation. We do not sell personal data, and we do not use it for third-party advertising.</p>
                <h3>Retention &amp; your rights</h3>
                <p>
                  Inner Circle emails are kept until you unsubscribe; enquiry records are kept for three years for warranty and care history. You may ask us to access, correct, or delete your data at any time — deletion requests are completed within 30 days.
                </p>
                <h3>Grievance Officer</h3>
                <p>Grievance Officer — AURELIA Client Care, care@aurelia.example.</p>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {bagOpen ? (
        <div className="shop-modal" role="dialog" aria-modal="true" aria-label="Shopping Bag">
          <div className="scrim2" onClick={onCloseBag} />
          <div className="shop-panel wide">
            <div className="shop-head">
              <h3>Shopping Bag</h3>
              <button className="shop-close" onClick={onCloseBag} aria-label="Close bag">
                ✕
              </button>
            </div>
            {bag.length ? (
              <div>
                {bag.map((i) => (
                  <div className="bag-row" key={i.key}>
                    <div className="br-main">
                      <img src={i.img} alt="" loading="lazy" decoding="async" />
                      <div>
                        <div className="br-name">{i.title}</div>
                        <div className="br-price">{inr(i.price)}</div>
                      </div>
                    </div>
                    <button className="bag-remove" onClick={() => onRemoveFromBag(i.key)}>
                      Remove
                    </button>
                  </div>
                ))}
                <div className="bag-total-row">
                  <span>Total</span>
                  <span>{inr(bagTotal)}</span>
                </div>
              </div>
            ) : (
              <p className="bag-empty">Your bag is empty.</p>
            )}
          </div>
        </div>
      ) : null}

      {customOpen ? (
        <div className="shop-modal" role="dialog" aria-modal="true" aria-label="Customize Your Piece">
          <div className="scrim2" onClick={onCloseCustom} />
          <div className="shop-panel">
            <div className="shop-head">
              <h3>Customize Your Piece</h3>
              <button className="shop-close" onClick={onCloseCustom} aria-label="Close customise">
                ✕
              </button>
            </div>
            <div className="shop-field">
              <span className="field-label" id="metal-label">
                Metal Finish
              </span>
              <div className="metal-opts" role="radiogroup" aria-labelledby="metal-label">
                {CUSTOM_METALS.map((m) => (
                  <button
                    key={m}
                    className={'metal-opt' + (customMetal === m ? ' sel' : '')}
                    role="radio"
                    aria-checked={customMetal === m}
                    onClick={() => onCustomMetalChange(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="shop-field">
              <label className="field-label" htmlFor="band-size">
                Band Size
              </label>
              <select className="shop-select" id="band-size" value={customSize} onChange={(e) => onCustomSizeChange(e.target.value)}>
                {['5', '6', '7', '8'].map((s) => (
                  <option key={s} value={s}>
                    {'Size ' + s}
                  </option>
                ))}
              </select>
            </div>
            <div className="shop-field">
              <label className="field-label" htmlFor="custom-eng">
                Custom Engraving (optional)
              </label>
              <input
                className="shop-input"
                id="custom-eng"
                type="text"
                maxLength={24}
                placeholder="e.g., Forever & Always"
                value={customEng}
                onChange={(e) => onCustomEngChange(e.target.value)}
              />
            </div>
            <button className="shop-add" onClick={onCustomAdd}>
              {'Add Custom Eternity Band — ' + inr(CUSTOM_PRICE)}
            </button>
          </div>
        </div>
      ) : null}

      {listMode ? (
        <div className="shop-modal" role="dialog" aria-modal="true" aria-label={listMode === 'sale' ? 'Great Value Sale' : 'All Jewellery Pieces'}>
          <div className="scrim2" onClick={onCloseList} />
          <div className="shop-panel wide">
            <div className="shop-head">
              <h3>{listMode === 'sale' ? 'Great Value Sale (50% – 75% Off)' : 'All Jewellery Pieces'}</h3>
              <button className="shop-close" onClick={onCloseList} aria-label="Close list">
                ✕
              </button>
            </div>
            {(listMode === 'sale' ? DEALS : DEALS.concat(POPULAR)).map((i) => (
              <div className="bag-row" key={i.id}>
                <div className="br-main">
                  <img src={i.img} alt="" loading="lazy" decoding="async" />
                  <div>
                    <div className="br-name">{i.title}</div>
                    <div className="br-price">
                      {listMode === 'sale' ? <span className="sale">{'Sale Price: ' + inr(i.price)}</span> : inr(i.price) + ' · ★ ' + i.rating}
                    </div>
                  </div>
                </div>
                <button className={'list-add' + (listMode === 'sale' ? ' sale' : '')} onClick={() => onAddToBag(i)}>
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className={'toast' + (toast ? ' on' : '')} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  );
}
