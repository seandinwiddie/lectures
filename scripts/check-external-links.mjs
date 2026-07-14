import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

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

const executable = process.platform === 'win32'
  ? path.join(root, 'node_modules', '.bin', 'markdown-link-check.cmd')
  : path.join(root, 'node_modules', '.bin', 'markdown-link-check');
const files = walk(root).sort();
const failures = [];
let nextFile = 0;

function validate(file) {
  return new Promise((resolve) => {
    const child = spawn(
      executable,
      [file, '--config', path.join(root, '.markdown-link-check.json'), '--quiet'],
      { cwd: root },
    );
    let output = '';
    child.stdout.on('data', (chunk) => { output += chunk; });
    child.stderr.on('data', (chunk) => { output += chunk; });
    child.on('error', (error) => resolve({ status: 1, output: `${error.message}\n` }));
    child.on('close', (status) => resolve({ status, output }));
  });
}

async function worker() {
  while (nextFile < files.length) {
    const file = files[nextFile];
    nextFile += 1;
    const result = await validate(file);
    if (result.status !== 0) failures.push({ file: path.relative(root, file), output: result.output });
  }
}

await Promise.all(Array.from({ length: Math.min(4, files.length) }, worker));

if (failures.length) {
  failures.sort((left, right) => left.file.localeCompare(right.file));
  failures.forEach((failure) => process.stderr.write(failure.output));
  console.error(`External link validation failed in ${failures.length} file(s): ${failures.map(({ file }) => file).join(', ')}`);
  process.exit(1);
}

console.log(`Validated external links in ${files.length} Markdown files.`);
