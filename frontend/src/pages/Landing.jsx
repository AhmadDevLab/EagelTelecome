import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import CountUp from "../components/CountUp";
import Icon from "../components/Icon";
import LeadForm from "../components/LeadForm";
import { useGlow, useReveal, useScrolled } from "../hooks/useMotion";
import "../landing.css";

const BRAND = "EtelQuotes";

const solutions = [
  {
    title: "Home Internet & Fiber",
    icon: "wifi",
    text: "Compare fiber, cable and 5G home plans available at your address.",
  },
  {
    title: "Mobile Plans",
    icon: "mobile",
    text: "Unlimited, family and prepaid plans from the major carriers.",
  },
  {
    title: "Business Phone & VoIP",
    icon: "phone",
    text: "Hosted PBX, SIP trunking and multi-line systems for growing teams.",
  },
  {
    title: "TV & Streaming",
    icon: "tv",
    text: "Cable, satellite and streaming bundles matched to what you watch.",
  },
  {
    title: "Bundles & Savings",
    icon: "layers",
    text: "Combine internet, mobile and TV into one plan and one bill.",
  },
  {
    title: "Relocation & New Service",
    icon: "home",
    text: "Moving soon? Line up service before you arrive.",
  },
];

const marquee = [
  "Fiber Internet",
  "5G Home",
  "Unlimited Mobile",
  "Business VoIP",
  "SIP Trunking",
  "Streaming TV",
  "Bundles",
  "New Service",
];

// Social-proof figures. Keep these accurate and update as they change.
const stats = [
  { value: 2000, suffix: "+", label: "Happy clients" },
  { value: 0, prefix: "$", label: "Cost to request a quote" },
  { text: "Live", label: "Specialists on every call" },
];

const values = [
  {
    icon: "bolt",
    title: "Live, not lists",
    text: "You get a real conversation with a specialist, not a stack of emails.",
  },
  {
    icon: "pin",
    title: "Local availability",
    text: "Quotes reflect what providers actually offer at your ZIP code.",
  },
  {
    icon: "shield",
    title: "No obligation",
    text: "Free to request, free to compare, and you decide what happens next.",
  },
];

const trust = ["Free quotes", "Live specialists", "Local plans", "No obligation"];

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
  const heroRef = useRef(null);
  const [menu, setMenu] = useState(false);
  const scrolled = useScrolled();
  const pastHero = useScrolled(640);
  useReveal();
  useGlow(heroRef);

  return (
    <div className="lp">
      <header className={`lp-header ${scrolled ? "is-scrolled" : ""}`}>
        <a href="#top" className="lp-brand">
          <img src="/logo.jpeg" alt="Eagle Telecommunications" />
          <span>
            Etel<b>Quotes</b>
          </span>
        </a>
        <nav className={`lp-nav ${menu ? "open" : ""}`} onClick={() => setMenu(false)}>
          <a href="#solutions">Solutions</a>
          <a href="#how">How it works</a>
          <a href="#why">Why us</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a href="#quote" className="lp-btn lp-btn-gold lp-btn-sm lp-header-cta">
          Get a quote
        </a>
        <button
          type="button"
          className={`lp-burger ${menu ? "open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={menu}
          onClick={() => setMenu((m) => !m)}
        >
          <span />
          <span />
        </button>
      </header>

      <main id="top">
        <section className="lp-hero" ref={heroRef}>
          <div className="lp-orb" aria-hidden="true">
            <img src="/logo.jpeg" alt="" />
          </div>
          <div className="lp-hero-copy lp-intro">
            <p className="lp-eyebrow">
              <span className="lp-dot" /> Telecom quotes, delivered live
            </p>
            <h1>
              The right phone, internet and TV plan, <em>on a live call.</em>
            </h1>
            <p className="lp-lead">
              {BRAND} connects you with licensed representatives who can quote
              plans available at your address. Calls that close deals, for
              customers who are ready to switch.
            </p>
            <div className="lp-hero-actions">
              <a href="#quote" className="lp-btn lp-btn-gold">
                Get my free quote <Icon name="arrow" size={18} />
              </a>
              <a href="#how" className="lp-btn lp-btn-outline">
                See how it works
              </a>
            </div>
            <ul className="lp-trust">
              {trust.map((t) => (
                <li key={t}>
                  <Icon name="check" size={16} /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="lp-intro lp-intro-2">
            <LeadForm />
          </div>
        </section>

        <div className="lp-marquee" aria-hidden="true">
          <div className="lp-marquee-track">
            {[...marquee, ...marquee].map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
        </div>

        <section id="solutions" className="lp-section">
          <p className="lp-kicker" data-reveal>Solutions</p>
          <h2 data-reveal>One place for every telecom service</h2>
          <p className="lp-sub" data-reveal data-delay="1">
            Whatever you need connected, we route you to the right specialist.
          </p>
          <div className="lp-grid">
            {solutions.map((s, i) => (
              <article
                key={s.title}
                className="lp-tile"
                data-reveal
                style={{ "--i": i }}
              >
                <span className="lp-icon">
                  <Icon name={s.icon} />
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <a href="#quote">Get a quote &rarr;</a>
              </article>
            ))}
          </div>
        </section>

        <section id="how" className="lp-section lp-alt">
          <p className="lp-kicker" data-reveal>How it works</p>
          <h2 data-reveal>From request to connected in five steps</h2>
          <ol className="lp-steps">
            {steps.map(([title, text], i) => (
              <li key={title} data-reveal style={{ "--i": i }}>
                <span className="lp-step-num">{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="lp-stats" aria-label="Our numbers">
          <div className="lp-stats-inner">
            {stats.map((st, i) => (
              <div
                key={st.label}
                className="lp-stat"
                data-reveal
                style={{ "--i": i }}
              >
                <strong>
                  {st.text ?? (
                    <CountUp
                      value={st.value}
                      prefix={st.prefix}
                      suffix={st.suffix}
                    />
                  )}
                </strong>
                <span>{st.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="why" className="lp-section">
          <p className="lp-kicker" data-reveal>Why {BRAND}</p>
          <h2 data-reveal>Built for people who want answers, not forms</h2>
          <div className="lp-values">
            {values.map((v, i) => (
              <div key={v.title} className="lp-value" data-reveal style={{ "--i": i }}>
                <span className="lp-icon">
                  <Icon name={v.icon} />
                </span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
          <div className="lp-table-wrap" data-reveal data-delay="1">
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
          <p className="lp-kicker" data-reveal>FAQ</p>
          <h2 data-reveal>Answers before the call</h2>
          <div className="lp-faq" data-reveal data-delay="1">
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
                <div className="lp-faq-body">
                  <p>{a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="lp-cta" data-reveal>
          <h2>Ready to find a better plan?</h2>
          <p>Request your free quote and speak with a specialist today.</p>
          <a href="#quote" className="lp-btn lp-btn-gold">
            Get my quote
          </a>
        </section>
      </main>

      <a
        href="#quote"
        className={`lp-sticky-cta ${pastHero ? "show" : ""}`}
        aria-hidden={!pastHero}
        tabIndex={pastHero ? 0 : -1}
      >
        Get my free quote <Icon name="arrow" size={18} />
      </a>

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
