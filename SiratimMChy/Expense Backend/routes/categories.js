const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const client = require('../config/db');

const categoriesCollection = () => client.db('expense-tracker').collection('categories');

const defaultCategories = [
  { name: 'Food', type: 'expense', isDefault: true },
  { name: 'Groceries', type: 'expense', isDefault: true },
  { name: 'Transport', type: 'expense', isDefault: true },
  { name: 'Bills', type: 'expense', isDefault: true },
  { name: 'Shopping', type: 'expense', isDefault: true },
  { name: 'Health', type: 'expense', isDefault: true },
  { name: 'Entertainment', type: 'expense', isDefault: true },
  { name: 'Education', type: 'expense', isDefault: true },
  { name: 'Housing', type: 'expense', isDefault: true },
  { name: 'Other', type: 'expense', isDefault: true },
  { name: 'Salary', type: 'income', isDefault: true },
  { name: 'Freelance', type: 'income', isDefault: true },
  { name: 'Business', type: 'income', isDefault: true },
  { name: 'Investments', type: 'income', isDefault: true },
  { name: 'Rental Income', type: 'income', isDefault: true },
  { name: 'Bonus', type: 'income', isDefault: true },
  { name: 'Commission', type: 'income', isDefault: true },
  { name: 'Interest', type: 'income', isDefault: true },
  { name: 'Gift', type: 'income', isDefault: true },
  { name: 'Other', type: 'income', isDefault: true },
];

// Seed default categories if not already present
async function seedDefaultCategories() {
  const count = await categoriesCollection().countDocuments({ isDefault: true });
  if (count === 0) {
    await categoriesCollection().insertMany(defaultCategories);
    console.log('Default categories seeded.');
  }
}

// POST /categories — add a custom category
router.post('/', async (req, res) => {
  try {
    const category = req.body;
    category.isDefault = false;

    if (!category.type) {
      return res.status(400).send({ message: 'Category type (expense/income) is required' });
    }

    const result = await categoriesCollection().insertOne(category);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET /categories — get system + user categories
router.get('/', async (req, res) => {
  try {
    const { email, type } = req.query;

    if (!email) {
      return res.status(400).send({ message: 'Email required' });
    }

    const queryFilter = type ? { type } : {};

    const [systemCategories, userCategories] = await Promise.all([
      categoriesCollection().find({ isDefault: true, ...queryFilter }).toArray(),
      categoriesCollection().find({ email, isDefault: { $ne: true }, ...queryFilter }).toArray(),
    ]);

    res.send([...systemCategories, ...userCategories]);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// DELETE /categories/:id — delete a custom category
router.delete('/:id', async (req, res) => {
  try {
    const category = await categoriesCollection().findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!category) {
      return res.status(404).send({ message: 'Category not found' });
    }

    if (category.isDefault) {
      return res.status(403).send({ message: 'System category cannot be deleted' });
    }

    const result = await categoriesCollection().deleteOne({
      _id: new ObjectId(req.params.id),
    });

    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
module.exports.seedDefaultCategories = seedDefaultCategories;
