import Image from "next/image";
import img from "../../../public/updateProfile.jpg";
import prisma from "@/database/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Server Action defined outside component
async function editProfile(formData: FormData) {
  "use server";

  const firstname = formData.get("firstname") as string;
  const lastname = formData.get("lastname") as string;
  const state = formData.get("state") as string;
  const city = formData.get("city") as string;
  const zip = formData.get("zip") as string;
  const university = formData.get("university") as string;

  const user = await prisma.user.findFirst({
    select: { id: true },
  });

  if (!user || !user.id) {
    throw new Error("User not found or user ID is undefined");
  }

  await prisma.profile.update({
    where: { userId: user.id },
    data: {
      firstname,
      lastname,
      state,
      city,
      zip,
      university,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/profile"); //  revalidate profile page
}
async function backBtn() {
  "use server";
  redirect("/profile");
}

export default function EditProfile() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-6xl w-full flex rounded-none overflow-hidden h-[90vh]">
        {/* Left: Form + Buttons */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <h1 className="text-5xl font-extrabold mb-12 text-blue-600 tracking-tight">
            Edit Profile
          </h1>
          <form action={editProfile} className="space-y-8">
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
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                required
                className="w-full px-5 py-4 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg placeholder-black"
              />
            ))}

            {/* Update button */}
            <div className="flex justify-between gap-4">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold text-xl tracking-wide transition"
              >
                Update Profile
              </button>
            </div>
          </form>

          {/* Back button, separate form, nicely styled */}
          <form action={backBtn} className="mt-6 w-full">
            <button
              type="submit"
              className="w-full bg-gray-300 hover:bg-gray-400 text-black py-4 rounded-lg font-semibold text-xl tracking-wide transition"
            >
              Back
            </button>
          </form>
        </div>

        {/* Right: Image */}
        <div className="w-1/2 relative h-full">
          <Image
            src={img}
            alt="Update Profile"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </div>
    </div>
  );
}
