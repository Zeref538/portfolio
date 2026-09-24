import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import { profile } from "./data.js";
import "./project-page.css";

// Every line here describes something the code actually does. If a data flow
// changes - a new form service, a new analytics tool, a new model host - this
// page changes in the same commit, or it becomes a false statement.
export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const prev = document.title;
    document.title = "Privacy - John Andrei Martinez";
    return () => { document.title = prev; };
  }, []);

  return (
    <div className="pp-wrap">
      <div className="pp-container pp-privacy">
        <Link className="pp-back" to="/">
          <LuArrowLeft /> back to the homepage
        </Link>
        <header className="pp-head">
          <h1>Privacy</h1>
          <div className="pp-category">Last updated September 2026</div>
        </header>

        <h2 className="pp-sec">// the short version</h2>
        <p className="pp-desc">
          This is a personal portfolio. It has no accounts, sets no tracking
          cookies, and sells nothing. The only personal data it handles is what
          you choose to type into the contact form or the chatbot.
        </p>

        <h2 className="pp-sec">// contact form</h2>
        <p className="pp-desc">
          Your name, email and message are sent through FormSubmit (formsubmit.co)
          to my inbox. I use them only to reply to you. FormSubmit handles the
          delivery under its own privacy terms. I do not add you to any list.
        </p>

        <h2 className="pp-sec">// chatbot</h2>
        <p className="pp-desc">
          What you type into zeref-bot is sent to Microsoft Azure OpenAI to
          generate the answer. This site does not save the conversation, and it
          is gone when you close the page. Your IP address is held in memory
          for a short time only to limit how many questions one visitor can
          send, so nobody can run up the bill.
        </p>

        <h2 className="pp-sec">// visit counts</h2>
        <p className="pp-desc">
          Vercel Web Analytics counts page views and Vercel Speed Insights
          measures load speed. Neither sets cookies or follows you to other
          sites. Fonts are served from this site, not from Google.
        </p>

        <h2 className="pp-sec">// removing your data</h2>
        <p className="pp-desc">
          If you sent me a message and want it deleted, email{" "}
          <a href={`mailto:${profile.email}`}>{profile.email}</a> and I will
          delete it from my inbox. This applies under the Philippine Data
          Privacy Act of 2012.
        </p>
      </div>
    </div>
  );
}
