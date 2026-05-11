export const CATALOG_PRODUCT_CONTRACT = 'catalog-product-v1';

export function getProductForCart(id) {
  return {
    id,
    name: 'Notebook',
    priceCents: 1200,
    available: true,
  };
}

export function assertCatalogProduct(product) {
  if (!product || typeof product.id !== 'string') throw new Error('missing product id');
  if (!Number.isInteger(product.priceCents)) throw new Error('missing product price');
  return true;
}
