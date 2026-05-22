// schemas/index.ts — Zod schemas for request validation
// Barrel export — all schemas in one place

import { z } from "zod";

export const GenericObjectSchema = z.record(
    z.string().regex(/^[a-zA-Z0-9_]+$/, "Invalid column name"),
    z.union([z.string(), z.number(), z.boolean(), z.null()]).optional()
);

export const TaskSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.enum(["todo", "in-progress", "done"]).optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    due_date: z.string().optional(),
    completed_at: z.string().optional(),
    context_type: z.enum(["study", "fitness", "finance", "habits", "general"]).optional(),
    context_id: z.string().optional(),
    budget_id: z.string().optional(),
    expected_cost: z.number().optional(),
    finance_type: z.enum(["expense", "income"]).optional(),
    start_time: z.string().optional(),
    end_time: z.string().optional(),
    estimated_duration: z.number().optional(),
    actual_duration: z.number().optional(),
    recurrence_rule: z.string().optional(),
    parent_task_id: z.string().optional(),
    order_index: z.number().optional(),
    labels: z.string().optional(),
    reminder_time: z.string().optional(),
    is_pinned: z.number().optional()
});

export const GymExerciseReorderSchema = z.object({ exercises: z.array(z.object({ id: z.string() })) });
export const GymWorkoutStartSchema = z.object({ planId: z.string() });
export const GymWorkoutFinishSchema = z.object({
    logId: z.string(),
    feeling: z.enum(["tired", "normal", "great"]).optional(),
    notes: z.string().optional(),
    duration: z.number().nonnegative().optional()
});
export const GymSetLogSchema = z.object({
    logId: z.string(),
    exerciseId: z.string(),
    exerciseName: z.string(),
    setNumber: z.number().int().nonnegative(),
    reps: z.number().int().nonnegative().optional(),
    weight: z.number().nonnegative(),
    weightUnit: z.enum(["kg", "lbs"]),
    rpe: z.number().nonnegative().max(10).optional()
});

export const SavingsAddSchema = z.object({ id: z.string(), amount: z.number(), description: z.string().optional() });
export const SavingsTxUpdateSchema = z.object({
    id: z.string(), savingsId: z.string(),
    oldAmount: z.number(), oldType: z.enum(["deposit", "withdraw"]),
    newAmount: z.number(), newType: z.enum(["deposit", "withdraw"]),
    newDate: z.string(), newDescription: z.string().optional()
});
export const SavingsTxDeleteSchema = z.object({
    id: z.string(), savingsId: z.string(),
    amount: z.number(), type: z.enum(["deposit", "withdraw"])
});

export const HabitCompleteSchema = z.object({
    habit: z.object({
        id: z.string(),
        streak_count: z.number().int().nonnegative(),
        last_completed_date: z.string().nullable().optional()
    }),
    date: z.string().optional()
});
