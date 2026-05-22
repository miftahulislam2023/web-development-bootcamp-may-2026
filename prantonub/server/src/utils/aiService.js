// server/src/utils/aiService.js
// Handles all Groq API communication and financial data preparation

const Groq = require("groq-sdk");

// Initialize Groq client — API key stays on server only
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Build a structured financial summary from the user's transactions.
 * This becomes the context the AI uses to answer questions accurately.
 */
const buildFinancialContext = (transactions) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthTx = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const lastMonthTx = transactions.filter((t) => {
    const d = new Date(t.date);
    const lm = currentMonth === 0 ? 11 : currentMonth - 1;
    const ly = currentMonth === 0 ? currentYear - 1 : currentYear;
    return d.getMonth() === lm && d.getFullYear() === ly;
  });

  const sum = (txList, type) =>
    txList.filter((t) => t.type === type).reduce((acc, t) => acc + t.amount, 0);

  const categoryMap = {};
  thisMonthTx
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

  const categoryBreakdown = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt]) => `  - ${cat}: $${amt.toFixed(2)}`)
    .join("\n");

  const recentList = transactions
    .slice(0, 10)
    .map(
      (t) =>
        `  - [${t.type.toUpperCase()}] ${t.title} | $${t.amount.toFixed(2)} | ${t.category} | ${new Date(t.date).toLocaleDateString()}`,
    )
    .join("\n");

  const expenseAmounts = thisMonthTx
    .filter((t) => t.type === "expense")
    .map((t) => t.amount);

  const avgExpense =
    expenseAmounts.length > 0
      ? expenseAmounts.reduce((a, b) => a + b, 0) / expenseAmounts.length
      : 0;

  const unusualExpenses = thisMonthTx
    .filter((t) => t.type === "expense" && t.amount > avgExpense * 2)
    .map((t) => `  - ${t.title}: $${t.amount.toFixed(2)} (${t.category})`)
    .join("\n");

  return `
=== USER FINANCIAL DATA ===

📅 THIS MONTH (${now.toLocaleString("default", { month: "long", year: "numeric" })}):
  - Total Income:   $${sum(thisMonthTx, "income").toFixed(2)}
  - Total Expenses: $${sum(thisMonthTx, "expense").toFixed(2)}
  - Net Savings:    $${(sum(thisMonthTx, "income") - sum(thisMonthTx, "expense")).toFixed(2)}
  - Transactions:   ${thisMonthTx.length}

📅 LAST MONTH:
  - Total Income:   $${sum(lastMonthTx, "income").toFixed(2)}
  - Total Expenses: $${sum(lastMonthTx, "expense").toFixed(2)}
  - Net Savings:    $${(sum(lastMonthTx, "income") - sum(lastMonthTx, "expense")).toFixed(2)}

📊 SPENDING BY CATEGORY (this month):
${categoryBreakdown || "  No expense data"}

⚠️ UNUSUAL EXPENSES (above 2x average of $${avgExpense.toFixed(2)}):
${unusualExpenses || "  None detected"}

🕐 RECENT 10 TRANSACTIONS:
${recentList || "  No transactions yet"}

📈 ALL-TIME TOTALS:
  - Total Income:   $${sum(transactions, "income").toFixed(2)}
  - Total Expenses: $${sum(transactions, "expense").toFixed(2)}
  - Total Records:  ${transactions.length}
`.trim();
};

/**
 * Send a message to Groq with the user's financial context.
 * @param {Array}  transactions - User's transaction records from MongoDB
 * @param {Array}  history      - Previous messages [{role, content}]
 * @param {string} userMessage  - The user's current question
 * @returns {string} AI response text
 */
const askAI = async (transactions, history, userMessage) => {
  const financialContext = buildFinancialContext(transactions);

  const systemPrompt = `
You are FinanceHub AI, a smart and friendly personal financial assistant.
You have access to the user's real financial data shown below.
Your job is to analyze their data and give helpful, accurate, and actionable financial insights.

RULES:
- Only answer finance-related questions
- Be concise but insightful (3-5 sentences max unless analysis is needed)
- Use emojis sparingly to make responses friendly
- Always reference the actual numbers from the user's data
- If asked something unrelated to finance, politely redirect
- Format currency as $X.XX
- Give specific actionable advice, not generic tips

${financialContext}
`.trim();

  // Build messages array — system prompt + history + new message
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-10).map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    })),
    { role: "user", content: userMessage },
  ];

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile", // free, fast, very capable
    messages,
    max_tokens: 1024,
    temperature: 0.7,
  });

  return response.choices[0].message.content;
};

module.exports = { askAI };
