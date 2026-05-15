// server/src/controllers/exportController.js

const Transaction = require("../models/Transaction");

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT CSV
// ─────────────────────────────────────────────────────────────────────────────
const exportCSV = async (req, res) => {
  try {
    const { startDate, endDate, type, category } = req.query;
    const filter = { user: req.user._id };
    if (type && type !== "All") filter.type = type;
    if (category && category !== "All") filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) {
        const e = new Date(endDate);
        e.setHours(23, 59, 59, 999);
        filter.date.$lte = e;
      }
    }

    const transactions = await Transaction.find(filter).sort("-date");

    const headers = ["Date", "Title", "Category", "Type", "Amount", "Note"];
    const rows = transactions.map((t) => [
      new Date(t.date).toLocaleDateString(),
      `"${t.title.replace(/"/g, '""')}"`,
      t.category,
      t.type,
      t.amount.toFixed(2),
      `"${(t.note || "").replace(/"/g, '""')}"`,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="FinanceHub-export-${Date.now()}.csv"`,
    );
    res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT SUMMARY (Monthly PDF Report)
// ─────────────────────────────────────────────────────────────────────────────
const exportSummary = async (req, res) => {
  try {
    const now = new Date();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const year = Number(req.query.year) || now.getFullYear();

    const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    console.log(
      `📅 Fetching transactions for user ${req.user._id} from ${start} to ${end}`,
    );

    const transactions = await Transaction.find({
      user: req.user._id,
      date: { $gte: start, $lte: end },
    }).sort("-date");

    console.log(`📊 Found ${transactions.length} transactions`);

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    const catMap = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
      });

    const MONTHS = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const fileName = `FinanceHub-Report-${MONTHS[month - 1]}-${year}.pdf`;
    const netSavings = totalIncome - totalExpense;
    const savingsRate =
      totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : "0.0";
    const maxCatAmt = Math.max(...Object.values(catMap), 1);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>FinanceHub — ${MONTHS[month - 1]} ${year} Report</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f3f4f6; min-height: 100vh; padding: 40px 16px; color: #111; }
    .no-print { position: fixed; top: 20px; right: 20px; z-index: 999; }
    .btn-download {
      display: flex; align-items: center; gap: 8px;
      background: #6d28d9; color: white; border: none; cursor: pointer;
      font-size: 14px; font-weight: 600; padding: 12px 24px;
      border-radius: 9999px; box-shadow: 0 10px 25px rgba(109,40,217,0.3);
      transition: background 0.2s;
    }
    .btn-download:hover { background: #5b21b6; }
    .btn-download:disabled { opacity: 0.6; cursor: not-allowed; }
    .report { max-width: 900px; margin: 0 auto; background: white; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.12); overflow: hidden; }
    .header { background: linear-gradient(135deg, #6d28d9, #7c3aed, #6d28d9); padding: 40px; color: white; position: relative; }
    .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .logo { display: flex; align-items: center; gap: 12px; }
    .logo-icon { width: 44px; height: 44px; background: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 900; }
    .logo-name { font-size: 18px; font-weight: 700; }
    .logo-sub { font-size: 11px; color: #ddd6fe; }
    .badge { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #ddd6fe; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 6px 16px; border-radius: 9999px; }
    .title { font-size: 48px; font-weight: 900; letter-spacing: -1px; }
    .title span { color: #ddd6fe; }
    .subtitle { font-size: 13px; color: #c4b5fd; margin-top: 6px; }
    .body { padding: 40px; }
    .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
    .card { border-radius: 16px; padding: 24px; }
    .card-green  { background: #f0fdf4; border: 1px solid #bbf7d0; }
    .card-red    { background: #fff1f2; border: 1px solid #fecdd3; }
    .card-purple { background: #faf5ff; border: 1px solid #e9d5ff; }
    .card-label { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; }
    .card-green  .card-label { color: #16a34a; }
    .card-red    .card-label { color: #dc2626; }
    .card-purple .card-label { color: #7c3aed; }
    .card-value { font-size: 30px; font-weight: 900; }
    .card-green  .card-value { color: #15803d; }
    .card-red    .card-value { color: #dc2626; }
    .card-purple .card-value { color: #6d28d9; }
    .card-value-red { color: #dc2626 !important; }
    .card-note { font-size: 12px; margin-top: 4px; }
    .card-green  .card-note { color: #4ade80; }
    .card-red    .card-note { color: #f87171; }
    .card-purple .card-note { color: #a78bfa; }
    .section-header { display: flex; align-items: center; gap: 12px; padding-bottom: 16px; border-bottom: 1px solid #f3f4f6; margin-bottom: 20px; }
    .section-title { font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #374151; }
    .section-count { margin-left: auto; font-size: 12px; color: #9ca3af; background: #f3f4f6; padding: 4px 12px; border-radius: 9999px; }
    .cat-row { display: flex; align-items: center; gap: 16px; margin-bottom: 12px; }
    .cat-name { font-size: 13px; font-weight: 500; color: #374151; width: 120px; flex-shrink: 0; }
    .cat-bar-wrap { flex: 1; height: 8px; background: #f3f4f6; border-radius: 9999px; overflow: hidden; }
    .cat-bar { height: 100%; background: linear-gradient(90deg, #7c3aed, #a78bfa); border-radius: 9999px; }
    .cat-pct { font-size: 11px; color: #9ca3af; width: 36px; text-align: right; flex-shrink: 0; }
    .cat-amt { font-size: 13px; font-weight: 700; color: #111827; width: 72px; text-align: right; flex-shrink: 0; }
    .mb-40 { margin-bottom: 40px; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #f9fafb; }
    th { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #9ca3af; padding: 12px 16px; text-align: left; }
    th:last-child { text-align: right; }
    td { padding: 12px 16px; font-size: 13px; }
    td:last-child { text-align: right; }
    tr.even { background: white; }
    tr.odd  { background: #f9fafb; }
    .date-cell { color: #9ca3af; white-space: nowrap; }
    .title-cell { font-weight: 500; color: #111827; }
    .badge-cat  { font-size: 11px; font-weight: 500; background: #f3f4f6; color: #6b7280; padding: 4px 10px; border-radius: 9999px; }
    .badge-income  { font-size: 11px; font-weight: 700; background: #d1fae5; color: #065f46; padding: 4px 10px; border-radius: 9999px; }
    .badge-expense { font-size: 11px; font-weight: 700; background: #fee2e2; color: #991b1b; padding: 4px 10px; border-radius: 9999px; }
    .amt-income  { font-weight: 700; color: #16a34a; }
    .amt-expense { font-weight: 700; color: #dc2626; }
    .empty { text-align: center; padding: 56px; color: #9ca3af; }
    .empty-icon { font-size: 40px; margin-bottom: 12px; }
    .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #f3f4f6; display: flex; justify-content: space-between; font-size: 12px; color: #9ca3af; }
    @media print { .no-print { display: none !important; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; display: none; }
  </style>
</head>
<body>

  <div class="no-print">
    <button id="downloadBtn" class="btn-download" onclick="downloadPDF()">
      <span id="btnIcon">⬇</span>
      <span id="btnText">Download PDF</span>
      <div id="spinner" class="spinner"></div>
    </button>
  </div>

  <div id="report" class="report">
    <div class="header">
      <div class="header-top">
        <div class="logo">
          <div class="logo-icon">F</div>
          <div>
            <div class="logo-name">FinanceHub</div>
            <div class="logo-sub">Personal Finance Tracker</div>
          </div>
        </div>
        <div class="badge">Monthly Report</div>
      </div>
      <div class="title">${MONTHS[month - 1]} <span>${year}</span></div>
      <div class="subtitle">
        Generated on ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        &nbsp;·&nbsp; ${transactions.length} transactions
      </div>
    </div>

    <div class="body">

      <!-- Summary Cards -->
      <div class="cards">
        <div class="card card-green">
          <div class="card-label">Income</div>
          <div class="card-value">$${totalIncome.toFixed(2)}</div>
          <div class="card-note">Total earned this month</div>
        </div>
        <div class="card card-red">
          <div class="card-label">Expenses</div>
          <div class="card-value">$${totalExpense.toFixed(2)}</div>
          <div class="card-note">Total spent this month</div>
        </div>
        <div class="card card-purple">
          <div class="card-label">Net Savings</div>
          <div class="card-value ${netSavings < 0 ? "card-value-red" : ""}">
            ${netSavings >= 0 ? "" : "-"}$${Math.abs(netSavings).toFixed(2)}
          </div>
          <div class="card-note">Savings rate: ${savingsRate}%</div>
        </div>
      </div>

      <!-- Category Breakdown -->
      ${
        Object.keys(catMap).length > 0
          ? `
      <div class="mb-40">
        <div class="section-header">
          <span>📊</span>
          <span class="section-title">Spending by Category</span>
          <span class="section-count">${Object.keys(catMap).length} categories</span>
        </div>
        ${Object.entries(catMap)
          .sort((a, b) => b[1] - a[1])
          .map(([cat, amt]) => {
            const pct = ((amt / maxCatAmt) * 100).toFixed(0);
            const sharePct =
              totalExpense > 0 ? ((amt / totalExpense) * 100).toFixed(1) : "0";
            return `
        <div class="cat-row">
          <div class="cat-name">${cat}</div>
          <div class="cat-bar-wrap"><div class="cat-bar" style="width:${pct}%"></div></div>
          <div class="cat-pct">${sharePct}%</div>
          <div class="cat-amt">$${amt.toFixed(2)}</div>
        </div>`;
          })
          .join("")}
      </div>`
          : ""
      }

      <!-- Transactions Table -->
      <div>
        <div class="section-header">
          <span>📋</span>
          <span class="section-title">All Transactions</span>
          <span class="section-count">${transactions.length} records</span>
        </div>

        ${
          transactions.length > 0
            ? `
        <table>
          <thead>
            <tr>
              <th>Date</th><th>Title</th><th>Category</th><th>Type</th><th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${transactions
              .map(
                (t, i) => `
            <tr class="${i % 2 === 0 ? "even" : "odd"}">
              <td class="date-cell">${new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
              <td class="title-cell">${t.title}</td>
              <td><span class="badge-cat">${t.category}</span></td>
              <td><span class="${t.type === "income" ? "badge-income" : "badge-expense"}">${t.type}</span></td>
              <td class="${t.type === "income" ? "amt-income" : "amt-expense"}">${t.type === "income" ? "+" : "-"}$${t.amount.toFixed(2)}</td>
            </tr>`,
              )
              .join("")}
          </tbody>
        </table>`
            : `
        <div class="empty">
          <div class="empty-icon">📭</div>
          <div>No transactions found for this period</div>
        </div>`
        }
      </div>

      <div class="footer">
        <span><strong>FinanceHub</strong> &nbsp;·&nbsp; Confidential financial report</span>
        <span>${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
      </div>

    </div>
  </div>

  <script>
    function downloadPDF() {
      const btn     = document.getElementById("downloadBtn");
      const btnText = document.getElementById("btnText");
      const btnIcon = document.getElementById("btnIcon");
      const spinner = document.getElementById("spinner");

      btn.disabled = true;
      btnText.textContent = "Generating...";
      btnIcon.style.display = "none";
      spinner.style.display = "inline-block";

      html2pdf()
        .set({
          margin:      [8, 8, 8, 8],
          filename:    "${fileName}",
          image:       { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF:       { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(document.getElementById("report"))
        .save()
        .then(() => {
          btn.disabled = false;
          btnText.textContent = "Download PDF";
          btnIcon.style.display = "inline";
          spinner.style.display = "none";
        });
    }
  </script>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { exportCSV, exportSummary };
