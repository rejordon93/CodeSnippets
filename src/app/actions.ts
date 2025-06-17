"use server";

import prisma from "@/database/prisma";

// actions.ts
export async function getAcceptedFriends() {
  // In getAcceptedFriends (actions.ts or wherever)
  const friends = await prisma.friend.findMany({
    where: { status: "ACCEPTED" },
    include: {
      recipient: {
        select: {
          username: true,
          isOnline: true,
        },
      },
    },
  });

  return friends;
}
