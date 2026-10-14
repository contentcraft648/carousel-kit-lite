// Creates a new carousel set folder from a template.
//
// Usage: node new-set.cjs --list
//       node new-set.cjs --dir <folder to create> [--channel <channel>] [--template <template name>]
//
// Without --channel, the engine's unstyled blank template is used.
// With --channel but no --template, the channel kit's default template is used.

const fs = require('fs');
const path = require('path');
const { config, ENGINE_TEMPLATES_DIR, readKitManifest, channelTemplatesDir, listChannels } = require('./lib/paths.cjs');

const OPTIONS = ['--dir', '--channel', '--template'];
const LIST_FLAG = '--list';

function parseOptions(args) {
  const options = {};
  OPTIONS.forEach((name) => {
    const index = args.indexOf(name);
    if (index !== -1) options[name.slice(2)] = args[index + 1];
  });
  return options;
}

function listTemplateNames(templatesDir) {
  if (!fs.existsSync(templatesDir)) return [];
  return fs
    .readdirSync(templatesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(templatesDir, entry.name, config.cardsFile)))
    .map((entry) => entry.name)
    .sort();
}

function printList() {
  console.log(`Blank templates (no design): ${listTemplateNames(ENGINE_TEMPLATES_DIR).join(', ')}`);
  listChannels().forEach((channel) => {
    const manifest = readKitManifest(channel);
    console.log(`\n[${channel}] ${manifest.name} — default template: ${manifest.defaultTemplate}`);
    listTemplateNames(channelTemplatesDir(channel)).forEach((name) => {
      const note = (manifest.templates && manifest.templates[name]) || '';
      console.log(`  ${name}${note ? ` — ${note}` : ''}`);
    });
  });
}

function resolveTemplateDir({ channel, template }) {
  if (!channel) return path.join(ENGINE_TEMPLATES_DIR, template || config.engine.blankTemplate);
  const name = template || readKitManifest(channel).defaultTemplate;
  return path.join(channelTemplatesDir(channel), name);
}

function createSet(options) {
  if (!options.dir) throw new Error('Tell me which folder to create: --dir <folder>');
  const targetDir = path.resolve(options.dir);
  const templateDir = resolveTemplateDir(options);
  if (!fs.existsSync(path.join(templateDir, config.cardsFile))) {
    throw new Error(`Template not found: ${templateDir}\nRun with --list to see the available templates.`);
  }
  if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
    throw new Error(`Folder already has content (not overwritten): ${targetDir}`);
  }
  fs.cpSync(templateDir, targetDir, { recursive: true });
  console.log(`Set created: ${targetDir}`);
  console.log(`Template: ${templateDir}`);
  console.log(`Next: edit the text in ${path.join(targetDir, config.cardsFile)}, then run node ${path.join(__dirname, 'render.cjs')} "${targetDir}"`);
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes(LIST_FLAG)) {
    printList();
    return;
  }
  createSet(parseOptions(args));
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
