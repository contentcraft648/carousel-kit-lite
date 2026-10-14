# Review checklist

The automatic check in `render.cjs` catches only overflow, small text, awkward line breaks, big empty bands and files that did not load. Open the pictures yourself to check the rest.

## On the contact sheet (`preview/sheet.png`)

- [ ] The cover has a visual anchor and the headline reads at a glance.
- [ ] Slides differ in structure. Unless you are listing items of equal rank, no two slides in a row have the same shape.
- [ ] The slide count fits the content. No stretched slides, and none with two messages crammed in.
- [ ] Colour and repeating devices (logo, slide number, strip) sit in the same places, so it looks like one set.
- [ ] Reading only each slide's headline in a row tells a story.
- [ ] The last slide has one thing to do.

## On the originals (`out/`), one by one

- [ ] No text or pictures overlap or are cut off.
- [ ] Line breaks are not awkward (no line with just a small word like "a" or "of", no one-word last lines).
- [ ] There is one emphasis per slide.
- [ ] No card is text only with a blank top or bottom (about a third of the height). A statement card needs a visual element: a big-number panel, a small diagram, example chat bubbles, or a screen frame. The automatic `empty band` warning catches the worst cases, but also check by eye.
- [ ] Nothing leans to one side, and no number or shape is cut off unless it is meant to bleed off the edge and still reads.
- [ ] At thumbnail size (the contact sheet) every card still has something that stands out, not only grey text.

## On the phone previews (`preview/phone/`)

- [ ] The body text is readable. Small labels may be unreadable without hurting understanding.
- [ ] The numbers in tables and charts are readable.

## Content

- [ ] No invented statistics, results or testimonials.
- [ ] Numbers, prices and dates were checked against their source.
- [ ] Sample screens and sample sentences are labelled "example".
- [ ] The handle and brand name are filled in with `data-token` (avoids typos).
- [ ] No key text in the roughly 100px square at the top right or at the centre of the right edge.

## Report what you could not check

How it looks in the real Instagram app, the grid thumbnail, and the quality after compression are only known by posting. If you haven't posted it, say so.
