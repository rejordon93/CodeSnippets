"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import img from "../../../public/blog.jpg";
import SnippetCard from "./components/SnippetCard"; // Make sure this accepts props!
import axios from "axios";
import { useRouter } from "next/navigation";

type UserType = {
  firstname: string;
  lastname: string;
};

type SnippetType = {
  id: number;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  author: {
    id: number;
    username: string;
    email: string;
    isOnline: boolean;
  };
};

export default function Snippet() {
  const [userData, setUserData] = useState<UserType | null>(null);
  const [snippets, setSnippets] = useState<SnippetType[]>([]);
  const [searchUser, setSearchUser] = useState(""); // ✅ properly placed
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("/server/snippets/get");
        setUserData(res.data.user);
        setSnippets(res.data.snippets); // <--- use snippets here
      } catch (err) {
        console.error("Failed to fetch blog data", err);
        setSnippets([]);
      }
    };
    getData();
  }, []);

  const filteredSnippet = (snippets ?? []).filter((snippet) =>
    snippet.author?.username?.toLowerCase().includes(searchUser.toLowerCase())
  );

  const addSnippet = () => router.push("/addSnippet");
  const addFriend = () => router.push("/addFriends");
  const backBtn = () => router.push("/profile");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-blue-100 px-8 py-20">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center md:items-stretch max-w-7xl mx-auto w-full mb-16">
        <div className="bg-white rounded-3xl shadow-2xl p-10 md:w-1/2 transition-all duration-300 hover:shadow-blue-300">
          <h1 className="text-5xl font-extrabold text-blue-700 mb-6 leading-tight">
            Welcome {userData?.firstname} {userData?.lastname}
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            A Hub for Sharing Useful Code Snippets & Tips
          </h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Share your favorite code snippets, learn from others, and
            collaborate with developers worldwide.
          </p>
          <h3 className="text-xl font-medium text-purple-700 mb-4">
            Got a cool snippet? Add it below and inspire the community! 💡
          </h3>

          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex flex-wrap gap-4 mt-6">
              <button
                onClick={addSnippet}
                className="flex-1 min-w-[160px] px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-blue-500 hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.7)] transition duration-300"
              >
                Add Snippet
              </button>

              <button
                onClick={addFriend}
                className="flex-1 min-w-[160px] px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-blue-500 hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.7)] transition duration-300"
              >
                Add Friends
              </button>

              <button
                onClick={backBtn}
                className="flex-1 min-w-[160px] px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-blue-500 hover:drop-shadow-[0_0_10px_rgba(59,130,246,0.7)] transition duration-300"
              >
                Back
              </button>
            </div>
          </div>
        </div>

        <div className="relative w-full lg:w-1/2 h-[450px] rounded-3xl overflow-hidden shadow-2xl hover:shadow-purple-300 transition-shadow duration-300">
          <Image
            src={img}
            alt="Blogging Illustration"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Blog Header + Search */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-700 tracking-tight">
          Community Code Snippets 💻
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Browse code snippets from developers — or search by username!
        </p>

        <div className="mt-6 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search by username..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Blog Snippet Display */}
      <div className="max-w-7xl mx-auto w-full">
        {filteredSnippet.length === 0 ? (
          <p className="text-center text-xl text-gray-500 mt-10">
            🚫 No snippets found. Try a different username!
          </p>
        ) : (
          <SnippetCard snippets={filteredSnippet} />
        )}
      </div>
    </div>
  );
}
