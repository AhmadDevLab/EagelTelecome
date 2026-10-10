import { useMemo, useState } from "react";
import api from "../lib/api";
import { previewEmail } from "../lib/email";

const initialForm = {
  first_name: "",
  last_name: "",
  zip_code: "",
  phone_number: "",
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
    setFormError("");
    setSubmitting(true);

    try {
      const response = await api.post("/submissions", form);
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

  const emailPreview = useMemo(
    () => previewEmail(form.first_name, form.last_name),
    [form.first_name, form.last_name],
  );

  if (result) {
    return (
      <div className="lp-card lp-success">
        <div className="lp-success-icon">&#10003;</div>
        <h2>Request received</h2>
        <p className="lp-muted">
          Thanks, {result.first_name}. A specialist will call you shortly.
        </p>
        <dl className="lp-kv">
          <div>
            <dt>Reference ID</dt>
            <dd className="lp-mono">{result.form_id}</dd>
          </div>
          <div>
            <dt>Verification code</dt>
            <dd className="lp-mono">{result.verification_code}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd className="lp-mono">{result.generated_email}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{result.phone_number}</dd>
          </div>
        </dl>
        <button className="lp-btn lp-btn-ghost" onClick={() => setResult(null)}>
          Submit another request
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

      <div className="lp-field">
        <label>Email (auto-generated)</label>
        <div className="lp-email">
          {emailPreview || "firstnamelastname47@gmail.com"}
        </div>
      </div>

      <div className="lp-row">
        <Field
          id="zip_code"
          label="ZIP code"
          value={form.zip_code}
          error={errors.zip_code}
          onChange={updateField}
          autoComplete="postal-code"
          inputMode="numeric"
        />
        <Field
          id="phone_number"
          label="Phone number"
          value={form.phone_number}
          error={errors.phone_number}
          onChange={updateField}
          autoComplete="tel"
          inputMode="tel"
        />
      </div>

      <button className="lp-btn lp-btn-gold" type="submit" disabled={submitting}>
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
        value={value}
        className={error ? "has-error" : ""}
        onChange={(e) => onChange(id, e.target.value)}
        {...rest}
      />
      {error && <div className="lp-error">{error}</div>}
    </div>
  );
}
