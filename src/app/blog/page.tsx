"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import img from "../../../public/blog.jpg";
import ShowBlogs from "./components/ShowBlogs";
import axios from "axios";
import { useRouter } from "next/navigation";

type UserType = {
  firstname: string;
  lastname: string;
};

type BlogType = {
  id: number;
  title: string;
  content: string;
  tags: string[]; // Added tags field
  createdAt: string;
  // Add other fields as needed
};

export default function Blog() {
  const [userData, setUserData] = useState<UserType | null>(null);
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("/server/blog/get");
        setUserData(res.data.user);
        setBlogs(res.data.blogs);
      } catch (err) {
        console.error("Failed to fetch blog data", err);
      }
    };
    getData();
  }, []);

  const addBlog = () => router.push("/addBlog");
  const addFriend = () => router.push("/addFriends");
  const backBtn = () => router.push("/profile");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-blue-100 px-8 py-20">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center md:items-stretch max-w-7xl mx-auto w-full mb-16">
        {/* Text Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 md:w-1/2 transition-all duration-300 hover:shadow-blue-300">
          <h1 className="text-5xl font-extrabold text-blue-700 mb-6 leading-tight">
            Welcome {userData?.firstname} {userData?.lastname}
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            A Blog for CS Students & Aspiring Developers
          </h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Whether you&apos;re just starting or already on your journey, share
            what you&apos;re learning, post helpful code snippets, and connect
            with other coders from around the world.
          </p>
          <h3 className="text-xl font-medium text-purple-700 mb-4">
            Add your ideas 💡 and let&apos;s grow together!
          </h3>
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={addBlog}
              className="px-8 py-3 bg-blue-600 text-white text-lg rounded-lg shadow hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              Add Blog
            </button>
            <button
              onClick={addFriend}
              className="px-8 py-3 bg-blue-600 text-white text-lg rounded-lg shadow hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              Add Friends
            </button>
            <button
              onClick={backBtn}
              className="px-12 py-3 bg-blue-600 text-white text-lg rounded-lg shadow hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              Back
            </button>
          </div>
        </div>

        {/* Image Section */}
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

      {/* Blog List or Empty State */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 tracking-tight">
          Your Blog Posts 📝
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Here&apos;s everything you&apos;ve shared — feel free to add more and
          inspire others!
        </p>
      </div>

      <div className="max-w-7xl mx-auto w-full">
        {blogs.length === 0 ? (
          <p className="text-center text-xl text-gray-500 mt-10">
            🚫 No blogs found. Be the first to add one!
          </p>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog, idx) => (
              <ShowBlogs key={idx} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
