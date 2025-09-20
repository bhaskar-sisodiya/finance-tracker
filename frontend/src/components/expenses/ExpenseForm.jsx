import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ExpenseForm = ({ onExpenseAdded }) => {
  const [form, setForm] = useState({
    date: "",
    domain: "",
    title: "",
    description: "",
    amount: "",
    transactionType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = {
      ...form,
      type: form.transactionType === "received" ? "credit" : "debit",
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add expense");
      alert("Expense added successfully!");
      onExpenseAdded?.();
      setForm({
        date: "",
        domain: "",
        title: "",
        description: "",
        amount: "",
        transactionType: "",
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="w-full h-full rounded-3xl bg-[#4caf50] flex justify-center items-start p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-4 shadow-sm h-full flex flex-col">
        <h2 className="text-xl font-bold mb-2 text-[#4caf50]">
          Expense Details
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col justify-between h-full text-sm"
        >
          {/* Date */}
          <div>
            <label htmlFor="date" className="block font-medium mb-1">
              Date:
            </label>
            <DatePicker
              id="date"
              selected={form.date ? new Date(form.date) : null}
              onChange={(date) =>
                setForm((prev) => ({
                  ...prev,
                  date: date.toLocaleDateString("en-CA"),
                }))
              }
              maxDate={new Date()}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a date"
              className="w-full border border-gray-300 rounded-md p-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#4caf50]"
              calendarClassName="shadow-lg rounded-md border border-gray-200"
              wrapperClassName="w-full" // <--- ensures wrapper takes full width
            />
          </div>

          {/* Domain */}
          <div>
            <label htmlFor="domain" className="block font-medium mb-1">
              Domain:
            </label>
            <select
              id="domain"
              name="domain"
              onChange={handleChange}
              value={form.domain}
              required
              className="w-full border border-gray-300 rounded-md p-1 text-sm"
            >
              <option value="">Select domain</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block font-medium mb-1">
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              onChange={handleChange}
              value={form.title}
              placeholder="Expense title"
              required
              className="w-full border border-gray-300 rounded-md p-1 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-medium mb-1">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              onChange={handleChange}
              value={form.description}
              placeholder="Describe the expense"
              rows="3"
              className="w-full border border-gray-300 rounded-md p-1 text-sm"
            />
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block font-medium mb-1">
              Amount:
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              onChange={handleChange}
              value={form.amount}
              placeholder="0.00"
              step="0.01"
              required
              className="w-full border border-gray-300 rounded-md p-1 text-sm"
            />
          </div>

          {/* Transaction Type */}
          <div>
            <span className="block font-medium mb-1">Transaction Type:</span>
            <div className="flex gap-4 text-sm">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="transactionType"
                  value="received"
                  onChange={handleChange}
                  checked={form.transactionType === "received"}
                  required
                  className="mr-1"
                />
                Received
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="transactionType"
                  value="spent"
                  onChange={handleChange}
                  checked={form.transactionType === "spent"}
                  required
                  className="mr-1"
                />
                Spent
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-1.5 rounded-md text-sm hover:bg-blue-700 transition"
          >
            Submit Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
