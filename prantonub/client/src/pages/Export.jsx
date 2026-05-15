import { useState } from "react";
import api from "../api/axios";

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

export default function Export() {
  const now = new Date();

  const [reportMonth, setReportMonth] = useState(now.getMonth() + 1);
  const [reportYear, setReportYear] = useState(now.getFullYear());
  const [reportLoading, setReportLoading] = useState(false);

  const handleExportReport = async () => {
    setReportLoading(true);

    // Open new tab immediately (must be before await to avoid popup blocker)
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(
        "<html><body style='font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f5f3ff'>" +
          "<p style='color:#4f46e5;font-size:18px'>⏳ Generating your report...</p></body></html>",
      );
    }

    try {
      const p = `month=${reportMonth}&year=${reportYear}`;
      const response = await api.get(`/export/summary?${p}`, {
        responseType: "text",
      });

      // Write the HTML report into the already-open tab
      if (newWindow) {
        newWindow.document.open();
        newWindow.document.write(response.data);
        newWindow.document.close();
      }
    } catch (err) {
      if (newWindow) newWindow.close();
      alert("Failed to generate report. Please try again.");
      console.error(err);
    } finally {
      setReportLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get("/export/csv", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `transactions-${new Date().toISOString().slice(0, 10)}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("CSV export failed. Please try again.");
      console.error(err);
    }
  };

  // Generate year options (5 years back to current year)
  const yearOptions = Array.from(
    { length: 6 },
    (_, i) => now.getFullYear() - 5 + i,
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="page-title">Export & Reports</h1>
        <p className="page-sub">Download and export your financial data</p>
      </div>

      {/* Export card */}
      <div className="card p-6">
        <div className="mb-5">
          <h2 className="font-bold text-gray-900 dark:text-white text-lg">
            Generate Reports
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Create PDF reports for specific months
          </p>
        </div>

        {/* Month & Year Picker */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <label className="label">Month</label>
            <select
              className="input"
              value={reportMonth}
              onChange={(e) => setReportMonth(Number(e.target.value))}
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Year</label>
            <select
              className="input"
              value={reportYear}
              onChange={(e) => setReportYear(Number(e.target.value))}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleExportReport}
          disabled={reportLoading}
          className="w-full btn-primary justify-center mb-3"
        >
          {reportLoading
            ? "⏳ Generating..."
            : `📄 Generate ${MONTHS[reportMonth - 1]} ${reportYear} PDF Report`}
        </button>

        <p className="text-xs text-gray-400 text-center">
          📌 Report opens in a new tab → click Download PDF to save
        </p>
      </div>

      {/* CSV Export card */}
      <div className="card p-6">
        <div className="mb-5">
          <h2 className="font-bold text-gray-900 dark:text-white text-lg">
            Export All Data
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Download all your transactions as CSV
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="w-full btn-secondary justify-center"
        >
          📊 Export All Transactions to CSV
        </button>
      </div>
    </div>
  );
}
