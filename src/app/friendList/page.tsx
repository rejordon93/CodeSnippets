"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAcceptedFriends } from "../actions";
import Image from "next/image";
import img from "../../../public/FriendList.jpg";
import { useRouter } from "next/navigation";

type Friend = {
  id: number;
  recipient: {
    id: number;
    username: string;
    isOnline: boolean;
  } | null;
};

export default function FriendsList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchFriends() {
      try {
        const data = await getAcceptedFriends();
        const formattedData: Friend[] = data.map((item) => ({
          id: item.id,
          recipient: item.recipient
            ? {
                id: item.recipientId,
                username: item.recipient.username,
                isOnline: item.recipient.isOnline,
              }
            : null,
        }));
        setFriends(formattedData);
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFriends();
  }, []);

  const handleRemoveUser = async (friendRequestId: number) => {
    try {
      console.log(`Remove user with id: ${friendRequestId}`);
      await axios.delete(`/server/addFriends/delete`, {
        params: { friendRequestId },
      });
      setFriends((prev) => prev.filter((req) => req.id !== friendRequestId));
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading friends...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-8">
      <div className="flex flex-col md:flex-row w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Friends Section */}
        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-extrabold text-blue-600 mb-8 text-center">
              Friend List
            </h2>

            {friends.length === 0 ? (
              <p className="text-center text-gray-500 italic text-lg">
                You have no friends yet.
              </p>
            ) : (
              <ul className="space-y-6">
                {friends.map((friend) => {
                  const user = friend.recipient;
                  return (
                    <li
                      key={friend.id}
                      className="flex items-center justify-between px-6 py-4 bg-gray-100 rounded-lg text-lg"
                    >
                      <span className="font-medium text-gray-800">
                        {user?.username || "Unknown User"}
                      </span>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`font-semibold ${
                            user?.isOnline ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {user?.isOnline ? "Online" : "Offline"}
                        </span>
                        <button
                          onClick={() => handleRemoveUser(friend.id)}
                          className="text-sm px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white transition"
                          aria-label={`Remove user ${user?.username}`}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mt-12 w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            Back
          </button>
        </div>

        {/* Image Section */}
        <div className="relative w-full md:w-1/2 h-[400px] md:h-[600px]">
          <Image
            src={img}
            alt="Friends visual"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
