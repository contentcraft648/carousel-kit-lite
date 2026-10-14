// Checks only what a machine can measure on a single card. Whether it looks good is for a person to judge by opening the image.

const { config } = require('./paths.cjs');

const BLEED_SELECTOR = `[${config.bleedAttribute}]`;

// Whether content overflows the canvas. Decorations that bleed on purpose (data-bleed) are excluded.
async function measureOverflow(card) {
  return card.evaluate((element, bleedSelector) => {
    const bleeds = [...element.querySelectorAll(bleedSelector)];
    const shown = bleeds.map((node) => node.style.display);
    bleeds.forEach((node) => { node.style.display = 'none'; });
    const size = { x: element.scrollWidth - element.clientWidth, y: element.scrollHeight - element.clientHeight };
    bleeds.forEach((node, index) => { node.style.display = shown[index]; });
    return size;
  }, BLEED_SELECTOR);
}

// Whether any text is below the minimum size. On a phone the card is shown at about 0.36x.
async function findSmallText(card, minFontPx) {
  return card.evaluate((element, minimum) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const found = new Map();
    while (walker.nextNode()) {
      const text = walker.currentNode.textContent.trim();
      const parent = walker.currentNode.parentElement;
      if (!text || !parent || parent.closest('svg')) continue;
      const size = parseFloat(getComputedStyle(parent).fontSize);
      if (size < minimum && !found.has(text)) found.set(text, size);
    }
    return [...found].map(([text, size]) => ({ text: text.slice(0, 24), size }));
  }, minFontPx);
}

// Images that have a src but did not load.
async function findBrokenImages(card) {
  return card.evaluate((element) =>
    [...element.querySelectorAll('img')]
      .filter((image) => image.getAttribute('src') && image.naturalWidth === 0)
      .map((image) => image.getAttribute('src')),
  );
}

// Line breaks: in text that wraps onto several lines, a short last line (an orphan line) reads awkwardly.
// Korean/CJK is judged per character; English and other Latin text per word (one short word left alone on the last line).
// Also reports a long word that had to be split across two lines.
// For each element that directly contains text, split it into lines by character position. If a segment ended by <br> wraps once more on its own
// and the wrapped last line is only a few characters or much shorter than the previous line, report it (manual <br> breaks are intentional and skipped).
async function findOrphanLines(card, rule) {
  return card.evaluate((element, { orphanMaxChars, tailMinRatio, latin, blockSelector }) => {
    const hasOwnText = (node) => [...node.childNodes].some((child) => child.nodeType === Node.TEXT_NODE && child.textContent.trim());
    const segmentsOf = (node) => {
      const segments = [[]];
      segments.broken = [];
      const range = document.createRange();
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
      while (walker.nextNode()) {
        const current = walker.currentNode;
        if (current.nodeType === Node.ELEMENT_NODE) {
          const breaks = current.tagName === 'BR' || getComputedStyle(current).display !== 'inline';
          if (breaks && segments[segments.length - 1].length) segments.push([]);
          continue;
        }
        const text = current.textContent;
        const lines = segments[segments.length - 1];
        for (let i = 0; i < text.length; i += 1) {
          if (!text[i].trim()) {
            if (lines.length) lines[lines.length - 1].text += ' ';
            continue;
          }
          range.setStart(current, i);
          range.setEnd(current, i + 1);
          const rect = range.getBoundingClientRect();
          if (!rect.height) continue;
          // Same line = vertical overlap. Mixed text sizes on one line (e.g. a small unit next to a number) still count as one line.
          const last = lines[lines.length - 1];
          const middle = rect.top + rect.height / 2;
          const lastMiddle = last ? (last.top + last.bottom) / 2 : 0;
          const sameLine = last && ((middle > last.top && middle < last.bottom) || (lastMiddle > rect.top && lastMiddle < rect.bottom));
          if (sameLine) {
            last.text += text[i];
            last.node = current;
            last.right = Math.max(last.right, rect.right);
            last.top = Math.min(last.top, rect.top);
            last.bottom = Math.max(last.bottom, rect.bottom);
          } else {
            // A word that the browser had to split because it did not fit on a line (Latin letters and digits on both sides of the break).
            if (last && last.node === current && /[A-Za-z0-9]$/.test(last.text) && /[A-Za-z0-9]/.test(text[i])) {
              segments.broken.push(last.text.split(/\s+/).pop() + '|' + text.slice(i).split(/[\s<]/)[0]);
            }
            lines.push({ top: rect.top, bottom: rect.bottom, text: text[i], left: rect.left, right: rect.right, node: current });
          }
        }
      }
      return segments;
    };
    const hasCjk = (value) => /[\u1100-\u11ff\u3040-\u30ff\u3130-\u318f\u3400-\u9fff\uac00-\ud7af]/.test(value);
    const found = [];
    element.querySelectorAll(blockSelector).forEach((node) => {
      const style = getComputedStyle(node);
      // Vertical text (side strips etc.) is not subject to the horizontal line-break check.
      if (node.closest('svg') || !hasOwnText(node) || style.display === 'inline' || !style.writingMode.startsWith('horizontal')) return;
      const segments = segmentsOf(node);
      segments.broken.forEach((word) => found.push({ kind: 'split', word }));
      segments.forEach((lines) => {
        if (lines.length < 2) return;
        const tail = lines[lines.length - 1];
        const tailText = tail.text.trim();
        const widest = Math.max(...lines.map((line) => line.right - line.left));
        const tailWidth = tail.right - tail.left;
        // Korean and other CJK text wraps per character, so count characters.
        // Latin text wraps per word: flag one short word left alone, or a very short last line.
        const short = hasCjk(tailText)
          ? tailText.length <= orphanMaxChars || tailWidth < widest * tailMinRatio
          : (!/\s/.test(tailText) && tailText.length <= latin.orphanMaxChars) || tailWidth < widest * latin.tailMinRatio;
        if (short) found.push({ kind: 'orphan', tail: tailText, before: lines[lines.length - 2].text.trim().slice(-12) });
      });
    });
    return found;
  }, rule);
}

// Empty band: the longest stretch of the card height with no text and no visual element (box with a fill or border, svg, img, canvas).
// A card whose top or bottom third is blank, or that has a big hole in the middle, usually needs a visual element or a better balance.
// Opt out for one card with the attribute data-allow-gap on the <section>.
async function findEmptyBand(card, minRatio) {
  return card.evaluate((element, ratio) => {
    if (!ratio || element.hasAttribute('data-allow-gap')) return null;
    const box = element.getBoundingClientRect();
    const height = box.height;
    const spans = [];
    const add = (rect, media) => {
      if (rect.width < 2 || rect.height < 2) return;
      if (!media && rect.height > height * 0.85) return; // full-height strips and wrappers are not content (a full-card image or canvas is)
      spans.push([Math.max(0, rect.top - box.top), Math.min(height, rect.bottom - box.top)]);
    };
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      [...range.getClientRects()].forEach(add);
    }
    element.querySelectorAll('*').forEach((node) => {
      if (node.closest('svg') && node.tagName.toLowerCase() !== 'svg') return;
      const style = getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden') return;
      const tag = node.tagName.toLowerCase();
      const visual = ['svg', 'img', 'canvas', 'video'].includes(tag)
        || (style.backgroundColor && !/rgba?\(\s*\d+,\s*\d+,\s*\d+,\s*0\s*\)|transparent/.test(style.backgroundColor))
        || style.backgroundImage !== 'none'
        || ['Top', 'Bottom'].some((side) => parseFloat(style['border' + side + 'Width']) > 0 && style['border' + side + 'Style'] !== 'none');
      if (visual) add(node.getBoundingClientRect(), ['svg', 'img', 'canvas', 'video'].includes(tag));
    });
    spans.sort((a, b) => a[0] - b[0]);
    let best = { size: 0, from: 0, to: 0 };
    let cursor = 0;
    for (const [start, end] of spans) {
      if (start - cursor > best.size) best = { size: start - cursor, from: cursor, to: start };
      cursor = Math.max(cursor, end);
    }
    if (height - cursor > best.size) best = { size: height - cursor, from: cursor, to: height };
    return best.size >= height * ratio ? { from: Math.round(best.from), to: Math.round(best.to), percent: Math.round((best.size / height) * 100) } : null;
  }, minRatio);
}

async function checkCard(card, label) {
  const warnings = [];
  const overflow = await measureOverflow(card);
  if (overflow.x > 0 || overflow.y > 0) warnings.push(`${label}: content overflows the card (${overflow.x} px horizontal, ${overflow.y} px vertical)`);
  const small = await findSmallText(card, config.checks.minFontPx);
  small.forEach((item) => warnings.push(`${label}: text smaller than ${config.checks.minFontPx}px (${item.size}px) "${item.text}"`));
  const orphans = await findOrphanLines(card, config.checks.lineBreak);
  orphans.forEach((item) => {
    if (item.kind === 'split') warnings.push(`${label}: word split mid-word "${item.word}" (a word is too long for its line: shorten it or give it more room)`);
    else warnings.push(`${label}: awkward line break: only "${item.tail}" is left on the last line after automatic wrapping (previous line ends "...${item.before}")`);
  });
  const gap = await findEmptyBand(card, config.checks.emptyBandRatio);
  if (gap) warnings.push(`${label}: empty band: nothing between y=${gap.from} and y=${gap.to} (${gap.percent}% of the card height). Add a visual element or rebalance the layout`);
  const broken = await findBrokenImages(card);
  broken.forEach((source) => warnings.push(`${label}: image did not load ${source}`));
  return warnings;
}

module.exports = { checkCard };
