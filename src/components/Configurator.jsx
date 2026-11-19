import { media, img, inr } from '../lib';
import { METALS, STONES, CARATS, VIEWS } from '../data';
import { IcoPen, IcoCheck } from './icons';

/* 4 · CONFIGURATOR — ring film in its porcelain studio frame, metal / stone /
   carat / engraving, animated price. Price = metal + stone + carat add-on.
   staticMedia renders the poster still instead of the <video> — used by the
   theme pour's reveal layer so only ONE ring video ever exists/plays. */
export default function Configurator({
  noFilm,
  staticMedia,
  mobile,
  ringVideoRef,
  view,
  onJumpView,
  metal,
  stone,
  carat,
  onSelectMetal,
  onSelectStone,
  onSelectCarat,
  engOpen,
  onToggleEng,
  engraving,
  onEngravingChange,
  shownPrice,
  reserved,
  onReserve,
}) {
  return (
    <section className="section cfg-sec" id="configurator" aria-label="The Configurator">
      <div className="wrap">
        <h2 className="sec-title rv">THE CONFIGURATOR</h2>
        <div className="cfg-grid">
          <div className="cfg-stage-card rv">
            <div className="cfg-film-frame">
              {noFilm || staticMedia ? (
                <img className="poster-still" src={img('ring-poster.jpg')} alt="Gold solitaire ring with a diamond, in the atelier studio frame" />
              ) : (
                <video
                  ref={(el) => {
                    ringVideoRef.current = el;
                    if (el) el.muted = true;
                  }}
                  src={mobile ? media('ring-mobile.mp4') : media('ring.mp4')}
                  poster={img('ring-poster.jpg')}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Diamond solitaire ring in gold, slowly turning — interactive preview"
                />
              )}
            </div>
            <div className="cfg-thumbs">
              {VIEWS.map((vw, i) => (
                <button
                  key={vw.t}
                  className={'thumb' + (view === i ? ' is-active' : '')}
                  onClick={() => onJumpView(i)}
                  aria-label={vw.label}
                  aria-pressed={view === i}
                >
                  <img src={vw.src} alt="" />
                </button>
              ))}
            </div>
            <p className="caption-i cfg-caption">Interactive Preview — Customise Every Detail</p>
          </div>
          <div className="panel rv rv-d1">
            <h3 className="panel-title">
              <span className="diamond" aria-hidden="true" />
              Configure Your Piece
            </h3>
            <div className="group" role="radiogroup" aria-label="Metal">
              <p className="group-label">Metal</p>
              {METALS.map((m) => (
                <button
                  key={m.id}
                  className={'opt' + (metal.id === m.id ? ' is-selected' : '')}
                  role="radio"
                  aria-checked={metal.id === m.id}
                  onClick={() => onSelectMetal(m)}
                >
                  <span className="radio" aria-hidden="true" />
                  {m.name}
                  <span className="opt-check" aria-hidden="true">
                    <IcoCheck />
                  </span>
                </button>
              ))}
            </div>
            <div className="group" role="radiogroup" aria-label="Gemstone">
              <p className="group-label">Gemstone</p>
              {STONES.map((s) => (
                <button
                  key={s.id}
                  className={'opt' + (stone.id === s.id ? ' is-selected' : '')}
                  role="radio"
                  aria-checked={stone.id === s.id}
                  onClick={() => onSelectStone(s)}
                >
                  <span className={'gem-dot gem-' + s.id} aria-hidden="true" />
                  {s.name}
                  <span className="opt-check" aria-hidden="true">
                    <IcoCheck />
                  </span>
                </button>
              ))}
            </div>
            <div className="group">
              <p className="group-label" id="carat-label">
                Carat
              </p>
              <div className="carat-row" role="radiogroup" aria-labelledby="carat-label">
                {CARATS.map((c) => (
                  <button
                    key={c.id}
                    className={'carat-btn' + (carat.id === c.id ? ' sel' : '')}
                    role="radio"
                    aria-checked={carat.id === c.id}
                    onClick={() => onSelectCarat(c)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <button className="eng-toggle" onClick={onToggleEng} aria-expanded={engOpen}>
              <IcoPen />
              {engOpen ? 'Hide inscription' : 'Add an inscription'}
            </button>
            {engOpen ? (
              <div className="engraving">
                <label htmlFor="eng-input">Add an inscription — up to 20 characters</label>
                <input
                  id="eng-input"
                  type="text"
                  maxLength={20}
                  value={engraving}
                  placeholder="Engrave a name or a date…"
                  onChange={(e) => onEngravingChange(e.target.value)}
                />
              </div>
            ) : null}
          </div>
          <div className="cfg-pricebar rv rv-d2">
            <p className="summary-line">
              {metal.name + ' · ' + stone.name + ' · ' + carat.label}
              {engraving.trim() ? <span className="eng">{' — “' + engraving.trim() + '”'}</span> : null}
            </p>
            <p className="price" aria-live="polite">
              {inr(shownPrice)}
            </p>
            <button className={'reserve' + (reserved ? ' reserved' : '')} onClick={onReserve}>
              {reserved ? 'Piece Reserved ✓' : 'Reserve This Piece'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
