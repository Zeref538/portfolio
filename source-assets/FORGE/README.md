# FORGE — Fake Or Real: Generated-image Examiner

Drop in an image, get a probability that an AI generator made it rather than
a camera. **The model runs entirely in your browser** — the image is never
uploaded, there is no server, and hosting costs nothing.

### ▶ [Try it live](https://zeref538.github.io/FORGE/) · [Read the case study](https://zeref538.github.io/FORGE/case-study.html)

![Accuracy for each of the 13 generator families, sorted worst to best, with the pooled number marked](web/img/fig-families.png)

*Rebuild this chart with `python docs/make_figures.py`. It is drawn from the result files in `ml/`, not typed in.*

The point of this project is not the accuracy number. It is the evaluation:
what happens when the detector meets a generator it was never trained on,
and what happened when a promising result turned out not to reproduce.

![Accuracy by company, next to what it was never trained on](docs/screenshots/forge-04-generators.png)

---

## Quick start

```bash
git clone https://github.com/Zeref538/FORGE.git
cd FORGE/web
python -m http.server 8000     # then open http://localhost:8000
```

No build step, no npm install. The site is plain HTML, CSS and JavaScript.

> Opening `index.html` directly by double-clicking will not work — browsers
> block `file://` pages from loading the model. Any local server fixes it.

## Repo layout

```
web/     the site — HTML, CSS, JS, and the deployed model
ml/      training and evaluation code (Kaggle kernels)
docs/    project brief, portfolio write-up, contributor handoffs
```

| If you want to… | Read |
|---|---|
| work on the site or deploy it | [`docs/FRONTEND_HANDOFF.md`](docs/FRONTEND_HANDOFF.md) |
| understand the research arc | [`docs/PORTFOLIO_CARD.md`](docs/PORTFOLIO_CARD.md) |
| see the original goals | [`docs/PROJECT_BRIEF.md`](docs/PROJECT_BRIEF.md) |

---

## How accurate it is

EfficientNet-B0, trained on 13 generator families. Every figure below is a
test slice the model never trained on, reported per family, **never pooled
into one flattering number**.

| generator | accuracy |
|---|---:|
| BigGAN | 100.0% |
| GLIDE | 99.7% |
| SFHQ-T2I | 99.7% |
| StyleGAN / StyleGAN2 | 99.2% |
| AI artwork | 97.3% |
| VQDM | 96.0% |
| Wukong | 96.0% |
| Stable Diffusion 1.5 | 96.0% |
| ADM | 95.2% |
| **real photographs** | **93.2%** |
| StyleGAN3 | 90.9% |
| **Midjourney** | **90.1%** |

**Overall: 95.7%**

Two of those deserve to be read carefully.

**Real photographs, 93.2%** means roughly **1 in 15 genuine photos is
wrongly called AI-generated.** That is the wrong direction for the error to
run - falsely accusing a real photo is worse than missing a fake, and this
got *worse* in the current version, not better (it was 94.6%).

**Midjourney, 90.1%** is now the weakest family, having been 93.3%. It is the
generator a casual user is most likely to bring.

### The same thing, by the names you'd recognise

Those are research labels. Here they are as actual tools and companies:

| Generator | Maker | Accuracy |
|---|---|---:|
| BigGAN | Google DeepMind | 100% |
| GLIDE | OpenAI | 99.7% |
| StyleGAN, StyleGAN2 | NVIDIA | 99.2% |
| VQ-Diffusion | Microsoft | 96.0% |
| Wukong | Huawei | 96.0% |
| Stable Diffusion 1.5 | Stability AI | 96.0% |
| Guided Diffusion (ADM) | OpenAI | 95.2% |
| StyleGAN3 | NVIDIA | 90.9% |
| Midjourney (2023-era) | Midjourney | 90.1% |

### Not trained on — results here are unreliable

| Generator | Maker |
|---|---|
| DALL·E 2 / 3, GPT-4o images | OpenAI |
| Imagen, Nano Banana | Google |
| Flux | Black Forest Labs |
| Firefly | Adobe |
| Ideogram | Ideogram AI |
| Grok / Aurora | xAI |
| SDXL, SD3 | Stability AI (newer than the 1.5 above) |
| Midjourney v6+ | Midjourney |

These are absent from the training data entirely, not merely untested. When a
whole generator family was hidden from training and then tested, this model
scored **0%** — it called every fake real, confidently. Anything in this table
carries that risk.

Version matters as well: Midjourney in 2023 and Midjourney today are
different models, and being right about one says little about the other.

## The finding

The original setup deliberately **hid two generator families from training**
to answer a harder question than "is it accurate": *what happens when
someone uses a generator that did not exist when this shipped?*

The answer was **0.000**. Not "poor" — zero. All 2,500 fakes called real.

Seven attempts to fix it:

| attempt | accuracy on the unseen family |
|---|---:|
| baseline | 0.000 |
| higher input resolution | 0.000 |
| frequency-domain (FFT) input channel | 0.000 |
| blur + JPEG augmentation (Wang et al. 2020) | 0.000 |
| CLIP frozen features (Ojha et al. 2023) | 0.003 |
| adding a related GAN family to training | 0.365 |
| attempt 7 (see `docs/ATTEMPT_7.md`) | not measured |

Attempt 7 is the row without a number, and the reason is the honest one: the
two ideas aimed at the unseen family both needed a GPU, and the weekly Kaggle
quota ran out before they could run. What it did produce is written up in
full, including a result it did not go looking for.

Three of its five ideas cost no GPU time at all. Choosing the decision
threshold on validation gave a trade-off curve instead of a single number:
at the shipped threshold of 0.5, 5.4% of real photos are called AI; at 0.8
that falls to 2.0%, paid for with fake recall dropping from 92.2% to 83.0%.
Nothing was changed, but the choice is now recorded rather than inherited.
NPR (Tan et al., CVPR 2024) was dropped by a pre-check with a positive
control: it separates BigGAN at 0.674 and StyleGAN3 at 0.577, near chance,
which is what you would expect from a generator published as *Alias-Free
GAN*. Leave-one-family-out checkpoint selection picked the same epoch as the
current rule in 12 of 13 cases, so it is a clean negative.

The uncomfortable finding came before any of that. **A decision tree given
only each file's width, height and format — no pixels — scores 0.861, against
0.927 for the real model, and separates eleven of twelve fake families
perfectly.** Class correlates with source resolution. StyleGAN3 is the only
family whose fakes and reals match on resolution, format and content, and it
is the only family the model finds hard. On that reading its old 51.5% was not a
broken family; it is the only number in the table being measured fairly.

A three-seed retrain on the current dataset averaged 0.955 overall and 0.877
on StyleGAN3, against 0.927 and 0.515. **That model is what now ships**, and
the honest label on it is more training data rather than a better model: the
dataset has grown from 10 fake families and 5,000 reals to 12 and 8,245 since
the previous model was trained. Architecture, epochs, learning rate and batch
size are unchanged.

**It was shipped over a failing gate, which is recorded rather than quietly
dropped.** The rule fixed before the run said no family may get worse by more
than 2 points. On the three-seed *mean* Midjourney came in at exactly -2.0 and
passed. The artifact that actually ships is a single seed, and no single seed
passes: seed 0 is -3.7 on Midjourney, seed 1 is -3.4 on real photographs, and
seed 2 -- the one the selection rule picks, on highest validation accuracy --
is -3.2 on Midjourney and -1.4 on real photographs. Averaging three seeds hid
a failure present in all three. The trade taken was +39.4 points on StyleGAN3
and +3.0 overall against -3.2 on Midjourney and 1 in 15 real photos wrongly
accused instead of 1 in 19.

The last of the six appeared to work, and **was published to the site.**

**It did not reproduce.** Re-running while logging accuracy after *every*
training epoch — instead of trusting the single saved checkpoint — showed
the number swinging between **0.005 and 0.305** on identical data. The 0.365
never appeared again, and the checkpoint the selection rule would actually
have kept scored 0.034.

The cause is structural: checkpoints are chosen by validation accuracy, and
the validation set only contains families the model trained on. The
selection process is blind to the exact thing being measured. The site was
corrected to report a range.

Three follow-ups asked whether the tool could at least *fail honestly*
instead. None worked:

- **Averaging checkpoints** erased the good epoch instead of reinforcing it,
  which confirms it was luck rather than a skill being learned.
- **The model's own calibrated confidence** is *confidently wrong* 58.2% of
  the time on the unseen family, and says "uncertain" on only 10.5%.
- **Novelty detection** (twice — on model features, then on radial frequency
  spectra) flagged under 0.5% of unseen-generator images, versus 9.7% of
  ordinary ones. The measured reason: those images sit *closer* to the
  training data than ordinary photos do. A well-made fake face does not look
  unusual — that is the point of it.

**Conclusion:** generalising to an unseen generator architecture is unsolved
here, and unsolved in the literature — the paper this compares against
reports its CNN dropping to near coin-flip on unseen architectures too. No
training trick fixed it. What worked was showing the model examples of that
architecture, which is why the shipped model trains on all 13 families.

That works for generators that exist today. It says nothing about the next
one.

## Model choice

Three backbones trained on identical data:

| backbone | params | accuracy | download | train time |
|---|---:|---:|---:|---:|
| MobileNetV3-Small | 1.5M | 90.1% | 6.1 MB | 30 min |
| **EfficientNet-B0** ← shipped | 4.0M | **95.7%** | 16.0 MB | 130 min |
| ResNet-50 | 23.5M | 90.2% | 94.0 MB | 273 min |

Bigger is not automatically better. ResNet-50 costs 6× the download for no
accuracy gain — its training accuracy was still climbing when the run
ended, so at 3 epochs it is undertrained rather than outclassed. Either way
94 MB is too large to send to a browser.

## Data

Public Kaggle datasets only — nothing scraped, no personal photos. About
36,000 images across 13 generator families. Sources are listed in
[`docs/FRONTEND_HANDOFF.md`](docs/FRONTEND_HANDOFF.md#8-where-the-data-came-from).

Every image is re-encoded to identical size and JPEG quality before
training. That fixed a real shortcut: real photos were mostly small PNGs and
fakes mostly large JPEGs, so a model could score well by recognising the
file format instead of the image.

## Reproducing

Training runs on Kaggle. Each directory under `ml/` holds a
`kernel-metadata.json` naming its datasets.

```bash
cd ml/phase1 && python -m kaggle kernels push     # build the dataset
python test_labeling.py                            # ALWAYS run before pushing
cd ../phase2/final_model && python -m kaggle kernels push
cd .. && python calibrate_efficientnet.py          # calibrate + write calibration.json
```

`test_labeling.py` takes about a second and exists because three separate
bugs silently inverted real/fake labels — one dataset stores AI images in a
folder named `nature`, which was in the real-photo hint list. None of them
crashed; all of them would have trained on wrong labels.

There is also a GitHub Action (`.github/workflows/kaggle-run.yml`) that runs
a kernel, waits, and commits the report back — so training does not need a
machine left switched on.

## What this tool cannot tell you

- It is **not forensic evidence** and cannot be used to accuse anyone of
  anything.
- It will misjudge generators released after it was trained. That gap is
  measured above, not hidden.
- Paintings, game renders and heavily filtered photos are out of scope; a
  confident-sounding number on them is still a guess.
- A missing content credential means the platform stripped it, not that the
  image is synthetic.

## Contributors

- [@Zeref538](https://github.com/Zeref538) — ML, data pipeline, evaluation
- [@Tinenen-cs](https://github.com/Tinenen-cs) — frontend
