import { useState } from "react";
import { useFinance } from "../context/FinanceContext";

const CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Salary",
  "Other",
];

const getTodayDate = () => new Date().toISOString().split("T")[0];

const AddTransactionModal = ({ isOpen, onClose }) => {
  const { addTransaction } = useFinance();

  const [formData, setFormData] = useState({
    amount: "",
    category: "Food",
    type: "expense",
    date: getTodayDate(),
    note: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const nextErrors = {};
    const amount = Number(formData.amount);

    if (!formData.amount.trim()) {
      nextErrors.amount = "Amount is required";
    } else if (!Number.isFinite(amount) || amount <= 0) {
      nextErrors.amount = "Amount must be greater than 0";
    } else if (amount > 100000000) {
      nextErrors.amount = "Amount is too large";
    }

    if (!formData.category) {
      nextErrors.category = "Category is required";
    }

    if (!formData.type) {
      nextErrors.type = "Type is required";
    }

    if (!formData.date) {
      nextErrors.date = "Date is required";
    } else if (formData.date > getTodayDate()) {
      nextErrors.date = "Date cannot be in the future";
    }

    if (formData.note.length > 200) {
      nextErrors.note = "Note must be 200 characters or fewer";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      amount: "",
      category: "Food",
      type: "expense",
      date: getTodayDate(),
      note: "",
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await addTransaction({
        ...formData,
        amount: Number(formData.amount),
      });
      resetForm();
      onClose();
    } catch {
      // Error toast is handled in FinanceContext
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-slate-800">Add Transaction</h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.amount ? "border-red-400" : "border-slate-200"
              }`}
            />
            {errors.amount && (
              <p className="text-sm text-red-500 mt-1">{errors.amount}</p>
            )}
          </div>

          <div>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.category ? "border-red-400" : "border-slate-200"
              }`}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.type ? "border-red-400" : "border-slate-200"
              }`}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            {errors.type && (
              <p className="text-sm text-red-500 mt-1">{errors.type}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              max={getTodayDate()}
              className={`w-full mt-1 px-4 py-3 rounded-xl border ${
                errors.date ? "border-red-400" : "border-slate-200"
              }`}
            />
            {errors.date && (
              <p className="text-sm text-red-500 mt-1">{errors.date}</p>
            )}
          </div>

          <div>
            <textarea
              name="note"
              placeholder="Note (optional)"
              value={formData.note}
              onChange={handleChange}
              maxLength={200}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.note ? "border-red-400" : "border-slate-200"
              }`}
            />
            {errors.note && (
              <p className="text-sm text-red-500 mt-1">{errors.note}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-slate-100 font-semibold disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-violet-600 text-white font-semibold disabled:opacity-60"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
