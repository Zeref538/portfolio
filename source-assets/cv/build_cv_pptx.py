"""Add a PROJECTS page to the real CV deck, in the deck's own styling.

    python source-assets/cv/build_cv_pptx.py

Why edit CVs.pptx instead of drawing a new one: every font size, the Inter
family, the thin rules, the photo and the exact margins already live in that
file. Rebuilding them from scratch is how a "recreation" ends up not matching.
So this clones real shapes out of page 1 and re-fills their text -- the copy
carries the formatting with it, because in PowerPoint the styling lives on the
runs inside the shape, not in a stylesheet.

Page 1 is left alone except for one fix: Python was missing from the skills.
"""

import copy
from pathlib import Path

from pptx import Presentation
from pptx.util import Inches, Pt

HERE = Path(__file__).parent
SRC = HERE / "CVs.pptx"
OUT = HERE / "Martinez-CV.pptx"

# --------------------------------------------------------------------------- #
# content
# --------------------------------------------------------------------------- #

# (name, tech, date, [bullets])
PROJECTS = [
    ("YODA - Your Offline Data Agent", "2026",
     "Python, Ollama, FastAPI, pandas, Agentic AI", [
         "Built a local-first data agent that answers questions over CSV and Excel files "
         "with no data leaving the machine, running a local Ollama model behind FastAPI.",
         "Designed a tool-calling loop that plans pandas operations, runs them, and "
         "checks its own output before answering.",
     ]),
    ("Aegix AI - Contract Compliance Screening", "2026",
     "Python, LangChain, Azure OpenAI, Vector Search, RAG, FastAPI", [
         "Shipped a retrieval-augmented screening tool that flags non-compliant contract "
         "clauses and cites the source paragraph behind every flag.",
         "Built the vector-search retrieval layer over Azure OpenAI embeddings, served "
         "through FastAPI with a React front end.",
     ]),
    ("Refusal Calibration - LLM Fine-Tuning", "2025",
     "PyTorch, LoRA, QLoRA, Model Evaluation, Python", [
         "Fine-tuned a base model with LoRA so it refuses out-of-scope questions instead "
         "of answering them confidently.",
         "Built a held-out evaluation set measuring over-refusal as well as refusal, so "
         "the model is not rewarded for simply declining everything.",
     ]),
    ("APAW - Dam Level and Spill-Risk Nowcaster", "2025",
     "Python, River, Online Learning, Time-Series, GitHub Actions", [
         "Deployed a self-updating forecaster that retrains on new Open-Meteo readings "
         "through a scheduled GitHub Actions job, running unattended.",
         "Used online learning so the model adapts to seasonal shift with no full retrain.",
     ]),
    ("FORGE - Fake Or Real Image Examiner", "2025",
     "PyTorch, ONNX, Computer Vision, GitHub Actions, JavaScript", [
         "Trained an image classifier separating AI-generated images from photographs, "
         "exported to ONNX so it runs in the browser with no server.",
     ]),
    ("Refresh Priority on Real Search Data", "2026",
     "scikit-learn, DuckDB, pandas, Causal Inference, Python", [
         "Ranked which pages to refresh first from real search-console data, reaching "
         "0.88 Precision@50 against a 0.86 recency baseline.",
         "Ran a leakage audit and bootstrap confidence intervals to show the gain was "
         "real and not an artefact of the split.",
     ]),
]

LINKS = "github.com/Zeref538   |   johnandreimartinez.com   |   20 projects, 18 with live demos"

# Python was absent from the original skills line, so an ATS scanning for it
# would score the CV as not having it. Everything else here is unchanged.
SKILLS_FIX = (
    "Programming & Databases: Python, SQL, PostgreSQL, MongoDB, JavaScript, Java, C, C++, React, Node.js"
)

# --------------------------------------------------------------------------- #
# layout constants, read off page 1 so page 2 lines up with it
# --------------------------------------------------------------------------- #

L = Inches(0.47)          # left margin used by every text box on page 1
RIGHT = Inches(7.75)      # right edge of the rules
TOP = Inches(0.44)        # where the name sits on page 1


def clone(shape, slide, left, top, width=None):
    """Copy a shape onto another slide, keeping all of its formatting.

    python-pptx has no "copy shape" call, so this deep-copies the underlying
    XML element and appends it to the target slide's shape tree. The copy keeps
    its fonts, sizes and colours because those attributes live inside that XML.
    """
    el = copy.deepcopy(shape._element)
    slide.shapes._spTree.append(el)
    new = slide.shapes[-1]
    new.left, new.top = left, top
    if width is not None:
        new.width = width
    return new


def set_lines(shape, lines):
    """Replace a text box's lines, reusing the first paragraph as the template.

    Each new paragraph is a copy of the original, so the font, size and bullet
    level come along. Writing plain text into a fresh paragraph instead would
    reset it to the theme default -- the usual reason a generated deck stops
    matching the one it was copied from.
    """
    tf = shape.text_frame
    template = copy.deepcopy(tf.paragraphs[0]._p)

    for p in list(tf._txBody.findall(
            "{http://schemas.openxmlformats.org/drawingml/2006/main}p")):
        tf._txBody.remove(p)

    for text in lines:
        p = copy.deepcopy(template)
        tf._txBody.append(p)
        runs = p.findall(
            "{http://schemas.openxmlformats.org/drawingml/2006/main}r")
        for extra in runs[1:]:
            p.remove(extra)
        if runs:
            runs[0].find(
                "{http://schemas.openxmlformats.org/drawingml/2006/main}t"
            ).text = text
    return shape


def main():
    prs = Presentation(SRC)
    page1 = prs.slides[0]
    by_name = {s.name: s for s in page1.shapes}

    # --- fix the skills line on page 1 ---
    skills = by_name["TextBox 45"]
    old = [t for p in skills.text_frame.paragraphs
           for t in ["".join(r.text for r in p.runs)] if t.strip()]
    old[0] = SKILLS_FIX
    set_lines(skills, old)

    # --- page 2, same blank layout as page 1 ---
    page2 = prs.slides.add_slide(page1.slide_layout)

    heading_tpl = by_name["TextBox 12"]     # "EDUCATIONAL BACKGROUND"
    rule_tpl = by_name["AutoShape 3"]       # the hairline under a heading
    title_tpl = by_name["TextBox 24"]       # bold entry name, left
    date_tpl = by_name["TextBox 23"]        # date, right
    body_tpl = by_name["TextBox 25"]        # the bullet block

    y = TOP
    set_lines(clone(heading_tpl, page2, L, y), ["PROJECTS"])
    clone(rule_tpl, page2, L, y + Inches(0.26))
    set_lines(clone(body_tpl, page2, L, y + Inches(0.32), Inches(7.3)), [LINKS])
    y += Inches(0.66)

    for name, date, tech, bullets in PROJECTS:
        set_lines(clone(title_tpl, page2, L, y, Inches(5.6)), [name])
        set_lines(clone(date_tpl, page2, Inches(5.79), y, Inches(1.97)), [date])
        # "Tech:" on its own line is what makes the stack machine-readable --
        # an ATS keyword-matches that list directly.
        set_lines(clone(body_tpl, page2, L, y + Inches(0.21), Inches(7.3)),
                  ["Tech: " + tech])
        set_lines(clone(body_tpl, page2, L, y + Inches(0.42), Inches(7.3)),
                  bullets)
        y += Inches(0.42) + Inches(0.21) * len(bullets) + Inches(0.30)

    prs.save(OUT)

    # A page 2 that overflows the sheet silently loses its last project, so
    # check the last shape actually sits on the page.
    bottom = max(s.top + (s.height or 0) for s in page2.shapes) / 914400
    print(f"{OUT.name}: {len(prs.slides.__iter__.__self__._sldIdLst)} pages, "
          f"page 2 content ends at {bottom:.2f}in of "
          f"{prs.slide_height / 914400:.2f}in")
    assert bottom < prs.slide_height / 914400, "page 2 overflows the sheet"


if __name__ == "__main__":
    main()
