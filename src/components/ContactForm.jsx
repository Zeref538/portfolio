import { useState } from "react";
import { LuSend, LuCheck, LuTriangleAlert } from "react-icons/lu";
import { profile } from "../data.js";

// Sends mail via FormSubmit.co (free, no account/API key; the inbox owner
// confirms once via an activation email). Falls back to mailto on failure.
export default function ContactForm() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorDetail, setErrorDetail] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    // `required` only checks the field is not an empty string, so a single space
    // sails through it and sends a blank enquiry. Trim first, and bail with a
    // message rather than a silent no-op.
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) {
      setErrorDetail("please fill in your name, email and a message");
      setStatus("error");
      return;
    }
    if (message.length > 5000) {
      setErrorDetail("that message is over 5,000 characters - please shorten it");
      setStatus("error");
      return;
    }
    // Spam bots fill in every field they find. This one is hidden from people, so
    // anything in it means a bot: drop it and show success rather than telling the
    // bot it was caught.
    if (form._honey && form._honey.value) {
      setStatus("sent");
      form.reset();
      return;
    }

    setStatus("sending");
    setErrorDetail("");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Portfolio contact from ${name}`,
          _template: "table",
          _captcha: "false",
        }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        // non-JSON response from FormSubmit - fall through with data=null
      }

      if (res.ok && data && (data.success === "true" || data.success === true)) {
        setStatus("sent");
        form.reset();
      } else {
        // surface FormSubmit's own message - usually explains *why*
        // (most common: the form needs one-time activation via email)
        setErrorDetail(data?.message || `request failed (${res.status})`);
        setStatus("error");
      }
    } catch (err) {
      setErrorDetail(err?.message || "network error");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="contact-form contact-form-done">
        <LuCheck className="cf-done-icon" />
        <p>message delivered - I'll get back to you soon.</p>
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
          <input name="name" type="text" required autoComplete="name" placeholder="your name" maxLength={120} />
        </label>
        <label className="cf-field">
          <span className="cf-label">email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" maxLength={200} />
        </label>
      </div>
      <label className="cf-field">
        <span className="cf-label">message</span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Hi John, we'd love to talk about..."
          maxLength={5000}
        />
      </label>
      {/* honeypot: hidden from people, irresistible to bots. tabIndex -1 and
          aria-hidden keep it out of keyboard and screen-reader flow. */}
      <input
        name="_honey"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <button type="submit" className="btn btn-primary cf-submit" disabled={status === "sending"}>
        <LuSend />
        {status === "sending" ? "sending..." : "Send Message"}
      </button>
      {status === "error" && (
        <p className="cf-error" role="alert">
          <LuTriangleAlert /> couldn't send{errorDetail ? `: ${errorDetail}` : ""} - email me directly at{" "}
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </p>
      )}
    </form>
  );
}
