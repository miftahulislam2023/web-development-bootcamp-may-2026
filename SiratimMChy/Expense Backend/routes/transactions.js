const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const client = require('../config/db');

const transactionsCollection = () => client.db('expense-tracker').collection('transactions');

// POST /transactions — create a transaction
router.post('/', async (req, res) => {
  try {
    const transaction = req.body;

    if (!transaction.email || !transaction.amount || !transaction.category || !transaction.type) {
      return res.status(400).send({
        message: 'Email, amount, category, and type are required',
      });
    }

    const result = await transactionsCollection().insertOne(transaction);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET /transactions — get all transactions for a user
router.get('/', async (req, res) => {
  try {
    const { email, type } = req.query;

    if (!email) {
      return res.status(400).send({ message: 'Email required' });
    }

    const query = { email };
    if (type) query.type = type;

    const result = await transactionsCollection().find(query).sort({ date: -1 }).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET /transactions/:id — get a single transaction
router.get('/:id', async (req, res) => {
  try {
    const result = await transactionsCollection().findOne({
      _id: new ObjectId(req.params.id),
    });
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// PUT /transactions/:id — update a transaction
router.put('/:id', async (req, res) => {
  try {
    const { _id, ...updateData } = req.body;

    const result = await transactionsCollection().updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// DELETE /transactions/:id — delete a transaction
router.delete('/:id', async (req, res) => {
  try {
    const result = await transactionsCollection().deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
