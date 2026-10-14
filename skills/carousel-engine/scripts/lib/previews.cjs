// Review images: phone-width previews and a single overview sheet of the whole set.

const fs = require('fs');
const path = require('path');
const { config } = require('./paths.cjs');

const { canvas, preview, output } = config;

// Re-shoots each card scaled down to phone width, to check that the text is actually readable.
async function savePhonePreviews(browser, pageUrl, prepare, targetDir) {
  const page = await browser.newPage({
    viewport: { width: canvas.width, height: canvas.height },
    deviceScaleFactor: preview.phoneWidth / canvas.width,
  });
  await page.goto(pageUrl);
  await prepare(page);
  fs.mkdirSync(targetDir, { recursive: true });
  const cards = page.locator(config.cardSelector);
  const count = await cards.count();
  for (let index = 0; index < count; index += 1) {
    const name = (await cards.nth(index).getAttribute(config.cardNameAttribute)) || 'card';
    const fileName = `${String(index + 1).padStart(2, '0')}-${name}.png`;
    await cards.nth(index).screenshot({ path: path.join(targetDir, fileName) });
  }
  await page.close();
}

function sheetHtml(imageUrls) {
  const columns = Math.min(preview.sheetColumns, imageUrls.length);
  const cellHeight = Math.round((preview.phoneWidth * canvas.height) / canvas.width);
  const images = imageUrls.map((url) => `<img src="${url}" width="${preview.phoneWidth}" height="${cellHeight}">`).join('');
  return `<!doctype html><meta charset="utf-8"><style>
    body { margin: 0; background: ${preview.sheetBackground}; }
    main { display: inline-grid; grid-template-columns: repeat(${columns}, ${preview.phoneWidth}px); gap: ${preview.sheetGap}px; padding: ${preview.sheetPadding}px; }
    img { display: block; }
  </style><main>${images}</main>`;
}

// Collects all rendered cards onto one sheet, so the flow and the layout variety between cards show at a glance.
async function saveSheet(browser, origin, cardFiles, targetPath) {
  const page = await browser.newPage({ viewport: { width: canvas.width, height: canvas.height } });
  const urls = cardFiles.map((file) => `${origin}/${output.cards}/${encodeURIComponent(file)}`);
  await page.setContent(sheetHtml(urls), { waitUntil: 'load' });
  await page.evaluate(() => Promise.all([...document.images].map((image) => image.decode().catch(() => null))));
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  await page.locator('main').screenshot({ path: targetPath });
  await page.close();
}

module.exports = { savePhonePreviews, saveSheet };
