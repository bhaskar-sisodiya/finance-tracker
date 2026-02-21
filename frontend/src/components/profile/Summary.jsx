import { useDispatch, useSelector } from "react-redux";
import { recalculateSummary } from "../../store/summarySlice";
import { fetchUser } from "../../store/userSlice";
import { useState } from "react";
import { Link } from "react-router-dom";
import ExpensePieChart from "../charts/ExpensePieChart";

const Summary = ({ summary, user, onToggleView, view, expenses }) => {
  const dispatch = useDispatch();
  const summaryLoading = useSelector((state) => state.summary.loading);
  const [isHovered, setIsHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRecalculate = async () => {
    await dispatch(recalculateSummary()).unwrap();
    // Refresh user profile in case savings/deficit updated on the user object
    dispatch(fetchUser());
  };

  return (
    <>
      <div className="w-full h-full rounded-3xl overflow-hidden shadow-sm flex flex-col">
        {/* user header */}
        <div className="user-info bg-[#4caf50] p-4 flex items-center gap-4">
          <div className="profile-img flex flex-col items-center">
            <img
              src={user?.profilePic || "/default-avatar.png"}
              alt="profile"
              className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover bg-white"
            />
            <Link
              to="/edit-profile"
              className="text-[11px] sm:text-[13px] text-white hover:text-black mt-1"
            >
              Edit Profile
            </Link>
          </div>

          <div className="flex-1">
            <h1 className="text-white text-lg sm:text-2xl font-semibold">
              {user?.name || "User"}
            </h1>
          </div>
        </div>

        <hr className="border-white border-t-2" />

        {/* summary stats + desktop buttons */}
        <div className="user-summary bg-[#4caf50] text-white p-4 flex flex-col justify-between lg:h-[250px]">
          <div className="space-y-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl sm:text-2xl lg:text-xl font-semibold">
                Summary
              </h2>
              <button
                onClick={handleRecalculate}
                disabled={summaryLoading}
                title="Recalculate Till Date"
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition disabled:opacity-50"
              >
                <svg
                  className={`w-4 h-4 text-white ${summaryLoading ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-1 text-xs sm:text-sm lg:text-sm">
              <p>Total Balance = ₹{summary?.totalBalance ?? "--"}</p>
              <p>Remaining Balance = ₹{summary?.remainingBalance ?? "--"}</p>
              <p>Savings = ₹{summary?.savings ?? "--"}</p>
              <p>Deficit = ₹{summary?.deficit ?? "--"}</p>
            </div>
          </div>

          {/* desktop-only toggle button */}
          <div className="mt-4 hidden lg:flex justify-center">
            <button
              onClick={onToggleView}
              type="button"
              className="flex items-center gap-2 pt-2 pb-2 px-6 text-[#22a127] hover:text-white bg-white hover:bg-[#007d04] rounded-3xl transition font-medium"
            >
              {view === "form" ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 6h18M3 14h10" />
                  </svg>
                  See Expenses
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Expense
                </>
              )}
            </button>
          </div>
        </div>

        <hr className="border-white border-t-2" />

        {/* pie chart — desktop has hover effect, mobile is plain */}
        <div
          className="relative bg-gradient-to-br from-[#4caf50] via-[#388e3c] to-[#2e7d32] p-4 flex justify-center items-center w-full lg:h-[400px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setModalOpen(true)}
        >
          {/* chart */}
          <div className={`w-full flex justify-center items-center transition-all duration-300 ${isHovered ? "opacity-30 blur-[1px]" : "opacity-100"}`}>
            <ExpensePieChart expenses={expenses} />
          </div>

          {/* desktop-only hover CTA — hidden on mobile */}
          <div
            className={`
              hidden lg:flex
              absolute inset-0
              flex-col items-center justify-center gap-2
              pointer-events-none
              transition-opacity duration-300
              ${isHovered ? "opacity-100" : "opacity-0"}
            `}
          >
            {/* expand icon */}
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/40 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 8V4m0 0h4M4 4l5 5m11-5V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                />
              </svg>
            </div>
            <p className="text-white font-semibold text-sm drop-shadow-md tracking-wide">
              Click to expand
            </p>
          </div>
        </div>
      </div>

      {/* ===== Expanded Modal Overlay ===== */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative bg-gradient-to-br from-[#4caf50] via-[#388e3c] to-[#2e7d32] rounded-3xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* close button */}
            <button
              className="absolute top-4 right-4 text-white hover:text-black transition bg-white/20 hover:bg-white rounded-full p-1.5"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-white text-lg font-bold mb-4 text-center">
              Domain-wise Breakdown
            </h3>

            {/* larger chart */}
            <div className="flex-1 min-h-[400px]">
              <ExpensePieChart expenses={expenses} containerClassName="w-full h-full min-h-[380px]" />
            </div>

            <p className="text-center text-white/60 text-xs mt-3">
              Click outside or ✕ to close
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Summary;
