import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import {
  FaEnvelope,
  FaUser,
  FaCalendarAlt,
  FaCamera,
} from "react-icons/fa";
import { updateProfile } from "firebase/auth";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { MdCancel } from "react-icons/md";


const ViewProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [openModal, setOpenModal] = useState(false);

  const [name, setName] = useState(user?.displayName || "");
  const [photo, setPhoto] = useState(user?.photoURL || "");


  // Update Profile

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      let imageURL = user?.photoURL;

      // Upload image to imagebb
      if (photo instanceof File) {
        const formData = new FormData();

        formData.append("image", photo);

        const imageUploadURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Host_API_Key}`;

        const imageRes = await fetch(imageUploadURL, {
          method: "POST",
          body: formData,
        });

        const imageData = await imageRes.json();

        imageURL = imageData.data.url;
      }

      // Update Firebase Profile
      await updateProfile(user, {
        displayName: name,
        photoURL: imageURL,
      });

      // Update DB
      await axiosSecure.patch("/users/profile", {
        displayName: name,
        photoURL: imageURL,
      });

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        showConfirmButton: false,
        timer: 1500,
      });

      setOpenModal(false);

    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Failed to update profile",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 border-b border-gray-200 pb-6">
          
          <img
            src={
              user?.photoURL ||
              "https://i.ibb.co/4pDNDk1/avatar.png"
            }
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border"
          />

          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {user?.displayName || "Unknown User"}
            </h1>

            <p className="text-gray-500 mt-1">
              User Account
            </p>
          </div>
        </div>

        {/* Information */}
        <div className="mt-8 space-y-5">

          {/* Email */}
          <div className="flex items-center gap-4">
            <div className="text-gray-600 text-lg">
              <FaEnvelope />
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>

              <h2 className="text-gray-900 font-medium break-all">
                {user?.email}
              </h2>
            </div>
          </div>

          {/* Username */}
          <div className="flex items-center gap-4">
            <div className="text-gray-600 text-lg">
              <FaUser />
            </div>

            <div>
              <p className="text-sm text-gray-500">Username</p>

              <h2 className="text-gray-900 font-medium">
                {user?.displayName || "Not Available"}
              </h2>
            </div>
          </div>

          {/* Joined */}
          <div className="flex items-center gap-4">
            <div className="text-gray-600 text-lg">
              <FaCalendarAlt />
            </div>

            <div>
              <p className="text-sm text-gray-500">Joined</p>

              <h2 className="text-gray-900 font-medium">
                {user?.metadata?.creationTime
                  ? new Date(
                      user.metadata.creationTime
                    ).toLocaleDateString()
                  : "N/A"}
              </h2>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="mt-8">
          <button
            onClick={() => setOpenModal(true)}
            className="px-5 py-2 bg-mist-700 text-white rounded-lg hover:bg-black cursor-pointer"
          >
            Edit Profile
          </button>
        </div>
      </div>

   

    {/* Edit profile Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
          
          <div className="bg-white w-full max-w-md rounded-xl p-6 relative">

            {/* Close */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute right-4 top-3 text-2xl cursor-pointer"
            >
              <MdCancel />
            </button>

            <h1 className="text-2xl font-semibold mb-6">
              Edit Profile
            </h1>

            <form
              onSubmit={handleUpdateProfile}
              className="space-y-5"
            >
              {/* Name */}
              <div>
                <label className="block mb-2 text-sm text-gray-600">
                  Username
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none"
                />
              </div>

              {/* Photo */}
              <div>
                <label className="block mb-2 text-sm text-gray-600">
                  Profile Photo
                </label>

                <label className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer">
                  <FaCamera className="text-2xl text-gray-500 mb-2" />

                  <input
                    className="ml-20"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setPhoto(e.target.files[0])
                    }
                  />
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 border rounded-lg cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white rounded-lg cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProfile;