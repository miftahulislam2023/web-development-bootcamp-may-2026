const User= require("../models/user.model");
const Account = require("../models/account.model");
const moment = require("moment");
const Transaction = require("../models/transaction.model");
const PDFDocument = require("pdfkit");

const dashboardInfo = async (req, res) => {

    const userId = req.user.sub;

    try {

        const incomes = await Transaction.find({
            userId,
            type: "income"
        });

        const expenses = await Transaction.find({
            userId,
            type: "expense"
        });

        const accounts = await Account.find({
            userId
        });


        const totalIncome = incomes.reduce(
            (sum, item) => sum + item.amount,
            0
        );

        const totalExpense = expenses.reduce(
            (sum, item) => sum + item.amount,
            0
        );

        
        const currentBalance = accounts.reduce(
            (sum, account) => sum + account.balance,
            0
        );

        res.status(200).json({
            totalIncome,
            totalExpense,
            currentBalance,
            netSavings:
                totalIncome - totalExpense
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const monthlySummary = async (req, res) => {
    const userId = req.user.sub;
    const { month } = req.query;

    try {

        if (!month) {
            return res.status(400).json({
                message: "Month is required"
            });
        }

        const startDate = new Date(`${month}-01`);

        const endDate = new Date(startDate);

        endDate.setMonth(
            endDate.getMonth() + 1
        );

        const transactions =
            await Transaction.find({ userId,
              transactionDate: {
                    $gte: startDate,
                    $lt: endDate
                }

            }).sort({ createdAt: -1 });

        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach((item) => {

            if (item.type === "income") {
                totalIncome += item.amount;
            }

            else {
                totalExpense += item.amount;
            }
        });

        res.status(200).json({

            month,

            totalIncome,

            totalExpense,

            netSavings: totalIncome - totalExpense,

            transactions
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};



const downloadMonthlyReport = async (req, res) => {
    const userId = req.user.sub;
  
    const { month } = req.query;
  
    try {
      if (!month) {
        return res.status(400).json({
          message: "Month is required",
        });
      }
  
      // dates
      const startDate = new Date(`${month}-01`);
  
      const endDate = new Date(startDate);
  
      endDate.setMonth(endDate.getMonth() + 1);
  
      // transactions
      const transactions = await Transaction.find({
        userId,
  
        transactionDate: {
          $gte: startDate,
          $lt: endDate,
        },
      }).sort({ createdAt: -1 });
  
      // separate income & expense
      const incomeTransactions =
        transactions.filter(
          (item) => item.type === "income"
        );
  
      const expenseTransactions =
        transactions.filter(
          (item) => item.type === "expense"
        );
  
      // totals
      const totalIncome =
        incomeTransactions.reduce(
          (sum, item) => sum + item.amount,
          0
        );
  
      const totalExpense =
        expenseTransactions.reduce(
          (sum, item) => sum + item.amount,
          0
        );
  
      const netSavings =
        totalIncome - totalExpense;
  
      // PDF
      const doc = new PDFDocument({
        margin: 50,
      });
  
      res.setHeader(
        "Content-Type",
        "application/pdf"
      );
  
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=report-${month}.pdf`
      );
  
      doc.pipe(res);
  
      // helper
      const line = () => {
        doc
          .moveTo(50, doc.y)
          .lineTo(545, doc.y)
          .strokeColor("#E2E8F0")
          .stroke();
  
        doc.moveDown();
      };
  
      // APP NAME
      doc
        .fontSize(24)
        .fillColor("#111827")
        .text("ExpenseTracker", {
          align: "center",
        });
  
      doc.moveDown(0.3);
  
      // REPORT TITLE
      doc
        .fontSize(15)
        .fillColor("#64748B")
        .text("Monthly Financial Report", {
          align: "center",
        });
  
      doc.moveDown(2);
  
      // MONTH
      doc
        .fontSize(13)
        .fillColor("#111827")
        .text(`Month: ${month}`);
  
      doc.moveDown();
  
      line();
  
      // =========================
      // INCOME
      // =========================
  
      doc
        .fontSize(18)
        .fillColor("#059669")
        .text("Income");
  
      doc.moveDown();
  
      if (incomeTransactions.length === 0) {
        doc
          .fontSize(12)
          .fillColor("#64748B")
          .text("No income transactions");
      }
  
      incomeTransactions.forEach(
        (item, index) => {
          doc
            .fontSize(12)
            .fillColor("#111827")
            .text(
              `${index + 1}. ${item.title}`,
              50,
              doc.y,
              {
                continued: true,
              }
            );
  
          doc.text(
            `BDT ${item.amount.toLocaleString(
              "en-BD"
            )}`,
            {
              align: "right",
            }
          );
  
          doc
            .fontSize(10)
            .fillColor("#64748B")
            .text(
              `${item.category || "Other"}`
            );
  
          doc.moveDown(0.7);
        }
      );
  
      line();
  
      doc
        .fontSize(13)
        .fillColor("#111827")
        .text(
          `Total Income: BDT ${totalIncome.toLocaleString(
            "en-BD"
          )}`,
          {
            align: "right",
          }
        );
  
      doc.moveDown(2);
  
      // =========================
      // EXPENSE
      // =========================
  
      doc
        .fontSize(18)
        .fillColor("#DC2626")
        .text("Expense");
  
      doc.moveDown();
  
      if (expenseTransactions.length === 0) {
        doc
          .fontSize(12)
          .fillColor("#64748B")
          .text("No expense transactions");
      }
  
      expenseTransactions.forEach(
        (item, index) => {
          doc
            .fontSize(12)
            .fillColor("#111827")
            .text(
              `${index + 1}. ${item.title}`,
              50,
              doc.y,
              {
                continued: true,
              }
            );
  
          doc.text(
            `BDT ${item.amount.toLocaleString(
              "en-BD"
            )}`,
            {
              align: "right",
            }
          );
  
          doc
            .fontSize(10)
            .fillColor("#64748B")
            .text(
              `${item.category || "Other"}`
            );
  
          doc.moveDown(0.7);
        }
      );
  
      line();
  
      doc
        .fontSize(13)
        .fillColor("#111827")
        .text(
          `Total Expense: BDT ${totalExpense.toLocaleString(
            "en-BD"
          )}`,
          {
            align: "right",
          }
        );
  
      doc.moveDown(2);
  
      // =========================
      // NET SAVINGS
      // =========================
  
      line();
  
      doc
        .fontSize(20)
        .fillColor("#4F46E5")
        .text("Net Savings", {
          align: "center",
        });
  
      doc.moveDown(0.5);
  
      doc
        .fontSize(28)
        .fillColor(
          netSavings >= 0
            ? "#059669"
            : "#DC2626"
        )
        .text(
          `BDT ${netSavings.toLocaleString(
            "en-BD"
          )}`,
          {
            align: "center",
          }
        );
  
      doc.end();
    } catch (error) {
      console.error(error);
  
      res.status(500).json({
        message: "Server error",
      });
    }
  };

const chartData = async (req, res) => {

    const userId = req.user.sub;

    try {

        const transactions = await Transaction.find({
            userId,
        }).sort({transactionDate: 1});

        const months ={};

        transactions.forEach((transaction) =>{
            const date = new Date(transaction.transactionDate);
            const month = date.toLocaleString("en-US", {
                month: "short",
                year: "2-digit",
              });

            if(!months[month]){
                months[month]={
                    month,
                    income: 0, 
                    expense: 0,
                };
            }
            if(transaction.type === "income"){
                months[month].income += transaction.amount;
            } else {
                months[month].expense += transaction.amount;
            }
        });
            const result = Object.values(months).slice(-6);
            return res.status(200).json(result);
    }

            catch(error){
                console.error(error);
                return res.status(500).json({
                    message: "Server error"
                });
            }
}
const expenseCategories = async (req, res) => {
    const userId = req.user.sub;
  
    try {
      const transactions = await Transaction.find({
        userId,
        type: "expense",
      }).sort({ transactionDate: 1 });
  
      const categories = {};
  
      transactions.forEach((transaction) => {
        const category = transaction.category || "Other";
  
        if (!categories[category]) {
          categories[category] = { category, amount: 0 };
        }
  
        categories[category].amount += transaction.amount;
      });
  
      const result = Object.values(categories);
  
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Server error",
      });
    }
  };         

module.exports = {
    dashboardInfo,
    monthlySummary,
    downloadMonthlyReport,
    chartData,
    expenseCategories,
};
