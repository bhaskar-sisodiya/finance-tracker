import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchAllExpenses } from "../store/expensesSlice";
import { fetchSummary } from "../store/summarySlice";
import { fetchCurrentMonthExpenses } from "../store/expensesSlice";
import Navbar from "../components/layout/Navbar";
import Pagination from "../components/common/Pagination";
import { useToast } from "../context/ToastContext";

// ─── Domain data ──────────────────────────────────────────────────────────────
const DEBIT_DOMAINS = [
    "Housing & Utilities", "Food & Groceries", "Transportation", "Healthcare",
    "Education & Learning", "Work & Professional", "Savings & Investments",
    "Entertainment & Leisure", "Personal Care", "Family & Social", "Taxes & Legal", "Miscellaneous",
];
const CREDIT_DOMAINS = [
    "Salary & Wages", "Business & Self-Employment", "Investments & Capital Gains",
    "Real Estate & Property", "Government & Institutional Transfers", "Family & Personal Transfers",
    "Royalties & Intellectual Property", "Digital & Online Sources", "Windfalls & Miscellaneous",
];
const ALL_DOMAINS = [...DEBIT_DOMAINS, ...CREDIT_DOMAINS];

const API = import.meta.env.VITE_API_URL;
const hdrs = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` });

const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const PAGE_SIZE = 15;

// ─── Edit Modal ───────────────────────────────────────────────────────────────
const EditModal = ({ expense, onClose, onSaved }) => {
    const { showToast } = useToast();
    const [form, setForm] = useState({
        date: expense.date ? new Date(expense.date) : new Date(),
        transactionType: expense.type === "credit" ? "received" : "spent",
        domain: expense.domain || "",
        title: expense.title || "",
        description: expense.description || "",
        amount: expense.amount || "",
    });
    const [saving, setSaving] = useState(false);
    const domainOptions = form.transactionType === "received" ? CREDIT_DOMAINS : DEBIT_DOMAINS;

    const set = (name, value) =>
        setForm((p) => name === "transactionType" ? { ...p, transactionType: value, domain: "" } : { ...p, [name]: value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`${API}/api/expenses/${expense._id}`, {
                method: "PUT", headers: hdrs(),
                body: JSON.stringify({
                    date: form.date.toLocaleDateString("en-CA"),
                    domain: form.domain, title: form.title,
                    description: form.description, amount: Number(form.amount),
                    type: form.transactionType === "received" ? "credit" : "debit",
                }),
            });
            if (!res.ok) throw new Error((await res.json()).error || "Update failed");
            showToast("Expense updated!", "success");
            onSaved();
        } catch (err) {
            showToast(err.message, "error");
        } finally { setSaving(false); }
    };

    const inp = "w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4caf50]/40 focus:border-[#4caf50] transition";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-[#4caf50] to-[#2e7d32] px-5 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-white font-bold text-base">Edit Expense</h2>
                    <button onClick={onClose} className="text-white hover:text-gray-200 text-xl">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-2">
                        {[{ value: "spent", label: "📤 Debit", c: "red" }, { value: "received", label: "📥 Credit", c: "green" }].map(({ value, label, c }) => (
                            <label key={value} className={`flex items-center gap-2 border-2 rounded-xl px-3 py-1.5 cursor-pointer text-sm font-medium transition-all
                ${form.transactionType === value ? (c === "red" ? "border-red-400 bg-red-50 text-red-700" : "border-[#4caf50] bg-green-50 text-[#2e7d32]") : "border-gray-200 bg-gray-50 text-gray-600"}`}>
                                <input type="radio" name="transactionType" value={value} checked={form.transactionType === value} onChange={e => set("transactionType", e.target.value)} className="sr-only" />
                                {label}
                            </label>
                        ))}
                    </div>
                    <select name="domain" value={form.domain} onChange={e => set("domain", e.target.value)} required className={inp}>
                        <option value="">Select category…</option>
                        {domainOptions.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <DatePicker selected={form.date} onChange={d => set("date", d)} maxDate={new Date()} dateFormat="yyyy-MM-dd" placeholderText="Date" className={inp} wrapperClassName="w-full" />
                    <input type="text" value={form.title} onChange={e => set("title", e.target.value)} placeholder="Title" required className={inp} />
                    <textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="Description (optional)" rows={2} className={`${inp} resize-none`} />
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">₹</span>
                        <input type="number" value={form.amount} onChange={e => set("amount", e.target.value)} placeholder="0.00" step="0.01" min="0" required className={`${inp} pl-7`} />
                    </div>
                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-500 py-2 rounded-xl text-sm hover:bg-gray-50 transition">Cancel</button>
                        <button type="submit" disabled={saving} className="flex-1 bg-[#4caf50] hover:bg-[#388e3c] text-white py-2 rounded-xl text-sm font-semibold transition disabled:opacity-60">
                            {saving ? "Saving…" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Delete Modal ─────────────────────────────────────────────────────────────
const DeleteModal = ({ count, onCancel, onConfirm, loading }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onCancel}>
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm flex flex-col gap-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3">
                <span className="text-3xl">🗑️</span>
                <div>
                    <h3 className="font-bold text-gray-800">Delete {count > 1 ? `${count} expenses` : "expense"}?</h3>
                    <p className="text-sm text-gray-500 mt-0.5">This action cannot be undone.</p>
                </div>
            </div>
            <div className="flex gap-3 justify-end">
                <button onClick={onCancel} className="px-4 py-2 rounded-full text-sm font-medium border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                <button onClick={onConfirm} disabled={loading} className="px-4 py-2 rounded-full text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-60">
                    {loading ? "Deleting…" : "Yes, delete"}
                </button>
            </div>
        </div>
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const ManageExpenses = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showToast } = useToast();

    const { all: allExpenses, loading } = useSelector((s) => s.expenses);

    // Filters
    const [search, setSearch] = useState("");
    const [type, setType] = useState("all");
    const [domain, setDomain] = useState("all");
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);

    // Pagination
    const [page, setPage] = useState(1);

    // Modals
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // ── Initial load ──
    useEffect(() => { dispatch(fetchAllExpenses()); }, [dispatch]);

    // ── Client-side filtering ──
    const filtered = useMemo(() => {
        return allExpenses.filter((exp) => {
            if (type !== "all" && exp.type !== type) return false;
            if (domain !== "all" && exp.domain !== domain) return false;
            if (from && new Date(exp.date) < from) return false;
            if (to && new Date(exp.date) > new Date(to.toDateString() + " 23:59:59")) return false;
            if (search) {
                const q = search.toLowerCase();
                if (!exp.title?.toLowerCase().includes(q) && !exp.description?.toLowerCase().includes(q)) return false;
            }
            return true;
        });
    }, [allExpenses, search, type, domain, from, to]);

    // Reset to page 1 whenever filters change
    useEffect(() => { setPage(1); }, [search, type, domain, from, to]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // ── Selection ──
    const [selected, setSelected] = useState(new Set());
    const isAllSelected = paginated.length > 0 && paginated.every(e => selected.has(e._id));
    const toggleAll = () => {
        setSelected(prev => {
            const s = new Set(prev);
            if (isAllSelected) paginated.forEach(e => s.delete(e._id));
            else paginated.forEach(e => s.add(e._id));
            return s;
        });
    };
    const toggleOne = (id) => setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

    // Clear selection when page changes
    useEffect(() => { setSelected(new Set()); }, [page]);

    // ── Refresh Redux after mutations ──
    const refreshAll = () => {
        dispatch(fetchAllExpenses());
        dispatch(fetchCurrentMonthExpenses());
        dispatch(fetchSummary());
    };

    // ── Delete ──
    const confirmDelete = async () => {
        setDeleting(true);
        try {
            if (deleteTarget === "bulk") {
                const ids = [...selected];
                const res = await fetch(`${API}/api/expenses/bulk`, { method: "DELETE", headers: hdrs(), body: JSON.stringify({ ids }) });
                if (!res.ok) throw new Error();
                showToast(`${ids.length} expense(s) deleted.`, "success");
                setSelected(new Set());
            } else {
                const res = await fetch(`${API}/api/expenses/${deleteTarget}`, { method: "DELETE", headers: hdrs() });
                if (!res.ok) throw new Error();
                showToast("Expense deleted.", "success");
            }
            setDeleteTarget(null);
            refreshAll();
        } catch { showToast("Delete failed.", "error"); }
        finally { setDeleting(false); }
    };

    const inp = "border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4caf50]/40 focus:border-[#4caf50] transition";

    return (
        <div className="w-full min-h-screen flex flex-col bg-[#f0faf0]">
            <Navbar />
            <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 py-4 gap-4">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate("/dashboard")} aria-label="Back"
                        className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-white border-2 border-[#4caf50] text-[#2e7d32] hover:bg-[#4caf50] hover:text-white shadow-sm transition hover:scale-110 active:scale-95">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-[#2e7d32]">Manage Expenses</h1>
                        <p className="text-xs text-gray-400">Search, filter, edit and delete your records</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl border border-[#c8e6c9] shadow-sm p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="relative sm:col-span-2 lg:col-span-1">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
                        </svg>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title or description…" className={`${inp} w-full pl-9`} />
                    </div>
                    <select value={type} onChange={e => setType(e.target.value)} className={inp}>
                        <option value="all">All Types</option>
                        <option value="debit">Debit (Spent)</option>
                        <option value="credit">Credit (Received)</option>
                    </select>
                    <select value={domain} onChange={e => setDomain(e.target.value)} className={inp}>
                        <option value="all">All Domains</option>
                        {ALL_DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <div className="flex gap-2 items-center sm:col-span-2 lg:col-span-1">
                        <DatePicker selected={from} onChange={setFrom} selectsStart startDate={from} endDate={to} maxDate={to || new Date()} dateFormat="dd/MM/yyyy" placeholderText="From" className={`${inp} w-full`} wrapperClassName="flex-1" />
                        <span className="text-gray-400 text-sm shrink-0">→</span>
                        <DatePicker selected={to} onChange={setTo} selectsEnd startDate={from} endDate={to} minDate={from} maxDate={new Date()} dateFormat="dd/MM/yyyy" placeholderText="To" className={`${inp} w-full`} wrapperClassName="flex-1" />
                    </div>
                    <button onClick={() => { setSearch(""); setType("all"); setDomain("all"); setFrom(null); setTo(null); }} className="text-sm text-[#2e7d32] hover:underline font-medium text-left sm:col-span-2 lg:col-span-4">
                        Clear all filters
                    </button>
                </div>

                {/* Bulk bar */}
                {selected.size > 0 && (
                    <div className="flex items-center justify-between bg-[#2e7d32] text-white rounded-xl px-4 py-2.5 shadow-md">
                        <span className="text-sm font-medium">{selected.size} selected</span>
                        <button onClick={() => setDeleteTarget("bulk")} className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition">
                            🗑️ Delete Selected
                        </button>
                    </div>
                )}

                {/* Table card */}
                <div className="bg-white rounded-2xl border border-[#c8e6c9] shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-[#4caf50] to-[#2e7d32] px-4 py-3">
                        <h2 className="text-white font-semibold text-sm">
                            {loading ? "Loading…" : `${filtered.length} record${filtered.length !== 1 ? "s" : ""} found`}
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-16 text-gray-400 text-sm gap-2">
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Loading expenses…
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
                            <span className="text-4xl">🔍</span>
                            <p className="text-sm">No expenses match your filters.</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left">
                                                <input type="checkbox" checked={isAllSelected} onChange={toggleAll} className="accent-[#4caf50] w-4 h-4 cursor-pointer" />
                                            </th>
                                            {["Date", "Title", "Domain", "Type", "Amount", "Actions"].map(h => (
                                                <th key={h} className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide ${h === "Amount" ? "text-right" : h === "Actions" ? "text-center" : "text-left"} ${h === "Domain" ? "hidden md:table-cell" : ""}`}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {paginated.map((exp, i) => (
                                            <tr key={exp._id} className={`transition-colors ${selected.has(exp._id) ? "bg-green-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-green-50/70`}>
                                                <td className="px-4 py-3">
                                                    <input type="checkbox" checked={selected.has(exp._id)} onChange={() => toggleOne(exp._id)} className="accent-[#4caf50] w-4 h-4 cursor-pointer" />
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{fmt(exp.date)}</td>
                                                <td className="px-4 py-3 font-medium text-gray-800 max-w-[160px] truncate">{exp.title}</td>
                                                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{exp.domain}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${exp.type === "credit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                        {exp.type === "credit" ? "Credit" : "Debit"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right font-semibold text-gray-800">₹{exp.amount}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button onClick={() => setEditTarget(exp)} title="Edit" className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#e8f5e9] text-[#2e7d32] hover:bg-[#4caf50] hover:text-white transition">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.5-6.5a2 2 0 012.828 2.828L11.828 15.83a4 4 0 01-1.897 1.06l-2.796.699.699-2.796A4 4 0 019 13z" /></svg>
                                                        </button>
                                                        <button onClick={() => setDeleteTarget(exp._id)} title="Delete" className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M3 7h18" /></svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="border-t border-gray-100">
                                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {editTarget && (
                <EditModal expense={editTarget} onClose={() => setEditTarget(null)} onSaved={() => { setEditTarget(null); refreshAll(); }} />
            )}
            {deleteTarget && (
                <DeleteModal count={deleteTarget === "bulk" ? selected.size : 1} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} loading={deleting} />
            )}
        </div>
    );
};

export default ManageExpenses;
