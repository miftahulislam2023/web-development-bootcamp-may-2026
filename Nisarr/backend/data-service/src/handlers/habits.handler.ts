// habits.handler.ts — Habit completion with streak logic
import { db } from "../utils/database.js";
import { HabitCompleteSchema } from "../schemas/index.js";

export async function handleHabits(req: any, res: any, userId: string) {
    const { method, body, url = "" } = req;

    try {
    if (url.includes("/complete") && method === "POST") {
        try {
            const parsed = HabitCompleteSchema.parse(body);
            const { habit, date } = parsed;
            const todayStr = new Date().toISOString().split("T")[0];
            const targetDateStr = date ? date.split("T")[0] : todayStr;
            const targetDate = new Date(targetDateStr); targetDate.setHours(0, 0, 0, 0);
            const lastCompletedStr = habit.last_completed_date?.split("T")[0];
            const lastCompletedDate = lastCompletedStr ? new Date(lastCompletedStr) : null;
            if (lastCompletedDate) lastCompletedDate.setHours(0, 0, 0, 0);

            let streakStartDate: Date | null = null;
            if (lastCompletedDate && habit.streak_count > 0) {
                streakStartDate = new Date(lastCompletedDate);
                streakStartDate.setDate(streakStartDate.getDate() - habit.streak_count + 1);
                streakStartDate.setHours(0, 0, 0, 0);
            }

            let newStreak = 1, newLastCompleted = targetDateStr;
            if (!lastCompletedDate) { newStreak = 1; newLastCompleted = targetDateStr; }
            else if (targetDate.getTime() > lastCompletedDate.getTime()) {
                const diffDays = Math.round((targetDate.getTime() - lastCompletedDate.getTime()) / (1000 * 60 * 60 * 24));
                newStreak = diffDays === 1 ? habit.streak_count + 1 : 1;
                newLastCompleted = targetDateStr;
            } else if (targetDate.getTime() === lastCompletedDate.getTime()) {
                newStreak = habit.streak_count; newLastCompleted = lastCompletedStr!;
            } else {
                if (streakStartDate) {
                    const diffDays = Math.round((streakStartDate.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));
                    if (diffDays === 1) { newStreak = habit.streak_count + 1; newLastCompleted = lastCompletedStr!; }
                    else { if (targetDate >= streakStartDate) return res.json({ success: true, ignored: true }); return res.json({ success: true, ignored: true, message: "Disjoint past completion" }); }
                } else { newStreak = 1; newLastCompleted = targetDateStr; }
            }

            await db.execute({ sql: "UPDATE habits SET streak_count = ?, last_completed_date = ? WHERE id = ? AND user_id = ?", args: [newStreak, newLastCompleted, habit.id, userId] });
            return res.json({ success: true, newStreak, newLastCompleted });
        } catch (e: any) { return res.status(400).json({ error: e.errors || e.message }); }
    }

    if (url.includes("/all") && method === "DELETE") {
        await db.execute({ sql: "DELETE FROM habits WHERE user_id = ?", args: [userId] });
        return res.json({ success: true });
    }

    return res.status(404).json({ error: "Habits route not found" });
    } catch (outerError: any) {
        return res.status(500).json({ error: `Habits handler error: ${outerError.message}` });
    }
}
