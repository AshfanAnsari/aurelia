import { CATEGORIES } from '../data';

/* 2 · EXPLORE ROW — six category tiles; a tap scrolls to The Collection. */
export default function Explore({ onCategory }) {
  return (
    <section className="section explore-sec" id="explore" aria-label="Explore categories">
      <div className="wrap">
        <h2 className="sec-title rv">EXPLORE</h2>
        <div className="explore-row rv">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className="cat-tile"
              onClick={() => onCategory(cat)}
              aria-label={'Explore ' + cat.label + ' — go to The Collection'}
            >
              <span className="cat-icon" aria-hidden="true">
                <cat.Icon />
              </span>
              <span className="cat-label">{cat.label}</span>
              <span className="cat-count">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
