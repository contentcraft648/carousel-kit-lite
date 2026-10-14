# Making your own brand kit

The engine recognises a brand when a `carousel-<brand>` folder has a `kit/kit.json`. Brand names use only lowercase English letters and digits (for example `carousel-mybrand`).

## Folder

```
~/.claude/skills/carousel-<brand>/
├── SKILL.md              when to use it, how to choose a sample, voice, what not to do
├── kit/
│   ├── kit.json          brand name, copy tokens, default sample, sample descriptions
│   ├── <brand>.css       colours, fonts, parts. This brand's look is defined in this one place only
│   └── assets/           logo, mascot, person cut-outs, etc.
├── templates/<sample name>/cards.html   a copy-and-use starting point
├── references/brand.md   the brand standard and its reasons
└── examples/             sample pictures (for reading)
```

`kit.json` example:

```json
{
  "channel": "mybrand",
  "name": "Brand display name",
  "tokens": { "name": "Brand display name", "handle": "@account" },
  "defaultTemplate": "series",
  "templates": { "series": "Default 7 slides" }
}
```

## The easy way: copy the starter and change it

1. Copy the `carousel-starter` folder to `carousel-<your brand>`. Inside it, rename `kit/starter.css` to `kit/<your brand>.css`.
2. In `kit/kit.json`, change `channel` to your brand name and `tokens` to your brand name and handle.
3. In `templates/series/cards.html`, change `data-channel="starter"` to your brand name, and `/__kit/starter/starter.css` to `/__kit/<your brand>/<your brand>.css`.
4. Start by changing the `--accent` colour at the top of the CSS to your brand colour. Fix fonts, corners and spacing after that.
5. Edit `name` and the description in `SKILL.md` for your brand.

If you change only the colour and stop, you get "the starter with a coat of colour". A brand has to be recognisable in the feed at a glance, so use the order below to make at least one repeating device that belongs only to that brand.

## Order when building from scratch

1. **Open the brand's real assets.** The site, videos, logo, past posts. Write down colour values, typefaces, repeating visual elements and voice. Don't fill gaps with guesses.
2. **Settle on one look.** Rather than making many styles, grow the formats (steps, a piece of screen, comparison, checklist, Q&A) inside one tone.
3. **Build it the way that tone is actually made.** Swap colours into another brand's CSS and you drag that same drawing style along. Pixel art is built on a grid with a pixel font, handwriting on paper and tape; build from that grammar from the start.
4. **Collect the parts in `<brand>.css`.** Don't re-specify colours in each sample. Styles for one slide only, such as a cover, also go in the kit CSS under the cover class (`.cover-name`), not in a `<style>` inside the sample. If a sample contains global styles, the inner slides break when that cover is dropped into another series.
5. **Build the samples and render them with the engine.** Copy them with `new-set.cjs --channel <brand>` and check that `render.cjs` runs without warnings.
6. **Quarantine the samples.** Keep results made with a real topic in `examples/` as pictures only. A sample's copy is example text, so replace all of it in a new set.
7. **Test it on someone new (or a fresh conversation).** Run it once to see whether a set on a new topic can be made from the skill alone.

