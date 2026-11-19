const VOICES = [
  ['Isabella R.', 'New York', 'The solitaire I configured arrived more brilliant than the preview promised.'],
  ['Sophia L.', 'London', 'Heirloom quality, and the atelier kept me close at every step.'],
  ['Charlotte M.', 'Paris', 'I have worn mine every day for a year. It still stops conversations.'],
];

/* 6 · VOICES — three testimonial glass cards. */
export default function Voices() {
  return (
    <section className="section voices-sec" id="voices" aria-label="Voices of Aurelia">
      <div className="watermark" aria-hidden="true">
        AURELIA
      </div>
      <div className="wrap">
        <h2 className="sec-title rv">VOICES OF AURELIA</h2>
        <div className="voices-grid">
          {VOICES.map((v, i) => (
            <article className={'voice-card rv rv-d' + (i + 1)} key={v[0]}>
              <div className="stars" role="img" aria-label="Rated five out of five stars">
                ★★★★★
              </div>
              <blockquote>{'“' + v[2] + '”'}</blockquote>
              <p className="who">
                <strong>{v[0]}</strong>
                {' — ' + v[1]}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
