import { useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const EyeIcon = ({ open }) =>
  open ? (
    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.53-4.003M6.228 6.228A9.969 9.969 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-1.88 3.34M3 3l18 18" />
    </svg>
  );

const EditProfile = ({ user, onClose, onUpdate }) => {
  const { showToast } = useToast();

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
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setIsLoading(true);
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

      showToast("Profile updated successfully!", "success");
      onUpdate?.();
      onClose?.();
    } catch (err) {
      console.error("Failed to update profile:", err);
      showToast("Failed to update profile. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-md">
      <h2 className="text-xl font-bold mb-4 text-[#4caf50]">
        Edit Profile
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border px-4 py-2 rounded text-base focus:outline-none focus:ring-1 focus:ring-[#4caf50]"
          placeholder="Name"
        />

        {/* Password with show/hide toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border px-4 py-2 pr-10 rounded text-base focus:outline-none focus:ring-1 focus:ring-[#4caf50]"
            placeholder="New Password (optional)"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>

        <input
          name="budget"
          type="number"
          step="0.01"
          value={form.budget}
          onChange={handleChange}
          className="border px-4 py-2 rounded text-base focus:outline-none focus:ring-1 focus:ring-[#4caf50]"
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
                className={`h-16 w-16 rounded-full cursor-pointer border-4 ${form.profilePic === avatar
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
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#4caf50] text-white px-4 py-2 rounded text-sm hover:bg-[#388e3c] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {isLoading ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
