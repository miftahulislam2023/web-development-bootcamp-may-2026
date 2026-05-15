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

    // ✅ FIX 1: Open the window BEFORE the await.
    // Browsers only allow window.open() in direct response to a user gesture.
    // After an `await`, the call is no longer synchronous and gets blocked as a popup.
    const newWindow = window.open("", "_blank");

    // Show a loading message in the new tab while the request runs
    if (newWindow) {
      newWindow.document.write(
        "<html><body style='font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f5f3ff'>" +
          "<p style='color:#4f46e5;font-size:18px'>⏳ Generating your report...</p></body></html>",
      );
    }

    try {
      const p = `month=${reportMonth}&year=${reportYear}`;
      const response = await api.get(`/export/summary?${p}`, {
        responseType: "blob",
      });

      // ✅ FIX 2: Convert blob to text, then write into the already-open window.
      // The old code created an object URL but window.open() was called after await (popup blocked).
      const htmlText = await response.data.text();

      if (newWindow) {
        newWindow.document.open();
        newWindow.document.write(htmlText);
        newWindow.document.close();
      }
    } catch (err) {
      // Close the blank tab if the request failed
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
            ? "⏳ Generating... (may take a moment)"
            : `📄 Generate ${MONTHS[reportMonth - 1]} ${reportYear} PDF Report`}
        </button>
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
