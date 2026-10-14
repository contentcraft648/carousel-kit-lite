// Renders each card in a set folder's cards.html to PNG and builds review previews.
//
// Usage: node render.cjs <set folder>            render + checks + previews
//       node render.cjs <set folder> --serve    skip rendering and just serve a URL to view in a browser (Ctrl+C to stop)
//
// Output: <set>/out/NN-name.png  <set>/preview/phone/NN-name.png  <set>/preview/sheet.png

const fs = require('fs');
const os = require('os');
const path = require('path');
const { config, findChrome } = require('./lib/paths.cjs');
const { preparePage } = require('./lib/prepare.cjs');
const { startServer } = require('./lib/server.cjs');
const { checkCard } = require('./lib/checks.cjs');
const { savePhonePreviews, saveSheet } = require('./lib/previews.cjs');

const SERVE_FLAG = '--serve';
const { canvas, output } = config;

function loadChromium() {
  try {
    return require('playwright-core').chromium;
  } catch (error) {
    throw new Error(`playwright-core is missing. Run "npm install" once in ${__dirname}.`);
  }
}

// Chrome runs with a throwaway profile (Playwright creates one per launch and deletes it on close).
// On macOS it also gets a mock keychain so Chrome never asks to create or unlock your login keychain,
// and its own HOME is your real account home even if this script runs under a temporary HOME.
function chromeLaunchOptions() {
  const iso = config.chromeIsolation;
  const platformArgs = process.platform === 'darwin' ? iso.darwinArgs : process.platform === 'linux' ? iso.linuxArgs : [];
  const options = { executablePath: findChrome(), args: [...config.chromeArgs, ...platformArgs] };
  if (process.platform === 'darwin') options.env = { ...process.env, HOME: os.userInfo().homedir };
  return options;
}

function resolveSetDir(argument) {
  if (!argument) throw new Error('Tell me the set folder: node render.cjs <set folder> [--serve]');
  const setDir = path.resolve(argument);
  if (!fs.existsSync(path.join(setDir, config.cardsFile))) throw new Error(`${config.cardsFile} not found: ${setDir}`);
  return setDir;
}

async function renderCards(browser, pageUrl, outDir) {
  const page = await browser.newPage({ viewport: { width: canvas.width, height: canvas.height }, deviceScaleFactor: 1 });
  const failed = [];
  page.on('requestfailed', (request) => failed.push(request.url()));
  page.on('response', (response) => { if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`); });
  await page.goto(pageUrl);
  await preparePage(page);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  const cards = page.locator(config.cardSelector);
  const count = await cards.count();
  const files = [];
  const warnings = failed.map((url) => `failed to load file: ${url}`);
  for (let index = 0; index < count; index += 1) {
    const name = (await cards.nth(index).getAttribute(config.cardNameAttribute)) || 'card';
    const fileName = `${String(index + 1).padStart(2, '0')}-${name}.png`;
    warnings.push(...(await checkCard(cards.nth(index), fileName)));
    await cards.nth(index).screenshot({ path: path.join(outDir, fileName) });
    files.push(fileName);
  }
  await page.close();
  return { files, warnings };
}

async function renderSet(setDir, origin) {
  const pageUrl = `${origin}/${config.cardsFile}`;
  const browser = await loadChromium().launch(chromeLaunchOptions());
  try {
    const { files, warnings } = await renderCards(browser, pageUrl, path.join(setDir, output.cards));
    if (files.length === 0) throw new Error(`No cards match ${config.cardSelector}.`);
    const previewDir = path.join(setDir, output.preview);
    await savePhonePreviews(browser, pageUrl, preparePage, path.join(previewDir, output.phone));
    await saveSheet(browser, origin, files, path.join(previewDir, output.sheet));
    return { files, warnings };
  } finally {
    await browser.close();
  }
}

function report(setDir, { files, warnings }) {
  const edited = fs.statSync(path.join(setDir, config.cardsFile)).mtime.toLocaleTimeString('en-GB', { hour12: false });
  console.log(`${files.length} cards -> ${path.join(setDir, output.cards)}  (${config.cardsFile} last modified ${edited})`);
  console.log(`Overview sheet -> ${path.join(setDir, output.preview, output.sheet)}`);
  if (warnings.length === 0) console.log('Auto-check: no warnings');
  warnings.forEach((warning) => console.log(`  ! ${warning}`));
}

async function main() {
  const args = process.argv.slice(2);
  const setDir = resolveSetDir(args.find((arg) => arg !== SERVE_FLAG));
  const server = await startServer(setDir);
  if (args.includes(SERVE_FLAG)) {
    console.log(`Open in browser: ${server.origin}/${config.cardsFile}  (Ctrl+C to stop)`);
    return;
  }
  try {
    report(setDir, await renderSet(setDir, server.origin));
  } finally {
    await server.close();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
