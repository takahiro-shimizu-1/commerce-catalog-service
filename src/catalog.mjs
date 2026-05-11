export const CATALOG_PRODUCT_CONTRACT = 'catalog-product-v1';

export function getProductForCart(id) {
  return {
    id,
    name: 'Notebook',
    priceCents: 1200,
    available: true,
    stockStatus: 'in-stock',
  };
}

export function assertCatalogProduct(product) {
  if (!product || typeof product.id !== 'string') throw new Error('missing product id');
  if (!Number.isInteger(product.priceCents)) throw new Error('missing product price');
  if (product.stockStatus !== 'in-stock') throw new Error('product is not in stock');
  return true;
}
