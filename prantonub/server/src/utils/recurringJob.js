const cron = require("node-cron");
const Recurring = require("../models/Recurring");
const Transaction = require("../models/Transaction");

const getNextDate = (current, frequency) => {
  const d = new Date(current);
  if (frequency === "daily")   d.setDate(d.getDate() + 1);
  if (frequency === "weekly")  d.setDate(d.getDate() + 7);
  if (frequency === "monthly") d.setMonth(d.getMonth() + 1);
  return d;
};

const processRecurring = async () => {
  try {
    const now = new Date();
    const due = await Recurring.find({ isActive: true, nextDate: { $lte: now } });

    for (const rec of due) {
      await Transaction.create({
        user:        rec.user,
        title:       rec.title,
        amount:      rec.amount,
        type:        rec.type,
        category:    rec.category,
        date:        rec.nextDate,
        note:        rec.note || "Auto-generated from recurring",
        isRecurring: true,
        recurringId: rec._id,
      });

      rec.nextDate = getNextDate(rec.nextDate, rec.frequency);
      await rec.save();
    }

    if (due.length > 0)
      console.log(`✅ Processed ${due.length} recurring transaction(s)`);
  } catch (err) {
    console.error("❌ Recurring job error:", err.message);
  }
};

// Run every hour
const startRecurringJob = () => {
  cron.schedule("0 * * * *", processRecurring);
  // Also run once at startup to catch any missed
  processRecurring();
  console.log("⏰ Recurring job scheduler started");
};

module.exports = { startRecurringJob };
