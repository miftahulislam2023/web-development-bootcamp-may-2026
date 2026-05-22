const cron = require("node-cron");
const Recurring = require("../models/Recurring");
const Transaction = require("../models/Transaction");

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("⏰ Running recurring transactions cron...");
  try {
    const today = new Date();
    today.setHours(0,0,0,0);

    const actives = await Recurring.find({ isActive: true });

    for (const rec of actives) {
      const last = rec.lastGenerated ? new Date(rec.lastGenerated) : null;
      let shouldGenerate = false;

      if (!last) {
        shouldGenerate = true;
      } else {
        const diff = Math.floor((today - last) / (1000*60*60*24));
        if (rec.frequency === "daily" && diff >= 1) shouldGenerate = true;
        if (rec.frequency === "weekly" && diff >= 7) shouldGenerate = true;
        if (rec.frequency === "monthly") {
          const lastMonth = last.getMonth() + last.getFullYear()*12;
          const thisMonth = today.getMonth() + today.getFullYear()*12;
          if (thisMonth > lastMonth) shouldGenerate = true;
        }
      }

      if (shouldGenerate) {
        await Transaction.create({
          user: rec.user, title: rec.title, amount: rec.amount,
          category: rec.category, type: rec.type, date: today,
          note: `Auto-generated (${rec.frequency})`, isRecurring: true,
        });
        rec.lastGenerated = today;
        await rec.save();
      }
    }
    console.log("✅ Recurring cron done");
  } catch (err) {
    console.error("❌ Cron error:", err.message);
  }
});
