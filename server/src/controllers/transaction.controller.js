import Transaction from "../models/transaction.model.js";
import { VALID_CATEGORIES, VALID_TYPES } from "../constants/categories.js";

const parseAmount = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }
  return amount;
};

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  if (date > today) {
    return "future";
  }

  return date;
};

export const createTransaction = async (req, res) => {
  try {
    const { amount, category, type, date, note } = req.body;

    if (!category || !type) {
      return res.status(400).json({
        message: "Category and type are required",
      });
    }

    const parsedAmount = parseAmount(amount);

    if (parsedAmount === null) {
      return res.status(400).json({
        message: "Amount must be a positive number",
      });
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        message: "Invalid category selected",
      });
    }

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({
        message: "Type must be income or expense",
      });
    }

    const parsedDate = parseDate(date);

    if (parsedDate === null) {
      return res.status(400).json({
        message: "A valid date is required",
      });
    }

    if (parsedDate === "future") {
      return res.status(400).json({
        message: "Transaction date cannot be in the future",
      });
    }

    if (note && note.length > 200) {
      return res.status(400).json({
        message: "Note must be 200 characters or fewer",
      });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      amount: parsedAmount,
      category,
      type,
      date: parsedDate,
      note: note?.trim() || "",
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
      if (!VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({
          message: "Invalid category filter",
        });
      }
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        const start = new Date(startDate);
        if (Number.isNaN(start.getTime())) {
          return res.status(400).json({
            message: "Invalid start date",
          });
        }
        filter.date.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);
        if (Number.isNaN(end.getTime())) {
          return res.status(400).json({
            message: "Invalid end date",
          });
        }
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
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
