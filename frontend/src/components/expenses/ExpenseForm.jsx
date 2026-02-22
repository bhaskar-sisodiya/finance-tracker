import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useToast } from "../../context/ToastContext";

// ─── Domain metadata ────────────────────────────────────────────────────────

const DEBIT_DOMAINS = [
  {
    value: "Housing & Utilities",
    icon: "🏠",
    desc: "Rent, electricity, water, internet, and home maintenance costs.",
  },
  {
    value: "Food & Groceries",
    icon: "🍽️",
    desc: "Daily meals, grocery runs, dining out, and food delivery.",
  },
  {
    value: "Transportation",
    icon: "🚗",
    desc: "Public transit, fuel, vehicle maintenance, and ride-hailing.",
  },
  {
    value: "Healthcare",
    icon: "🏥",
    desc: "Medical checkups, insurance premiums, prescriptions, and emergency care.",
  },
  {
    value: "Education & Learning",
    icon: "📚",
    desc: "Tuition fees, online courses, certifications, and books.",
  },
  {
    value: "Work & Professional",
    icon: "💼",
    desc: "Tools, software subscriptions, office supplies, and work attire.",
  },
  {
    value: "Savings & Investments",
    icon: "💰",
    desc: "Emergency fund contributions, retirement savings, mutual funds, and stocks.",
  },
  {
    value: "Entertainment & Leisure",
    icon: "🎬",
    desc: "Movies, streaming services, hobbies, sports, and leisure travel.",
  },
  {
    value: "Personal Care",
    icon: "🧴",
    desc: "Clothing, grooming products, wellness services, and self-care.",
  },
  {
    value: "Family & Social",
    icon: "👨‍👩‍👧",
    desc: "Gifts, celebrations, events, and expenses for dependents.",
  },
  {
    value: "Taxes & Legal",
    icon: "📋",
    desc: "Income tax, property tax, filing fees, and legal compliance costs.",
  },
  {
    value: "Miscellaneous",
    icon: "📦",
    desc: "Unexpected, one-off, or irregular expenses that don't fit elsewhere.",
  },
];

const CREDIT_DOMAINS = [
  {
    value: "Salary & Wages",
    icon: "💵",
    desc: "Regular pay from employment, stipends, bonuses, and salary credits.",
  },
  {
    value: "Business & Self-Employment",
    icon: "🏪",
    desc: "Business profits, freelance income, consulting fees, and side hustles.",
  },
  {
    value: "Investments & Capital Gains",
    icon: "📈",
    desc: "Dividends, interest income, stock/mutual fund sales, and bond returns.",
  },
  {
    value: "Real Estate & Property",
    icon: "🏢",
    desc: "Rental income, lease payments, and property appreciation proceeds.",
  },
  {
    value: "Government & Institutional Transfers",
    icon: "🏛️",
    desc: "Scholarships, government grants, subsidies, pensions, and welfare.",
  },
  {
    value: "Family & Personal Transfers",
    icon: "🤝",
    desc: "Allowances from family, personal gifts, and remittances from abroad.",
  },
  {
    value: "Royalties & Intellectual Property",
    icon: "🎨",
    desc: "Licensing fees, patent royalties, and income from creative works.",
  },
  {
    value: "Digital & Online Sources",
    icon: "💻",
    desc: "Content monetization, affiliate marketing, and gig platform earnings.",
  },
  {
    value: "Windfalls & Miscellaneous",
    icon: "🎉",
    desc: "Lottery winnings, inheritance, unexpected settlements, or one-time gains.",
  },
];

const DOMAIN_MAP = Object.fromEntries(
  [...DEBIT_DOMAINS, ...CREDIT_DOMAINS].map((d) => [d.value, d])
);

// ─── Spinner ─────────────────────────────────────────────────────────────────

const Spinner = () => (
  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
);

// ─── Field wrapper (must be at module level — not inside a component) ─────────
// Defining this inside ExpenseForm would cause remount on every render,
// making inputs lose focus after each keystroke.
const Field = ({ label, children, hint }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
      {label}
    </label>
    {children}
    {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
  </div>
);

// ─── Component ───────────────────────────────────────────────────────────────

const ExpenseForm = ({ onExpenseAdded }) => {
  const { showToast } = useToast();

  const [form, setForm] = useState({
    date: null,
    transactionType: "",
    domain: "",
    title: "",
    description: "",
    amount: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const domainOptions =
    form.transactionType === "received" ? CREDIT_DOMAINS : DEBIT_DOMAINS;

  const selectedDomain = form.domain ? DOMAIN_MAP[form.domain] : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "transactionType") {
      setForm((prev) => ({ ...prev, transactionType: value, domain: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () =>
    setForm({ date: null, transactionType: "", domain: "", title: "", description: "", amount: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Defaults: today's date if none selected; fallback domain by type
    const resolvedDate = form.date ?? new Date();
    const defaultDomain =
      form.transactionType === "received"
        ? "Windfalls & Miscellaneous"
        : "Miscellaneous";
    const resolvedDomain = form.domain || defaultDomain;

    const payload = {
      ...form,
      date: resolvedDate.toLocaleDateString("en-CA"),
      domain: resolvedDomain,
      type: form.transactionType === "received" ? "credit" : "debit",
    };
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to add expense");
      showToast("Entry added successfully!", "success");
      onExpenseAdded?.();
      resetForm();
    } catch (err) {
      console.error(err);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls =
    "w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4caf50]/40 focus:border-[#4caf50] transition";

  return (
    <div className="w-full h-full rounded-3xl bg-[#4caf50] flex justify-center items-start p-3">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-3 shadow-sm h-full flex flex-col gap-2.5 overflow-y-auto scroll-y-hidden">

        {/* Header */}
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <span className="text-xl">📝</span>
          <h2 className="text-lg font-bold text-[#4caf50]">
            {form.transactionType === "received" ? "Log Income" : "Log Expense"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 flex-1">

          {/* ── Transaction Type ── */}
          <Field label="Transaction Type">
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "spent", label: "Debit — Spent", icon: "📤", color: "red" },
                { value: "received", label: "Credit — Received", icon: "📥", color: "green" },
              ].map(({ value, label, icon, color }) => (
                <label
                  key={value}
                  className={`flex items-center gap-2 border-2 rounded-xl px-3 py-1.5 cursor-pointer transition-all text-sm font-medium hover:scale-[1.02] active:scale-[0.98]
                    ${form.transactionType === value
                      ? color === "red"
                        ? "border-red-400 bg-red-50 text-red-700"
                        : "border-[#4caf50] bg-green-50 text-[#2e7d32]"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 shadow-sm"
                    }`}
                >
                  <input
                    type="radio"
                    name="transactionType"
                    value={value}
                    onChange={handleChange}
                    checked={form.transactionType === value}
                    required
                    className="sr-only"
                  />
                  <span className="text-base">{icon}</span>
                  {label}
                </label>
              ))}
            </div>
          </Field>

          {/* ── Domain ── */}
          <Field label={form.transactionType === "received" ? "Income Source" : "Expense Category"}>
            <select
              name="domain"
              onChange={handleChange}
              value={form.domain}
              disabled={!form.transactionType}
              className={`${inputCls} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <option value="">
                {form.transactionType ? "Select a category…" : "Choose transaction type first"}
              </option>
              {domainOptions.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.icon}  {d.value}
                </option>
              ))}
            </select>

            {/* Description card */}
            {selectedDomain && (
              <div className="flex items-start gap-3 bg-[#f0faf0] border border-[#4caf50]/30 rounded-xl px-3 py-2 mt-1">
                <span className="text-xl leading-none">{selectedDomain.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-[#2e7d32]">{selectedDomain.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{selectedDomain.desc}</p>
                </div>
              </div>
            )}
          </Field>

          {/* ── Date ── */}
          <Field label="Date">
            <DatePicker
              selected={form.date}
              onChange={(date) => setForm((prev) => ({ ...prev, date }))}
              maxDate={new Date()}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a date"
              className={inputCls}
              calendarClassName="shadow-lg rounded-xl border border-gray-200"
              wrapperClassName="w-full"
            />
          </Field>

          {/* ── Title ── */}
          <Field label="Title">
            <input
              type="text"
              name="title"
              onChange={handleChange}
              value={form.title}
              placeholder="e.g. Monthly electricity bill"
              required
              className={inputCls}
            />
          </Field>

          {/* ── Description ── */}
          <Field label="Description (optional)">
            <textarea
              name="description"
              onChange={handleChange}
              value={form.description}
              placeholder="Add any extra notes…"
              rows={1}
              className={`${inputCls} resize-none`}
            />
          </Field>

          {/* ── Amount ── */}
          <Field label="Amount (₹)">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">₹</span>
              <input
                type="number"
                name="amount"
                onChange={handleChange}
                value={form.amount}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                className={`${inputCls} pl-7`}
              />
            </div>
          </Field>

          {/* ── Buttons ── */}
          <div className="flex gap-3 pt-1 mt-auto">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 border border-gray-200 text-gray-500 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all hover:scale-105 active:scale-95"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-2 w-full bg-[#4caf50] hover:bg-[#388e3c] text-white py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              {isLoading ? <><Spinner /> Submitting…</> : "Submit"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
