import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";

const EyeIcon = ({ open }) =>
  open ? (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.53-4.003M6.228 6.228A9.969 9.969 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-1.88 3.34M3 3l18 18" />
    </svg>
  );

const EditProfile = ({ user, onClose, onUpdate }) => {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [historicalData, setHistoricalData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

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
    confirmPassword: "",
    budget: user?.budget || "",
    profilePic: user?.profilePic || avatarChoices[0],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const currentYear = new Date().getFullYear();
      const yearsToFetch = [currentYear, currentYear - 1]; // Current and Last year
      let allData = [];

      for (const year of yearsToFetch) {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/expenses/yearly-summary/${year}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Add year info to each month and filter out months with no activity
        const filtered = res.data
          .filter(m => m.debit > 0 || m.credit > 0 || m.budget > 0)
          .map(m => ({ ...m, year }));
        allData = [...allData, ...filtered];
      }

      // Sort by date descending
      allData.sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });

      setHistoricalData(allData);
    } catch (err) {
      console.error("Failed to fetch historical data:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password && form.password !== form.confirmPassword) {
      return showToast("Passwords do not match!", "error");
    }

    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const submitPayload = { ...form };
      delete submitPayload.confirmPassword;
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
      fetchHistory(); // Re-fetch history to reflect budget changes immediately
      setIsEditing(false);
      setForm({ ...form, password: "", confirmPassword: "" });
    } catch (err) {
      console.error("Failed to update profile:", err);
      showToast("Failed to update profile. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getMonthName = (num) => {
    return new Date(0, num - 1).toLocaleString('default', { month: 'short' });
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6 p-4">
      {/* Profile Card */}
      <div className="relative group mx-auto w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>

        <div className="relative bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Edit Profile" : "Profile Details"}
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm font-bold text-green-600 hover:text-green-700 flex items-center gap-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-green-500/20 p-1">
                  <img
                    src={user?.profilePic || avatarChoices[0]}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover bg-gray-50"
                  />
                </div>
              </div>

              <div className="w-full space-y-4">
                <div className="flex flex-col items-center">
                  <p className="text-xl font-bold text-gray-900">{user?.name}</p>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Monthly Budget</p>
                    <p className="text-lg font-bold text-green-600">₹{user?.budget?.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Status</p>
                    <p className="text-lg font-bold text-blue-600">Active</p>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full mt-2 py-2.5 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
              >
                Go Back
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  placeholder="Name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full border border-gray-200 px-4 py-2.5 pr-10 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      tabIndex={-1}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Confirm Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-4 py-2.5 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Default Monthly Budget</label>
                <input
                  name="budget"
                  type="number"
                  step="0.01"
                  value={form.budget}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  placeholder="Budget"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2">Choose Avatar</p>
                <div className="flex gap-2 flex-wrap">
                  {avatarChoices.map((avatar) => (
                    <img
                      key={avatar}
                      src={avatar}
                      alt="Avatar"
                      className={`h-12 w-12 rounded-full cursor-pointer border-2 transition-all ${form.profilePic === avatar
                        ? "border-green-500 scale-110 shadow-md"
                        : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      onClick={() => setForm({ ...form, profilePic: avatar })}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-100 flex items-center gap-2 disabled:opacity-60"
                >
                  {isLoading && (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  )}
                  {isLoading ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Historical Data Section */}
      <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl border border-white/20">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Historical Performance</h3>
        </div>

        <div className="overflow-x-auto">
          {loadingHistory ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse flex space-x-4">
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : historicalData.length === 0 ? (
            <p className="text-center py-8 text-gray-500 italic">No historical data found yet.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Budget</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Debit (Expense)</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Credit (Income)</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {historicalData.map((row, idx) => {
                  const diff = row.budget - row.debit + row.credit;
                  const isPositive = diff >= 0;
                  return (
                    <tr key={`${row.year}-${row.month}`} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-bold text-gray-900">{getMonthName(row.month)}</span>
                        <span className="ml-2 text-xs font-medium text-gray-400">{row.year}</span>
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-gray-600">₹{row.budget.toLocaleString()}</td>
                      <td className="py-4 px-4 text-right font-medium text-red-500">₹{row.debit.toLocaleString()}</td>
                      <td className="py-4 px-4 text-right font-medium text-green-600">₹{row.credit.toLocaleString()}</td>
                      <td className={`py-4 px-4 text-right font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : ''}₹{diff.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
