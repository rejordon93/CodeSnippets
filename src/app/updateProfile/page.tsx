import prisma from "@/database/prisma";
import Image from "next/image";
import img from "../../../public/updateProfile.jpg";
import Form from "next/form";

export default function UpdateProfile() {
  async function newProfile(formData: FormData) {
    "use server";

    const firstname = formData.get("firstname") as string;
    const lastname = formData.get("lastname") as string;
    const state = formData.get("state") as string;
    const city = formData.get("city") as string;
    const zip = formData.get("zip") as string;
    const university = formData.get("university") as string; // fixed string here

    const user = await prisma.user.findFirst({
      select: {
        id: true,
      },
    });

    if (!user || !user.id) {
      throw new Error("User not found or user ID is undefined");
    }

    await prisma.profile.update({
      where: {
        id: user.id,
      },
      data: {
        firstname,
        lastname,
        state,
        city,
        zip,
        university,
      },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-6xl w-full flex rounded-none overflow-hidden h-[90vh]">
        {/* Left: Form */}
        <div className="w-1/2 p-12 flex flex-col justify-center ">
          <h1 className="text-5xl font-extrabold mb-12 text-blue-600 tracking-tight">
            Create Profile
          </h1>
          <Form action={newProfile} className="space-y-8">
            <input
              type="text"
              id="firstname"
              name="firstname"
              placeholder="First Name"
              required
              className="w-full px-5 py-4 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg placeholder-black"
            />
            <input
              type="text"
              id="lastname"
              name="lastname"
              placeholder="Last Name"
              required
              className="w-full px-5 py-4 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg placeholder-black"
            />
            <input
              type="text"
              id="state"
              name="state"
              placeholder="State"
              required
              className="w-full px-5 py-4 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg placeholder-black"
            />
            <input
              type="text"
              id="city"
              name="city"
              placeholder="City"
              required
              className="w-full px-5 py-4 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg placeholder-black"
            />
            <input
              type="text"
              id="zip"
              name="zip"
              placeholder="Zip Code"
              required
              className="w-full px-5 py-4 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg placeholder-black"
            />
            <input
              type="text"
              id="university"
              name="university"
              placeholder="University"
              required
              className="w-full px-5 py-4 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg placeholder-black"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold text-xl tracking-wide transition"
            >
              Create Profile
            </button>
          </Form>
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
