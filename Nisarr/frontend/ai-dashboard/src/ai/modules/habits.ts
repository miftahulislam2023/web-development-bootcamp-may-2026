// Habits AI Module - handles habit actions

import { AIModule, HabitHooks } from '../core/types';

export const HABIT_ACTIONS = [
    "ADD_HABIT",
    "COMPLETE_HABIT",
    "DELETE_HABIT",
];

export const HABIT_PROMPT = `HABIT RULES:
For ADD_HABIT, data must include: name (string), category (optional: 'general'/'health'/'learning'/'productivity'/'mindfulness'/'social'/'creative')
For COMPLETE_HABIT, data must include: name (to find habit by habit_name)
For DELETE_HABIT, data must include: name (to find habit by habit_name)

Habit Examples:
- "add habit drink water" → ADD_HABIT with name "Drink water", category "health"
- "add a reading habit" → ADD_HABIT with name "Read", category "learning"
- "I did my exercise today" → COMPLETE_HABIT with name "exercise"
- "mark meditation done" → COMPLETE_HABIT with name "meditation"
- "delete the reading habit" → DELETE_HABIT with name "reading"`;

export async function executeHabitAction(
    action: string,
    data: Record<string, unknown>,
    hooks: HabitHooks
): Promise<void> {
    switch (action) {
        case "ADD_HABIT":
            await hooks.addHabit.mutateAsync({
                name: String(data.name),
                category: data.category ? String(data.category) : "general",
            });
            break;

        case "COMPLETE_HABIT": {
            const searchTerm = String(data.name || data.id || "").toLowerCase();
            const habitToComplete = hooks.habits?.find(h =>
                h.habit_name.toLowerCase().includes(searchTerm)
            );
            if (habitToComplete) await hooks.completeHabit.mutateAsync(habitToComplete as unknown as void);
            break;
        }

        case "DELETE_HABIT": {
            const searchTerm = String(data.name || data.id || "").toLowerCase();
            const habitToDelete = hooks.habits?.find(h =>
                h.habit_name.toLowerCase().includes(searchTerm)
            );
            if (habitToDelete) await hooks.deleteHabit.mutateAsync(habitToDelete.id);
            break;
        }
    }
}

export const habitsModule: AIModule = {
    name: "habits",
    actions: HABIT_ACTIONS,
    prompt: HABIT_PROMPT,
    execute: executeHabitAction as AIModule['execute'],
};
