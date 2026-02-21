import React, { useState, useEffect, useRef } from "react";
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
  const [desktopView, setDesktopView] = useState("table");

  // Swipe logic
  const touchStart = useRef(0);
  const touchEnd = useRef(0);
  const views = ["summary", "form", "table"];
  const currentIdx = views.indexOf(view);

  const handleTouchStart = (e) => {
    touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIdx < views.length - 1) {
      setView(views[currentIdx + 1]);
    } else if (isRightSwipe && currentIdx > 0) {
      setView(views[currentIdx - 1]);
    }
  };

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

      {/* ===== Mobile/Tablet: Swipeable Horizontal Container ===== */}
      <div
        className="lg:hidden w-full flex-1 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIdx * 100}%)` }}
        >
          <div className="min-w-full h-full px-1">
            <div className="mx-auto w-full max-w-3xl h-full">
              <Summary summary={summary} user={user} expenses={expenses} />
            </div>
          </div>
          <div className="min-w-full h-full px-1">
            <div className="mx-auto w-full max-w-3xl h-full">
              <ExpenseForm onExpenseAdded={refresh} />
            </div>
          </div>
          <div className="min-w-full h-full px-1">
            <div className="mx-auto w-full max-w-3xl h-full">
              <ExpenseTable />
            </div>
          </div>
        </div>
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
