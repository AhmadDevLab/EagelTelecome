import { useState } from "react";
import api from "../lib/api";

const initialForm = {
  first_name: "",
  last_name: "",
  phone_number: "",
  email: "",
  zip_code: "",
  state: "",
  bananaConsent: false,
};

export default function LeadForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [result, setResult] = useState(null);

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[key];
        return next;
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.bananaConsent) {
      setErrors((er) => ({
        ...er,
        bananaConsent: "Please agree to be contacted to continue.",
      }));
      return;
    }
    setFormError("");
    setSubmitting(true);

    try {
      const hidden = new FormData(e.currentTarget);
      const response = await api.post("/submissions", {
        ...form,
        user_agent: navigator.userAgent,
        xxTrustedFormCertUrl: hidden.get("xxTrustedFormCertUrl") || "",
      });
      setResult(response.data.data);
      setForm(initialForm);
      setErrors({});
    } catch (err) {
      if (err.response?.status === 422) {
        const fieldErrors = {};
        const apiErrors = err.response.data.errors || {};
        Object.keys(apiErrors).forEach((key) => {
          fieldErrors[key] = apiErrors[key][0];
        });
        setErrors(fieldErrors);
      } else {
        setFormError(
          "Something went wrong submitting the form. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="lp-card lp-success">
        <div className="lp-success-icon">&#10003;</div>
        <h2>Your quote has been submitted</h2>
        <p className="lp-muted">
          Thanks, {result.first_name}. A specialist will call you shortly.
        </p>
        <button
          type="button"
          className="lp-btn lp-btn-ghost"
          onClick={() => setResult(null)}
        >
          Request another quote
        </button>
      </div>
    );
  }

  return (
    <form className="lp-card" onSubmit={handleSubmit} noValidate id="quote">
      <h2>Get your free quote</h2>
      <p className="lp-muted">Takes under a minute. No obligation.</p>

      {formError && <div className="lp-alert">{formError}</div>}

      <div className="lp-row">
        <Field
          id="first_name"
          label="First name"
          value={form.first_name}
          error={errors.first_name}
          onChange={updateField}
          autoComplete="given-name"
        />
        <Field
          id="last_name"
          label="Last name"
          value={form.last_name}
          error={errors.last_name}
          onChange={updateField}
          autoComplete="family-name"
        />
      </div>

      <div className="lp-row">
        <Field
          id="phone_number"
          label="Phone"
          value={form.phone_number}
          error={errors.phone_number}
          onChange={updateField}
          autoComplete="tel"
          inputMode="tel"
        />
        <Field
          id="email"
          label="Email (optional)"
          type="email"
          value={form.email}
          error={errors.email}
          onChange={updateField}
          autoComplete="email"
        />
      </div>

      <div className="lp-row">
        <Field
          id="zip_code"
          label="Zip code"
          value={form.zip_code}
          error={errors.zip_code}
          onChange={updateField}
          autoComplete="postal-code"
          inputMode="numeric"
        />
        <Field
          id="state"
          label="State"
          value={form.state}
          error={errors.state}
          onChange={(id, v) => updateField(id, v.toUpperCase())}
          autoComplete="address-level1"
          placeholder="e.g. TX"
          maxLength={2}
        />
      </div>

      <input
        type="hidden"
        id="xxTrustedFormCertUrl"
        name="xxTrustedFormCertUrl"
      />

      <label className="lp-consent">
        <input
          type="checkbox"
          id="bananaConsent"
          name="bananaConsent"
          data-tf-element-role="consent-opt-in"
          checked={form.bananaConsent}
          onChange={(e) => updateField("bananaConsent", e.target.checked)}
        />
        <span data-tf-element-role="consent-language">
          By clicking &quot;Check Box&quot;, I expressly consent to these Terms
          of Service and Privacy Policy, and authorize etelquotes.com, their
          agents, and Marketing Partners to contact me about insurance products
          and other non-insurance offers by telephone calls, pre-recorded
          messages or artificial voice, email, and text messages to the number
          and email address I provided above. I agree to receive telemarketing
          calls and pre-recorded messages via an automated dialing system, even
          if my telephone number is a mobile number that is currently listed on
          any state, federal, or corporate &quot;Do Not Call&quot; list. I
          understand that my consent is not a condition of purchase of any goods
          or services. Consent can be revoked by any reasonable means. Standard
          message and data rates may apply.
        </span>
      </label>
      {errors.bananaConsent && (
        <div className="lp-error">{errors.bananaConsent}</div>
      )}

      <button
        id="submit_quote"
        data-tf-element-role="submit"
        className="lp-btn lp-btn-gold"
        type="submit"
        disabled={submitting || !form.bananaConsent}
      >
        {submitting ? "Submitting…" : "Get my quote"}
      </button>
    </form>
  );
}

function Field({ id, label, value, error, onChange, ...rest }) {
  return (
    <div className="lp-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        value={value}
        className={error ? "has-error" : ""}
        onChange={(e) => onChange(id, e.target.value)}
        {...rest}
      />
      {error && <div className="lp-error">{error}</div>}
    </div>
  );
}
