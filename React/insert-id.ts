// jscodeshift can take a parser, like "babel", "babylon", "flow", "ts", or "tsx"
// Read more: https://github.com/facebook/jscodeshift#parser
import fs from 'fs';
import path from 'path';

// Global sequential ID persisted across runs via a counter file

export const parser = 'tsx';

const COUNTER_FILE = path.resolve(process.cwd(), '.data-id-seq');
let counterInitialized = false;
let currentCounter = 0;

function initCounter() {
  if (counterInitialized) return;
  try {
    const raw = fs.readFileSync(COUNTER_FILE, 'utf8').trim();
    const parsed = parseInt(raw, 10);
    currentCounter = Number.isNaN(parsed) ? 0 : parsed;
  } catch (e) {
    currentCounter = 0;
  }
  counterInitialized = true;
}

function ensureCounterAtLeast(minValue) {
  initCounter();
  if (currentCounter < minValue) {
    currentCounter = minValue;
    try { fs.writeFileSync(COUNTER_FILE, String(currentCounter), 'utf8'); } catch {}
  }
}

function getNextSequentialId() {
  initCounter();
  currentCounter += 1; // 1-based sequence
  const id = String(currentCounter).padStart(6, '0');
  try { fs.writeFileSync(COUNTER_FILE, String(currentCounter), 'utf8'); } catch {}
  return id;
}

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Initialize counter to at least the highest existing 6-digit data-id in the file
  let maxExistingId = 0;
  root
    .find(j.JSXAttribute, { name: { name: 'data-id' } })
    .forEach((p) => {
      const valueNode = p.node.value;
      const rawValue =
        valueNode && (valueNode.type === 'Literal' || valueNode.type === 'StringLiteral')
          ? valueNode.value
          : null;
      if (typeof rawValue === 'string' && /^\d{6}$/.test(rawValue)) {
        const numeric = parseInt(rawValue, 10);
        if (!Number.isNaN(numeric)) {
          if (numeric > maxExistingId) maxExistingId = numeric;
        }
      }
    });
  ensureCounterAtLeast(maxExistingId);

  return root
    .find(j.JSXIdentifier)
    .forEach((path) => {
      if (path.parentPath.node.attributes && !path.parentPath.node.attributes.map(attr => attr.name?.name).includes('data-id')) {
        // Remove existing data-id if it exists
        // const filteredAttributes = path.parentPath.node.attributes.filter((attr) => attr.name?.name !== 'data-id');

        // Add new sequential data-id (zero-padded 6-digit string)
        path.parentPath.node.attributes = [
          j.jsxAttribute(j.jsxIdentifier('data-id'), j.stringLiteral(getNextSequentialId())),
          ...path.parentPath.node.attributes,
        ];
      }
    })
    .toSource();
}
