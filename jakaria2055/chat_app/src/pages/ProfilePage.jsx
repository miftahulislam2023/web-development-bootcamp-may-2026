import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../store/AuthStore";
import { ArrowLeft, Upload, Save, User, FileText } from "lucide-react";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedImgPreview, setSelectedImgPreview] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setSelectedImg(file);
      setSelectedImgPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!selectedImg) {
        await updateProfile({ fullName: name, bio });
        navigate("/");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(selectedImg);
      reader.onload = async () => {
        const base64Image = reader.result;
        await updateProfile({ profilePic: base64Image, fullName: name, bio });
        navigate("/");
      };
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
      style={{ 
        backgroundImage: "url('/api/placeholder/1920/1080')",
        // Replace with your actual background image path
      }}
    >
      <div className="w-full max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-4 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Chat</span>
        </button>

        {/* Main Card */}
        <div className="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left Side - Profile Image */}
            <div className="lg:w-1/3 bg-white/5 backdrop-blur-sm p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/20">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <img
                  src={
                    selectedImgPreview ||
                    authUser?.profilePic ||
                    assets.avatar_icon
                  }
                  alt="Profile"
                  className="relative w-40 h-40 rounded-full object-cover ring-4 ring-white/30 shadow-xl transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              
              <h2 className="mt-6 text-white text-xl font-semibold text-center">
                {name || authUser?.fullName}
              </h2>
              <p className="text-gray-300 text-sm text-center mt-1">
                {bio || "No bio added yet"}
              </p>
              
              <div className="mt-6 text-center">
                <span className="inline-block px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-xs">
                  {authUser?.email}
                </span>
              </div>
            </div>

            {/* Right Side - Edit Form */}
            <div className="lg:w-2/3 p-8">
              <h3 className="text-white text-xl font-semibold mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" />
                Edit Profile Details
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Upload Image */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Profile Picture
                  </label>
                  <label
                    htmlFor="avatar"
                    className="flex items-center gap-4 p-3 bg-white/10 border border-white/20 rounded-xl cursor-pointer hover:bg-white/20 transition-all duration-300 group"
                  >
                    <input
                      onChange={handleImageSelect}
                      type="file"
                      id="avatar"
                      accept=".png, .jpg, .jpeg, .gif"
                      hidden
                    />
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                      {selectedImgPreview ? (
                        <img
                          src={selectedImgPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm group-hover:text-purple-300 transition-colors">
                        Click to upload new image
                      </p>
                      <p className="text-gray-400 text-xs">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </label>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Bio
                  </label>
                  <textarea
                    onChange={(e) => setBio(e.target.value)}
                    value={bio}
                    required
                    placeholder="Write something about yourself..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none"
                    rows={4}
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    {bio.length}/200 characters
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;