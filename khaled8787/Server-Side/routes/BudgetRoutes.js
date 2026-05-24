const express = require("express");

const Budget = require("../models/Budget");

const Transaction = require(
  "../models/Transaction"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const router = express.Router();



router.post(
  "/add",
  authMiddleware,

  async (req, res) => {

    try {

      const {
        category,
        limit,
      } = req.body;

      const budget =
        await Budget.create({

          userId: req.user,

          category,
          limit,
        });

      res.status(201).json(budget);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }
  }
);



router.get(
  "/all",
  authMiddleware,

  async (req, res) => {

    try {

      const budgets =
        await Budget.find({
          userId: req.user,
        });

      const transactions =
        await Transaction.find({
          userId: req.user,
          type: "expense",
        });

      const budgetData =
        budgets.map((budget) => {

          const spent =
            transactions
              .filter(
                (item) =>
                  item.category ===
                  budget.category
              )
              .reduce(
                (acc, item) =>
                  acc + item.amount,
                0
              );

          return {
            ...budget._doc,
            spent,
          };
        });

      res.json(budgetData);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }
  }
);
module.exports = router;