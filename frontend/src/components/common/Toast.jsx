import { useEffect, useState } from "react";

const ICONS = {
  success: (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
    </svg>
  ),
};

const STYLES = {
  success: "bg-green-600 text-white",
  error:   "bg-red-600 text-white",
  info:    "bg-gray-800 text-white",
};

const ToastItem = ({ toast, removeToast }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const enterTimer = setTimeout(() => setVisible(true), 10);
    // Start exit animation slightly before removal
    const exitTimer = setTimeout(() => setVisible(false), 2900);
    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, []);

  return (
    <div
      onClick={() => removeToast(toast.id)}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg cursor-pointer
        transition-all duration-300 max-w-sm w-full
        ${STYLES[toast.type] || STYLES.info}
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >
      {ICONS[toast.type] || ICONS.info}
      <span className="text-sm font-medium leading-snug">{toast.message}</span>
    </div>
  );
};

const Toast = ({ toasts, removeToast }) => {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} removeToast={removeToast} />
        </div>
      ))}
    </div>
  );
};

export default Toast;
