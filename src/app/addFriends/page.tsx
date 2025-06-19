"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import img from "../../../public/addFriend.jpg";

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
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-white px-6 py-20 w-full">
      {/* Top Section: Text Left, Image Right */}
      <div className="w-full flex flex-col md:flex-row items-center md:items-start gap-16 mb-16 px-6">
        {/* Left Text */}
        <div className="md:w-1/2 text-left px-4 md:px-0">
          <h1 className="text-5xl font-extrabold text-blue-700 mb-6 tracking-tight leading-tight">
            🔍 Friend Finder
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 leading-relaxed">
            Search for friends — just start typing a name to find and connect
            with awesome people around you.
          </h2>
          <p className="text-gray-600 mb-10 text-lg leading-relaxed">
            Easily browse all users and send friend requests with one click.
            Build your network, stay connected, and share your journey!
          </p>
        </div>

        {/* Right Image */}
        <div className="relative md:w-1/2 w-full h-[420px] rounded-xl overflow-hidden shadow-lg ring-1 ring-blue-200">
          <Image
            src={img}
            alt="Add Friends Illustration"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Back & Search */}
      <form className="px-6 w-3xl mb-14" onSubmit={(e) => e.preventDefault()}>
        <div className="flex items-center justify-between gap-5">
          {/* Search Input */}
          <div className="relative flex-grow">
            {" "}
            {/* flex-grow allows input to expand */}
            <input
              type="search"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pl-14 text-base text-gray-900 border border-gray-300 rounded-2xl shadow-md bg-white focus:ring-4 focus:ring-blue-400 focus:outline-none transition"
              placeholder="Search for a friend..."
              autoComplete="off"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
              <svg
                className="w-6 h-6 text-gray-400"
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

          {/* Back Button on Right */}
          <button
            onClick={() => router.back()}
            type="button"
            className="px-6 py-3 text-blue-700 font-semibold rounded-2xl hover:bg-blue-100 focus:ring-2 focus:ring-blue-300 transition whitespace-nowrap"
            style={{ flexShrink: 0 }} // prevent shrinking if needed
          >
            Back
          </button>
        </div>
      </form>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-10 text-green-600 text-xl font-semibold animate-pulse select-none px-6">
          {successMessage}
        </div>
      )}

      {/* User List */}
      {searchTerm.trim() !== "" && filteredUsers.length > 0 && (
        <div className=" w-3xl bg-white rounded-3xl shadow-xl border border-gray-200 divide-y divide-gray-200 px-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center px-6 py-5 hover:bg-blue-50 transition-all cursor-pointer"
            >
              <div className="text-gray-900 font-semibold text-lg select-text">
                {user.username}
              </div>
              <button
                onClick={() => handleAddFriend(user.id)}
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-6 rounded-2xl shadow-md transition duration-200"
              >
                Add Friend
              </button>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {searchTerm.trim() !== "" && filteredUsers.length === 0 && (
        <p className="text-gray-500 mt-8 text-lg select-none px-6">
          No users found.
        </p>
      )}
    </div>
  );
}
