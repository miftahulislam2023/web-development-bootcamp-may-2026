import { useContext, useState } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import { updateProfile } from "firebase/auth";
import auth from "../firebase/firebase.config";
import { toast } from "react-toastify";
import axios from "axios";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || "");
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);

    let updatedPhotoURL = user.photoURL;

    if (photoFile) {
      const formData = new FormData();
      formData.append("image", photoFile);

      try {
        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=d6d69d6d3d1835a58c3edf001ecc0c25`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        updatedPhotoURL = res.data.data.display_url;
      } catch {
        toast.error("Photo upload failed. Try again.");
        setSaving(false);
        return;
      }
    }

    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: updatedPhotoURL,
      });

      const updatedUser = {
        ...user,
        displayName: name,
        photoURL: updatedPhotoURL,
      };
      await axios.put(`https://cashnivo.vercel.app/users/${user.email}`, {
        displayName: name,
        photoURL: updatedPhotoURL,
      });

      setUser(updatedUser);
      toast.success("Profile updated successfully!");
      setEditing(false);
      setPhotoFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-2">
      <div className="bg-base-200 border-2 border-base-300 rounded-lg p-6 w-full max-w-xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="avatar">
              <div className="w-24 h-24 rounded-full ring ring-red-500 ring-offset-base-100 ring-offset-2 overflow-hidden">
                <img src={user?.photoURL || "/default-avatar.png"} alt="User avatar" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-base-content">{user?.displayName || "User"}</h2>
              <p className="text-sm text-base-content/70">{user?.email || "no-email@example.com"}</p>
            </div>
          </div>

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Name</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full bg-base-100 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <input
                  value={user?.email || ""}
                  disabled
                  className="input input-bordered w-full bg-base-100 cursor-not-allowed opacity-70"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Profile Photo</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="file-input file-input-bordered w-full bg-base-100"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn bg-linear-to-r from-blue-600 to-cyan-600 text-white w-full sm:w-auto border-none"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="btn btn-outline w-full sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="btn bg-linear-to-r from-blue-600 to-cyan-600 text-white w-full border-none"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
