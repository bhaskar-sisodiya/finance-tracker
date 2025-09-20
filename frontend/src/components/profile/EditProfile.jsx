import { useState } from "react";
import axios from "axios";

const EditProfile = ({ user, onClose, onUpdate }) => {
  const avatarChoices = [
    "/images/avatars/avatar1.png",
    "/images/avatars/avatar2.png",
    "/images/avatars/avatar3.png",
    "/images/avatars/avatar4.png",
    "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  ];

  const [form, setForm] = useState({
    name: user?.name || "",
    password: "",
    budget: user?.budget || "",
    profilePic: user?.profilePic || avatarChoices[0],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const submitPayload = { ...form };
      if (!submitPayload.password) delete submitPayload.password;

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/update`,
        submitPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Profile updated!");
      onUpdate?.();
      onClose?.();
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-md">
      {" "}
      {/* widened from max-w-sm to max-w-md */}
      <h2 className="text-xl font-bold mb-4 text-[#4caf50]">
        Edit Profile
      </h2>{" "}
      {/* increased font size */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border px-4 py-2 rounded text-base" // more padding and font size
          placeholder="Name"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="border px-4 py-2 rounded text-base"
          placeholder="New Password (optional)"
        />
        <input
          name="budget"
          value={form.budget}
          onChange={handleChange}
          className="border px-4 py-2 rounded text-base"
          placeholder="Monthly Budget"
        />
        <div>
          <p className="text-sm text-gray-600 mb-2">Choose Avatar:</p>
          <div className="flex gap-3 flex-wrap">
            {avatarChoices.map((avatar) => (
              <img
                key={avatar}
                src={avatar}
                alt="Avatar"
                className={`h-16 w-16 rounded-full cursor-pointer border-4 ${
                  form.profilePic === avatar
                    ? "border-[#4caf50]"
                    : "border-transparent"
                }`}
                onClick={() => setForm({ ...form, profilePic: avatar })}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#4caf50] text-white px-4 py-2 rounded text-sm"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
