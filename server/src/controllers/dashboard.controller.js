import Transaction from "../models/transaction.model.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user._id,
    });

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryExpenses = {};

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      }

      if (transaction.type === "expense") {
        totalExpense += transaction.amount;

        categoryExpenses[transaction.category] =
          (categoryExpenses[transaction.category] || 0) + transaction.amount;
      }
    });

    const netBalance = totalIncome - totalExpense;

    let topSpendingCategory = null;
    let topSpendingAmount = 0;

    Object.entries(categoryExpenses).forEach(([category, amount]) => {
      if (amount > topSpendingAmount) {
        topSpendingCategory = category;
        topSpendingAmount = amount;
      }
    });

    let insight = "Start adding transactions to get spending insights.";

    if (totalExpense > 0 && topSpendingCategory) {
      const percentage = Math.round((topSpendingAmount / totalExpense) * 100);

      insight = `${topSpendingCategory} accounts for ${percentage}% of your total spending.`;
    }

    if (totalIncome > 0) {
      const savingsRate = Math.round((netBalance / totalIncome) * 100);

      if (savingsRate >= 30) {
        insight = `Great job! You are saving ${savingsRate}% of your income.`;
      } else if (savingsRate < 0) {
        insight = "Warning: Your expenses are higher than your income.";
      }
    }

    const chartData = Object.entries(categoryExpenses).map(
      ([category, amount]) => ({
        category,
        amount,
      })
    );

    res.status(200).json({
      totalIncome,
      totalExpense,
      netBalance,
      topSpendingCategory,
      insight,
      chartData,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getRecentTransactions = async (req, res) => {
  try {
    const recentTransactions = await Transaction.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      recentTransactions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};