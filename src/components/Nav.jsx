import { IcoBurger, IcoSearch, IcoBag, IcoDrop } from './icons';

const NAV_LINKS = [
  ['Explore', '#explore'],
  ['Collection', '#collection'],
  ['Configurator', '#configurator'],
  ['Heritage', '#heritage'],
  ['Voices', '#voices'],
];

/* Slim bar — appears after scrolling past the hero (see initSlimBar). */
export default function Nav({ bagCount, onOpenDrawer, onOpenSearch, onOpenBag, onNavClick, theme, onToggleTheme }) {
  const dark = theme === 'dark';
  return (
    <div className="slim-bar" id="slimBar">
      <button className="slim-burger" onClick={onOpenDrawer} aria-label="Open menu">
        <IcoBurger />
      </button>
      <a className="slim-brand" href="#top" aria-label="AURELIA — back to top">
        AURELIA
      </a>
      <nav className="slim-nav" aria-label="Primary">
        {NAV_LINKS.map(([label, href]) => (
          <a key={label} href={href} onClick={onNavClick}>
            {label}
          </a>
        ))}
      </nav>
      <div className="slim-icons">
        <button
          className="head-action theme-toggle"
          onClick={(e) => onToggleTheme(e.currentTarget)}
          aria-pressed={dark}
          aria-label={dark ? 'Pour the light theme' : 'Pour the dark theme'}
          title={dark ? 'Pour light' : 'Pour dark'}
        >
          <IcoDrop />
          <span className="lbl">{dark ? 'Pour light' : 'Pour dark'}</span>
        </button>
        <button className="head-action" onClick={onOpenSearch} aria-label="Search">
          <IcoSearch />
        </button>
        <button className="head-action" onClick={onOpenBag} aria-label="Shopping bag">
          <IcoBag />
          <span className={'count' + (bagCount ? ' on' : '')}>{String(bagCount)}</span>
        </button>
      </div>
    </div>
  );
}
