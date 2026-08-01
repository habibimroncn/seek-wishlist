import prisma from "../db.server";

export async function getWishlist(customerId: string) {
  return prisma.wishlist.findMany({
    where: {
      customerId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function addWishlist(
  customerId: string,
  variantId: string,
) {
  const existing = await prisma.wishlist.findFirst({
    where: {
      customerId,
      variantId,
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.wishlist.create({
    data: {
      customerId,
      variantId,
    },
  });
}

export async function removeWishlist(
  customerId: string,
  variantId: string,
) {
  return prisma.wishlist.deleteMany({
    where: {
      customerId,
      variantId,
    },
  });
}