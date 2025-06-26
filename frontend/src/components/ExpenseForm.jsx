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
      onExpenseAdded?.(); // optional chaining in case the prop isn't passed
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
    <>
      <div className="w-[70%] h-full rounded-3xl bg-[#4caf50] flex justify-center items-center">
        <div className="w-[80%] h-[96%] rounded-3xl bg-white p-4">
          <h2 className="text-2xl font-bold mb-4 text-[#4caf50]">
            Expense Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Date */}
            <div className="w-full">
              <label htmlFor="date" className="block text-sm font-medium">
                Date:
              </label>
              <DatePicker
                id="date"
                selected={form.date ? new Date(form.date) : null}
                onChange={(date) =>
                  setForm((prev) => ({
                    ...prev,
                    date: date.toLocaleDateString("en-CA"), // ⬅️ outputs 'YYYY-MM-DD' in local time,
                  }))
                }
                maxDate={new Date()} // 🚫 Disables future dates
                dateFormat="yyyy-MM-dd"
                placeholderText="Select a date"
                className="w-full block border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4caf50]"
                calendarClassName="shadow-lg rounded-md border border-gray-200"
                wrapperClassName="w-full"
                popperPlacement="bottom-start"
              />
            </div>

            {/* Domain as select */}
            <div>
              <label htmlFor="domain" className="block text-sm font-medium">
                Domain:
              </label>
              <select
                id="domain"
                name="domain"
                onChange={handleChange}
                value={form.domain}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
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
              <label htmlFor="title" className="block text-sm font-medium">
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
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium"
              >
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                onChange={handleChange}
                value={form.description}
                placeholder="Describe the expense"
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              ></textarea>
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium">
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
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Transaction Type */}
            <div>
              <span className="block text-sm font-medium">
                Transaction Type:
              </span>
              <div className="mt-1 flex gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="transactionType"
                    value="received"
                    onChange={handleChange}
                    checked={form.transactionType === "received"}
                    required
                    className="mr-2"
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
                    className="mr-2"
                  />
                  Spent
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Submit Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ExpenseForm;
