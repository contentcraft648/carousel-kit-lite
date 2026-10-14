# Specs and their basis

This is what was researched when building the bundle. Platform specs change, so check Instagram's help pages again before posting.

| Item | Standard | Confidence |
| --- | --- | --- |
| Supported ratios | 1.91:1 to 3:4. Both 1080x1350 (4:5) and 1080x1440 (3:4) work | Official (opened Instagram's help page directly) |
| Slides per post | Up to 20; one orientation (square, portrait, landscape) for the whole post | Official |
| Engine default canvas | 1080x1350 | Same as the defaults of common carousel-making tools |
| Profile grid | Cropped to 3:4. At 1080x1350 about 34px disappears from each side | Several secondary sources agree; the 34px is a calculated value |
| Cover safe margin | At least 60px left and right | Recommendation |
| Minimum text size | No official figure. The engine warns under 24px and recommends 36px or more for body text | A value set by reading text directly on the 390px preview |
| Covered spots | Top right of the cover (the multi-image icon), vertical centre of the right edge (the next button on the web) | Web checked by capture, app not checked. The covered width was never measured. Text placed inside the card's left and right padding (60-72px) can stay as is; just don't push text out past that padding |

To change the canvas size, edit `canvas` in `scripts/config.json`. The samples are drawn for 1080x1350, so if you switch to another size you must re-check the layout.
