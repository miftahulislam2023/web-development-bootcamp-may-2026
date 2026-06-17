"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ImageIcon, Pencil, UserIcon, X } from "lucide-react";
import Image from "next/image";
import ProfileDetailsSkeleton from "./ProfileDetailsSkeleton";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import updateProfile from "@/actions/updateProfile";
import useProfileDetails from "@/hooks/useProfileDetails";

const ProfileDetails = () => {
  const { data: profile, isLoading } = useProfileDetails();

  const [editMode, setEditMode] = useState<boolean>(false);
  const [profileInfo, setProfileInfo] = useState<{
    name: string;
    bio: string;
    photo: null | File;
    imageUrl: string;
  }>({ name: "", bio: "", photo: null, imageUrl: "" });
  const [fileError, setFileError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE = 0.1 * 1024 * 1024; // 100kb
    const allowed_types = ["image/png", "image/jpeg", "image/jpg"];
    const selectedFile = e.target.files?.[0] ?? null;
    if (!selectedFile) return;

    if (profileInfo.imageUrl) URL.revokeObjectURL(profileInfo.imageUrl);
    const imageUrl = URL.createObjectURL(selectedFile);

    setEditMode(true);
    setProfileInfo({
      name: profileInfo.name
        ? profileInfo.name
        : profile?.name
          ? profile.name
          : "",
      bio: profileInfo.bio
        ? profileInfo.bio
        : profile?.bio
          ? profile.bio
          : "Hey there! I am using Dialog.",

      photo: selectedFile,
      imageUrl,
    });
    setFileError("");

    if (!allowed_types.includes(selectedFile.type)) {
      setFileError("Only JPG, JPEG, and PNG image files are allowed.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError("Image must be under 100 KB");
      return;
    }
  };

  const removePhoto = () => {
    if (profileInfo.imageUrl) URL.revokeObjectURL(profileInfo.imageUrl);
    setProfileInfo((prev) => ({
      ...prev,
      photo: null,
      imageUrl: "",
    }));
    setFileError(null);
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    const res = await updateProfile(profileInfo);
    setLoading(false);

    if (res.success) {
      if (profileInfo.imageUrl) URL.revokeObjectURL(profileInfo.imageUrl);
      setEditMode(false);
      setProfileInfo({ name: "", bio: "", photo: null, imageUrl: "" });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully!", {
        className:
          "bg-[#00875F] text-white rounded-md shadow-md px-4 py-2 text-sm",
        progressClassName: "bg-white/50",
      });
    } else {
      toast.error(res.message, {
        className:
          "bg-[#C53030] text-white rounded-md shadow-md px-4 py-2 text-sm",
        progressClassName: "bg-white/50",
      });
    }
  };

  const handleEdit = () => {
    setProfileInfo((prev) => ({
      ...prev,
      name: profile?.name || "",
      bio: profile?.bio || "Hey there! I am using Dialog.",
    }));
    setEditMode(true);
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-left duration-200">
      <header className="flex h-27 items-end bg-white px-6 pb-4">
        <div className="flex items-center gap-6">
          <Link href="/rooms">
            <ArrowLeft className="h-6 w-6 text-[#54656f] cursor-pointer" />
          </Link>
          <h1 className="text-xl font-medium text-[#111b21]">Profile</h1>
        </div>
      </header>
      {isLoading ? (
        <ProfileDetailsSkeleton />
      ) : (
        <div className="flex-1 bg-[#f0f2f5] overflow-y-auto custom-scrollbar">
          <div className="flex flex-col items-center py-7 bg-white">
            <button
              type="button"
              onClick={removePhoto}
              className={`p-2 mb-1 hover:bg-white hover:shadow-sm rounded-full text-slate-400 hover:text-red-500 transition-all cursor-pointer ${profileInfo.imageUrl ? "" : "hidden"}`}
              title="Remove photo"
            >
              <X size={18} />
            </button>
            <div className="relative group cursor-pointer">
              {profileInfo.imageUrl ? (
                <Image
                  src={profileInfo.imageUrl}
                  alt="Profile"
                  className="rounded-full h-50 w-50 object-cover"
                  height={200}
                  width={200}
                />
              ) : profile?.image ? (
                <Image
                  src={profile.image}
                  alt="Profile"
                  className="rounded-full h-50 w-50 object-cover"
                  height={200}
                  width={200}
                />
              ) : (
                <div className="h-50 w-50 rounded-full overflow-hidden bg-[#dfe5e7] flex items-center justify-center">
                  <UserIcon className="h-20 w-20 text-white" />
                </div>
              )}

              <label
                htmlFor="photo"
                className="absolute inset-0 bg-black/30 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <ImageIcon className="h-6 w-6 mb-2" />
                <span className="text-xs uppercase text-center px-4">
                  Change profile picture
                </span>
              </label>
            </div>

            <input
              type="file"
              accept="image/*"
              name="photo"
              id="photo"
              className="hidden"
              onChange={(e) => handleFileChange(e)}
            />
          </div>
          <div className="bg-white px-8 py-4 mb-3">
            <p className="text-[#008069] text-sm mb-4">Your name</p>
            <div className="flex justify-between items-center border-b border-transparent hover:border-[#d1d7db] pb-2">
              {editMode ? (
                <input
                  type="text"
                  value={profileInfo.name}
                  onChange={(e) =>
                    setProfileInfo((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="text-base text-[#111b21] bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-0 m-0 w-full"
                />
              ) : (
                <>
                  <span className="text-base text-[#111b21]">
                    {profile?.name}
                  </span>

                  <Pencil
                    className="h-5 w-5 text-[#54656f] cursor-pointer"
                    onClick={handleEdit}
                  />
                </>
              )}
            </div>
          </div>
          <div className="bg-white px-8 py-4 mb-3">
            <p className="text-[#667781] text-sm mb-4">About</p>
            <div className="flex justify-between items-center">
              {editMode ? (
                <input
                  type="text"
                  value={profileInfo.bio}
                  onChange={(e) =>
                    setProfileInfo((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className="text-base text-[#111b21] bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-0 m-0 w-full"
                />
              ) : (
                <>
                  <span className="text-base text-[#111b21]">
                    {profile?.bio
                      ? profile.bio
                      : "Hey there! I am using Dialog."}
                  </span>
                  <Pencil
                    className="h-5 w-5 text-[#54656f] cursor-pointer"
                    onClick={handleEdit}
                  />
                </>
              )}
            </div>
          </div>
          {fileError && (
            <p className="text-red-500 text-xs mt-1 ml-8 mb-2">{fileError}</p>
          )}

          {(profileInfo.name || profileInfo.bio || profileInfo.photo) && (
            <button
              disabled={!!fileError || loading}
              className={`bg-[#008069] ml-8 hover:bg-[#006d5b] text-white text-sm font-medium px-4 py-2 rounded-md transition-colors duration-200 ${
                fileError || loading
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={handleUpdateProfile}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;
