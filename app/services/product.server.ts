import { authenticate } from "../shopify.server";

export async function getProductsByVariantIds(
  request: Request,
  variantIds: string[],
) {
  const { admin } = await authenticate.public.appProxy(request);

  if (!admin) {
    throw new Response("Unauthorized", {
      status: 401,
    });
  }

  const ids = variantIds.map(
    (id) => `gid://shopify/ProductVariant/${id}`,
  );

  const response = await admin.graphql(
    `#graphql
    query Products($ids:[ID!]!) {
      nodes(ids:$ids) {

        ... on ProductVariant {

          id
          availableForSale
          price

          product {

            id
            title
            handle

            featuredImage {
              url
            }

          }

        }

      }
    }`,
    {
      variables: {
        ids,
      },
    },
  );

  const json = await response.json();

  return json.data.nodes;
}