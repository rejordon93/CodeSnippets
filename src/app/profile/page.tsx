"use client";
import Image from "next/image";
import img from "../../../public/profile.jpg";
import { FiEdit } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type UserProfileType = {
  firstname: string;
  lastname: string;
  state: string;
  city: string;
  zip: string;
  university: string;
};
type AcceptedFriend = {
  id: number;
  recipient: {
    username: string;
    isOnline: boolean;
  };
};

type FriendRequestType = {
  id: number;
  senderId: number;
  senderName: string;
  // ... add other relevant fields if needed
};

export default function Profile() {
  const [userProfile, setUserProfile] = useState<UserProfileType>();
  const [friendRequests, setFriendRequests] = useState<FriendRequestType[]>([]);
  const [friendList, setFriendList] = useState<AcceptedFriend[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const res = await axios.get("/server/profile/get");
        setUserProfile(res.data as UserProfileType);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    getProfileData();
  }, []);

  useEffect(() => {
    const getFriendRequest = async () => {
      try {
        const res = await axios.get("/server/addFriends/get");
        console.log("Friend Requests:", res.data);
        setFriendRequests(res.data.data);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };
    getFriendRequest();
  }, []);

  useEffect(() => {
    const fetchAcceptedFriends = async () => {
      try {
        const res = await axios.get("/server/addFriends/getFriendsList");
        setFriendList(res.data.data);
      } catch (err) {
        console.error("Error fetching accepted friends:", err);
      }
    };

    fetchAcceptedFriends();
  }, []);

  const handleLogout = async () => {
    const res = axios.delete("/server/clients/logout");
    router.push("/");
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-20">
      <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden max-w-6xl w-full">
        {/* Left: Profile Info */}
        <div className="relative w-full md:w-1/2 p-14 flex flex-col justify-center">
          {/* Edit Icon */}
          <div className="absolute top-6 right-6">
            <button
              className="text-blue-600 hover:text-blue-800 transition"
              aria-label="Edit Profile"
              onClick={() => navigateTo("/editProfile")}
            >
              <FiEdit size={24} />
            </button>
          </div>

          {/* Heading */}
          <h1 className="text-5xl mb-10 text-blue-700 tracking-tight font-[var(--font-geist-sans)] text-center md:text-left">
            Profile
          </h1>

          {/* Profile Fields */}
          {userProfile ? (
            <div className="space-y-6 font-[var(--font-geist-sans)] text-gray-800 text-xl pb-24">
              <div className="space-y-6">
                <div className="flex justify-between">
                  <span className="font-semibold">First Name:</span>
                  <span>{userProfile.firstname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Last Name:</span>
                  <span>{userProfile.lastname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">City:</span>
                  <span>{userProfile.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">State:</span>
                  <span>{userProfile.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Zip Code:</span>
                  <span>{userProfile.zip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">University:</span>
                  <span>{userProfile.university}</span>
                </div>
              </div>

              {/* Bottom-left Button */}
              <div className="absolute bottom-0 left-0 w-full px-8 pb-8">
                <div className="flex justify-start max-w-4xl mx-auto gap-4">
                  <button
                    onClick={() => navigateTo("/snippet")}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow hover:bg-blue-700 transition-transform transform hover:scale-105"
                  >
                    Add Snippets
                  </button>
                  <button
                    onClick={handleLogout}
                    className="mt-6 px-6 py-3 bg-red-500 text-white text-lg rounded-lg shadow hover:bg-red-600 hover:shadow-md transition-transform transform hover:scale-105 flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-11V4m0 4h-1"
                      />
                    </svg>
                    Logout
                  </button>

                  {/* Single Friend Requests Button */}
                  {friendRequests.length > 0 && (
                    <button
                      onClick={() => navigateTo("/friendRequest")}
                      className="relative mt-6 px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow hover:bg-blue-700 transition-transform transform hover:scale-105"
                    >
                      Friend Requests
                      <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {friendRequests.length}
                      </span>
                    </button>
                  )}
                  {friendList.length > 0 && (
                    <button
                      onClick={() => navigateTo("/friendList")}
                      className="relative mt-6 px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow hover:bg-green-700 transition-transform transform hover:scale-105"
                    >
                      Friend List
                      <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                        {friendList.length}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-xl text-center">
              No profile found.
            </p>
          )}
        </div>

        {/* Right: Image */}
        <div className="relative w-full md:w-1/2 h-[600px] md:h-auto">
          <Image
            src={img}
            alt="Profile Image"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
