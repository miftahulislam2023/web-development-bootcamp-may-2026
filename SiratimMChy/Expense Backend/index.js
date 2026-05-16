const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ybtdeyi.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
  
    const database = client.db('expense-tracker')
    const usersCollection = database.collection('user')
    const categoriesCollection = database.collection('categories')
    const transactionsCollection = database.collection('transactions')
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
      { name: 'Other', type: 'income', isDefault: true }
    ];
    const count = await categoriesCollection.countDocuments({ isDefault: true });

    if (count === 0) {
      await categoriesCollection.insertMany(defaultCategories);
    }


    app.post('/users', async (req, res) => {
      const user = req.body;

      const existingUser = await usersCollection.findOne({
        email: user.email
      });

      if (existingUser) {
        return res.send({
          message: 'User already exists',
          inserted: false
        });
      }

      const result = await usersCollection.insertOne(user);

      res.send(result);
    });



    app.get('/users', async (req, res) => {
      try {
        const result = await usersCollection.find().toArray();

        res.send(result);
      } catch (error) {
        res.status(500).send({
          message: 'Failed to fetch users',
          error: error.message,
        });
      }
    });


    app.get('/users/role/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    app.put('/users/:email', async (req, res) => {
      try {
        const email = req.params.email;
        const { displayName, photoURL } = req.body;

        const result = await usersCollection.updateOne(
          { email },
          {
            $set: {
              displayName,
              photoURL,
            },
          }
        );

        res.send(result);

      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.post('/categories', async (req, res) => {
      try {
        const category = req.body;

        category.isDefault = false;

        if (!category.type) {
          return res.status(400).send({
            message: "Category type (expense/income) is required"
          });
        }

        const result = await categoriesCollection.insertOne(category);
        res.send(result);

      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.get('/categories', async (req, res) => {
      try {
        const email = req.query.email;
        const type = req.query.type;

        if (!email) {
          return res.status(400).send({ message: "Email required" });
        }

        const queryFilter = type ? { type } : {};

        const systemCategories = await categoriesCollection.find({
          isDefault: true,
          ...queryFilter
        }).toArray();

        const userCategories = await categoriesCollection.find({
          email,
          isDefault: { $ne: true },
          ...queryFilter
        }).toArray();

        res.send([...systemCategories, ...userCategories]);

      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.put('/transactions/:id', async (req, res) => {
      try {
        const { _id, ...updateData } = req.body;
        const result = await transactionsCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: updateData }
        );
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });
    app.delete('/categories/:id', async (req, res) => {
      try {
        const category = await categoriesCollection.findOne({
          _id: new ObjectId(req.params.id)
        });

        if (category.isDefault) {
          return res.status(403).send({
            message: "System category cannot be deleted"
          });
        }

        const result = await categoriesCollection.deleteOne({
          _id: new ObjectId(req.params.id)
        });

        res.send(result);

      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });
    // POST new transaction
    app.post('/transactions', async (req, res) => {
      try {
        const transaction = req.body;

        if (!transaction.email || !transaction.amount || !transaction.category || !transaction.type) {
          return res.status(400).send({
            message: "Email, amount, category, and type are required"
          });
        }

        const result = await transactionsCollection.insertOne(transaction);
        res.send(result);

      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // GET all transactions for a user
    app.get('/transactions', async (req, res) => {
      try {
        const email = req.query.email;
        const type = req.query.type;

        if (!email) {
          return res.status(400).send({ message: "Email required" });
        }

        const query = { email };
        if (type) query.type = type;

        const result = await transactionsCollection.find(query).sort({ date: -1 }).toArray();
        res.send(result);

      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // GET single transaction
    app.get('/transactions/:id', async (req, res) => {
      try {
        const result = await transactionsCollection.findOne({
          _id: new ObjectId(req.params.id)
        });
        res.send(result);

      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // UPDATE transaction
    app.put('/transactions/:id', async (req, res) => {
      try {
        const result = await transactionsCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: req.body }
        );
        res.send(result);

      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // DELETE transaction
    app.delete('/transactions/:id', async (req, res) => {
      try {
        const result = await transactionsCollection.deleteOne({
          _id: new ObjectId(req.params.id)
        });
        res.send(result);

      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.get('/stats', async (req, res) => {
      try {
        const [users, transactions, categories] = await Promise.all([
          usersCollection.countDocuments(),
          transactionsCollection.countDocuments(),
          categoriesCollection.countDocuments(),
        ]);
        res.send({ users, transactions, categories });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}

app.get('/', (req, res) => {
  res.send("Expense Backend Tracker")
})

run().then(() => {
  app.listen(port, () => {
    console.log(`Expense Backend Tracker is running on ${port}`);
  });
}).catch(console.dir);