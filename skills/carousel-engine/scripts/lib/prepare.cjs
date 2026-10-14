// Pre-render prep: fill in channel text and page numbers, then wait until fonts and images have loaded.

const { config, readKitManifest } = require('./paths.cjs');

const { canvas } = config;

async function readChannel(page) {
  return page.locator('html').getAttribute(config.channelAttribute);
}

// Channel text (handle, name): looked up in the kit.json tokens of the channel kit named by <html data-channel> and filled into data-token elements.
async function fillTokens(page) {
  const channel = await readChannel(page);
  const tokens = channel ? readKitManifest(channel).tokens || {} : {};
  await page.evaluate(({ attribute, values }) => {
    document.querySelectorAll(`[${attribute}]`).forEach((element) => {
      const key = element.getAttribute(attribute);
      if (!(key in values)) throw new Error(`Undefined text token: ${key}`);
      element.textContent = values[key];
    });
  }, { attribute: config.tokenAttribute, values: tokens });
}

// Page numbers: fills data-page elements with "current / total". Adding or removing cards needs no manual renumbering.
// To change the format, write e.g. data-page="{nn} / {tt}" ({n} = 1, {nn} = 01, {t}/{tt} = total count).
async function fillPageNumbers(page) {
  await page.evaluate(({ cardSelector, attribute, defaultPattern }) => {
    const cards = [...document.querySelectorAll(cardSelector)];
    const pad = (value) => String(value).padStart(2, '0');
    cards.forEach((card, index) => {
      card.querySelectorAll(`[${attribute}]`).forEach((element) => {
        const pattern = element.getAttribute(attribute) || defaultPattern;
        element.textContent = pattern
          .replace('{nn}', pad(index + 1))
          .replace('{tt}', pad(cards.length))
          .replace('{n}', index + 1)
          .replace('{t}', cards.length);
      });
    });
  }, { cardSelector: config.cardSelector, attribute: config.pageAttribute, defaultPattern: config.pagePattern });
}

// Pre-render prep: inject canvas size, then channel text, then page numbers, then wait for fonts and images to load.
async function preparePage(page) {
  await page.addStyleTag({ content: `:root{--cw:${canvas.width}px;--ch:${canvas.height}px}` });
  await fillTokens(page);
  await fillPageNumbers(page);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.decode().catch(() => null)));
  });
}

module.exports = { preparePage, readChannel };
