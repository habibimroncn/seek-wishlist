import { data } from "react-router";

import { authenticate } from "../shopify.server";

import {
  addWishlist,
  getWishlist,
  removeWishlist,
} from "../services/wishlist.server";

import { getProductsByVariantIds } from "../services/product.server";

export async function loader({
  request,
}: {
  request: Request;
}) {

  await authenticate.public.appProxy(request);

  const url = new URL(request.url);

  const customerId = String(
    url.searchParams.get("customerId"),
  );

  const wishlist = await getWishlist(customerId);

  if (!wishlist.length) {
    return data([]);
  }

  const variants = await getProductsByVariantIds(
    request,
    wishlist.map((item) => item.variantId),
  );

  const variantMap = new Map(
    variants.map((variant: any) => [
      variant.id.split("/").pop(),
      variant,
    ]),
  );

  const result = wishlist.map((item) => {

    const variant = variantMap.get(item.variantId) as any;

    return {

      variantId: item.variantId,

      productId:
        variant?.product?.id ?? "",

      title:
        variant?.product?.title ?? "",

      handle:
        variant?.product?.handle ?? "",

      image:
        variant?.product?.featuredImage?.url ?? "",

      price:
        variant?.price ?? "",

      available:
        variant?.availableForSale ?? false,

    };

  });

  return data(result);

}

export async function action({
  request,
}: {
  request: Request;
}) {

  await authenticate.public.appProxy(request);

  if (request.method !== "POST") {
    return data(
      { error: "Method Not Allowed" },
      { status: 405 },
    );
  }

  const body = await request.json();

  const {
    action,
    customerId,
    variantId,
  } = body;

  if (!customerId || !variantId) {
    return data(
      { error: "Missing parameters" },
      { status: 400 },
    );
  }

  switch (action) {

    case "add":

      return data(
        await addWishlist(
          customerId,
          variantId,
        ),
      );

    case "remove":

      return data(
        await removeWishlist(
          customerId,
          variantId,
        ),
      );

    default:

      return data(
        { error: "Invalid action" },
        { status: 400 },
      );

  }

}