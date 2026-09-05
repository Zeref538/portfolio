"""Build the ATS-safe CV and resume PDFs.

    python source-assets/cv/build_cv.py

ATS = the applicant tracking system that reads the PDF into a database before a
human sees it. It reads plain text top to bottom, so everything here is ONE
column, real selectable text, standard Helvetica, and no tables or images. The
right-hand dates are drawn on the same text line as the heading rather than in a
table cell, because a table can flatten into scrambled text on some parsers.

Edit the data blocks below and re-run. Output goes to this same folder.
"""

from pathlib import Path

from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas as _canvas
from reportlab.platypus import (
    BaseDocTemplate, Flowable, Frame, PageTemplate, Paragraph, Spacer,
)

OUT = Path(__file__).parent
MARGIN = 0.6 * inch
FULL = LETTER[0] - 2 * MARGIN

# --------------------------------------------------------------------------- #
# content
# --------------------------------------------------------------------------- #

NAME = "JOHN ANDREI MERONG MARTINEZ"
CONTACT = (
    "San Jose Del Monte, Bulacan, Philippines | 0993-446-6975 | "
    "martinezjandrei8425@gmail.com<br/>"
    "linkedin.com/in/john-andrei-martinez-499a0b343 | github.com/Zeref538 | "
    "johnandreimartinez.com"
)

SUMMARY = (
    "AI/ML engineering student who ships end-to-end systems: agentic AI, "
    "retrieval-augmented generation (RAG), LLM fine-tuning, forecasting and "
    "computer vision, taken from dataset to deployed service. Twenty personal "
    "projects, eighteen with live demos. Dean's Lister 2023-2026."
)

SKILLS = [
    ("Languages", "Python, SQL, JavaScript, Java, C, C++"),
    ("AI/ML", "PyTorch, scikit-learn, LLM Fine-Tuning (LoRA, QLoRA, Unsloth), "
              "RAG, LangChain, Agentic AI, Ollama, Transformers, CNNs, "
              "Computer Vision, Time-Series Forecasting, Model Evaluation"),
    ("Data", "pandas, NumPy, DuckDB, PostgreSQL, MongoDB, SQLite, MySQL, Tableau, Power BI"),
    ("Backend & Tools", "FastAPI, Node.js, React, Docker, Git/GitHub, "
                        "GitHub Actions, ONNX, n8n, Kaggle"),
    ("Cloud", "Azure OpenAI, Google Cloud, Oracle Cloud, AWS, Vercel, Supabase, Firebase"),
]

# (name, tech, date, [bullets])
PROJECTS = [
    ("YODA - Your Offline Data Agent",
     "Python, Ollama, FastAPI, pandas, Agentic AI", "2026", [
         "Built a local-first data agent that answers questions over CSV and Excel "
         "files with no data leaving the machine, running a local Ollama model "
         "behind a FastAPI service.",
         "Designed a tool-calling loop that plans pandas operations, executes them, "
         "and validates its own output before answering.",
     ]),
    ("Aegix AI - Contract Compliance Screening",
     "Python, LangChain, Azure OpenAI, Vector Search, RAG, FastAPI", "2026", [
         "Shipped a retrieval-augmented screening tool that flags non-compliant "
         "contract clauses and cites the source paragraph behind every flag.",
         "Built the vector-search retrieval layer over Azure OpenAI embeddings and "
         "exposed it as a FastAPI service with a React front end.",
     ]),
    ("Refusal Calibration - LLM Fine-Tuning",
     "PyTorch, LoRA, QLoRA, Model Evaluation, Python", "2025", [
         "Fine-tuned a base model with LoRA so it refuses out-of-scope questions "
         "instead of answering them confidently.",
         "Built a held-out evaluation set that measures over-refusal as well as "
         "refusal, so the model is not rewarded for simply declining everything.",
     ]),
    ("APAW - Dam Level and Spill-Risk Nowcaster",
     "Python, River, Online Learning, Time-Series, GitHub Actions", "2025", [
         "Deployed a self-updating forecaster that retrains on new Open-Meteo "
         "readings through a scheduled GitHub Actions job, running unattended.",
         "Used online learning so the model adapts to seasonal shift without a "
         "full retrain from scratch.",
     ]),
    ("FORGE - Fake Or Real Image Examiner",
     "PyTorch, ONNX, Computer Vision, GitHub Actions, JavaScript", "2025", [
         "Trained an image classifier that separates AI-generated images from "
         "photographs, exported to ONNX so it runs in the browser with no server.",
         "Automated retraining and redeployment through GitHub Actions.",
     ]),
    ("Which Page Do You Fix First? - Refresh Priority on Search Data",
     "scikit-learn, DuckDB, pandas, Causal Inference, Python", "2026", [
         "Ranked which pages to refresh first from real search-console data, "
         "reaching 0.88 Precision@50 against a 0.86 recency baseline.",
         "Ran a leakage audit and bootstrap confidence intervals so the gain was "
         "shown to be real rather than an artefact of the split.",
     ]),
]

# (role, org, dates, [bullets])
EXPERIENCE = [
    ("ML Engineering Intern", "FlyRank AI", "2026 - Present", [
        "Prepare and validate datasets, support model testing, and automate "
        "workflow steps in Python.",
        "Build data pipelines and internal automation tools that cut manual "
        "handling out of the team's day-to-day work.",
    ]),
    ("Virtual Assistant", "Freelance", "2025 - 2026", [
        "Ran end-to-end recruitment, data administration and digital record "
        "keeping, improving hiring turnaround and record accuracy.",
    ]),
]

EDUCATION = [
    ("BS Computer Science, specializing in AI/ML Engineering",
     "Our Lady of Fatima University", "2023 - Present", [
         "Dean's Lister 2023-2026, with placements in Python, Database Design "
         "and C Programming.",
     ]),
]

CERTS = [
    ("Google Advanced Data Analytics Professional Certificate", "Coursera", "July 2026"),
    ("Google AI Professional Certificate", "Coursera", "June 2026"),
    ("AWS AI Practitioner", "Udemy", "June 2026"),
    ("Building with the Claude API", "Anthropic", "2026"),
    ("Introduction to Model Context Protocol", "Anthropic", "2026"),
    ("Oracle Cloud Infrastructure Certified AI Foundations Associate",
     "Oracle University", "July 2025"),
    ("Google Data Analytics Professional Certificate", "Coursera", "May 2025"),
]

ACTIVITIES = (
    "Technical Team Member, English Society. Directorate Member, "
    "Junior Philippine Computer Society (JPCS)."
)

# --------------------------------------------------------------------------- #
# styles
# --------------------------------------------------------------------------- #

INK, GREY = "#111111", "#555555"

S = {
    "name": ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=16,
                           leading=19, textColor=INK, spaceAfter=3),
    "contact": ParagraphStyle("contact", fontName="Helvetica", fontSize=8.4,
                              leading=11.4, textColor=GREY),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=9,
                           leading=12, textColor=INK, alignment=TA_JUSTIFY),
    "bullet": ParagraphStyle("bullet", fontName="Helvetica", fontSize=9,
                             leading=11.8, textColor=INK, leftIndent=10,
                             bulletIndent=1, spaceAfter=1.2),
    "sub": ParagraphStyle("sub", fontName="Helvetica-Oblique", fontSize=8.6,
                          leading=11, textColor=GREY, spaceAfter=1.5),
}


class Rule(Flowable):
    """A section heading with its underline, drawn directly.

    A heading and a horizontal rule as two separate flowables can be split
    across a page break, leaving the line stranded at the top of page two.
    """

    def __init__(self, text, width=FULL):
        super().__init__()
        self.text, self.width, self.height = text, width, 17

    def draw(self):
        c = self.canv
        c.setFont("Helvetica-Bold", 9.6)
        c.setFillColor(INK)
        c.drawString(0, 6, self.text.upper())
        c.setStrokeColor("#999999")
        c.setLineWidth(0.6)
        c.line(0, 2.5, self.width, 2.5)


class Head(Flowable):
    """One heading line: bold title on the left, date flush right.

    Drawn rather than laid out in a two-column table, because tables are the
    single most common way a CV turns into scrambled text inside an ATS.
    """

    def __init__(self, left, right, width=FULL, sub=None):
        super().__init__()
        self.left, self.right, self.sub = left, right, sub
        self.width = width
        self.height = 11.5 if not sub else 21

    def draw(self):
        c = self.canv
        y = self.height - 9
        c.setFont("Helvetica-Bold", 9.6)
        c.setFillColor(INK)
        c.drawString(0, y, self.left)
        c.setFont("Helvetica", 8.6)
        c.setFillColor(GREY)
        c.drawRightString(self.width, y, self.right)
        if self.sub:
            c.setFont("Helvetica-Oblique", 8.6)
            c.drawString(0, y - 10, self.sub)


def bullets(lines):
    return [Paragraph(t, S["bullet"], bulletText="-") for t in lines]


def header():
    return [
        Paragraph(NAME, S["name"]),
        Paragraph(CONTACT, S["contact"]),
        Spacer(1, 8),
    ]


def skills_block():
    out = [Rule("Skills"), Spacer(1, 3)]
    for label, items in SKILLS:
        out.append(Paragraph(f"<b>{label}:</b> {items}", S["body"]))
        out.append(Spacer(1, 1.5))
    return out


def entry_block(title, rows, project=False):
    out = [Rule(title), Spacer(1, 3)]
    for row in rows:
        if project:
            name, tech, date, bl = row
            out.append(Head(name, date, sub=f"Tech: {tech}"))
        else:
            role, org, date, bl = row
            out.append(Head(f"{role} - {org}", date))
        out.append(Spacer(1, 1))
        out += bullets(bl)
        out.append(Spacer(1, 5))
    return out


def certs_block():
    out = [Rule("Certifications"), Spacer(1, 3)]
    for name, issuer, date in CERTS:
        out.append(Head(name, date, sub=issuer))
        out.append(Spacer(1, 3))
    return out


def build(path, story):
    doc = BaseDocTemplate(str(path), pagesize=LETTER,
                          leftMargin=MARGIN, rightMargin=MARGIN,
                          topMargin=MARGIN, bottomMargin=MARGIN,
                          title="John Andrei Martinez", author="John Andrei Martinez")
    frame = Frame(MARGIN, MARGIN, FULL, LETTER[1] - 2 * MARGIN, id="f",
                  leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id="p", frames=[frame])])
    doc.build(story)
    return path


# --------------------------------------------------------------------------- #
# the two documents
# --------------------------------------------------------------------------- #

def cv():
    """The long one: every project, every certificate, room to breathe."""
    s = header()
    s.append(Rule("Summary"))
    s.append(Spacer(1, 3))
    s.append(Paragraph(SUMMARY, S["body"]))
    s.append(Spacer(1, 8))
    s += skills_block() + [Spacer(1, 7)]
    s += entry_block("Projects", PROJECTS, project=True) + [Spacer(1, 2)]
    s += entry_block("Experience", EXPERIENCE) + [Spacer(1, 2)]
    s += entry_block("Education", EDUCATION) + [Spacer(1, 2)]
    s += certs_block() + [Spacer(1, 4)]
    s.append(Rule("Extracurricular Activities"))
    s.append(Spacer(1, 3))
    s.append(Paragraph(ACTIVITIES, S["body"]))
    return build(OUT / "Martinez-CV.pdf", s)


def resume():
    """The one-pager: four projects, one bullet each, certificates as one line."""
    s = header()
    s.append(Paragraph(SUMMARY, S["body"]))
    s.append(Spacer(1, 7))
    s += skills_block() + [Spacer(1, 6)]

    trimmed = [(n, t, d, b[:1]) for n, t, d, b in PROJECTS[:4]]
    s += entry_block("Projects", trimmed, project=True)

    s += entry_block("Experience", [EXPERIENCE[0]])
    s += entry_block("Education", EDUCATION)

    s.append(Rule("Certifications"))
    s.append(Spacer(1, 3))
    s.append(Paragraph(
        "; ".join(f"{n} ({i}, {d})" for n, i, d in CERTS[:5]) + ".", S["body"]))
    return build(OUT / "Martinez-Resume.pdf", s)


if __name__ == "__main__":
    import pymupdf

    for f in (cv(), resume()):
        pages = pymupdf.open(f).page_count
        # A resume that spills onto page 2 is the failure mode this guards.
        print(f"{f.name}: {pages} page(s), {f.stat().st_size // 1024} KB")
        assert pages <= (2 if "CV" in f.name else 1), f"{f.name} is too long"
