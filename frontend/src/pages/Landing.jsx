import { useState } from "react";
import { Link } from "react-router-dom";
import LeadForm from "../components/LeadForm";
import "../landing.css";

const BRAND = "EtelQuotes";

const solutions = [
  {
    title: "Home Internet & Fiber",
    text: "Compare fiber, cable and 5G home plans available at your address.",
  },
  {
    title: "Mobile Plans",
    text: "Unlimited, family and prepaid plans from the major carriers.",
  },
  {
    title: "Business Phone & VoIP",
    text: "Hosted PBX, SIP trunking and multi-line systems for growing teams.",
  },
  {
    title: "TV & Streaming",
    text: "Cable, satellite and streaming bundles matched to what you watch.",
  },
  {
    title: "Bundles & Savings",
    text: "Combine internet, mobile and TV into one plan and one bill.",
  },
  {
    title: "Relocation & New Service",
    text: "Moving soon? Line up service before you arrive.",
  },
];

const steps = [
  ["Tell us where you are", "Share your ZIP code and the services you need."],
  ["We find local options", "We check which providers and plans serve your area."],
  ["Quick qualification", "A specialist confirms your needs, budget and timing."],
  ["Live call", "You speak with a licensed representative, no waiting."],
  ["Get connected", "Pick a plan and get set up, usually within days."],
];

const comparison = [
  ["Consumer-requested quotes", "Yes, every request comes from you", "Often purchased or recycled lists"],
  ["Speed", "Live call within minutes", "Hours or days"],
  ["Quality checks", "Verified before every transfer", "Limited"],
  ["Transparency", "Clear plan and pricing details", "Fine print and surprises"],
  ["Flexibility", "Compare many providers", "One provider's offer"],
];

const faqs = [
  [
    "Is there a cost to get a quote?",
    "No. Requesting a quote is free and there is no obligation to sign up for anything.",
  ],
  [
    "Who will call me?",
    "A representative from a provider or partner that serves your ZIP code. Calls typically arrive within minutes of your request.",
  ],
  [
    "What do you do with my information?",
    "We use your details only to connect you with providers for the service you requested. See our Privacy Policy for details.",
  ],
  [
    "Which providers do you work with?",
    "We work with a range of internet, mobile, TV and business phone providers. Availability depends on your address.",
  ],
  [
    "Can I request business services?",
    "Yes. Business phone, VoIP and multi-line plans are available. Mention it when the specialist calls.",
  ],
  [
    "How fast can I get connected?",
    "Mobile plans can be active the same day. Home internet installation usually takes a few days, depending on the provider.",
  ],
];

export default function Landing() {
  const [open, setOpen] = useState(0);

  return (
    <div className="lp">
      <header className="lp-header">
        <a href="#top" className="lp-brand">
          <img src="/logo.jpeg" alt="Eagle Telecommunications" />
          <span>
            Etel<b>Quotes</b>
          </span>
        </a>
        <nav className="lp-nav">
          <a href="#solutions">Solutions</a>
          <a href="#how">How it works</a>
          <a href="#why">Why us</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a href="#quote" className="lp-btn lp-btn-gold lp-btn-sm">
          Get a quote
        </a>
      </header>

      <main id="top">
        <section className="lp-hero">
          <div className="lp-hero-copy">
            <p className="lp-eyebrow">Telecom quotes, delivered live</p>
            <h1>
              The right phone, internet and TV plan, <em>on a live call.</em>
            </h1>
            <p className="lp-lead">
              {BRAND} connects you with licensed representatives who can quote
              plans available at your address. Calls that close deals, for
              customers who are ready to switch.
            </p>
            <div className="lp-badges">
              <span>Free quotes</span>
              <span>Real-time call delivery</span>
              <span>Local availability</span>
            </div>
          </div>
          <LeadForm />
        </section>

        <section id="solutions" className="lp-section">
          <h2>One place for every telecom service</h2>
          <p className="lp-sub">
            Whatever you need connected, we route you to the right specialist.
          </p>
          <div className="lp-grid">
            {solutions.map((s) => (
              <article key={s.title} className="lp-tile">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <a href="#quote">Get a quote &rarr;</a>
              </article>
            ))}
          </div>
        </section>

        <section id="how" className="lp-section lp-alt">
          <h2>From request to connected in five steps</h2>
          <ol className="lp-steps">
            {steps.map(([title, text], i) => (
              <li key={title}>
                <span className="lp-step-num">{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="why" className="lp-section">
          <h2>Built for people who want answers, not forms</h2>
          <div className="lp-table-wrap">
            <table className="lp-table">
              <thead>
                <tr>
                  <th></th>
                  <th>{BRAND}</th>
                  <th>Typical lead sites</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map(([k, a, b]) => (
                  <tr key={k}>
                    <th>{k}</th>
                    <td>{a}</td>
                    <td>{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="faq" className="lp-section lp-alt">
          <h2>Answers before the call</h2>
          <div className="lp-faq">
            {faqs.map(([q, a], i) => (
              <div key={q} className={`lp-faq-item ${open === i ? "open" : ""}`}>
                <button
                  type="button"
                  aria-expanded={open === i}
                  onClick={() => setOpen(open === i ? -1 : i)}
                >
                  {q}
                  <span aria-hidden="true">{open === i ? "−" : "+"}</span>
                </button>
                {open === i && <p>{a}</p>}
              </div>
            ))}
          </div>
        </section>

        <section className="lp-cta">
          <h2>Ready to find a better plan?</h2>
          <p>Request your free quote and speak with a specialist today.</p>
          <a href="#quote" className="lp-btn lp-btn-gold">
            Get my quote
          </a>
        </section>
      </main>

      <footer className="lp-footer">
        <div>
          <div className="lp-brand">
            <img src="/logo.jpeg" alt="" />
            <span>
              Etel<b>Quotes</b>
            </span>
          </div>
          <p>
            A service of Eagle Telecommunications. Calls that close deals.
          </p>
        </div>
        <div>
          <h4>Solutions</h4>
          <a href="#solutions">Internet &amp; Fiber</a>
          <a href="#solutions">Mobile</a>
          <a href="#solutions">Business Phone</a>
          <a href="#solutions">TV &amp; Streaming</a>
        </div>
        <div>
          <h4>Company</h4>
          <a href="#quote">Get a quote</a>
          <a href="#faq">FAQ</a>
          <Link to="/admin">Admin</Link>
        </div>
        <p className="lp-legal">
          &copy; {new Date().getFullYear()} {BRAND}.com &middot; Eagle
          Telecommunications. Quotes are subject to provider availability at
          your address.
        </p>
      </footer>
    </div>
  );
}
