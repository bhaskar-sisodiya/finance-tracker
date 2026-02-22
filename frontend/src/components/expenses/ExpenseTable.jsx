import { useSelector } from "react-redux";
import { useState } from "react";

const PAGE_SIZE = 10;

const ExpenseTable = () => {
  const { currentMonth: expenses, loading } = useSelector((s) => s.expenses);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil((expenses?.length || 0) / PAGE_SIZE));
  const paginated = (expenses || []).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Nav button style ──
  const navBtn = (disabled) =>
    `w-8 h-8 flex items-center justify-center rounded-lg border-2 text-sm transition-all duration-150
     ${disabled
      ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50"
      : "border-[#4caf50] text-[#2e7d32] hover:bg-[#4caf50] hover:text-white cursor-pointer"}`;

  return (
    <div className="h-full flex flex-col rounded-3xl overflow-hidden border border-gray-200 shadow-sm bg-white">

      {/* ── Table area — fills all available space ── */}
      <div className="flex-1 overflow-y-auto scroll-y-hidden">
        <table className="w-full table-auto text-sm">
          <thead className="bg-[#4caf50] text-white sticky top-0 z-10">
            <tr>
              <th className="p-3 text-center">Date</th>
              <th className="p-3 text-center">Title</th>
              <th className="p-3 text-center">Domain</th>
              <th className="p-3 text-center">Amount</th>
              <th className="p-3 text-center">Type</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <tr key={i} className="border-t animate-pulse">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="p-2 text-center">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginated.length > 0 ? (
              <>
                {paginated.map((exp, idx) => (
                  <tr
                    key={exp._id}
                    className={`border-t transition-colors duration-100
                      ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      hover:bg-green-50`}
                  >
                    <td className="p-4 whitespace-nowrap text-center">{exp.date.split("T")[0]}</td>
                    <td className="p-4 text-center">{exp.title}</td>
                    <td className="p-4 text-gray-500 text-center">{exp.domain}</td>
                    <td className="p-4 font-medium text-center">₹{exp.amount}</td>
                    <td className={`p-4 capitalize font-medium text-center ${exp.type === "credit" ? "text-green-600" : "text-red-500"}`}>
                      {exp.type}
                    </td>
                  </tr>
                ))}
                {/* Ghost rows to fill remaining space */}
                {Array.from({ length: Math.max(0, PAGE_SIZE - paginated.length) }).map((_, i) => (
                  <tr key={`ghost-${i}`} className={`border-t ${(paginated.length + i) % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="p-4 h-[54px]" colSpan={5} />
                  </tr>
                ))}
              </>
            ) : (
              <>
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-400 text-sm">
                    No expenses recorded this month.
                  </td>
                </tr>
                {Array.from({ length: PAGE_SIZE - 1 }).map((_, i) => (
                  <tr key={`ghost-empty-${i}`} className={`border-t ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                    <td className="p-4 h-[54px]" colSpan={5} />
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Always-visible pagination bar ── */}
      <div className="shrink-0 border-t border-gray-100 bg-white px-4 py-2 flex items-center justify-between gap-3">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className={navBtn(page <= 1)}
          aria-label="Previous page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <span className="text-xs text-gray-500 font-medium">
          Page {page} of {totalPages}
          {expenses?.length > 0 && (
            <span className="text-gray-400 ml-1">({expenses.length} total)</span>
          )}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className={navBtn(page >= totalPages)}
          aria-label="Next page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ExpenseTable;
