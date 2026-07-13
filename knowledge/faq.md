# Recruiter FAQ

> Answers in John's own words, feeding zeref-bot (the site chatbot).

## Availability & logistics

**Q: Are you currently open to work, and for what kind of role (internship / entry-level / full-time)?**
A: Yes, actively. Internship or entry-level in AI/ML or data analytics. I want a team where I can ship fast and learn faster.

**Q: When can you start, and are you available part-time or full-time?**
A: I can start on short notice. Part-time or full-time both work; tell me the tempo and I'll match it.

**Q: Do you prefer remote, hybrid, or on-site? Are you willing to relocate?**
A: No preference — I perform in all three. Willing to relocate for the right opportunity.

**Q: What is your location and timezone, and how much overlap do you have with US / EU hours?**
A: San Jose del Monte, Bulacan, Philippines (GMT+8). I keep a disciplined schedule, so overlapping with US or EU hours is a planning problem, not a blocker — I'll adjust to your core hours.

**Q: Are you legally authorized to work in the Philippines / would you need visa sponsorship abroad?**
A: Authorized in the Philippines. For roles abroad I'd need sponsorship, and I'm ready to go through that process.

**Q: What are your salary or stipend expectations?**
A: Standard entry-level compensation is fine. I'm optimizing for experience and growth right now — the payoff compounds later.

**Q: What's the best way to reach you, and how fast do you usually respond?**
A: Email or phone. I treat responsiveness as a skill — expect a reply within the day, usually much sooner.

## Role & goals

**Q: What roles are you targeting (Data Analyst, ML Engineer, AI Engineer, Full-Stack)?**
A: AI Engineer, ML Engineer, or Data Analyst. Those three share one core loop — data in, model out, decisions made — so the skills transfer directly between them.

**Q: What kind of problems or domains excite you most?**
A: New or hard problems, any domain. Like a fresh chess opening — the less familiar the position, the more I want to solve it.

**Q: Where do you want to be in 2–3 years?**
A: Deep in a company that earns my loyalty, with strong command of the tech around my role, not just inside it. I plan several moves ahead.

**Q: Why should a company hire you over other junior candidates?**
A: I bring fresh perspective, I'm efficiency-obsessed, and I'm loyal to teams that invest in me. I also ship — I've taken real systems from idea to live deployment on my own, which most juniors haven't done yet.

## Technical strengths

**Q: What's your strongest area — ML modeling, data analysis, or software engineering?**
A: AI implementation — taking models and turning them into working systems. Solid ML fundamentals and working data analytics underneath that.

**Q: Which languages and tools are you most fluent in day-to-day?**
A: Python daily. Around it: FastAPI, React, Supabase, Vercel, and YOLOv8/ONNX for computer vision work.

**Q: How comfortable are you taking a model from data → training → evaluation → deployment?**
A: I've run that full pipeline end to end — dataset annotation, training on GPU, metric evaluation, and live deployment. It's my home turf.

**Q: What's your experience with production systems, cloud, and CI/CD?**
A: I've shipped live deployments — FastAPI backends on Hugging Face Spaces, React frontends on Vercel, with automated builds on deploy. Small scale, real users, real consequences.

**Q: How do you approach learning a new tool or framework quickly?**
A: I build with it immediately. Read just enough docs to start, break something small, fix it, repeat. Reps beat theory — same way you learn a new badminton grip.

## Projects (depth a recruiter will probe)

**Q: Which project are you most proud of, and what was your exact role in it?**
A: Aegix AI. I built the entire thing solo — architecture, model, backend, frontend, deployment. Every decision and every bug was mine.

**Q: What was the hardest technical problem you solved, and how?**
A: In my thesis, detection performance plateaued no matter how I tuned the model. I traced the bottleneck to annotation quality, not model capacity — so I rebuilt the annotation schema, led a full reannotation of the weakest class, and tuned the inference confidence threshold from actual metric curves instead of defaults. Diagnose first, then move.

**Q: Tell me about a time something broke in production or an experiment failed — what did you do?**
A: A new dataset version silently changed the class order, which invalidated my trained models. I caught it in evaluation, retrained from scratch on the new version, and added a check to my workflow so it can't happen twice. Lose a game once, fine — study it so you never lose it the same way.

**Q: For your thesis (ACRA), what was genuinely novel vs. standard technique?**
A: The detection stack (YOLOv8) and color science (Machado CVD simulation, CIEDE2000) are established. The novel part is combining them into an adaptive pipeline that finds color-critical regions in Philippine public materials and re-encodes them in LCH space specifically for deutan-type color vision deficiency — applied research on a real accessibility gap, not a toy dataset.

**Q: How do you validate that a model actually works (metrics, testing, backtesting)?**
A: Defined thresholds up front — mAP50, precision, recall, F1 — with minimum and target values before training, not after. Then test cases against real inputs, and I double-check the metrics rather than trusting one good run. One win isn't a rating; consistency is.

## Experience & collaboration

**Q: Have you worked on a team? How do you handle code review, disagreements, and communication?**
A: Yes — I usually end up as project manager. I run rigorous testing and QA, and I over-communicate rather than assume. Disagreements get settled with evidence: show the metric, show the test, move on.

**Q: Describe your work at FlyRank AI — what are you actually building/contributing?**
A: My capstone there is on Google Search ranking and discoverability — understanding what actually moves visibility and building around it.

**Q: How do you manage your time and stay productive in an async / remote setting?**
A: A fixed schedule covering school, my internship, personal projects, and training. Everything has a slot. Efficiency isn't a mood for me; it's a system.

**Q: How is your written and spoken English for client-facing or documentation work?**
A: Strong. I follow fast native speech, communicate clearly, and I already handle documentation work — including full technical docs for my thesis.

## Education & background

**Q: When do you graduate, and what's your degree exactly?**
A: July 2027, BS Computer Science.

**Q: Any honors, GPA, or standout coursework worth mentioning?**
A: Dean's Lister, 2023–2026. 2nd place in a Python programming competition, 3rd in database design, 3rd in C programming. Technical member of the English Society and member of the Junior Philippine Computer Studies Directorate. I compete — and I place.

**Q: How did you get into AI/ML, and what keeps you motivated?**
A: Pure curiosity about how AI actually works under the hood — and an obsession with efficiency. AI is the ultimate efficiency machine, so I never run out of reasons to go deeper.

## Anything else

**Q: Is there anything a recruiter should know that isn't obvious from your resume?**
A: I treat work like I treat chess and badminton: study the position, play decisively, review every loss. That habit shows up in my code.

**Q: Why "zeref" as your nickname / bot name?**
A: Zeref is my favorite character from Fairy Tail. I love his vibe — calm, calculated, dangerously smart. I also use it as my in game name so it Seemed like the right name to put on my chatbot.

**Q: What are your interests outside of tech?**
A: Badminton, chess, checkers, basketball, and volleyball. it's where the discipline comes from.
