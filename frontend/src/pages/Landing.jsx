import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CountUp from "../components/CountUp";
import Icon from "../components/Icon";
import LeadForm from "../components/LeadForm";
import { useGlow, useReveal, useScrolled } from "../hooks/useMotion";
import "../landing.css";

const BRAND = "EtelQuotes";

const solutions = [
  {
    title: "Medicare",
    icon: "heart",
    text: "Medicare Advantage, Supplement and Part D options explained by a licensed agent.",
  },
  {
    title: "ACA & Under-65 Health",
    icon: "users",
    text: "ACA Marketplace and U65 individual and family plans, with subsidies checked for you.",
  },
  {
    title: "Final Expense Life",
    icon: "shield",
    text: "Affordable whole life coverage to help your family with end-of-life costs.",
  },
  {
    title: "Mortgage Protection",
    icon: "home",
    text: "Life coverage that can help keep your family in the home if the unexpected happens.",
  },
  {
    title: "Debt Settlement",
    icon: "wallet",
    text: "Talk to a specialist about options for resolving unsecured debt.",
  },
  {
    title: "Home Improvement",
    icon: "tools",
    text: "Get matched with contractors for roofing, windows, baths, HVAC and more.",
  },
];

const marquee = [
  "Medicare",
  "Medicare Advantage",
  "ACA Plans",
  "Under 65 Health",
  "Final Expense",
  "Mortgage Protection",
  "Debt Settlement",
  "Home Improvement",
];

const stats = [
  { value: 3756, suffix: "+", label: "Happy clients" },
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
    text: "Options reflect what is available in your state and ZIP code.",
  },
  {
    icon: "shield",
    title: "No obligation",
    text: "Free to request, free to compare, and you decide what happens next.",
  },
];

const trust = [
  "Free quotes",
  "Live specialists",
  "Options for your state",
  "No obligation",
];

const steps = [
  [
    "Tell us what you need",
    "Share your ZIP code and the coverage or service you are looking for.",
  ],
  [
    "We match you locally",
    "We find specialists and partners that serve your state and area.",
  ],
  [
    "Quick qualification",
    "A few questions about your situation, needs and budget.",
  ],
  ["Live call", "You speak with a representative, no waiting."],
  [
    "Decide with confidence",
    "Compare your options and choose what fits, or walk away.",
  ],
];

const comparison = [
  [
    "Consumer-requested quotes",
    "Yes, every request comes from you",
    "Often purchased or recycled lists",
  ],
  ["Speed", "Live call within minutes", "Hours or days"],
  ["Quality checks", "Verified before every transfer", "Limited"],
  [
    "Transparency",
    "Clear plan and pricing details",
    "Fine print and surprises",
  ],
  ["Flexibility", "Compare options from many carriers", "One company's offer"],
];

const faqs = [
  [
    "Is there a cost to get a quote?",
    "No. Requesting a quote is free and there is no obligation to enroll or sign up for anything.",
  ],
  [
    "Who will call me?",
    "A licensed agent or representative from a partner that serves your state. Calls typically arrive within minutes of your request.",
  ],
  [
    "What do you do with my information?",
    "We use your details only to connect you with specialists for the service you requested. See our Privacy Policy for details.",
  ],
  [
    "Which insurance companies do you work with?",
    "We work with a range of health and life insurance carriers. Availability and eligibility depend on your state, age and ZIP code.",
  ],
  [
    "Can I enroll in Medicare or ACA plans at any time?",
    "Medicare and ACA plans have enrollment periods. A specialist can tell you whether you are in an open or special enrollment window.",
  ],
  [
    "Does debt settlement work for everyone?",
    "No. Not every debt qualifies and results vary. A specialist will explain the options, costs and possible effects before you decide anything.",
  ],
];

export default function Landing() {
  const [open, setOpen] = useState(0);

  // TrustedForm: loads the cert script, which fills the hidden xxTrustedFormCertUrl field.
  // Load it once only: a second instance throws "Lock found" (StrictMode runs effects twice in dev).
  useEffect(() => {
    if (document.getElementById("trustedform-script")) return;
    const tf = document.createElement("script");
    tf.id = "trustedform-script";
    tf.type = "text/javascript";
    tf.async = true;
    tf.src =
      "https://api.trustedform.com/trustedform.js?field=xxTrustedFormCertUrl&use_tagged_consent=true&l=" +
      new Date().getTime() +
      Math.random();
    document.body.appendChild(tf);
  }, []);
  const heroRef = useRef(null);
  const [menu, setMenu] = useState(false);
  const scrolled = useScrolled();
  const pastHero = useScrolled(640);

  // Any "#quote" link scrolls to the form and puts the cursor in First name.
  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest?.('a[href="#quote"]');
      if (!link) return;
      e.preventDefault();
      const form = document.getElementById("quote");
      if (!form) return;
      form.scrollIntoView({ behavior: "smooth", block: "center" });
      // preventScroll so focusing doesn't interrupt the smooth scroll.
      setTimeout(
        () =>
          document.getElementById("first_name")?.focus({ preventScroll: true }),
        400,
      );
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
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
        <nav
          className={`lp-nav ${menu ? "open" : ""}`}
          onClick={() => setMenu(false)}
        >
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
          {/* Rotating eagle logo background (disabled)
          <div className="lp-orb" aria-hidden="true">
            <img src="/logo.jpeg" alt="" />
          </div>
          */}
          <div className="lp-hero-copy lp-intro">
            <p className="lp-eyebrow">
              <span className="lp-dot" /> Health, life &amp; home quotes,
              delivered live
            </p>
            <h1>
              The right health coverage and savings, <em>on a live call.</em>
            </h1>
            <p className="lp-lead">
              {BRAND} connects you with licensed agents and specialists for
              Medicare, ACA and under-65 health plans, life insurance, debt
              relief and home improvement. Free to request, with no obligation.
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
          <p className="lp-kicker" data-reveal>
            Solutions
          </p>
          <h2 data-reveal>One place for coverage and savings</h2>
          <p className="lp-sub" data-reveal data-delay="1">
            Whatever you are looking for, we route you to the right specialist.
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
          <p className="lp-kicker" data-reveal>
            How it works
          </p>
          <h2 data-reveal>From request to answers in five steps</h2>
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
          <p className="lp-kicker" data-reveal>
            Why {BRAND}
          </p>
          <h2 data-reveal>Built for people who want answers, not forms</h2>
          <div className="lp-values">
            {values.map((v, i) => (
              <div
                key={v.title}
                className="lp-value"
                data-reveal
                style={{ "--i": i }}
              >
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
          <p className="lp-kicker" data-reveal>
            FAQ
          </p>
          <h2 data-reveal>Answers before the call</h2>
          <div className="lp-faq" data-reveal data-delay="1">
            {faqs.map(([q, a], i) => (
              <div
                key={q}
                className={`lp-faq-item ${open === i ? "open" : ""}`}
              >
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
          <h2>Ready to find better coverage?</h2>
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

      <button
        type="button"
        className={`lp-to-top ${pastHero ? "show" : ""}`}
        aria-label="Back to top"
        tabIndex={pastHero ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <Icon name="arrow" size={20} />
      </button>

      <footer className="lp-footer">
        <noscript>
          <img
            src="https://api.trustedform.com/ns.gif"
            alt=""
            width="1"
            height="1"
          />
        </noscript>
        <div>
          <div className="lp-brand">
            <img src="/logo.jpeg" alt="" />
            <span>
              Etel<b>Quotes</b>
            </span>
          </div>
          <p>A service of Eagle Telecommunications. Calls that close deals.</p>
        </div>
        <div>
          <h4>Solutions</h4>
          <a href="#solutions">Medicare</a>
          <a href="#solutions">ACA &amp; Under-65 Health</a>
          <a href="#solutions">Final Expense &amp; Mortgage Protection</a>
          <a href="#solutions">Debt Settlement &amp; Home Improvement</a>
        </div>
        <div>
          <h4>Company</h4>
          <a href="#quote">Get a quote</a>
          <a href="#faq">FAQ</a>
        </div>
        <p className="lp-legal">
          &copy; {new Date().getFullYear()} {BRAND}.com &middot; Eagle
          Telecommunications. Availability and eligibility vary by state and ZIP
          code. {BRAND} is not affiliated with or endorsed by Medicare, the U.S.
          government or the federal Medicare program. Debt settlement results
          vary and are not guaranteed.
        </p>
      </footer>
    </div>
  );
}
