import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useFinance } from "../context/FinanceContext";

const Transactions = () => {
  const { transactions, getTransactions, deleteTransaction } = useFinance();

  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    getTransactions();
  }, []);

  const handleFilter = async () => {
    if (startDate && endDate && startDate > endDate) {
      toast.error("Start date cannot be after end date");
      return;
    }

    const filters = {};

    if (category) filters.category = category;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    try {
      await getTransactions(filters);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to filter transactions");
    }
  };

  const handleClearFilter = async () => {
    setCategory("");
    setStartDate("");
    setEndDate("");
    await getTransactions();
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              Transactions
            </h1>
            <p className="text-slate-500 mt-2">
              View, filter and manage your income and expenses.
            </p>
          </div>

          <span className="w-fit bg-violet-100 text-violet-600 px-4 py-2 rounded-xl font-semibold">
            {transactions.length} Records
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mt-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Filters</h2>
              <p className="text-sm text-slate-400">
                Filter by category or date range.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-violet-200"
            >
              <option value="">All Categories</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Health">Health</option>
              <option value="Salary">Salary</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-violet-200"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-violet-200"
            />

            <button
              onClick={handleFilter}
              className="w-full bg-violet-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-violet-700 transition"
            >
              Apply Filter
            </button>

            <button
              onClick={handleClearFilter}
              className="w-full bg-slate-100 text-slate-600 px-5 py-3 rounded-xl font-semibold hover:bg-slate-200 transition"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8 mb-4">
          <h2 className="text-2xl font-bold text-slate-800">
            Transaction History
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left px-6 py-4 text-slate-600">
                    Category
                  </th>
                  <th className="text-left px-6 py-4 text-slate-600">
                    Type
                  </th>
                  <th className="text-left px-6 py-4 text-slate-600">
                    Amount
                  </th>
                  <th className="text-left px-6 py-4 text-slate-600">
                    Date
                  </th>
                  <th className="text-left px-6 py-4 text-slate-600">
                    Note
                  </th>
                  <th className="text-left px-6 py-4 text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {transactions?.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="border-t border-slate-100 hover:bg-violet-50/50 transition"
                    >
                      <td className="px-6 py-5 font-semibold text-slate-800">
                        {transaction.category}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                            transaction.type === "income"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>

                      <td
                        className={`px-6 py-5 font-bold ${
                          transaction.type === "income"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {new Date(transaction.date).toLocaleDateString("en-IN")}
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {transaction.note || "-"}
                      </td>

                      <td className="px-6 py-5">
                        <button
                          onClick={() => deleteTransaction(transaction._id)}
                          className="bg-red-50 text-red-500 px-4 py-2 rounded-xl font-semibold hover:bg-red-100 transition"
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-14 text-slate-400"
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Transactions;