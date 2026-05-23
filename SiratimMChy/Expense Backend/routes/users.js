const express = require('express');
const router = express.Router();
const client = require('../config/db');

const usersCollection = () => client.db('expense-tracker').collection('user');

// POST /users — create user (skip if already exists)
router.post('/', async (req, res) => {
  try {
    const user = req.body;

    const existingUser = await usersCollection().findOne({ email: user.email });

    if (existingUser) {
      return res.send({ message: 'User already exists', inserted: false });
    }

    const result = await usersCollection().insertOne(user);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET /users — get all users
router.get('/', async (req, res) => {
  try {
    const result = await usersCollection().find().toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch users', error: error.message });
  }
});

// GET /users/role/:email — get user by email
router.get('/role/:email', async (req, res) => {
  try {
    const result = await usersCollection().findOne({ email: req.params.email });
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// PUT /users/:email — update user profile
router.put('/:email', async (req, res) => {
  try {
    const { displayName, photoURL } = req.body;

    const result = await usersCollection().updateOne(
      { email: req.params.email },
      { $set: { displayName, photoURL } }
    );

    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
