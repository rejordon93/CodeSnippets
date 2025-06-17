import { NextResponse } from "next/server";
import prisma from "@/database/prisma";

export async function GET() {
  const requests = await prisma.friend.findMany({
    where: {
      status: {
        not: "ACCEPTED",
      },
    },
    select: {
      id: true,
      requesterId: true,
      recipientId: true,
      createdAt: true,
      status: true,
      requester: {
        select: {
          username: true,
        },
      },
    },
  });

  return NextResponse.json(
    { message: "All friend requests", data: requests },
    { status: 200 }
  );
}

// might need this again

// import { NextResponse } from "next/server";
// import prisma from "@/database/prisma";

// export async function GET() {
//   const requests = await prisma.user.findMany({
//     select: {
//       id: true,
//       username: true,
//       requestedFriends: {
//         select: {
//           id: true,
//           recipientId: true,
//           createdAt: true,
//           requester: {
//             // include requester info
//             select: {
//               username: true,
//             },
//           },
//         },
//       },
//       receivedFriends: {
//         select: {
//           id: true,
//           requesterId: true,
//           createdAt: true,
//           requester: {
//             // requester is the user who sent the friend request
//             select: {
//               username: true,
//             },
//           },
//         },
//       },
//     },
//   });

//   return NextResponse.json(
//     { message: "All requests", data: requests },
//     { status: 200 }
//   );
// }
