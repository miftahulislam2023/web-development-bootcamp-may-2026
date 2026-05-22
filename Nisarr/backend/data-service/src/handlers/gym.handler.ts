// gym.handler.ts — Gym workout logging with PR detection
import crypto from "crypto";
import { db } from "../utils/database.js";
import { GymExerciseReorderSchema, GymWorkoutStartSchema, GymWorkoutFinishSchema, GymSetLogSchema } from "../schemas/index.js";

export async function handleGym(req: any, res: any, userId: string) {
    const { method, body, url = "" } = req;

    if (url.includes("/exercises/reorder") && method === "POST") {
        const parsed = GymExerciseReorderSchema.parse(body);
        await Promise.all(parsed.exercises.map((e, i) => db.execute({ sql: "UPDATE gym_exercises SET order_index = ? WHERE id = ? AND user_id = ?", args: [i, e.id, userId] })));
        return res.json({ success: true });
    }

    if (url.includes("/workouts/start") && method === "POST") {
        const parsed = GymWorkoutStartSchema.parse(body);
        const id = crypto.randomUUID(), logDate = new Date().toISOString();
        try { await db.execute({ sql: "INSERT INTO gym_workout_logs (id, user_id, plan_id, log_date, created_at) VALUES (?, ?, ?, ?, ?)", args: [id, userId, parsed.planId, logDate, logDate] }); }
        catch (e: any) { if (e.message?.includes("no such column: created_at")) await db.execute({ sql: "INSERT INTO gym_workout_logs (id, user_id, plan_id, log_date) VALUES (?, ?, ?, ?)", args: [id, userId, parsed.planId, logDate] }); else throw e; }
        return res.json({ success: true, id, logDate });
    }

    if (url.includes("/workouts/finish") && method === "POST") {
        const parsed = GymWorkoutFinishSchema.parse(body);
        await db.execute({ sql: "UPDATE gym_workout_logs SET duration_minutes = ?, overall_feeling = ?, notes = ? WHERE id = ? AND user_id = ?", args: [parsed.duration ?? null, parsed.feeling ?? null, parsed.notes ?? null, parsed.logId, userId] });
        return res.json({ success: true });
    }

    if (url.includes("/sets/log") && method === "POST") {
        const parsed = GymSetLogSchema.parse(body);
        const reps = parsed.reps ?? 0;
        const epley1RM = parsed.weight * (1 + (reps / 30));
        let isPr = false;
        const existingRes = await db.execute({ sql: "SELECT * FROM gym_personal_records WHERE LOWER(exercise_name) = LOWER(?) AND user_id = ?", args: [parsed.exerciseName, userId] });
        const date = new Date().toISOString();
        if (existingRes.rows.length === 0) {
            isPr = true;
            await db.execute({ sql: "INSERT INTO gym_personal_records (id, user_id, exercise_name, weight, reps, achieved_date, log_id) VALUES (?, ?, ?, ?, ?, ?, ?)", args: [crypto.randomUUID(), userId, parsed.exerciseName, parsed.weight, reps, date, parsed.logId] });
        } else {
            const best: any = existingRes.rows[0];
            if (epley1RM > (best.weight as number) * (1 + ((best.reps as number) / 30))) {
                isPr = true;
                await db.execute({ sql: "UPDATE gym_personal_records SET weight = ?, reps = ?, achieved_date = ?, log_id = ? WHERE id = ? AND user_id = ?", args: [parsed.weight, reps, date, parsed.logId, best.id, userId] });
            }
        }
        const setId = crypto.randomUUID();
        await db.execute({ sql: "INSERT INTO gym_set_logs (id, user_id, log_id, exercise_id, exercise_name, set_number, reps, weight, weight_unit, is_pr, rpe) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", args: [setId, userId, parsed.logId, parsed.exerciseId, parsed.exerciseName, parsed.setNumber, reps, parsed.weight, parsed.weightUnit, isPr ? 1 : 0, parsed.rpe ?? null] });
        return res.json({ success: true, id: setId, isPR: isPr, createdAt: date });
    }

    return res.status(404).json({ error: "Gym route not found" });
}
