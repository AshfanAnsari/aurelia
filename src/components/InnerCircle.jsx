/* 7 · INNER CIRCLE — newsletter panel with success state. */
export default function InnerCircle({ subscribed, email, onEmailChange, onSubmit }) {
  return (
    <section className="section circle-sec" id="circle" aria-label="Join the Inner Circle">
      <div className="wrap">
        <div className="circle-panel rv">
          <h2 className="sec-title">JOIN THE INNER CIRCLE</h2>
          <p className="line">Be the first to discover new collections, private previews and atelier stories.</p>
          {subscribed ? (
            <p className="circle-success" aria-live="polite">
              Welcome to the Inner Circle — your first preview is on its way.
            </p>
          ) : (
            <form className="circle-form" onSubmit={onSubmit}>
              <label className="sr-only" htmlFor="circle-email">
                Email address
              </label>
              <input
                id="circle-email"
                type="email"
                required
                value={email}
                placeholder="Your email address"
                autoComplete="email"
                onChange={(e) => onEmailChange(e.target.value)}
              />
              <button type="submit">Subscribe</button>
            </form>
          )}
          <p className="circle-small">One letter a month. No spam — unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}
