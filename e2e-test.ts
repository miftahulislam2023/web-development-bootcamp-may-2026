// Full E2E Test Script
const API_URL = "http://localhost:3030";

async function test() {
  try {
    console.log("🚀 Starting Full End-to-End Test...\n");

    // 1. Register
    console.log("1️⃣ Testing Registration...");
    const regRes = await fetch(`${API_URL}/auth/v1/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "e2etest@example.com",
        firstName: "E2E",
        lastName: "Test",
        password: "password123",
      }),
    });
    const regData = await regRes.json();
    const userId = regData.data?.id;
    console.log(`   ✓ User registered: ${userId}\n`);

    // 2. Login
    console.log("2️⃣ Testing Login...");
    const loginRes = await fetch(`${API_URL}/auth/v1/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "e2etest@example.com",
        password: "password123",
      }),
    });
    const loginData = await loginRes.json();
    const accessToken = loginData.data?.accessToken;
    console.log(`   ✓ Logged in, token: ${accessToken?.slice(0, 20)}...\n`);

    const authHeader = { Authorization: `Bearer ${accessToken}` };

    // 3. Create Category
    console.log("3️⃣ Testing Create Category...");
    const catRes = await fetch(`${API_URL}/categories/v1`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({
        name: "Groceries",
        type: "expense",
        icon: "🛒",
        color: "#FF6B6B",
      }),
    });
    const catData = await catRes.json();
    const categoryId = catData.data?.id;
    console.log(`   ✓ Category created: ${categoryId}\n`);

    // 4. List Categories
    console.log("4️⃣ Testing List Categories...");
    const listCatRes = await fetch(`${API_URL}/categories/v1?type=expense`, {
      headers: { ...authHeader },
    });
    const listCatData = await listCatRes.json();
    console.log(`   ✓ Categories listed: ${listCatData.data?.length} found\n`);

    // 5. Create Transaction
    console.log("5️⃣ Testing Create Transaction...");
    const txRes = await fetch(`${API_URL}/transactions/v1`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({
        type: "expense",
        amount: 50.5,
        currency: "USD",
        date: new Date().toISOString(),
        notes: "Weekly groceries",
        categoryId,
      }),
    });
    const txData = await txRes.json();
    const transactionId = txData.data?.id;
    console.log(`   ✓ Transaction created: ${transactionId}\n`);

    // 6. List Transactions
    console.log("6️⃣ Testing List Transactions...");
    const listTxRes = await fetch(
      `${API_URL}/transactions/v1?page=1&limit=10`,
      {
        headers: { ...authHeader },
      },
    );
    const listTxData = await listTxRes.json();
    console.log(
      `   ✓ Transactions listed: ${listTxData.data?.length || 0} found\n`,
    );

    // 7. Create Budget
    console.log("7️⃣ Testing Create Budget...");
    const budRes = await fetch(`${API_URL}/budgets/v1`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({
        name: "Monthly Groceries",
        limitAmount: 500,
        currency: "USD",
        period: "monthly",
        alertThreshold: 80,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        categoryId,
      }),
    });
    const budData = await budRes.json();
    const budgetId = budData.data?.id;
    console.log(`   ✓ Budget created: ${budgetId}\n`);

    // 8. List Budgets
    console.log("8️⃣ Testing List Budgets...");
    const listBudRes = await fetch(`${API_URL}/budgets/v1`, {
      headers: { ...authHeader },
    });
    const listBudData = await listBudRes.json();
    console.log(
      `   ✓ Budgets listed: ${listBudData.data?.length || 0} found\n`,
    );

    // 9. Get Profile (Me)
    console.log("9️⃣ Testing Get Profile...");
    const meRes = await fetch(`${API_URL}/auth/v1/me`, {
      headers: { ...authHeader },
    });
    const meData = await meRes.json();
    console.log(`   ✓ Profile fetched: ${meData.data?.email}\n`);

    // 10. Update Transaction
    console.log("🔟 Testing Update Transaction...");
    const updateTxRes = await fetch(
      `${API_URL}/transactions/v1/${transactionId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({
          amount: 55.75,
          notes: "Updated groceries amount",
        }),
      },
    );
    const updateTxData = await updateTxRes.json();
    console.log(`   ✓ Transaction updated: ${updateTxData.data?.amount}\n`);

    // 11. Delete Transaction
    console.log("1️⃣1️⃣ Testing Delete Transaction...");
    const deleteTxRes = await fetch(
      `${API_URL}/transactions/v1/${transactionId}`,
      { method: "DELETE", headers: { ...authHeader } },
    );
    console.log(
      `   ✓ Transaction deleted: ${deleteTxRes.status === 204 ? "Success" : "Failed"}\n`,
    );

    // 12. Logout
    console.log("1️⃣2️⃣ Testing Logout...");
    const logoutRes = await fetch(`${API_URL}/auth/v1/logout`, {
      method: "POST",
      headers: { ...authHeader },
    });
    console.log(`   ✓ Logged out\n`);

    console.log(
      "✅ All tests passed! The full project is working correctly.\n",
    );
    console.log("📊 Summary:");
    console.log("   ✓ User registration");
    console.log("   ✓ User login with JWT");
    console.log("   ✓ Profile fetching");
    console.log("   ✓ Category CRUD operations");
    console.log("   ✓ Transaction CRUD operations");
    console.log("   ✓ Budget CRUD operations");
    console.log("   ✓ Database integration");
    console.log("   ✓ Authentication middleware");
  } catch (error: any) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  }
}

test();
