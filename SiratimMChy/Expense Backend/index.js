const express = require('express');
const cors = require('cors');
require('dotenv').config();

const client = require('./config/db');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const transactionRoutes = require('./routes/transactions');
const statsRoutes = require('./routes/stats');
const { seedDefaultCategories } = require('./routes/categories');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Root
app.get('/', (req, res) => {
  res.send('Expense Backend Tracker');
});

// Routes
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/transactions', transactionRoutes);
app.use('/stats', statsRoutes);

// Connect to DB, seed data, then start server
async function start() {
  try {
    await client.connect();
    await seedDefaultCategories();
    console.log('Connected to MongoDB successfully.');

    app.listen(port, () => {
      console.log(`Expense Backend Tracker is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();