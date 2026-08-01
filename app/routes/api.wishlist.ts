import { data } from "react-router";
import {
  addWishlist,
  getWishlist,
  removeWishlist,
} from "../services/wishlist.server";

export async function loader({
  request,
}: {
  request: Request;
}) {
  const url = new URL(request.url);

  const customerId = url.searchParams.get("customerId");

  if (!customerId) {
    return data(
      { error: "Missing parameters" },
      { status: 400 }
    );
  }

  const wishlist = await getWishlist(customerId!);

  return data(wishlist);
}

export async function action({
  request,
}: {
  request: Request;
}) {
  const body = await request.json();

  const {
    customerId,
    variantId
  } = body;

  if (!customerId || !variantId) {
    return data(
      { error: "Missing parameters" },
      { status: 400 }
    );
  }

  switch (request.method) {

    case "POST":

      return data(
        await addWishlist(
          customerId,
          variantId
        )
      );

    case "DELETE":

      return data(
        await removeWishlist(
          customerId,
          variantId
        )
      );

    default:

      return data(
        { error: "Method not allowed" },
        { status: 405 }
      );

  }
}