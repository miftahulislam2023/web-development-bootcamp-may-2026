import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import {
  User,
  Mail,
  Save,
  ShieldCheck,
  MapPin,
  Calendar,
  Link as LinkIcon,
  Edit3,
} from "lucide-react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
 import { LazyLoadImage } from "react-lazy-load-image-component";

const Profile = () => {
  const { user, updateUser, loading: authLoading } = useAuth(); // updateUser = updateUserProfile function
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    displayName: "",
    photoURL: "",
    email: "",
  });

  // Load user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Firebase Profile Update
      await updateUser(formData.displayName, formData.photoURL);

      // 2. Force Reload User Data to reflect changes immediately
      if (user) {
        await user.reload(); // Firebase user reload
      }

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile information has been updated successfully.",
        background: "#1a1a1a",
        color: "#fff",
        showConfirmButton: false,
        timer: 1500,
      });

      // 3. Close Edit Mode
      setIsEditing(false);

      // Note: Since user.reload() doesn't always trigger a re-render in React Context immediately,
      // the local 'formData' state is already showing the new values, so the UI will look updated.
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not update profile. " + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading Spinner
  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-blue-500/10 rounded-full blur-[120px] -z-10" />

      {/* --- Main Profile Card --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-base-100/80 backdrop-blur-2xl border border-base-content/10 rounded-[3rem] shadow-2xl overflow-hidden"
      >
        {/* Header / Banner */}
        <div className="relative h-48 bg-linear-to-r from-gray-900 to-black overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
          <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-transparent" />

          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-6 right-6 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-bold text-sm flex items-center gap-2 hover:bg-white/20 transition-all"
          >
            {isEditing ? <XIcon /> : <Edit3 size={16} />}
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </button>
        </div>

        <div className="px-8 pb-12">
          {/* --- Avatar Section --- */}
          <div className="relative -mt-20 mb-8 flex flex-col md:flex-row items-end md:items-center gap-6">
            <div className="relative group">
              <div className="w-40 h-40 rounded-[2.5rem] p-1.5 bg-base-100 shadow-xl">
                {/* Use formData.photoURL here for instant preview */}
                <LazyLoadImage
                  src={formData.photoURL || "https://i.ibb.co/5GzXkwq/user.png"}
                  alt="Profile"
                  className="w-full h-full rounded-4xl object-cover border border-base-content/5"
                  effect="blur"
                  onError={(e) =>
                    (e.target.src = "https://i.ibb.co/5GzXkwq/user.png")
                  }
                />
              </div>
              <div
                className="absolute bottom-4 -right-2.5 w-6 h-6 bg-green-500 border-4 border-base-100 rounded-full"
                title="Online"
              />
            </div>

            <div className="mb-4 md:mb-0">
              {/* Use formData.displayName here for instant preview */}
              <h1 className="text-3xl md:text-4xl font-black text-base-content leading-tight">
                {formData.displayName || "User"}
              </h1>
              <div className="flex items-center gap-3 mt-2 text-base-content/60 font-medium text-sm">
                <span className="flex items-center gap-1">
                  <Mail size={14} /> {formData.email || "No Email"}
                </span>
                <span className="w-1 h-1 bg-base-content/30 rounded-full" />
                <span className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck size={12} /> Pro Member
                </span>
              </div>
            </div>
          </div>

          {/* --- Form Section --- */}
          <form onSubmit={handleUpdate} className="grid lg:grid-cols-12 gap-10">
            {/* Left: Inputs */}
            <div className="lg:col-span-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <ProfileInput
                  label="Full Name"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  icon={User}
                  disabled={!isEditing}
                />
                <ProfileInput
                  label="Email Address"
                  value={formData.email}
                  icon={Mail}
                  disabled={true}
                  opacity="opacity-60 cursor-not-allowed"
                />
                <div className="md:col-span-2">
                  <ProfileInput
                    label="Photo URL"
                    value={formData.photoURL}
                    onChange={(e) =>
                      setFormData({ ...formData, photoURL: e.target.value })
                    }
                    icon={LinkIcon}
                    disabled={!isEditing}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-4"
                >
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-red-700 transition-all hover:-translate-y-1 disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <Save size={18} />
                    )}
                    Save Changes
                  </button>
                </motion.div>
              )}
            </div>

            {/* Right: Info / Stats */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl bg-base-200/50 border border-base-content/5">
                <h3 className="text-sm font-bold uppercase tracking-widest text-base-content/40 mb-4">
                  Account Info
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-base-100 flex items-center justify-center text-base-content/60">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-base-content/50 uppercase font-bold">
                        Joined
                      </p>
                      <p className="font-bold text-sm">
                        {user?.metadata?.creationTime
                          ? new Date(user.metadata.creationTime).toDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-base-100 flex items-center justify-center text-base-content/60">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-base-content/50 uppercase font-bold">
                        Location
                      </p>
                      <p className="font-bold text-sm">Bangladesh</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// --- Helper Components ---
const ProfileInput = ({
  label,
  value,
  onChange,
  icon: Icon,
  disabled,
  placeholder,
  opacity = "",
}) => (
  <div className={`space-y-2 ${opacity}`}>
    <label className="text-xs font-bold uppercase tracking-widest text-base-content/50 ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-primary transition-colors">
        <Icon size={18} />
      </div>
      <input
        type="text"
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`
          w-full pl-12 pr-4 py-3.5 rounded-2xl bg-base-200/50 border-2 border-transparent 
          text-base-content font-medium transition-all outline-none
          ${
            disabled
              ? "border-transparent bg-base-200/30 text-base-content/60"
              : "focus:border-primary/50 focus:bg-base-100"
          }
        `}
      />
    </div>
  </div>
);

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export default Profile;
