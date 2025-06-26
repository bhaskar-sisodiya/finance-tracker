import { useState, useEffect } from "react";
import axios from "axios";
import EditProfile from "../components/EditProfile"; // your reusable form

const EditProfilePage = () => {
  const [user, setUser] = useState(null);

  // Fetch user info from backend
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) {
    return <p className="text-center mt-10 text-white">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-[#4caf50]/10 flex items-center justify-center">
      <EditProfile
        user={user}
        onUpdate={fetchUser} // optional: re-fetch after editing
        onClose={() => window.history.back()} // returns to previous page
      />
    </div>
  );
};

export default EditProfilePage;