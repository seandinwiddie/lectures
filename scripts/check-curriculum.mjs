import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const fail = (message) => failures.push(message);
const ignoredDirectories = new Set(['.git', '_site', 'node_modules', 'vendor']);

function markdownFiles(directory = root) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (ignoredDirectories.has(entry.name)) return [];
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(absolute);
    return absolute.endsWith('.md') ? [path.relative(root, absolute)] : [];
  });
}

const curriculumSource = read('_data/curriculum.yml');
const records = curriculumSource
  .split(/(?=^- path: )/m)
  .filter((block) => block.startsWith('- path: '))
  .map((block) => ({
    path: block.match(/^- path: (.+)$/m)?.[1],
    url: block.match(/^  url: (.+)$/m)?.[1],
    title: block.match(/^  title: (.+)$/m)?.[1],
    difficulty: block.match(/^  difficulty: (.+)$/m)?.[1],
    outcomes: [...block.matchAll(/^    - (.+)$/gm)].map((match) => match[1]),
  }));

if (records.length !== 18) fail(`Expected 18 curriculum records, found ${records.length}.`);
for (const key of ['path', 'url', 'title']) {
  const values = records.map((record) => record[key]);
  if (values.some((value) => !value)) fail(`Every curriculum record needs ${key}.`);
  if (new Set(values).size !== values.length) fail(`Curriculum ${key} values must be unique.`);
}

for (const record of records) {
  const absolute = path.join(root, record.path ?? '');
  if (!fs.existsSync(absolute)) {
    fail(`Missing lecture source ${record.path}.`);
    continue;
  }
  const source = fs.readFileSync(absolute, 'utf8');
  if (!/^---[\s\S]*?^layout: lecture\s*$[\s\S]*?^---$/m.test(source)) {
    fail(`${record.path} must use the lecture layout.`);
  }
  const rawTitle = source.match(/^title:\s*(.+)$/m)?.[1]?.trim();
  const frontMatterTitle = rawTitle?.replace(/^(["'])(.*)\1$/, '$2');
  const headingTitle = source.match(/^#\s+(.+?)\s*$/m)?.[1];
  if (frontMatterTitle !== record.title) {
    fail(`${record.path} front matter title must match curriculum title ${record.title}.`);
  }
  if (headingTitle !== record.title) {
    fail(`${record.path} h1 must match curriculum title ${record.title}.`);
  }
  if (!['Beginner', 'Intermediate', 'Advanced'].includes(record.difficulty)) {
    fail(`${record.path} has invalid difficulty ${record.difficulty}.`);
  }
  if (record.outcomes.length < 2) fail(`${record.path} needs at least two outcomes.`);
}

const forbidden = [
  /redux for everything/i,
  /boycott react logic/i,
  /hooks?\s+(?:are\s+)?banned/i,
  /useEffect\s+(?:is\s+)?forbidden/i,
  /no component state/i,
  /all state management uses Redux/i,
  /RTK Query for all data fetching/i,
  /strictly presentational/i,
  /presentational only/i,
  /zero business logic/i,
  /AI responses may include mistakes/i,
  /^##\s*$/m,
];

for (const file of markdownFiles()) {
  const source = read(file);
  for (const pattern of forbidden) {
    if (pattern.test(source)) fail(`${file} contains forbidden legacy guidance matching ${pattern}.`);
  }
}

for (const variant of ['technology-maintenance-condensed.md', 'technology-maintenance-extensive.md']) {
  const source = read(variant);
  if (!/^robots: ["']?noindex, follow["']?$/m.test(source)) fail(`${variant} must be noindex, follow.`);
  if (!/^sitemap: false$/m.test(source)) fail(`${variant} must be excluded from the sitemap.`);
  if (!/^canonical_url: ["']?https:\/\/seandinwiddie\.github\.io\/lectures\/technology-maintenance\.html["']?$/m.test(source)) {
    fail(`${variant} must canonicalize to technology-maintenance.html.`);
  }
}

if (!read('index.md').includes('site.data.curriculum')) {
  fail('The Course schema must be generated from _data/curriculum.yml.');
}
const socialImage = 'assets/functional-programming-lectures-social.png';
if (!read('_config.yml').includes(socialImage) || !fs.existsSync(path.join(root, socialImage))) {
  fail('The site needs a default social image.');
}
if (fs.existsSync(path.join(root, '.DS_Store'))) fail('Tracked .DS_Store must be removed.');

if (failures.length) {
  console.error(`Curriculum validation failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Validated ${records.length} curriculum records and publication policies.`);
