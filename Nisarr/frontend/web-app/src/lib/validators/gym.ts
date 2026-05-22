import { z } from "zod";

// Shared Schemas
const muscleGroupSchema = z.enum(["chest", "back", "shoulders", "biceps", "triceps", "legs", "core", "cardio"]);
const splitTypeSchema = z.enum(["push", "pull", "legs", "upper", "lower", "full", "rest", "custom"]);
const equipmentSchema = z.enum(["barbell", "dumbbell", "machine", "cable", "bodyweight", "none"]);
const feelingSchema = z.enum(["great", "good", "okay", "bad"]);

// Plan Validation
export const createPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required").max(100, "Plan name is too long"),
  splitType: splitTypeSchema,
  dayOfWeek: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "any"])
});

export const updatePlanSchema = createPlanSchema.partial();

// Exercise Validation
export const createExerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required").max(100, "Exercise name is too long"),
  muscleGroup: muscleGroupSchema,
  equipment: equipmentSchema,
  defaultSets: z.number().int().min(1, "Must have at least 1 set").max(20, "Too many sets"),
  defaultReps: z.string().max(20, "Reps description too long").default("10"),
  defaultWeight: z.number().min(0, "Weight cannot be negative").max(1000, "Weight exceeds realistic limits"),
  notes: z.string().max(500, "Notes too long").optional(),
  orderIndex: z.number().int().min(0)
});

export const updateExerciseSchema = createExerciseSchema.partial();

// Log Set Validation
export const logSetSchema = z.object({
  exerciseId: z.string().uuid("Invalid exercise ID"),
  exerciseName: z.string().min(1, "Exercise name missing"),
  setNumber: z.number().int().min(1, "Set number must be at least 1"),
  reps: z.number().int().min(0, "Reps cannot be negative").max(1000, "Reps too high").optional(),
  weight: z.number().min(0, "Weight cannot be negative").max(2000, "Weight too high"),
  weightUnit: z.enum(["kg", "lbs"]),
  rpe: z.number().min(1).max(10).optional()
});

// Finish Workout Validation
export const finishWorkoutSchema = z.object({
  feeling: feelingSchema,
  notes: z.string().max(1000, "Notes too long for workout").optional()
});

// Body Metric Validation
export const logMetricSchema = z.object({
  metricDate: z.string().datetime(),
  weightKg: z.number().min(20, "Weight seems too low").max(500, "Weight seems too high").optional(),
  bodyFatPercentage: z.number().min(1, "Body fat % too low").max(99, "Body fat % too high").optional(),
  chestCm: z.number().min(10).max(300).optional(),
  waistCm: z.number().min(10).max(300).optional(),
  hipsCm: z.number().min(10).max(300).optional(),
  bicepCm: z.number().min(10).max(100).optional(),
  notes: z.string().max(500, "Notes too long").optional()
}).refine(data => 
  data.weightKg !== undefined || 
  data.bodyFatPercentage !== undefined || 
  data.chestCm !== undefined ||
  data.waistCm !== undefined ||
  data.hipsCm !== undefined ||
  data.bicepCm !== undefined,
  "At least one metric must be provided"
);

