import { data } from "react-router";
import prisma from "../db.server";

export async function action({ request }: { request: Request }) {
  const body = await request.json();

  const { customerId, shop, items } = body;

  if (!customerId || !Array.isArray(items)) {
    return data({ success: false }, { status: 400 });
  }

  for (const item of items) {
    const exists = await prisma.wishlist.findFirst({
      where: {
        customerId,
        shop,
        variantId: item.variant,
      },
    });

    if (!exists) {
      await prisma.wishlist.create({
        data: {
          customerId,
          shop,
          variantId: item.variant,
        },
      });
    }
  }

  return data({
    success: true,
  });
}