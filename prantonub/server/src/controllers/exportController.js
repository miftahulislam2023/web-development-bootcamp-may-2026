const Transaction = require("../models/Transaction");

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
      `attachment; filename="spendwise-export-${Date.now()}.csv"`,
    );
    res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const exportSummary = async (req, res) => {
  try {
    const now = new Date();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const year = Number(req.query.year) || now.getFullYear();

    // ✅ FIXED: correct start and end for any selected month
    const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    const transactions = await Transaction.find({
      user: req.user._id,
      date: { $gte: start, $lte: end },
    }).sort("-date");

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
    const fileName = `SpendWise-Report-${MONTHS[month - 1]}-${year}.pdf`;

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>SpendWise Report - ${MONTHS[month - 1]} ${year}</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; color: #1f2937; background: #f3f4f6; padding: 40px 20px; }
    .page { max-width: 820px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .topbar { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; }
    .logo { display: flex; align-items: center; gap: 10px; }
    .logo-icon { width: 42px; height: 42px; background: #7c3aed; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 20px; }
    .logo-name { font-size: 20px; font-weight: 800; color: #111827; }
    .logo-sub  { font-size: 12px; color: #9ca3af; margin-top: 2px; }
    .btn-download {
      display: inline-flex; align-items: center; gap: 8px;
      background: #7c3aed; color: white; border: none;
      border-radius: 10px; padding: 11px 22px;
      font-size: 14px; font-weight: 600; cursor: pointer;
      transition: background 0.2s;
    }
    .btn-download:hover { background: #6d28d9; }
    .btn-download:disabled { background: #a78bfa; cursor: not-allowed; }
    .spinner {
      width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      display: none;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .report-title { font-size: 22px; font-weight: 700; color: #111827; margin-bottom: 4px; }
    .report-sub   { font-size: 13px; color: #6b7280; margin-bottom: 28px; }
    .cards { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 32px; }
    .card { background: #f9fafb; border-radius: 12px; padding: 18px 20px; border: 1px solid #e5e7eb; }
    .card-label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
    .card-value { font-size: 26px; font-weight: 800; }
    .income  { color: #059669; }
    .expense { color: #dc2626; }
    .savings { color: #7c3aed; }
    .section-title { font-size: 15px; font-weight: 700; color: #374151; margin: 28px 0 12px; padding-bottom: 8px; border-bottom: 2px solid #f3f4f6; }
    .cat-row { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
    .cat-row:last-child { border-bottom: none; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #7c3aed; }
    th { color: white; padding: 10px 14px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
    td { padding: 10px 14px; font-size: 13px; border-bottom: 1px solid #f3f4f6; color: #374151; }
    tr:nth-child(even) td { background: #fafafa; }
    .badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .badge-income  { background: #d1fae5; color: #065f46; }
    .badge-expense { background: #fee2e2; color: #991b1b; }
    .amount-income  { color: #059669; font-weight: 700; }
    .amount-expense { color: #dc2626; font-weight: 700; }
    .footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #f3f4f6; font-size: 11px; color: #9ca3af; text-align: center; }
  </style>
</head>
<body>
  <div class="page" id="report">

    <div class="topbar">
      <div class="logo">
        <div class="logo-icon">S</div>
        <div>
          <div class="logo-name">SpendWise</div>
          <div class="logo-sub">Personal Expense Tracker</div>
        </div>
      </div>
      <button class="btn-download" id="downloadBtn" onclick="downloadPDF()">
        <span id="btnIcon">⬇️</span>
        <span id="btnText">Download PDF</span>
        <div class="spinner" id="spinner"></div>
      </button>
    </div>

    <p class="report-title">Monthly Financial Report</p>
    <p class="report-sub">${MONTHS[month - 1]} ${year} &nbsp;·&nbsp; Generated on ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>

    <div class="cards">
      <div class="card"><div class="card-label">Total Income</div><div class="card-value income">$${totalIncome.toFixed(2)}</div></div>
      <div class="card"><div class="card-label">Total Expenses</div><div class="card-value expense">$${totalExpense.toFixed(2)}</div></div>
      <div class="card"><div class="card-label">Net Savings</div><div class="card-value savings">$${(totalIncome - totalExpense).toFixed(2)}</div></div>
    </div>

    ${
      Object.keys(catMap).length > 0
        ? `
    <p class="section-title">📊 Spending by Category</p>
    ${Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .map(
        ([cat, amt]) => `
      <div class="cat-row"><span>${cat}</span><strong>$${amt.toFixed(2)}</strong></div>
    `,
      )
      .join("")}`
        : ""
    }

    <p class="section-title">📋 All Transactions (${transactions.length})</p>
    ${
      transactions.length > 0
        ? `
    <table>
      <thead><tr><th>Date</th><th>Title</th><th>Category</th><th>Type</th><th>Amount</th></tr></thead>
      <tbody>
        ${transactions
          .map(
            (t) => `
        <tr>
          <td>${new Date(t.date).toLocaleDateString()}</td>
          <td>${t.title}</td>
          <td>${t.category}</td>
          <td><span class="badge badge-${t.type}">${t.type}</span></td>
          <td class="amount-${t.type}">${t.type === "income" ? "+" : "−"}$${t.amount.toFixed(2)}</td>
        </tr>`,
          )
          .join("")}
      </tbody>
    </table>`
        : `<p style="color:#9ca3af;font-size:13px;padding:20px 0">No transactions found for this period.</p>`
    }

    <div class="footer">Generated by SpendWise &nbsp;·&nbsp; ${new Date().toLocaleDateString()} &nbsp;·&nbsp; Confidential</div>
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

      btn.style.visibility = "hidden";

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
          btn.style.visibility = "visible";
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
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { exportCSV, exportSummary };
