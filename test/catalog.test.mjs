import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { CATALOG_PRODUCT_CONTRACT, getProductForCart } from '../src/catalog.mjs';

test('catalog exposes stock status for cart and checkout', () => {
  assert.equal(CATALOG_PRODUCT_CONTRACT, 'catalog-product-v1');
  assert.deepEqual(getProductForCart('sku-1'), {
    id: 'sku-1',
    name: 'Notebook',
    category: 'stationery',
    taxClass: 'standard',
    priceCents: 1200,
    available: true,
    stockStatus: 'in-stock',
    fulfillmentChannel: 'warehouse',
  });
});
