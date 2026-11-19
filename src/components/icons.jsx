/* Icons — 1.5px line style (category icons use the 64×64 / 2.2px set).
   Ported 1:1 from the original build. */

function Svg({ children, vb }) {
  return (
    <svg viewBox={vb || '0 0 24 24'} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

function BigSvg({ children }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export function IcoSearch() {
  return (
    <Svg>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.8-3.8" />
    </Svg>
  );
}

export function IcoHeart() {
  return (
    <Svg>
      <path d="M12 20.5C7 16.5 3.5 13.2 3.5 9.6 3.5 7 5.4 5 7.9 5c1.7 0 3.2.9 4.1 2.3C12.9 5.9 14.4 5 16.1 5c2.5 0 4.4 2 4.4 4.6 0 3.6-3.5 6.9-8.5 10.9z" />
    </Svg>
  );
}

export function IcoUser() {
  return (
    <Svg>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20c1.4-3.4 4-5 7-5s5.6 1.6 7 5" />
    </Svg>
  );
}

export function IcoBag() {
  return (
    <Svg>
      <path d="M5 8h14l-1.2 12.2a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3L5 8z" />
      <path d="M8.5 10V6.5a3.5 3.5 0 0 1 7 0V10" />
    </Svg>
  );
}

export function IcoBurger() {
  return (
    <Svg>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h10" />
    </Svg>
  );
}

export function IcoChat() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a8 8 0 0 1-8 8H4l2.2-2.9A8 8 0 1 1 21 12z" />
      <path d="M8.5 11h.01M12 11h.01M15.5 11h.01" strokeWidth="2.4" />
    </svg>
  );
}

export function IcoPen() {
  return (
    <Svg>
      <path d="M4 20c2.5-.4 3.2-1 4.6-3.4L16.9 8a2.1 2.1 0 0 0-3-3L5.6 13.3C4.7 15.9 4.3 17.6 4 20z" />
      <path d="M14.5 7.5l2 2" />
      <path d="M3 21c3-1.8 6-2 9-.6" />
    </Svg>
  );
}

export function IcoCheck() {
  return (
    <Svg>
      <path d="M4 12.5l5 5L20 6.5" />
    </Svg>
  );
}

export function IcoInsta() {
  return (
    <Svg>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.2 6.8h.01" strokeWidth="2.2" />
    </Svg>
  );
}

export function IcoPin2() {
  return (
    <Svg>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.5 21l3-9" />
      <path d="M8.8 10.2c-.6 2.3.6 4 2.4 4 2.3 0 3.8-1.9 3.8-4.1 0-2-1.5-3.4-3.5-3.4a3.9 3.9 0 0 0-4 4c0 .8.3 1.5.8 2" />
    </Svg>
  );
}

export function IcoX() {
  return (
    <Svg>
      <path d="M5 5l14 14M19 5L5 19" />
    </Svg>
  );
}

export function IcoStar() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function IcoTag() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 1 0 0 3z" />
    </svg>
  );
}

export function IcoArrL() {
  return (
    <Svg>
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </Svg>
  );
}

export function IcoArrR() {
  return (
    <Svg>
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </Svg>
  );
}

export function IcoArrUR() {
  return (
    <Svg>
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </Svg>
  );
}

/* Category icons — drawn line icons, consistent stroke */

export function CatRing() {
  return (
    <BigSvg>
      <circle cx="32" cy="38" r="15" />
      <path d="M32 8 L40 17 L32 24 L24 17 Z" />
      <path d="M24 17 H40 M32 8 V24" />
    </BigSvg>
  );
}

export function CatCouple() {
  return (
    <BigSvg>
      <circle cx="25" cy="39" r="13" />
      <circle cx="40" cy="39" r="13" />
      <path d="M25 15 L30 21 L25 26 L20 21 Z" />
      <path d="M40 15 L45 21 L40 26 L35 21 Z" />
    </BigSvg>
  );
}

export function CatEarrings() {
  return (
    <BigSvg>
      <path d="M20 6 a6 6 0 1 1 -6 6" />
      <path d="M20 20 L20 26" />
      <path d="M20 26 C14 34 13 40 20 47 C27 40 26 34 20 26 Z" />
      <path d="M44 6 a6 6 0 1 1 -6 6" />
      <path d="M44 20 L44 26" />
      <path d="M44 26 C38 34 37 40 44 47 C51 40 50 34 44 26 Z" />
    </BigSvg>
  );
}

export function CatNecklace() {
  return (
    <BigSvg>
      <path d="M10 8 C10 30 20 42 32 44 C44 42 54 30 54 8" />
      <path d="M32 44 V49" />
      <path d="M32 49 C27 54 26 57 32 61 C38 57 37 54 32 49 Z" />
    </BigSvg>
  );
}

export function CatBracelet() {
  return (
    <BigSvg>
      <path d="M14 22 A22 22 0 1 0 50 22" />
      <circle cx="14" cy="22" r="3" />
      <circle cx="50" cy="22" r="3" />
      <path d="M32 47 L32 52 M27 49.5 L37 49.5" />
    </BigSvg>
  );
}

export function CatBangles() {
  return (
    <BigSvg>
      <circle cx="29" cy="29" r="17" />
      <circle cx="37" cy="37" r="17" />
      <circle cx="29" cy="16" r="2.4" />
      <circle cx="37" cy="24" r="2.4" />
    </BigSvg>
  );
}
