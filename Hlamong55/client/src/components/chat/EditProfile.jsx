import { useState } from "react";
import axiosInstance from "../../lib/axios";

const EditProfile = ({
  isOpen,
  setIsOpen,
}) => {

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  const [name, setName] = useState(
    currentUser?.name || ""
  );

  const [phone, setPhone] = useState(
    currentUser?.phone || ""
  );

  const [bio, setBio] = useState(
    currentUser?.bio || ""
  );

  const [avatar, setAvatar] = useState("");
  const [preview, setPreview] = useState(
    currentUser?.avatar || ""
  );


  const handleImageChange = (e) => {

    const file = e.target.files[0];
    if (!file) return;


    const reader = new FileReader();
    reader.readAsDataURL(file);


    reader.onloadend = () => {

      setAvatar(reader.result);
      setPreview(reader.result);
    };
  };


  const handleSave = async () => {

    try {
      const response =
        await axiosInstance.put(
          "/auth/update-profile",
          {
            userId: currentUser.id,
            name,
            phone,
            bio,
            avatar,
          }
        );


      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );


      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  if (!isOpen) return null;


  return (

    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-base-100 p-6 rounded-2xl max-w-xl">

        <h2 className="text-2xl font-bold mb-5">
          Edit Profile
        </h2>


        <div className="flex justify-center mb-5">

          <div className="avatar">

            <div className="w-32 rounded-full ring ring-success ring-offset-2">

              <img
                src={
                  preview ||
                  "https://i.pravatar.cc/100"
                }
                alt="preview"
              />

            </div>

          </div>

        </div>


        <div className="space-y-4">

          <input
            type="file"
            className="file-input file-input-bordered w-full"
            onChange={handleImageChange}
          />


          <input
            type="text"
            placeholder="Update Name"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />


          <input
            type="text"
            placeholder="Phone Number"
            className="input input-bordered w-full"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />


          <textarea
            placeholder="Bio / Status"
            className="textarea textarea-bordered w-full"
            value={bio}
            onChange={(e) =>
              setBio(e.target.value)
            }
          ></textarea>

        </div>


        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={() => setIsOpen(false)}
            className="btn rounded-lg border border-primary hover:scale-105 transition"
          >
            Cancel
          </button>


          <button
            onClick={handleSave}
            className="btn btn-primary rounded-lg hover:bg-violet-900 hover:scale-105 transition"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
};

export default EditProfile;