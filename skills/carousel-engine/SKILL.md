---
name: carousel-engine
description: Shared engine for making Instagram carousels. Covers the method (plan, slide outline, copy, render, review, hand-off) and the tools (render cards.html to 1080x1350 PNGs, automatic checks for overflow, tiny text and awkward line breaks, phone-width previews, a contact sheet) plus an undesigned blank starter file. Use whenever the user says "make a carousel", "Instagram carousel", "carousel about X", "turn this into slides for Instagram", "put this in a few swipeable cards", "re-render the carousel", "rebuild the PNGs", or "new carousel style for my brand". If a brand kit skill (carousel-<brand>) exists, read that first and use this skill for tools and method. First-time users start from carousel-starter (the neutral starter kit). This is the Lite bundle: PNG output and one style (Paper). Animated MP4s and six more styles are in the full Carousel Kit. Not for edited footage, character animation, a single thumbnail, or presentation slide decks.
---

# Carousel engine

This skill holds only **the method and the tools**. It holds no colours, font choices, characters or tone of voice; those belong to a brand kit skill (`carousel-<brand>`).

## Brand kits

| Skill | Meaning |
| --- | --- |
| `carousel-starter` | The neutral starter kit that ships with this bundle. One style, Paper (a 7-slide series). Lite ships one style; the full kit has seven |
| `carousel-<your brand>` | A brand kit you made yourself by copying the starter (`references/new-channel.md`) |

If a brand kit is set, read its SKILL.md and `references/brand.md` first. If there is no brand yet, start from `carousel-starter`. There is also an undesigned grey placeholder sample (`templates/blank`), but do not polish that grey into a design. Decide the design by looking at the brand's real assets (logo, colours, past posts).

## What never changes

1. **The cover has one visual anchor.** A photo, an object, a character, a big number or a piece of screen holds the centre. A plain background with only text and a white box looks flat and nobody wants to swipe.
2. **One message per slide.** People swipe quickly; put two ideas on one slide and neither gets read.
3. **Slides differ in structure.** If slides keep the same shape with only the words swapped, there is no reason to swipe. Pick the format that fits the content: steps, a piece of screen, before/after, a table, a checklist. When listing items of equal rank (7 tips, for example) you may repeat one format, but change the number and the picture, and drop in a different format (a single sentence, a comparison, a recap) every three slides.
4. **Never invent.** No made-up statistics, results or testimonials. Check numbers against the source, and label sample screens "example".

## Steps

1. **State the goal in one sentence.** Who will look, and what should they do once they have seen it? If it is not given, look in the conversation or existing plans, and ask only if you still can't find it.
2. **Read the brand standard.** Open the brand kit's `brand.md` and its sample images. For a new brand, open the brand's real assets.
3. **Outline the slides.** Cover (question or hook) -> body (one message per slide) -> a recap worth saving -> closing (one thing to do). Slide count follows "The content decides the number of slides" below. Write each slide's one sentence and format in a table first and save it as `plan.md` in the set folder.
4. **Create the set.** Copy a sample with `new-set.cjs`.
5. **Fill in copy and pictures.** Edit only `cards.html`. If you need pictures, read `references/images.md`.
6. **Render.** Run `render.cjs`. If warnings appear, fix them and run it again.
7. **Review by eye.** Open `preview/sheet.png` and `preview/phone/` yourself and follow `references/quality-checklist.md`.
8. **Report.** Give the location, the number of slides, the check result, and what you could not verify. Do not post or schedule anything; a person uploads it.

Details are in `references/method.md`.

## The content decides the number of slides

The slide count in a sample (around 7) is just a sample. Don't fix the count first and stretch the content to fit. Slide numbers fill in automatically, so you only add (copy) or remove slides.

1. Split what you want to say into units you can state as one sentence.
2. One message is one inner slide. Add one cover and one closing slide.
3. If a message needs its own example or screen to show it, that example takes one more slide.

| Size of the content | Rough slide count |
| --- | --- |
| An announcement, one tip | 4-6 slides |
| A method or a set of habits | 7-10 slides |
| A deep guide, a long list | 11-15 slides |

Instagram's limit is 20 slides.

- If the request names a count, follow it. The above is for when none is given.
- If you end up at 6 or fewer, first check that you explained enough: why it matters -> how -> example -> common questions -> recap. Is any missing?
- Don't pad the count by repeating yourself. Drop a slide that doesn't reduce to one sentence.
- Never put two messages on one slide. If it overflows, split it.

## Tools

The scripts are in `scripts/`. They use only Node and Chrome (or Edge / Chromium); no remote fonts and no outside services. In the commands below, `ENGINE` is this skill's `scripts` folder (usually `~/.claude/skills/carousel-engine/scripts` for Claude Code and `~/.codex/skills/carousel-engine/scripts` for Codex; use wherever this skill is installed).

```bash
ENGINE=~/.claude/skills/carousel-engine/scripts   # if installed for Codex: ~/.codex/skills/carousel-engine/scripts

node $ENGINE/new-set.cjs --list                                    # available brands and samples
node $ENGINE/new-set.cjs --dir <set folder> --channel starter       # start from the starter's 7-slide sample
node $ENGINE/new-set.cjs --dir <set folder>                         # the undesigned blank starter file

node $ENGINE/render.cjs <set folder>                                # render + automatic checks + small previews
node $ENGINE/render.cjs <set folder> --serve                        # view in a browser (does not render)
```

What `render.cjs` produces:

| Location | Contents |
| --- | --- |
| `out/NN-name.png` | The deliverable originals, 1080x1350 |
| `preview/phone/NN-name.png` | Pictures shrunk to phone width (390px). Use these to see whether the text is readable |
| `preview/sheet.png` | One contact sheet of the whole set. Use it to see the flow and how the slides differ |

The automatic check catches these: content overflowing the card (`content overflows the card`), text smaller than 24px (`text smaller than 24px`), pictures or files that did not load (`image did not load`), awkward line breaks, and big empty areas (`empty band`: no text and no visual element across 20% or more of the card height, adjustable as `checks.emptyBandRatio` in `config.json`; add `data-allow-gap` to a `<section>` to switch it off for one card on purpose). For line breaks there are two kinds of warning: `awkward line break` means a piece of text wrapped on its own and left a short last line (a widow or orphan; a line you broke yourself with `<br>` is allowed), and `word split mid-word` means a long word was broken across lines. English is checked word by word and Korean character by character. When all is well the output says `Auto-check: no warnings`. No warnings does not mean it looks good. Overlaps, spacing and lines that break the meaning awkwardly only show up when you open the pictures.

If `playwright-core is missing` appears on first use, run `npm install` once in `scripts/`. If it says `Chrome not found`, set the environment variable `CHROME_PATH` to the full path of the Chrome executable.

## Animated carousels (video)

Not in this Lite bundle. The full Carousel Kit adds a video skill that makes one MP4 per slide: https://contentcraft648.gumroad.com/l/byvwg

## How to write cards.html

The set folder holds only `cards.html` and that set's own pictures (`images/`). The engine and brand parts are connected through virtual addresses at render time, so don't copy them in.

| What you write | Meaning |
| --- | --- |
| `<section class="card" data-name="cover">` | One slide. `data-name` becomes the file name (use English) |
| `<html data-channel="starter">` | The brand for this set. At render time the engine reads that brand kit's `kit.json` |
| `data-token="handle"` | A slot filled from the same-named value in that `kit.json`'s `tokens` (account, channel name). Don't type it by hand |
| `data-page` | A slot where the slide number fills in automatically ("2 / 6"). You don't need to fix it when slides are added or removed. Change the shape like `data-page="{nn} / {tt}"` |
| `data-bleed` | A decoration deliberately bled off the card. Excluded from the overflow check |
| `/__engine/fonts.css`, `/__engine/base.css` | The engine's fonts and base styles |
| `/__kit/<brand>/…` | The `kit/` folder of that brand's skill |
| `images/…` | Pictures inside the set folder |

These addresses only work while the render server is running. If you open `cards.html` straight from disk, fonts and parts will be missing; view it with `--serve`.

Edit the copy with an editing tool (Claude Code's Edit). macOS `sed -i` works differently from Linux and silently fails easily. The "last modified" time on the first line of the render output tells you whether your edit was picked up.

Use only the font names in `shared/fonts.css`. This bundle includes **Pretendard** (Latin and Korean) (SIL OFL 1.1; the text is `shared/fonts/OFL-Pretendard.txt`). To use another font, put the font file in `shared/fonts/` (check its redistribution terms yourself) and add one `@font-face` line to `shared/fonts.css`.

## Reference numbers

- Canvas 1080x1350 (4:5), every slide the same size.
- Keep cover headlines at least 60px inside the left and right edges. The profile grid crops about 34px off each side.
- Body text 36px or larger, small labels 24px or larger. On a phone everything appears at about 0.36x.
- Don't put key text in the roughly 100px square at the top right of the cover, or at the vertical centre of the right edge.

The reasoning and confidence level are in `references/specs.md`.

## What is supported

- Works: still-image carousels, any layout you can draw with HTML/CSS, and pictures drawn in code (SVG, CSS).
- Needs separate work: generating photos or 3D images (`references/images.md`), actually posting or scheduling, and checking how it displays in the Instagram app.
- Not in Lite: animated carousels (MP4). Say so plainly if asked; the full kit has them.

## Reference documents

- `references/method.md` - the steps in detail, how to use the slide table, polishing the copy
- `references/quality-checklist.md` - the by-eye review list
- `references/specs.md` - specs and their basis
- `references/images.md` - when you need photos or 3D pictures
- `references/new-channel.md` - how to make your own brand kit
