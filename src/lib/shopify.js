// Shopify Storefront API client — shared Cool J's store (headless).
// The Storefront token is a public, read-only key (safe in client code).
const DOMAIN = process.env.REACT_APP_SHOPIFY_DOMAIN || 'suynjr-jx.myshopify.com';
const TOKEN = process.env.REACT_APP_SHOPIFY_STOREFRONT_TOKEN || 'ddcbab9372f59289cb205d1911cbae07';
const API_VERSION = '2025-10';
export const COLLECTION_HANDLE = 'cool-js-afterdark';

async function shopifyFetch(query, variables = {}) {
  const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map(e => e.message).join('; '));
  return json.data;
}

const PRODUCT_CARD = `
  id handle title productType
  priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount } }
  featuredImage { url altText width height }
  images(first: 2) { nodes { url altText } }
  availableForSale
`;

const CART_FIELDS = `
  id checkoutUrl totalQuantity
  cost { subtotalAmount { amount currencyCode } }
  lines(first: 50) {
    nodes {
      id quantity
      cost { totalAmount { amount currencyCode } }
      merchandise {
        ... on ProductVariant {
          id title
          image { url altText }
          price { amount currencyCode }
          product { title handle }
        }
      }
    }
  }
`;

export async function getCollectionProducts(handle = COLLECTION_HANDLE) {
  const data = await shopifyFetch(
    `query($handle: String!) {
      collection(handle: $handle) {
        title description
        products(first: 50, sortKey: CREATED, reverse: true) { nodes { ${PRODUCT_CARD} } }
      }
    }`,
    { handle }
  );
  return data.collection;
}

export async function getProduct(handle) {
  const data = await shopifyFetch(
    `query($handle: String!) {
      product(handle: $handle) {
        id handle title descriptionHtml productType tags
        options { name optionValues { name } }
        images(first: 12) { nodes { url altText } }
        variants(first: 100) {
          nodes {
            id title availableForSale
            price { amount currencyCode }
            selectedOptions { name value }
            image { url altText }
          }
        }
      }
    }`,
    { handle }
  );
  return data.product;
}

export async function createCart(lines) {
  const data = await shopifyFetch(
    `mutation($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) { cart { ${CART_FIELDS} } userErrors { message } }
    }`,
    { lines }
  );
  return data.cartCreate.cart;
}

export async function getCart(cartId) {
  const data = await shopifyFetch(`query($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`, { id: cartId });
  return data.cart;
}

export async function addCartLines(cartId, lines) {
  const data = await shopifyFetch(
    `mutation($id: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $id, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } }
    }`,
    { id: cartId, lines }
  );
  return data.cartLinesAdd.cart;
}

export async function updateCartLine(cartId, lineId, quantity) {
  const data = await shopifyFetch(
    `mutation($id: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $id, lines: $lines) { cart { ${CART_FIELDS} } userErrors { message } }
    }`,
    { id: cartId, lines: [{ id: lineId, quantity }] }
  );
  return data.cartLinesUpdate.cart;
}

export async function removeCartLine(cartId, lineId) {
  const data = await shopifyFetch(
    `mutation($id: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $id, lineIds: $lineIds) { cart { ${CART_FIELDS} } userErrors { message } }
    }`,
    { id: cartId, lineIds: [lineId] }
  );
  return data.cartLinesRemove.cart;
}

export function formatMoney(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(amount));
}

// Shopify CDN resize helper
export function sized(url, width) {
  if (!url) return url;
  return url + (url.includes('?') ? '&' : '?') + `width=${width}`;
}
