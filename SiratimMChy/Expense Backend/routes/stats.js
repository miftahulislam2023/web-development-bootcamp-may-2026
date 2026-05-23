const express = require('express');
const router = express.Router();
const client = require('../config/db');

const db = () => client.db('expense-tracker');

// GET /stats — summary counts
router.get('/', async (req, res) => {
  try {
    const [users, transactions, categories] = await Promise.all([
      db().collection('user').countDocuments(),
      db().collection('transactions').countDocuments(),
      db().collection('categories').countDocuments(),
    ]);

    res.send({ users, transactions, categories });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
