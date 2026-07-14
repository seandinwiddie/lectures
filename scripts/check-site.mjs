import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const siteRoot = path.join(root, '_site');
const failures = [];
const fail = (message) => failures.push(message);

function walk(directory, extension) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(absolute, extension);
    return absolute.endsWith(extension) ? [absolute] : [];
  });
}

function count(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

function decode(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function outputForHref(fromFile, href) {
  const pathname = decode(href).split(/[?#]/, 1)[0];
  if (!pathname) return fromFile;
  let candidate;
  if (pathname.startsWith('/')) {
    const relative = pathname.replace(/^\/lectures(?=\/|$)/, '').replace(/^\/+/, '');
    candidate = path.join(siteRoot, relative);
  } else {
    candidate = path.resolve(path.dirname(fromFile), pathname);
  }
  const possibilities = [candidate];
  if (pathname.endsWith('/') || !path.extname(candidate)) possibilities.push(path.join(candidate, 'index.html'));
  if (path.extname(candidate) === '.md') possibilities.push(candidate.replace(/\.md$/, '.html'));
  if (candidate === siteRoot) possibilities.push(path.join(siteRoot, 'index.html'));
  return possibilities.find((item) => fs.existsSync(item) && fs.statSync(item).isFile());
}

if (!fs.existsSync(siteRoot)) {
  console.error('_site does not exist. Run the Jekyll build first.');
  process.exit(1);
}

const htmlFiles = walk(siteRoot, '.html');
for (const file of htmlFiles) {
  const relative = path.relative(siteRoot, file);
  const html = fs.readFileSync(file, 'utf8');
  if (!/^<!doctype html>/i.test(html)) fail(`${relative}: missing HTML doctype.`);
  if (!/<html\b[^>]*\blang=["']en["']/i.test(html)) fail(`${relative}: missing lang=en.`);
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(`${relative}: missing title.`);
  if (!/<meta\b[^>]*\bname=["']description["'][^>]*\bcontent=["'][^"']+/i.test(html)) fail(`${relative}: missing description.`);
  if (!/<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']https:\/\//i.test(html)) fail(`${relative}: missing absolute canonical URL.`);
  if (!/<link\b(?=[^>]*\brel=["']alternate["'])(?=[^>]*\btype=["']application\/atom\+xml["'])/i.test(html)) {
    fail(`${relative}: missing Atom feed discovery metadata.`);
  }
  if (!/<meta\b(?=[^>]*\bproperty=["']og:image["'])(?=[^>]*\bcontent=["'][^"']+\.png["'])/i.test(html)) {
    fail(`${relative}: Open Graph image must use the raster social card.`);
  }
  if (!/<meta\b(?=[^>]*\bname=["']twitter:creator["'])(?=[^>]*\bcontent=["']@seandinwiddie["'])/i.test(html)) {
    fail(`${relative}: incorrect Twitter creator metadata.`);
  }
  if (!/<nav\b(?=[^>]*\bclass=["']site-nav["'])(?=[^>]*\baria-label=["']Primary["'])/i.test(html)) {
    fail(`${relative}: missing accessible primary navigation.`);
  }
  if (/\bclass=["'][^"']*\bnav-trigger\b/i.test(html)) {
    fail(`${relative}: contains the inaccessible checkbox navigation control.`);
  }
  if (!/<li\b[^>]*\bclass=["']p-name["'][^>]*>Sean Dinwiddie<\/li>/i.test(html)) {
    fail(`${relative}: footer author metadata is malformed.`);
  }
  if (count(html, /<main\b/gi) !== 1) fail(`${relative}: expected exactly one main landmark.`);
  if (count(html, /<h1\b/gi) !== 1) fail(`${relative}: expected exactly one h1.`);
  if (/\{[{%]/.test(html)) fail(`${relative}: contains unresolved Liquid.`);

  let previousLevel = 0;
  for (const heading of html.matchAll(/<h([1-6])\b/gi)) {
    const level = Number(heading[1]);
    if (previousLevel && level > previousLevel + 1) fail(`${relative}: heading order jumps from h${previousLevel} to h${level}.`);
    previousLevel = level;
  }
  for (const image of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt=["'][^"']*["']/i.test(image[0])) fail(`${relative}: image is missing alt text.`);
  }

  for (const link of html.matchAll(/\bhref=["']([^"']+)["']/gi)) {
    const href = link[1];
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) continue;
    const target = outputForHref(file, href);
    if (!target) fail(`${relative}: missing rendered target ${href}.`);
  }

  for (const script of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(script[1]); } catch (error) { fail(`${relative}: invalid JSON-LD (${error.message}).`); }
  }
}

const curriculumSource = fs.readFileSync(path.join(root, '_data', 'curriculum.yml'), 'utf8');
const records = [...curriculumSource.matchAll(/^- path: (.+)\n  url: (.+)\n  title: (.+)\n  difficulty: (.+)\n  outcomes:\n    - (.+)\n    - (.+)$/gm)].map((match) => ({
  path: match[1], url: match[2], title: match[3], difficulty: match[4], outcomes: [match[5], match[6]],
}));

const home = fs.readFileSync(path.join(siteRoot, 'index.html'), 'utf8');
const homeSchemas = [...home.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  .map((match) => JSON.parse(match[1]));
const course = homeSchemas.find((schema) => schema['@type'] === 'Course');
if (!course || !course['@id']?.endsWith('/lectures/#course')) fail('Home page needs the stable Course schema ID.');
if (course?.hasPart?.length !== records.length) fail(`Course schema must list all ${records.length} lectures.`);

for (const record of records) {
  const file = path.join(siteRoot, record.url.replace(/^\/+|\/+$/g, ''), 'index.html');
  if (!fs.existsSync(file)) {
    fail(`Missing rendered lecture ${record.url}.`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const schemas = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(match[1]));
  const graph = schemas.find((schema) => Array.isArray(schema['@graph']))?.['@graph'] ?? [];
  const resource = graph.find((item) => item['@type'] === 'LearningResource');
  if (!resource?.['@id']?.endsWith(`${record.url}#learning-resource`)) fail(`${record.url}: unstable LearningResource ID.`);
  if (resource?.educationalLevel !== record.difficulty) fail(`${record.url}: schema difficulty mismatch.`);
  if (resource?.teaches?.length !== record.outcomes.length) fail(`${record.url}: schema outcomes mismatch.`);
  if (!graph.some((item) => item['@type'] === 'BreadcrumbList')) fail(`${record.url}: missing BreadcrumbList schema.`);
  if (!/<nav\b[^>]*class=["']curriculum-breadcrumbs["']/i.test(html)) fail(`${record.url}: missing visible breadcrumbs.`);
  if (!/<nav\b[^>]*class=["']curriculum-pagination["']/i.test(html)) fail(`${record.url}: missing previous/next navigation.`);
  if (!/<meta\b[^>]*property=["']og:image["']/i.test(html)) fail(`${record.url}: missing social image metadata.`);
}

const sitemapFile = path.join(siteRoot, 'sitemap.xml');
if (!fs.existsSync(sitemapFile)) fail('Missing sitemap.xml.');
else {
  const sitemap = fs.readFileSync(sitemapFile, 'utf8');
  for (const record of records) {
    if (!sitemap.includes(`/lectures${record.url}`)) fail(`Sitemap omits ${record.url}.`);
  }
  if (!sitemap.includes('/lectures/technology-maintenance.html')) fail('Sitemap omits canonical technology maintenance page.');
  for (const variant of ['condensed', 'extensive']) {
    if (sitemap.includes(`/lectures/technology-maintenance-${variant}.html`)) fail(`Sitemap includes ${variant} duplicate.`);
  }
}

for (const variant of ['condensed', 'extensive']) {
  const file = path.join(siteRoot, `technology-maintenance-${variant}.html`);
  const html = fs.readFileSync(file, 'utf8');
  if (!/<meta\b[^>]*name=["']robots["'][^>]*content=["']noindex, follow["']/i.test(html)) fail(`${variant} duplicate is missing noindex.`);
  if (!/<link\b[^>]*rel=["']canonical["'][^>]*href=["']https:\/\/seandinwiddie\.github\.io\/lectures\/technology-maintenance\.html["']/i.test(html)) {
    fail(`${variant} duplicate has the wrong canonical URL.`);
  }
}

if (failures.length) {
  console.error(`Rendered-site validation failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} rendered pages, ${records.length} lecture schemas, and sitemap policy.`);
