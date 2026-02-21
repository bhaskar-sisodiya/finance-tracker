import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../store/userSlice";
import { fetchSummary } from "../../store/summarySlice";
import { fetchCurrentMonthExpenses } from "../../store/expensesSlice";
import Summary from "./Summary";
import ExpenseTable from "../expenses/ExpenseTable";
import ExpenseForm from "../expenses/ExpenseForm";

const User = () => {
  const dispatch = useDispatch();
  const { data: user } = useSelector((s) => s.user);
  const { data: summary } = useSelector((s) => s.summary);
  const { currentMonth: expenses } = useSelector((s) => s.expenses);

  const [view, setView] = useState("summary"); // mobile: "summary"|"form"|"table"
  //  desktop right-panel: "form"|"table"  (defaults to table)
  const [desktopView, setDesktopView] = useState("table");

  const refresh = () => {
    dispatch(fetchSummary());
    dispatch(fetchCurrentMonthExpenses());
  };

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchSummary());
    dispatch(fetchCurrentMonthExpenses());
  }, [dispatch]);

  return (
    <div className="h-full p-3 flex flex-col gap-4 overflow-hidden">
      {/* ===== Mobile / Tablet 3-button menu ===== */}
      <div className="flex lg:hidden justify-center">
        <div className="flex gap-2 bg-gray-100 p-2 rounded-lg shadow-md">
          {["summary", "form", "table"].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={`px-3 py-1 rounded-md font-medium capitalize transition ${view === v ? "bg-black text-white" : "bg-white text-black"
                }`}
            >
              {v === "summary" ? "Summary" : v === "form" ? "Expense Form" : "Expense Table"}
            </button>
          ))}
        </div>
      </div>

      {/* ===== Mobile/Tablet: show selected panel ===== */}
      <div className="lg:hidden w-full">
        {view === "summary" && (
          <div className="mx-auto w-full max-w-3xl">
            <Summary summary={summary} user={user} expenses={expenses} />
          </div>
        )}
        {view === "form" && (
          <div className="mx-auto w-full max-w-3xl">
            <ExpenseForm onExpenseAdded={refresh} />
          </div>
        )}
        {view === "table" && (
          <div className="mx-auto w-full max-w-3xl">
            <ExpenseTable />
          </div>
        )}
      </div>

      {/* ===== Desktop: 2-column layout ===== */}
      <div className="hidden lg:flex w-full gap-4 flex-1 overflow-hidden">
        <div className="w-[30%] h-full overflow-auto">
          <Summary
            summary={summary}
            user={user}
            expenses={expenses}
            view={desktopView}
            onToggleView={() => setDesktopView((v) => (v === "form" ? "table" : "form"))}
          />
        </div>

        <div className="w-[70%] h-full overflow-hidden">
          {desktopView === "form" ? (
            <ExpenseForm onExpenseAdded={refresh} />
          ) : (
            <ExpenseTable />
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
