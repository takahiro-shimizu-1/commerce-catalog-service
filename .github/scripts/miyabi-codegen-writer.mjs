#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';

replaceOnce(
  'src/catalog.mjs',
  "    category: 'stationery',\n    priceCents: 1200,",
  "    category: 'stationery',\n    taxClass: 'standard',\n    priceCents: 1200,",
);
replaceOnce(
  'src/catalog.mjs',
  "  if (product.category !== 'stationery') throw new Error('missing product category');\n",
  "  if (product.category !== 'stationery') throw new Error('missing product category');\n  if (product.taxClass !== 'standard') throw new Error('missing product tax class');\n",
);
replaceOnce(
  'test/catalog.test.mjs',
  "    category: 'stationery',\n    priceCents: 1200,",
  "    category: 'stationery',\n    taxClass: 'standard',\n    priceCents: 1200,",
);
updateContracts((entry) => {
  if (entry.id === 'CATALOG_PRODUCT_CONTRACT') entry.version = '4';
});

function updateContracts(mutator) {
  const filePath = 'config/gitnexus-contracts.json';
  const manifest = JSON.parse(readFileSync(filePath, 'utf8'));
  for (const entry of manifest.contracts) mutator(entry);
  writeFileSync(filePath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

function replaceOnce(filePath, search, replacement) {
  const current = readFileSync(filePath, 'utf8');
  if (!current.includes(search)) {
    throw new Error(`Expected text not found in ${filePath}`);
  }
  writeFileSync(filePath, current.replace(search, replacement), 'utf8');
}
