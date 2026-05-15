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
      `attachment; filename="FinanceHub-export-${Date.now()}.csv"`,
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
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: { sans: ['Inter', 'sans-serif'] },
          colors: {
            brand: { DEFAULT: '#7c3aed', light: '#ede9fe', dark: '#5b21b6' }
          }
        }
      }
    }
  </script>
  <style>
    body { font-family: 'Inter', sans-serif; }
    .spinner { display: none; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .animate-spin-btn { animation: spin 0.7s linear infinite; }
    .cat-bar { transition: width 0.6s ease; }
    @media print { .no-print { display: none !important; } }
  </style>
</head>
<body class="bg-gray-100 min-h-screen py-10 px-4">

  <!-- Floating Download Button -->
  <div class="no-print fixed top-5 right-5 z-50">
    <button
      id="downloadBtn"
      onclick="downloadPDF()"
      class="flex items-center gap-2 bg-violet-700 hover:bg-violet-800 active:scale-95 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-xl transition-all duration-200"
    >
      <span id="btnIcon" class="text-base">⬇</span>
      <span id="btnText">Download PDF</span>
      <div id="spinner" class="spinner w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-btn"></div>
    </button>
  </div>

  <!-- Report Page -->
  <div id="report" class="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">

    <!-- ── Hero Header ── -->
    <div class="bg-gradient-to-br from-violet-700 via-violet-600 to-purple-700 px-10 py-10 relative overflow-hidden">
      <!-- Decorative circles -->
      <div class="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white opacity-5"></div>
      <div class="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-white opacity-5"></div>

      <!-- Top row -->
      <div class="relative flex items-center justify-between mb-8">
        <!-- Brand -->
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white font-black text-xl">F</div>
          <div>
            <p class="text-white font-bold text-lg leading-none">FinanceHub</p>
            <p class="text-violet-200 text-xs mt-0.5">Personal Finance Tracker</p>
          </div>
        </div>
        <!-- Badge -->
        <span class="text-xs font-semibold tracking-widest uppercase text-violet-200 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full">
          Monthly Report
        </span>
      </div>

      <!-- Title -->
      <div class="relative">
        <h1 class="text-5xl font-extrabold text-white tracking-tight leading-none mb-2">
          ${MONTHS[month - 1]} <span class="text-violet-200">${year}</span>
        </h1>
        <p class="text-violet-300 text-sm">
          Generated on ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          &nbsp;·&nbsp; ${transactions.length} transactions
        </p>
      </div>
    </div>

    <!-- ── Body ── -->
    <div class="px-10 py-10">

      <!-- ── Summary Cards ── -->
      <div class="grid grid-cols-3 gap-5 mb-10">

        <!-- Income -->
        <div class="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 text-sm">↑</div>
            <p class="text-xs font-semibold uppercase tracking-widest text-emerald-600">Income</p>
          </div>
          <p class="text-3xl font-extrabold text-emerald-700 tracking-tight">$${totalIncome.toFixed(2)}</p>
          <p class="text-xs text-emerald-500 mt-1">Total earned this month</p>
        </div>

        <!-- Expenses -->
        <div class="bg-red-50 border border-red-100 rounded-2xl p-6">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-500 text-sm">↓</div>
            <p class="text-xs font-semibold uppercase tracking-widest text-red-500">Expenses</p>
          </div>
          <p class="text-3xl font-extrabold text-red-600 tracking-tight">$${totalExpense.toFixed(2)}</p>
          <p class="text-xs text-red-400 mt-1">Total spent this month</p>
        </div>

        <!-- Savings -->
        <div class="bg-violet-50 border border-violet-100 rounded-2xl p-6">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600 text-sm">◆</div>
            <p class="text-xs font-semibold uppercase tracking-widest text-violet-600">Net Savings</p>
          </div>
          <p class="text-3xl font-extrabold tracking-tight ${netSavings >= 0 ? "text-violet-700" : "text-red-600"}">
            ${netSavings >= 0 ? "" : "−"}$${Math.abs(netSavings).toFixed(2)}
          </p>
          <p class="text-xs text-violet-400 mt-1">Savings rate: ${savingsRate}%</p>
        </div>
      </div>

      <!-- ── Savings Rate Bar ── -->
      ${
        totalIncome > 0
          ? `
      <div class="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-10">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm font-semibold text-gray-700">💰 Savings Rate</p>
          <p class="text-sm font-bold ${netSavings >= 0 ? "text-violet-600" : "text-red-500"}">${savingsRate}%</p>
        </div>
        <div class="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div class="h-full rounded-full ${netSavings >= 0 ? "bg-gradient-to-r from-violet-500 to-purple-400" : "bg-red-400"}"
               style="width: ${Math.min(Math.abs(parseFloat(savingsRate)), 100)}%"></div>
        </div>
        <p class="text-xs text-gray-400 mt-2">
          You saved $${Math.abs(netSavings).toFixed(2)} out of $${totalIncome.toFixed(2)} earned
        </p>
      </div>`
          : ""
      }

      <!-- ── Category Breakdown ── -->
      ${
        Object.keys(catMap).length > 0
          ? `
      <div class="mb-10">
        <div class="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
          <div class="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center text-sm">📊</div>
          <h2 class="text-sm font-bold text-gray-800 uppercase tracking-wider">Spending by Category</h2>
          <span class="ml-auto text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">${Object.keys(catMap).length} categories</span>
        </div>

        <div class="space-y-3">
          ${Object.entries(catMap)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, amt]) => {
              const pct = ((amt / maxCatAmt) * 100).toFixed(0);
              const sharePct =
                totalExpense > 0
                  ? ((amt / totalExpense) * 100).toFixed(1)
                  : "0";
              return `
          <div class="flex items-center gap-4">
            <p class="text-sm text-gray-700 font-medium capitalize w-28 flex-shrink-0">${cat}</p>
            <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full cat-bar" style="width:${pct}%"></div>
            </div>
            <p class="text-xs text-gray-400 w-10 text-right flex-shrink-0">${sharePct}%</p>
            <p class="text-sm font-bold text-gray-800 w-20 text-right flex-shrink-0">$${amt.toFixed(2)}</p>
          </div>`;
            })
            .join("")}
        </div>
      </div>`
          : ""
      }

      <!-- ── Transactions Table ── -->
      <div>
        <div class="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
          <div class="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center text-sm">📋</div>
          <h2 class="text-sm font-bold text-gray-800 uppercase tracking-wider">All Transactions</h2>
          <span class="ml-auto text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">${transactions.length} records</span>
        </div>

        ${
          transactions.length > 0
            ? `
        <div class="overflow-hidden rounded-xl border border-gray-100">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50">
                <th class="text-left text-xs font-semibold uppercase tracking-wider text-gray-400 px-4 py-3">Date</th>
                <th class="text-left text-xs font-semibold uppercase tracking-wider text-gray-400 px-4 py-3">Title</th>
                <th class="text-left text-xs font-semibold uppercase tracking-wider text-gray-400 px-4 py-3">Category</th>
                <th class="text-left text-xs font-semibold uppercase tracking-wider text-gray-400 px-4 py-3">Type</th>
                <th class="text-right text-xs font-semibold uppercase tracking-wider text-gray-400 px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              ${transactions
                .map(
                  (t, i) => `
              <tr class="${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-violet-50/30 transition-colors">
                <td class="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">${new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                <td class="px-4 py-3 text-sm font-medium text-gray-800">${t.title}</td>
                <td class="px-4 py-3">
                  <span class="inline-block text-xs font-medium bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full capitalize">${t.category}</span>
                </td>
                <td class="px-4 py-3">
                  <span class="inline-block text-xs font-bold px-2.5 py-1 rounded-full ${t.type === "income" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}">
                    ${t.type}
                  </span>
                </td>
                <td class="px-4 py-3 text-right text-sm font-bold ${t.type === "income" ? "text-emerald-600" : "text-red-500"}">
                  ${t.type === "income" ? "+" : "−"}$${t.amount.toFixed(2)}
                </td>
              </tr>`,
                )
                .join("")}
            </tbody>
          </table>
        </div>`
            : `
        <div class="text-center py-14 text-gray-400">
          <p class="text-4xl mb-3">📭</p>
          <p class="text-sm font-medium">No transactions found for this period</p>
        </div>`
        }
      </div>

      <!-- ── Footer ── -->
      <div class="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
        <p class="text-xs text-gray-400">
          <span class="font-semibold text-gray-500">FinanceHub</span> &nbsp;·&nbsp; Confidential financial report
        </p>
        <p class="text-xs text-gray-400">${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
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
