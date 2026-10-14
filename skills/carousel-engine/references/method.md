# The steps in detail

## 1. State the goal in one sentence

Write down "who will look, and what should they do after seeing it" in one sentence. That sentence decides the cover headline and the last slide.

- For information, the last slide is "save this".
- To send people to a video or an article, the last slide is "go and watch / read".
- For a product notice, the last slide is "price and where to get it". Check prices and contents against the sales source (the original price list).

If the request doesn't give the goal, look first in earlier conversation and the material you have. Ask only if you still can't find it.

## 2. The slide table

Write the table before any HTML and save it as `plan.md` in the set folder. If the table is awkward, design won't fix it. Whoever reviews it later also checks the intent from this table.

| Slide | Role | One sentence for this slide | Format |
| --- | --- | --- | --- |
| 1 | Cover | (a question or one line of situation) | Visual anchor + big headline |
| 2 | Problem | | Three key points / piece of screen |
| 3 | Method 1 | | Steps / before-after |
| … | | | |
| N-1 | Recap | | Checklist (worth saving) |
| N | Closing | | One thing to do |

Check:
- Do two slides in a row ever have the same format? Unless you are listing items of equal rank, change one to another format.
- Does reading only each slide's one sentence in a row make a story?
- Did you fix the slide count first? The number of messages decides the count (see "The content decides the number of slides" in SKILL.md). The number of rows in the table is the count.
- With 6 slides or fewer, is a step missing: why, how, example, common questions, recap?

## 3. The cover

The cover represents the post in the profile grid and the feed. It must read at a glance, like a video thumbnail.

- The headline is 2-3 lines, a few short words per line. A question or a situation makes people swipe. The number of lines that fit differs by cover type, so follow the limit written in the brand kit skill (on a cover with a picture, extra lines collide with the picture).
- Emphasise just one word in the headline, with colour or a box. Emphasise two places and both get weaker.
- There is one visual anchor. Scatter several small ones and the centre disappears.
- Keep the swipe hint ("swipe") and the handle small and in the same spot.

## 4. Inner slides

- The headline is 2-3 times the size of the body. Keep the body to 2-3 lines per slide.
- Show instead of explaining. Two request sentences side by side read faster than "be specific in your request".
- Label sample screens and sample sentences "example". They must not look like real cases.
- A one-line aside under the screen gives each slide some breathing room.

## 5. Polishing the copy

- Say one thing per sentence.
- Write the way you talk, not in stiff noun-phrase sentences. Each brand has its own voice; follow the brand kit's `brand.md`.
- Insert line breaks yourself (`<br>`). Don't let a single small word like "a" or "of" fall alone onto the next line, and don't leave one lonely word on the last line.
- Open the source and check numbers, prices and dates before putting them in.

## 6. Render and fix

Run `render.cjs` and open `preview/sheet.png`. It's rare to finish in one pass. Common problems and fixes:

| What you see | How to fix |
| --- | --- |
| An overflow warning | Shorten the copy. Shrinking the text is the last resort |
| A picture covers the text | Move the picture or reduce the headline to fewer lines |
| The bottom looks empty | Increase the spacing between elements and the inner padding. Don't fill the gap with decoration |
| All the slides look alike | Change the format. Changing only the background colour is not a fix |
| Text isn't readable in the phone preview | Make that text 36px or larger, or remove it |

## 7. Report

- The set folder location and the number of slides
- The automatic check result (number of warnings) and how much you checked by eye
- Sources for copy and numbers, and what you could not verify
- If you used photos or 3D pictures, how they were made

Do not post or schedule. A person does the uploading.
