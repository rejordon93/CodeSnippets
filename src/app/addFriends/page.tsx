"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  username: string;
  email: string;
};

export default function AddFriends() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMounted, setHasMounted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();

  const handleAddFriend = async (id: number) => {
    try {
      await axios.post("/server/addFriends/create", {
        recipientId: id,
      });
      setUsers((prev) => prev.filter((user) => user.id !== id));
      setSuccessMessage("🎉 Friend request sent!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get<User[]>("/server/clients/getUser");
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getUsers();
  }, []);

  if (!hasMounted) return null;

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-white px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-8 tracking-tight text-center">
        🔍 Friend Finder
      </h1>

      {/* Back & Search */}
      <form
        className="w-full max-w-2xl mb-10"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-col md:flex-row items-center gap-4">
          <button
            onClick={() => router.back()}
            type="button"
            className="text-blue-600 border border-blue-600 rounded-md px-4 py-2 text-sm font-semibold hover:bg-blue-600 hover:text-white transition duration-200 w-full md:w-auto"
          >
            ← Back
          </button>

          <div className="relative w-full">
            <input
              type="search"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 ps-12 text-base text-gray-800 border border-gray-300 rounded-xl shadow-md bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Search for a friend..."
              autoComplete="off"
            />

            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </form>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 text-green-600 text-lg font-medium animate-pulse">
          {successMessage}
        </div>
      )}

      {/* User List */}
      {searchTerm.trim() !== "" && filteredUsers.length > 0 && (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center px-6 py-4 hover:bg-blue-50 transition-all"
            >
              <div className="text-gray-900 font-medium text-lg">
                {user.username}
              </div>
              <button
                onClick={() => handleAddFriend(user.id)}
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-5 rounded-lg transition duration-200"
              >
                Add Friend
              </button>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {searchTerm.trim() !== "" && filteredUsers.length === 0 && (
        <p className="text-gray-500 mt-6 text-lg">No users found.</p>
      )}
    </div>
  );
}
