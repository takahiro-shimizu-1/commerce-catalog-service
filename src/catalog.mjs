export const CATALOG_PRODUCT_CONTRACT = 'catalog-product-v1';

export function getProductForCart(id) {
  return {
    id,
    name: 'Notebook',
    category: 'stationery',
    taxClass: 'standard',
    priceCents: 1200,
    available: true,
    stockStatus: 'in-stock',
    fulfillmentChannel: 'warehouse',
    fulfillmentRegion: 'JP',
    lifecycleBadge: 'standard-flow',
    qualitySignal: 'catalog-reviewed',
  };
}

export function assertCatalogProduct(product) {
  if (!product || typeof product.id !== 'string') throw new Error('missing product id');
  if (!Number.isInteger(product.priceCents)) throw new Error('missing product price');
  if (product.category !== 'stationery') throw new Error('missing product category');
  if (product.taxClass !== 'standard') throw new Error('missing product tax class');
  if (product.stockStatus !== 'in-stock') throw new Error('product is not in stock');
  if (product.fulfillmentChannel !== 'warehouse') throw new Error('missing fulfillment channel');
  if (product.fulfillmentRegion !== 'JP') throw new Error('missing fulfillment region');
  if (product.lifecycleBadge !== 'standard-flow') throw new Error('missing lifecycle badge');
  if (product.qualitySignal !== 'catalog-reviewed') throw new Error('missing quality signal');
  return true;
}
