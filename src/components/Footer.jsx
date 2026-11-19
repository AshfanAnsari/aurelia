import { IcoInsta, IcoPin2, IcoX } from './icons';

const PAYMENTS = ['VISA', 'Mastercard', 'AMEX', 'PayPal', 'Apple Pay'];

/* 8 · FOOTER — ink footer with payment chips, legal links, socials. */
export default function Footer({ onOpenLegal, onOpenConcierge }) {
  return (
    <footer>
      <div className="foot-brand">AURELIA</div>
      <div className="foot-sub">Haute Joaillerie</div>
      <div className="pay-row" aria-label="Accepted payments">
        {PAYMENTS.map((p) => (
          <span className="pay-chip" key={p}>
            {p}
          </span>
        ))}
      </div>
      <nav className="foot-links" aria-label="Footer">
        <button onClick={() => onOpenLegal('terms')}>Terms</button>
        <button onClick={() => onOpenLegal('privacy')}>Privacy</button>
        <button onClick={onOpenConcierge}>Contact</button>
      </nav>
      <div className="social-row">
        <span className="social-lbl">Follow Us</span>
        <a className="social-btn" href="#top" aria-label="AURELIA on Instagram" onClick={(e) => e.preventDefault()}>
          <IcoInsta />
        </a>
        <a className="social-btn" href="#top" aria-label="AURELIA on Pinterest" onClick={(e) => e.preventDefault()}>
          <IcoPin2 />
        </a>
        <a className="social-btn" href="#top" aria-label="AURELIA on X" onClick={(e) => e.preventDefault()}>
          <IcoX />
        </a>
      </div>
      <p className="copy-line">© 2026 AURELIA Haute Joaillerie</p>
    </footer>
  );
}
