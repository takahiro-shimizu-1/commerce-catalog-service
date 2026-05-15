#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';

const scenario = resolveScenario();

if (scenario === 'large-catalog-product') {
  applyLargeCatalogProductChange();
} else if (scenario === 'validation-catalog-signal-v10') {
  applyValidationCatalogSignalV10Change();
} else {
  throw new Error(`Unsupported catalog Miyabi scenario: ${scenario}`);
}

function resolveScenario() {
  const text = [process.env.AUTOMATION_TASK_TITLE, process.env.AUTOMATION_TASK_ID].filter(Boolean).join(' ').toLowerCase();
  if (text.includes('large-catalog-product')) return 'large-catalog-product';
  if (text.includes('validation-catalog-signal-v10')) return 'validation-catalog-signal-v10';
  return 'unknown';
}

function applyLargeCatalogProductChange() {
  replaceOnce(
    'src/catalog.mjs',
    "    fulfillmentRegion: 'JP',\n  };",
    "    fulfillmentRegion: 'JP',\n    lifecycleBadge: 'standard-flow',\n  };",
  );
  replaceOnce(
    'src/catalog.mjs',
    "  if (product.fulfillmentRegion !== 'JP') throw new Error('missing fulfillment region');\n",
    "  if (product.fulfillmentRegion !== 'JP') throw new Error('missing fulfillment region');\n  if (product.lifecycleBadge !== 'standard-flow') throw new Error('missing lifecycle badge');\n",
  );
  replaceOnce(
    'test/catalog.test.mjs',
    "    fulfillmentRegion: 'JP',\n  });",
    "    fulfillmentRegion: 'JP',\n    lifecycleBadge: 'standard-flow',\n  });",
  );
  updateContracts((entry) => {
    if (entry.id === 'CATALOG_PRODUCT_CONTRACT') entry.version = '7';
  });
}

function applyValidationCatalogSignalV10Change() {
  replaceOnce(
    'src/catalog.mjs',
    "    lifecycleBadge: 'standard-flow',\n  };",
    "    lifecycleBadge: 'standard-flow',\n    qualitySignal: 'catalog-reviewed',\n  };",
  );
  replaceOnce(
    'src/catalog.mjs',
    "  if (product.lifecycleBadge !== 'standard-flow') throw new Error('missing lifecycle badge');\n",
    "  if (product.lifecycleBadge !== 'standard-flow') throw new Error('missing lifecycle badge');\n  if (product.qualitySignal !== 'catalog-reviewed') throw new Error('missing quality signal');\n",
  );
  replaceOnce(
    'test/catalog.test.mjs',
    "    lifecycleBadge: 'standard-flow',\n  });",
    "    lifecycleBadge: 'standard-flow',\n    qualitySignal: 'catalog-reviewed',\n  });",
  );
  updateContracts((entry) => {
    if (entry.id === 'CATALOG_PRODUCT_CONTRACT') entry.version = '10';
  });
}

function updateContracts(mutator) {
  const filePath = 'config/gitnexus-contracts.json';
  const manifest = JSON.parse(readFileSync(filePath, 'utf8'));
  for (const entry of manifest.contracts) mutator(entry);
  writeFileSync(filePath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

function replaceOnce(filePath, search, replacement) {
  const current = readFileSync(filePath, 'utf8');
  if (current.includes(search)) {
    writeFileSync(filePath, current.replace(search, replacement), 'utf8');
    return;
  }
  if (current.includes(replacement)) {
    return;
  }
  throw new Error(`Expected text not found in ${filePath}`);
}
