---
name: carousel-starter
description: Neutral starter brand kit for Instagram carousels (Lite bundle: one style, Paper, a 7-slide series). Use it when someone without a brand kit says "make a carousel", "Instagram carousel about X", "carousel for my cafe / studio / shop", "start a carousel", or "make my own carousel style", and read it together with carousel-engine. It also explains how to swap in your own channel name, handle and colour.
---

# Carousel starter kit

A neutral starter brand kit. You can make carousels with it right away, or copy it as the starting point of your own brand kit. The method and tools belong to `carousel-engine` (PNG); read its SKILL.md first.

## The one style in Lite: Paper

Lite ships one style, **Paper** (`--template series`, the default): light background, one strong accent colour, the boldest two-line headline, a screen frame filling half the card, pill label, progress bar and swipe button. The sample is 7 slides. It suits topics where you can show a real screen: a tool, a method, a prompt, a menu. "One item = one slide". Good for a neighbourhood cafe's new menu, a shop notice, a few tips.

The full Carousel Kit has seven styles (Paper, Midnight, Neon Block, Chat Screen, Studio Minimal, Data Bento, Pixel Game) and one MP4 per slide: https://contentcraft648.gumroad.com/l/byvwg . If the user asks for another style or for video, say plainly that Lite does not include it. Do not imitate those styles by hand.

- All sample copy is **example** text. Replace all of it for a new set to fit the topic.
- A card that is just a big sentence on a flat background triggers the `empty band` warning; put a screen frame with real content on it.

## Getting started

```bash
ENGINE=~/.claude/skills/carousel-engine/scripts   # if installed for Codex: ~/.codex/skills/carousel-engine/scripts
node $ENGINE/new-set.cjs --dir <set folder> --channel starter
node $ENGINE/render.cjs <set folder>
```

## Make it yours

1. **Channel name and handle**: edit `tokens.name` and `tokens.handle` in `kit/kit.json`. Cards pick them up through `data-token`.
2. **Accent colour**: change it in `:root` at the top of the style file.
   - `starter.css`: the one `--accent` line (a deep colour that white text reads on; pale pastels have no punch).
3. **Grow it into your own brand kit**: follow "Copy the starter and change it" in `carousel-engine/references/new-channel.md`. Keep the skill name in the `carousel-<brand>` form.

## Slide structure of the default style (`series`)

Every slide is built the same way: header -> pill label -> two-line headline (only one line in the accent colour) -> one-line description -> screen frame (all the remaining height) -> dotted list (optional) -> progress bar and swipe button.

| Slide | Name (`data-name`) | Format | Used for |
| --- | --- | --- | --- |
| 1 | cover | Accent-colour background. Three-line headline (numbers and key words flipped to white boxes) + a dark screen | The cover. The headline takes half the slide |
| 2 | why | The screen shows a common request and the reply that came back (speech bubbles) | Why it matters. A scene instead of an explanation |
| 3-5 | item-1 … | "01 / 03" pill + big name + one line + a large screen + dotted list | One item = one slide. Copy to extend |
| 5 | item-3 | The screen content swipes (`data-slides`) | A result or process across several screens |
| 6 | checklist | Check lines inside the screen | A recap worth saving |
| 7 | closing | A ready-to-use prompt on a dark screen | One thing to do (save, share, link) |

- Put real records, prompts and results in the screen. Don't leave it empty with a line or two of text. Pick the screen kind from the "inside the screen" parts of `kit/starter.css`: `.raw` (record list), `.rows` (named lines), `.talk` (speech bubbles), `.ask` (prompt), `.out` (table), `.checks` (check lines).
- Too many lines inside a screen cuts off the bottom (the automatic check cannot catch content that overflows a screen frame). Keep record lists and named lines to three or four lines. After rendering, check on the contact sheet that the bottom line of the screen isn't cut off.
- One line of description. Put anything more in the caption. Don't make a slide that explains a concept.
- The progress bar (`.prog`) has one `<i>` per slide, with `class="on"` up to and including the current slide. If you add or remove slides, fix it on every slide.
- The content decides the number of slides (see "The content decides the number of slides" in `carousel-engine`).

## What not to do

- Don't tint this kit's look with a colour and call it a "new brand". Make at least one repeating device that belongs only to the brand (a mascot, a shape, a typeface, a strip).
- Don't post with the sample copy left in.
- Don't invent statistics, testimonials or results. Label sample screens and sample numbers "example".
- Don't leave a screen frame empty with a line or two of text. If there's little content, make the text bigger or add content.
- Don't use the accent colour in several places on one slide. Don't change the accent to a pale pastel (default style).

The design standard for the default style is in `references/brand.md`.
