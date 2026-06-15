import Transaction from "../models/transaction.model.js";

export const createTransaction = async (req, res) => {
  try {
    const { amount, category, type, date, note } = req.body;

    if (!amount || !category || !type) {
      return res.status(400).json({
        message: "Amount, category and type are required",
      });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      amount,
      category,
      type,
      date,
      note,
    });

    res.status(201).json({
      message: "Transaction added successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getTransactions = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;

    const filter = {
      user: req.user._id,
    };

    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }

      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    const transactions = await Transaction.find(filter).sort({
      date: -1,
    });

    res.status(200).json({
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    await transaction.deleteOne();

    res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};