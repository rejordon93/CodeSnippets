"use client";

import React, { useState } from "react";
import Image from "next/image";
import img from "../../../public/SignUpProfle.jpg";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post("/api/signup", {
        username,
        email,
        password,
      });

      if (res.status === 201 || res.status === 200) {
        // Signup success, redirect to login
        router.push("/login");
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-6xl w-full flex rounded-none overflow-hidden h-[90vh]">
        {/* Left: Form */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <h1 className="text-5xl font-extrabold mb-12 text-blue-600 tracking-tight">
            Sign Up
          </h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg placeholder-black"
              disabled={loading}
            />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg placeholder-black"
              disabled={loading}
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="New password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg placeholder-black"
              disabled={loading}
            />
            {error && (
              <p className="text-red-600 text-center font-medium">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold text-xl tracking-wide transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        </div>

        {/* Right: Image */}
        <div className="w-1/2 relative h-full">
          <Image
            src={img}
            alt="Sign Up"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </div>
    </div>
  );
}
