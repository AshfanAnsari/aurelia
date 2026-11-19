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

  const mobile = isMobile();
  const noFilm = REDUCED || SAVE_DATA;

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

  return (
    <div>
      <Nav
        bagCount={bag.length}
        onOpenDrawer={() => setDrawer(true)}
        onOpenSearch={() => setSearch(true)}
        onOpenBag={() => setBagOpen(true)}
        onNavClick={() => setDrawer(false)}
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
      />

      <main>
        <Explore onCategory={goCategory} />

        <Collection
          collHi={collHi}
          deal={deal}
          nextDeal={nextDeal}
          dealIdx={dealIdx}
          dealFav={dealFav}
          bagCount={bag.length}
          popFavs={popFavs}
          onPrevDeal={() => setDealIdx((dealIdx + DEALS.length - 1) % DEALS.length)}
          onNextDeal={() => setDealIdx((dealIdx + 1) % DEALS.length)}
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
