import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../context/AuthContext";

// ─── Animated Hamburger → X icon ─────────────────────────────────────────────
const HamburgerIcon = ({ open }) => (
  <div className="w-5 h-4 flex flex-col justify-between cursor-pointer">
    <span
      className={`block h-0.5 w-full bg-current rounded-full origin-top-left transition-all duration-300 ease-in-out
        ${open ? "rotate-45 translate-y-[0px] translate-x-[2px]" : ""}`}
    />
    <span
      className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 ease-in-out
        ${open ? "opacity-0 scale-x-0" : ""}`}
    />
    <span
      className={`block h-0.5 w-full bg-current rounded-full origin-bottom-left transition-all duration-300 ease-in-out
        ${open ? "-rotate-45 -translate-y-[1px] translate-x-[2px]" : ""}`}
    />
  </div>
);

// ─── Reusable mobile menu link ────────────────────────────────────────────────
const MobileMenuLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors
       ${isActive ? "bg-[#4caf50] text-white" : "text-gray-700 hover:bg-gray-100"}`
    }
  >
    {children}
  </Link>
);

// ─── Component ────────────────────────────────────────────────────────────────
const AuthControls = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const close = () => setOpen(false);

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
    close();
    setConfirmOpen(false);
  };

  const requestLogout = () => {
    close(); // close mobile menu if open
    setConfirmOpen(true);
  };

  const btnBase = "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 border-2";
  const btnOutline = `${btnBase} border-black text-black hover:bg-black hover:text-white`;
  const btnFilled = `${btnBase} border-black bg-black text-white hover:bg-white hover:text-black`;

  return (
    <>
      {/* ── Desktop ── */}
      {/* ── Logout confirmation modal (portalled to body to escape navbar stacking context) ── */}
      {confirmOpen && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚪</span>
              <div>
                <h3 className="font-bold text-gray-800 text-base">Log out?</h3>
                <p className="text-sm text-gray-500 mt-0.5">You'll need to sign in again to access your account.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded-full text-sm font-medium border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full text-sm font-medium bg-black text-white hover:bg-gray-800 transition"
              >
                Yes, log out
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <div className="hidden sm:flex items-center gap-2">
        {isLoggedIn ? (
          <button onClick={requestLogout} className={btnOutline}>Logout</button>
        ) : (
          <>
            <button onClick={() => navigate({ to: "/login" })} className={btnOutline}>Log In</button>
            <button onClick={() => navigate({ to: "/register" })} className={btnFilled}>Get Started</button>
          </>
        )}
      </div>

      {/* ── Mobile ── */}
      <div className="relative sm:hidden" ref={menuRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className={`w-9 h-9 flex items-center justify-center rounded-lg border-2 transition-colors duration-200
            ${open ? "bg-black text-white border-black" : "bg-white text-black border-gray-300 hover:border-black"}`}
        >
          <HamburgerIcon open={open} />
        </button>

        {/* Dropdown */}
        <div
          className={`absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50
            transition-all duration-200 origin-top-right
            ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}
        >
          <div className="p-2 flex flex-col gap-0.5">

            {/* Nav links (mobile-only) */}
            {isLoggedIn && (
              <MobileMenuLink to="/stats" onClick={close}>📊 Stats</MobileMenuLink>
            )}
            {isLoggedIn && (
              <MobileMenuLink to="/manage" onClick={close}>🗂️ Manage</MobileMenuLink>
            )}
            <MobileMenuLink to="/about" onClick={close}>ℹ️ About</MobileMenuLink>

            {/* Divider */}
            <div className="border-t-2 border-gray-200 my-1.5 mx-1" />

            {/* Auth actions */}
            {isLoggedIn ? (
              <button
                onClick={requestLogout}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                🚪 Logout
              </button>
            ) : (
              <>
                <MobileMenuLink to="/login" onClick={close}>🔑 Log In</MobileMenuLink>
                <MobileMenuLink to="/register" onClick={close}>🚀 Get Started</MobileMenuLink>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthControls;
