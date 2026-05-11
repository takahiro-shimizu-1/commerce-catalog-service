#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';

replaceOnce(
  'src/catalog.mjs',
  "    stockStatus: 'in-stock',\n  };",
  "    stockStatus: 'in-stock',\n    fulfillmentChannel: 'warehouse',\n  };",
);
replaceOnce(
  'src/catalog.mjs',
  "  if (product.stockStatus !== 'in-stock') throw new Error('product is not in stock');\n",
  "  if (product.stockStatus !== 'in-stock') throw new Error('product is not in stock');\n  if (product.fulfillmentChannel !== 'warehouse') throw new Error('missing fulfillment channel');\n",
);
replaceOnce(
  'test/catalog.test.mjs',
  "    stockStatus: 'in-stock',\n  });",
  "    stockStatus: 'in-stock',\n    fulfillmentChannel: 'warehouse',\n  });",
);
updateContracts((entry) => {
  if (entry.id === 'CATALOG_PRODUCT_CONTRACT') entry.version = '5';
});

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
