import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { previewEmail } from "../lib/email";

const initialForm = {
  first_name: "",
  last_name: "",
  zip_code: "",
  phone_number: "",
};

export default function PublicForm() {
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

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">ET</span>
          Eagle Telecom
        </div>
        <span className="topbar-tag">Client Intake Demo</span>
      </header>

      <main className="content">
        {result ? (
          <div className="card form-card success-panel">
            <div className="success-icon">&#10003;</div>
            <h2 className="form-title">Submission received</h2>
            <p className="form-subtitle">
              A unique form ID and verification code were generated for this
              entry.
            </p>

            <div className="kv-list">
              <Row label="Form ID" value={result.form_id} mono />
              <Row
                label="Verification Code"
                value={result.verification_code}
                mono
              />
              <Row
                label="Name"
                value={`${result.first_name} ${result.last_name}`}
              />
              <Row
                label="Generated Email"
                value={result.generated_email}
                mono
              />
              <Row label="Zip Code" value={result.zip_code} />
              <Row label="Phone Number" value={result.phone_number} />
              <Row
                label="Submitted At"
                value={new Date(result.submitted_at).toLocaleString()}
              />
            </div>

            <button
              className="btn btn-secondary"
              style={{ width: "100%" }}
              onClick={() => setResult(null)}
            >
              Submit another entry
            </button>
          </div>
        ) : (
          <form className="card form-card" onSubmit={handleSubmit} noValidate>
            <h2 className="form-title">Get in touch</h2>
            <p className="form-subtitle">
              Fill in your details below. An account email is generated
              automatically &mdash; no need to type one.
            </p>

            {formError && <div className="alert alert-error">{formError}</div>}

            <div className="field">
              <label htmlFor="first_name">First name</label>
              <input
                id="first_name"
                className={errors.first_name ? "has-error" : ""}
                value={form.first_name}
                onChange={(e) => updateField("first_name", e.target.value)}
                placeholder="Ahmad"
                autoComplete="given-name"
              />
              {errors.first_name && (
                <div className="field-error">{errors.first_name}</div>
              )}
            </div>

            <div className="field">
              <label htmlFor="last_name">Last name</label>
              <input
                id="last_name"
                className={errors.last_name ? "has-error" : ""}
                value={form.last_name}
                onChange={(e) => updateField("last_name", e.target.value)}
                placeholder="Ullah"
                autoComplete="family-name"
              />
              {errors.last_name && (
                <div className="field-error">{errors.last_name}</div>
              )}
            </div>

            <div className="field">
              <label>Email (auto-generated)</label>
              <div className="email-preview">
                &#9993;
                <strong>
                  {emailPreview || "firstnamelastname47@gmail.com"}
                </strong>
              </div>
            </div>

            <div className="field">
              <label htmlFor="zip_code">Zip code</label>
              <input
                id="zip_code"
                className={errors.zip_code ? "has-error" : ""}
                value={form.zip_code}
                onChange={(e) => updateField("zip_code", e.target.value)}
                placeholder="54000"
                autoComplete="postal-code"
              />
              {errors.zip_code && (
                <div className="field-error">{errors.zip_code}</div>
              )}
            </div>

            <div className="field">
              <label htmlFor="phone_number">Phone number</label>
              <input
                id="phone_number"
                className={errors.phone_number ? "has-error" : ""}
                value={form.phone_number}
                onChange={(e) => updateField("phone_number", e.target.value)}
                placeholder="0300 1234567"
                autoComplete="tel"
              />
              {errors.phone_number && (
                <div className="field-error">{errors.phone_number}</div>
              )}
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </form>
        )}
      </main>

      <div className="footer-note">
        <Link to="/admin" style={{ color: "inherit" }}>
          Admin access
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div className="kv-row">
      <span className="kv-key">{label}</span>
      <span className={`kv-val ${mono ? "mono" : ""}`}>{value}</span>
    </div>
  );
}
