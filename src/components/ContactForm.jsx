import { useState } from "react";
import { LuSend, LuCheck, LuTriangleAlert } from "react-icons/lu";
import { profile } from "../data.js";

// Sends mail via FormSubmit.co (free, no account/API key; the inbox owner
// confirms once via an activation email). Falls back to mailto on failure.
export default function ContactForm() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setStatus("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name.value,
          email: form.email.value,
          message: form.message.value,
          _subject: `Portfolio contact from ${form.name.value}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const data = await res.json();
      if (data.success === "true" || data.success === true) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="contact-form contact-form-done">
        <LuCheck className="cf-done-icon" />
        <p>message delivered — I'll get back to you soon.</p>
        <button type="button" className="btn btn-ghost" onClick={() => setStatus("idle")}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="cf-row">
        <label className="cf-field">
          <span className="cf-label">name</span>
          <input name="name" type="text" required autoComplete="name" placeholder="Jane Recruiter" />
        </label>
        <label className="cf-field">
          <span className="cf-label">email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="jane@company.com" />
        </label>
      </div>
      <label className="cf-field">
        <span className="cf-label">message</span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Hi John, we'd love to talk about..."
        />
      </label>
      <button type="submit" className="btn btn-primary cf-submit" disabled={status === "sending"}>
        <LuSend />
        {status === "sending" ? "sending..." : "Send Message"}
      </button>
      {status === "error" && (
        <p className="cf-error" role="alert">
          <LuTriangleAlert /> couldn't send — email me directly at{" "}
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </p>
      )}
    </form>
  );
}
