// Resolves the locations of the engine and channel skills in one place. No home-directory paths are hard-coded; everything is found relative to this file.

const fs = require('fs');
const path = require('path');
const config = require('../config.json');

const ENGINE_ROOT = path.resolve(__dirname, '..', '..');
const SKILLS_ROOT = path.dirname(ENGINE_ROOT);
const SHARED_DIR = path.join(ENGINE_ROOT, config.engine.sharedDir);
const ENGINE_TEMPLATES_DIR = path.join(ENGINE_ROOT, config.engine.templatesDir);
const CHANNEL_NAME_PATTERN = /^[a-z0-9]+$/;

function channelSkillDir(channel) {
  if (!CHANNEL_NAME_PATTERN.test(channel)) throw new Error(`Channel names may only use lowercase letters and digits: ${channel}`);
  return path.join(SKILLS_ROOT, `${config.kit.skillPrefix}${channel}`);
}

function kitDir(channel) {
  return path.join(channelSkillDir(channel), config.kit.dir);
}

function readKitManifest(channel) {
  const manifestPath = path.join(kitDir(channel), config.kit.manifest);
  if (!fs.existsSync(manifestPath)) throw new Error(`Channel kit not found: ${manifestPath}`);
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function channelTemplatesDir(channel) {
  return path.join(channelSkillDir(channel), config.kit.templatesDir);
}

// Chrome executable location. Uses the CHROME_PATH environment variable if set, otherwise tries the usual install locations in turn.
function findChrome() {
  const fromEnv = process.env[config.chromePathEnv];
  if (fromEnv) {
    if (!fs.existsSync(fromEnv)) throw new Error(`The file that ${config.chromePathEnv} points to does not exist: ${fromEnv}`);
    return fromEnv;
  }
  const found = config.chromePathCandidates.find((candidate) => fs.existsSync(candidate));
  if (!found) {
    throw new Error(`Chrome not found. Install Chrome, or set the ${config.chromePathEnv} environment variable to the full path of the Chrome executable.`);
  }
  return found;
}

// Finds installed channel skills (folders containing carousel-<channel>/kit/kit.json).
function listChannels() {
  return fs
    .readdirSync(SKILLS_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(config.kit.skillPrefix))
    .map((entry) => entry.name.slice(config.kit.skillPrefix.length))
    .filter((channel) => CHANNEL_NAME_PATTERN.test(channel))
    .filter((channel) => fs.existsSync(path.join(kitDir(channel), config.kit.manifest)))
    .sort();
}

module.exports = {
  config,
  ENGINE_ROOT,
  SHARED_DIR,
  ENGINE_TEMPLATES_DIR,
  kitDir,
  readKitManifest,
  channelTemplatesDir,
  listChannels,
  findChrome,
};
