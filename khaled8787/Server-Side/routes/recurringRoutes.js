const express = require("express");

const router = express.Router();

const Recurring = require(
  "../models/Recurring"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);


router.post(
  "/add",
  authMiddleware,

  async (req, res) => {

    try {

      const recurring =
        await Recurring.create({

          ...req.body,

          userId: req.user,
        });

      res.status(201).json(
        recurring
      );

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

      const data =
        await Recurring.find({
          userId: req.user,
        }).sort({
          createdAt: -1,
        });

      res.json(data);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }
  }
);
module.exports = router;