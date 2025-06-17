"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import img from "../../../public/addProfile.jpg";

export default function CreateProfile() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    state: "",
    city: "",
    zip: "",
    university: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("/server/profile/create", form);
      // or wherever your API route is
      router.push("/profile"); // redirect on success
    } catch (err) {
      console.error("Profile creation failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-6xl w-full flex rounded-none overflow-hidden h-[90vh]">
        <div className="w-1/2 p-12 flex flex-col justify-center ">
          <h1 className="text-5xl font-extrabold mb-12 text-blue-600 tracking-tight">
            Create Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            {[
              "firstname",
              "lastname",
              "state",
              "city",
              "zip",
              "university",
            ].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field[0].toUpperCase() + field.slice(1)}
                value={(form as any)[field]}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg placeholder-black"
              />
            ))}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold text-xl tracking-wide transition"
            >
              Create Profile
            </button>
          </form>
        </div>
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
