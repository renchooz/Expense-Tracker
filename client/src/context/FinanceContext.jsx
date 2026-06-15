import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [financeLoading, setFinanceLoading] = useState(false);

  const getDashboardSummary = async () => {
    const res = await api.get("/dashboard/summary");
    setDashboardData(res.data);
    return res.data;
  };

  const getRecentTransactions = async () => {
    const res = await api.get("/dashboard/recent");
    setRecentTransactions(res.data.recentTransactions || []);
    return res.data;
  };

  const getTransactions = async (filters = {}) => {
    const res = await api.get("/transactions", {
      params: filters,
    });

    setTransactions(res.data.transactions || []);
    return res.data;
  };

  const addTransaction = async (formData) => {
    try {
      const res = await api.post("/transactions", formData);
      toast.success(res.data.message || "Transaction added");
      await getDashboardSummary();
      await getRecentTransactions();
      await getTransactions();
      return res.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add transaction"
      );
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const res = await api.delete(`/transactions/${id}`);
      toast.success(res.data.message || "Transaction deleted");
      await getDashboardSummary();
      await getRecentTransactions();
      await getTransactions();
      return res.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete transaction"
      );
      throw error;
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        dashboardData,
        transactions,
        recentTransactions,
        financeLoading,
        setFinanceLoading,
        getDashboardSummary,
        getRecentTransactions,
        getTransactions,
        addTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  return useContext(FinanceContext);
};
