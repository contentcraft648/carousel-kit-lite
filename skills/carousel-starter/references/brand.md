# Starter design standard (default style `series`, "Paper")

This is not a design for any particular brand. It holds only the baseline standard that reads on any channel. The colours and parts are at the top of `kit/starter.css` and in its comments.

## Colour

| Name | Value | Use |
| --- | --- | --- |
| `--accent` | `#2447f9` | The one accent colour. One line of the headline, the pill label, the progress bar, the cover background. Choose a deep colour that white text reads on. This is the only line you change |
| `--accent-wash` | calculated from accent | Filled areas inside the screen |
| `--paper` | `#f2f0eb` | Card background |
| `--ink`, `--ink-soft`, `--ink-faint` | `#131417`, `#5d6068`, `#9b9da3` | Text, description, header |
| `--panel`, `--line` | `#ffffff`, `#dcd9d1` | Screen background and thin lines |

Colour is background plus one accent. Don't use pale pastels or tinted backgrounds.

## Type

- One typeface, Pretendard (it covers Latin and Korean). Headline 900, description 500, inside the screen 500-800, labels 800.
- Headline 96px (cover 104px), description 38px, inside the screen 34-46px, dotted list 32px, header 26px. Nothing under 24px (the automatic check warns).
- The headline is **two lines** (up to three on the cover), a few short words per line. Only one line or one word is in the accent colour.
- The description is **one line**. Voice: short, plain statements; friendly and direct, no jargon.
- Insert line breaks yourself with `<br>`. If text wraps on its own and leaves a short last line, the automatic check reports `awkward line break`.

## Layout

- **The screen frame is at least half the slide.** Put real records, prompts and results in it. Label sample material "example". Don't leave it empty with a line or two of text.
- Inner slides show **one item per slide**: which one (pill) -> name (big) -> one line -> large screen -> dotted list. Don't make slides that explain a concept.
- The finish is the same on every slide: the header on top (channel name, slide number), and below it the progress bar and swipe button. On the last slide the handle takes the button's place.
- Card inner padding 72px. Screen corners 20px, line 2px.

## Motion

- Make entrances a single kind: rising from below (`rise`).
- On a slide with a swiping screen, fix the text and frame with `data-motion="none"` and swipe only the screen. About 2 seconds per screen.
- The only idle motion is the small movement of the swipe button. The whole screen does not move.
