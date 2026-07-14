import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const ignoredDirectories = new Set(['.git', '_site', 'node_modules', 'vendor']);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (ignoredDirectories.has(entry.name)) return [];
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(absolute);
    return absolute.endsWith('.md') ? [absolute] : [];
  });
}

function visibleLines(markdown) {
  let fence = null;
  return markdown.split(/\r?\n/).map((line) => {
    const match = line.match(/^\s*(`{3,}|~{3,})/);
    if (match) {
      if (!fence) fence = match[1][0];
      else if (fence === match[1][0]) fence = null;
      return '';
    }
    return fence ? '' : line;
  });
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/&(?:amp|lt|gt|quot|#39);/g, '')
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
}

const anchorCache = new Map();
function anchorsFor(file) {
  if (anchorCache.has(file)) return anchorCache.get(file);
  const anchors = new Set();
  const counts = new Map();
  for (const line of visibleLines(fs.readFileSync(file, 'utf8'))) {
    const heading = line.match(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/);
    if (!heading) continue;
    const explicit = heading[1].match(/\s*\{#([^}]+)\}\s*$/);
    const base = explicit ? explicit[1] : slugify(heading[1]);
    const count = counts.get(base) ?? 0;
    anchors.add(count === 0 ? base : `${base}-${count}`);
    counts.set(base, count + 1);
  }
  anchorCache.set(file, anchors);
  return anchors;
}

function sourceForLink(fromFile, pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    decoded = pathname;
  }

  let candidate;
  if (decoded.startsWith('/')) {
    const withoutBaseurl = decoded.replace(/^\/lectures(?=\/|$)/, '');
    candidate = path.join(root, withoutBaseurl.replace(/^\/+/, ''));
  } else {
    candidate = path.resolve(path.dirname(fromFile), decoded || '.');
  }

  const possibilities = [candidate];
  if (path.extname(candidate) === '.html') {
    possibilities.push(candidate.replace(/\.html$/, '.md'));
  }
  if (!path.extname(candidate) || decoded.endsWith('/')) {
    possibilities.push(path.join(candidate, 'index.md'), `${candidate}.md`);
  }
  if (candidate === root) possibilities.push(path.join(root, 'index.md'));

  return possibilities.find((item) => fs.existsSync(item) && fs.statSync(item).isFile());
}

function referencesIn(line) {
  const references = [];
  const markdownLink = /!?\[[^\]]*\]\(\s*<?([^\s)>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g;
  const htmlLink = /\b(?:href|src)=["']([^"']+)["']/g;
  for (const pattern of [markdownLink, htmlLink]) {
    for (const match of line.matchAll(pattern)) references.push(match[1]);
  }
  return references;
}

const failures = [];
const files = walk(root).sort();
for (const file of files) {
  const lines = visibleLines(fs.readFileSync(file, 'utf8'));
  lines.forEach((line, index) => {
    for (const rawReference of referencesIn(line)) {
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/|\{[{%])/i.test(rawReference)) continue;
      const [pathname, encodedAnchor] = rawReference.split('#', 2);
      const target = pathname ? sourceForLink(file, pathname.split(/[?]/, 1)[0]) : file;
      const label = `${path.relative(root, file)}:${index + 1}`;
      if (!target) {
        failures.push(`${label} missing target: ${rawReference}`);
        continue;
      }
      if (encodedAnchor) {
        let anchor = encodedAnchor;
        try { anchor = decodeURIComponent(encodedAnchor); } catch { /* use raw anchor */ }
        if (!anchorsFor(target).has(anchor)) {
          failures.push(`${label} missing anchor #${anchor} in ${path.relative(root, target)}`);
        }
      }
    }
  });
}

if (failures.length) {
  console.error(`Markdown link validation failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Validated internal links and anchors in ${files.length} Markdown files.`);
