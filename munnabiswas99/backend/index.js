const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const verifyToken = require("./middlewares/verifyToken");

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://personal-expense-tracker-a4828.web.app",
    ],
    credentials: true,
  }),
);

// Root Route
app.get("/", (req, res) => {
  res.send("Expense tracker server is running.");
});

const uri = process.env.MONGO_URI;

let client;
let clientPromise;

async function connectDB() {
  if (!clientPromise) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }

  const connectedClient = await clientPromise;

  return connectedClient.db("ExpenseTrackerDB");
}


// POST user
app.post("/users", async (req, res) => {
  try {
    const db = await connectDB();
    const userCollection = db.collection("users");
    const user = req.body;
    user.createdAt = new Date();
    const email = user.email;
    const userExist = await userCollection.findOne({ email });

    if (userExist) {
      return res.send({ message: "user already exist" });
    }

    const result = await userCollection.insertOne(user);
    console.log(result);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

// Update user Profile
app.patch("/users/profile", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const userCollection = db.collection("users");
    const email = req.decoded.email;
    const { displayName, photoURL } = req.body;

    const query = {
      email,
    };

    const updateDoc = {
      $set: {
        displayName,
        photoURL,
      },
    };

    const result = await userCollection.updateOne(query, updateDoc);

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

// Transaction Related API

// Get User Transactions Data
app.get("/transactions", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const transactionCollection = db.collection("transactions");
    const searchText = req.query.searchText;
    const filterType = req.query.filterType;
    const email = req.decoded.email;

    const query = { userEmail: email };

    if (searchText) {
      query.title = { $regex: searchText, $options: "i" };
    }

    if (filterType) {
      query.type = filterType;
    }
    const result = await transactionCollection
      .find(query)
      .limit(10)
      .sort({ createdAt: -1 })
      .toArray();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

// Get a specific transaction by id
app.get("/transactions/:id", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const transactionCollection = db.collection("transactions");
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await transactionCollection.findOne(query);

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

// Post Transaction Data
app.post("/transactions", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const transactionCollection = db.collection("transactions");
    const walletCollection = db.collection("wallets");

    const transactionData = req.body;
    transactionData.userEmail = req.decoded.email;
    transactionData.createdAt = new Date();

    const wallet = await walletCollection.findOne({
      _id: new ObjectId(transactionData.walletId),
    });

    if (!wallet) {
      return res.status(404).send({
        message: "Wallet not found",
      });
    }

    let updatedBalance = Number(wallet.balance);

    // For income add balance
    if (transactionData.type === "income") {
      updatedBalance += Number(transactionData.amount);
    }

    // for Expense/Investment/Savings reduce money
    else {
      updatedBalance -= Number(transactionData.amount);
    }

    // Prevent negative balance
    if (updatedBalance < 0) {
      return res.status(400).send({
        message: "Insufficient wallet balance",
      });
    }

    // Update Balance
    const query = { _id: new ObjectId(transactionData.walletId) };
    const updateDoc = {
      $set: {
        balance: updatedBalance,
      },
    };
    await walletCollection.updateOne(query, updateDoc);

    const result = await transactionCollection.insertOne(transactionData);

    res.send(result);
  } catch (error) {
    res.status(500).send({
      message: "Failed to add transaction",
    });
  }
});

// Update tranaction
app.patch("/transactions/:id", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const transactionCollection = db.collection("transactions");
    const walletCollection = db.collection("wallets");

    const id = req.params.id;
    const email = req.decoded.email;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid transaction id",
      });
    }

    const updatedData = req.body;

    // Remove unwanted fields
    delete updatedData._id;
    delete updatedData.userEmail;

    // FIND OLD TRANSACTION

    const oldTransaction = await transactionCollection.findOne({
      _id: new ObjectId(id),
      userEmail: email,
    });

    if (!oldTransaction) {
      return res.status(404).send({
        message: "Transaction not found",
      });
    }

    // FIND WALLET

    const wallet = await walletCollection.findOne({
      _id: new ObjectId(oldTransaction.walletId),
    });

    if (!wallet) {
      return res.status(404).send({
        message: "Wallet not found",
      });
    }

    // REVERSE OLD TRANSACTION EFFECT

    let updatedBalance = Number(wallet.balance);

    // OLD income → subtract
    if (oldTransaction.type === "income") {
      updatedBalance -= Number(oldTransaction.amount);
    }

    // OLD expense/investment/savings → add back
    else {
      updatedBalance += Number(oldTransaction.amount);
    }

    // APPLY NEW TRANSACTION EFFECT

    // NEW income → add
    if (updatedData.type === "income") {
      updatedBalance += Number(updatedData.amount);
    }

    // NEW expense/investment/savings → subtract
    else {
      updatedBalance -= Number(updatedData.amount);
    }

    // PREVENT NEGATIVE BALANCE

    if (updatedBalance < 0) {
      return res.status(400).send({
        message: "Insufficient wallet balance",
      });
    }

    // UPDATE WALLET BALANCE

    await walletCollection.updateOne(
      {
        _id: wallet._id,
      },
      {
        $set: {
          balance: updatedBalance,
        },
      },
    );

    // UPDATE TRANSACTION

    const query = {
      _id: new ObjectId(id),
      userEmail: email,
    };

    const updateDoc = {
      $set: {
        ...updatedData,
      },
    };

    const result = await transactionCollection.updateOne(query, updateDoc);

    res.send(result);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to update transaction",
    });
  }
});

// Delete Transaction
app.delete("/transactions/:id", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const transactionCollection = db.collection("transactions");
    const walletCollection = db.collection("wallets");
    const id = req.params.id;

    // STEP 1
    const transaction = await transactionCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!transaction) {
      return res.status(404).send({
        message: "Transaction not found",
      });
    }

    // STEP 2
    const wallet = await walletCollection.findOne({
      _id: new ObjectId(transaction.walletId),
    });

    if (!wallet) {
      return res.status(404).send({
        message: "Wallet not found",
      });
    }

    // STEP 3
    let updatedBalance = Number(wallet.balance);

    if (transaction.type === "income") {
      updatedBalance -= Number(transaction.amount);
    } else {
      updatedBalance += Number(transaction.amount);
    }

    if (updatedBalance < 0) {
      return res.status(400).send({
        message: "Insufficient wallet balance",
      });
    }

    // STEP 4
    await walletCollection.updateOne(
      {
        _id: wallet._id,
      },
      {
        $set: {
          balance: updatedBalance,
        },
      },
    );

    // STEP 5
    const result = await transactionCollection.deleteOne({
      _id: new ObjectId(id),
    });

    res.send(result);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to delete transaction",
    });
  }
});

// Dash Board data
app.get("/dashboard-data", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const transactionCollection = db.collection("transactions");
    const email = req.decoded.email;

    // Get Transactions
    const transactions = await transactionCollection
      .find({ userEmail: email })
      .toArray();

    // Summary Calculation
    const totalIncome = transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const totalExpense = transactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const totalSavings = transactions
      .filter((item) => item.type === "savings")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const totalInvestment = transactions
      .filter((item) => item.type === "investment")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    // Recent Income
    const recentIncome = transactions
      .filter((item) => item.type === "income")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // Recent Expense
    const recentExpense = transactions
      .filter((item) => item.type === "expense")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // Response Send
    res.send({
      summary: {
        totalIncome,
        totalExpense,
        totalSavings,
        totalInvestment,
      },

      recentIncome,

      recentExpense,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Failed to load dashboard data",
    });
  }
});

// Get Monthly Income and Expense
app.get("/income-expense", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const transactionCollection = db.collection("transactions");

    const email = req.decoded.email;

    const transactions = await transactionCollection
      .find({ userEmail: email })
      .toArray();

    // Build last 5 months info
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const now = new Date();
    const last5Months = [];

    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last5Months.push({
        name: monthNames[d.getMonth()],
        month: d.getMonth() + 1, // 1-12
        year: d.getFullYear(),
      });
    }

    // Filter and summarize
    const summary = last5Months.map(({ name, month, year }) => {
      const monthTransactions = transactions.filter((t) => {
        const [tYear, tMonth] = t.date.split("-").map(Number);
        return tYear === year && tMonth === month;
      });

      const income = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0); // 👈 Number()

      const expense = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0); // 👈 Number()
      return { name, income, expense };
    });

    res.send(summary);
  } catch (error) {
    console.error("income-expense error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get wallet data
app.get("/wallets", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const walletCollection = db.collection("wallets");
    const email = req.decoded.email;
    const result = await walletCollection.find({ userEmail: email }).toArray();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
});

// Post Wallet Data
app.post("/wallet", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const walletCollection = db.collection("wallets");

    const wallet = req.body;

    if (wallet.balance < 0) {
      return res.status(400).send({
        message: "Wallet balance can not be less than zero(0)",
      });
    }

    wallet.userEmail = req.decoded.email;

    wallet.createdAt = new Date();

    const result = await walletCollection.insertOne(wallet);

    res.send(result);
  } catch (error) {
    res.status(500).send({
      message: "Failed to add wallet",
    });
  }
});

module.exports = app;

// For Loaclhost
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Expense Tracker is listening on port ${PORT}`);
  });
}
