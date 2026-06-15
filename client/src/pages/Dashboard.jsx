import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AddTransactionModal from "../components/AddTransactionModal";
import { useFinance } from "../context/FinanceContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    dashboardData,
    recentTransactions,
    getDashboardSummary,
    getRecentTransactions,
  } = useFinance();

  useEffect(() => {
    getDashboardSummary();
    getRecentTransactions();
  }, []);

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500 mt-2">
              Track your income, expenses and spending insights.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 md:mt-0 bg-violet-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-violet-700 transition"
          >
            + Add Transaction
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <p className="text-slate-500 font-medium">Total Income</p>
            <h2 className="text-3xl font-bold text-green-500 mt-3">
              {formatCurrency(dashboardData?.totalIncome)}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <p className="text-slate-500 font-medium">Total Expense</p>
            <h2 className="text-3xl font-bold text-red-500 mt-3">
              {formatCurrency(dashboardData?.totalExpense)}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <p className="text-slate-500 font-medium">Net Balance</p>
            <h2 className="text-3xl font-bold text-blue-500 mt-3">
              {formatCurrency(dashboardData?.netBalance)}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <p className="text-slate-500 font-medium">Top Category</p>
            <h2 className="text-3xl font-bold text-violet-500 mt-3">
              {dashboardData?.topSpendingCategory || "N/A"}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mt-8">
          <p className="text-slate-500 font-medium">Spending by Category</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">
            Category Breakdown
          </h3>

          <div className="h-80 mt-6">
            {dashboardData?.chartData?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar
                    dataKey="amount"
                    radius={[12, 12, 0, 0]}
                    fill="#8B5CF6"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                No expense data available for chart.
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <p className="text-slate-500 font-medium">💡 Spending Insight</p>
            <h3 className="text-xl font-semibold text-slate-800 mt-4">
              {dashboardData?.insight || "Add transactions to get insights."}
            </h3>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <p className="text-slate-500 font-medium">Recent Transactions</p>

            <div className="mt-4 space-y-3">
              {recentTransactions?.length > 0 ? (
                recentTransactions.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between bg-slate-50 rounded-2xl px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">
                        {item.category}
                      </p>
                      <p className="text-sm text-slate-500">
                        {item.note || item.type}
                      </p>
                    </div>

                    <p
                      className={`font-bold ${
                        item.type === "income"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {item.type === "income" ? "+" : "-"}
                      {formatCurrency(item.amount)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400">No recent transactions yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;