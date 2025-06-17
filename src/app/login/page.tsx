"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import img from "../../../public/LoginImg.jpg";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      interface LoginResponse {
        hasProfile: boolean;
      }

      const res = await axios.post("/server/clients/login", {
        email,
        password,
      });

      const data = res.data as LoginResponse;
      const hasProfile = data.hasProfile;

      setEmail("");
      setPassword("");

      if (hasProfile) {
        router.push("/profile");
      } else {
        router.push("/createProfile");
      }
    } catch (error: unknown) {
      console.error("error", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-6xl w-full flex rounded-none overflow-hidden h-[90vh]">
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <h1 className="text-5xl font-extrabold mb-12 text-blue-600 tracking-tight">
            Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg placeholder-black"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg placeholder-black"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold text-xl tracking-wide transition"
            >
              Login
            </button>
          </form>
        </div>

        <div className="w-1/2 relative h-full">
          <Image
            src={img}
            alt="Login Image"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </div>
    </div>
  );
}
