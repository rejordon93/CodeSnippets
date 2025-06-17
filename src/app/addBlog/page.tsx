"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import img from "../../../public/addBlog.jpg";

export default function AddBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("/server/blog/create", {
        title,
        content,
        tags: tags.split(",").map((tag) => tag.trim()),
      });

      router.push("/blogHome");
    } catch (error) {
      console.error("Blog submission error:", error);
    }
  };

  const handleBack = () => {
    router.push("/blog");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-6xl w-full flex rounded-none overflow-hidden h-[90vh]">
        {/* Left: Blog Form */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <h1 className="text-5xl font-extrabold mb-12 text-blue-600 tracking-tight">
            Create Blog Post
          </h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Blog Title"
              required
              className="w-full px-5 py-4 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg placeholder-black"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here..."
              required
              rows={6}
              className="w-full px-5 py-4 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg placeholder-black resize-none"
            />
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className="w-full px-5 py-4 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg placeholder-black"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold text-xl tracking-wide transition"
            >
              Post Blog
            </button>
          </form>

          <button
            onClick={handleBack}
            className="mt-4 w-full bg-gray-400 hover:bg-gray-500 text-white py-4 rounded-lg font-semibold text-xl tracking-wide transition"
          >
            Back
          </button>
        </div>

        {/* Right: Image */}
        <div className="w-1/2 relative h-full">
          <Image
            src={img}
            alt="Blog Writing"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
