"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import img from "../../../public/friendRequest.jpg";
import { useRouter } from "next/navigation";

type FriendRequest = {
  id: number;
  requesterId: number;
  recipientId: number;
  createdAt: string;
  requester: {
    username: string; // requester username
  };
};

export default function FriendRequest() {
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get<{ data: FriendRequest[] }>(
          "/server/addFriends/get"
        );

        const requests = res.data.data.map((request) => ({
          id: request.id,
          requesterId: request.requesterId,
          recipientId: request.recipientId,
          createdAt: request.createdAt,
          requester: {
            username: request.requester.username, // nested inside `requester`
          },
        }));

        setReceivedRequests(requests);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };
    getUsers();
  }, []);

  const handleFriendRequest = async (friendRequestId: number) => {
    try {
      await axios.put("/server/addFriends/put", {
        friendRequestId,
      });

      setReceivedRequests((prev) =>
        prev.filter((req) => req.id !== friendRequestId)
      );
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleRejectRequest = async (friendRequestId: number) => {
    try {
      // Optional: You can call your API to delete or reject the friend request
      await axios.delete(`/server/addFriends/delete`, {
        params: { friendRequestId },
      });

      // Update UI
      setReceivedRequests((prev) =>
        prev.filter((req) => req.id !== friendRequestId)
      );
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-20">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-xl overflow-hidden max-w-6xl w-full">
        <div className="w-full md:w-1/2 p-12 flex flex-col">
          <h2 className="text-4xl font-extrabold mb-10 text-blue-700 text-center md:text-left">
            Friend Requests
          </h2>

          {receivedRequests.length === 0 ? (
            <p className="text-center text-gray-500 italic text-lg mt-16">
              No friend requests found.
            </p>
          ) : (
            <ul className="space-y-6 overflow-y-auto max-h-[480px]">
              {receivedRequests.map(({ id, requester: { username } }) => (
                <li
                  key={id}
                  className="flex justify-between items-center p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div>
                    <p className="text-xl font-semibold text-gray-900">
                      {username}
                    </p>
                    <p className="text-sm text-gray-500">
                      Sent you a friend request
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleFriendRequest(id)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-transform transform hover:scale-105"
                    >
                      Add Friend
                    </button>
                    <button
                      onClick={() => handleRejectRequest(id)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 transition-transform transform hover:scale-105"
                      title="Reject"
                    >
                      ❌
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={() => router.back()}
            className="mt-8 px-6 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold shadow hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Back
          </button>
        </div>

        <div className="relative w-full md:w-1/2 h-80 md:h-auto">
          <Image
            src={img}
            alt="Friend Request Illustration"
            fill
            className="object-cover rounded-r-xl"
            priority
          />
        </div>
      </div>
    </div>
  );
}
