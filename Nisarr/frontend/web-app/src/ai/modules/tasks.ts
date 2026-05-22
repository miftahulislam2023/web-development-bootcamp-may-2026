// Tasks AI Module - handles task actions

import { AIModule, TaskHooks } from '../core/types';

export const TASK_ACTIONS = [
    "ADD_TASK",
    "UPDATE_TASK",
    "DELETE_TASK",
    "COMPLETE_TASK",
];

export const TASK_PROMPT = `TASK RULES:
For ADD_TASK, data must include: 
- title (string, required)
- priority (optional: 'low'/'medium'/'high'/'urgent')
- due_date (optional YYYY-MM-DD)
- context_type (optional: 'general'/'study'/'finance'/'habit'/'project')
- expected_cost (optional: number, for finance-linked tasks)
- finance_type (optional: 'income'/'expense', required if context_type is 'finance' and expected_cost is set)
- start_time/end_time (optional: HH:MM format for time blocking)
- estimated_duration (optional: minutes)

For UPDATE_TASK, data must include: id or title (to find task), and any fields to update
For DELETE_TASK, data must include: id or title
For COMPLETE_TASK, data must include: id or title. Note: Completing a finance-linked task will automatically create a finance entry with the expected_cost.

Task Examples:
- "add task buy groceries" → ADD_TASK with title "Buy groceries"
- "remind me to call mom tomorrow" → ADD_TASK with title "Call mom", due_date tomorrow
- "add expense task shopping for 500 taka" → ADD_TASK with title "Shopping", context_type "finance", finance_type "expense", expected_cost 500
- "complete the groceries task" → COMPLETE_TASK with title "groceries"
- "delete call mom task" → DELETE_TASK with title "call mom"`;

export async function executeTaskAction(
    action: string,
    data: Record<string, unknown>,
    hooks: TaskHooks
): Promise<void> {
    switch (action) {
        case "ADD_TASK":
            await hooks.addTask.mutateAsync({
                title: String(data.title),
                priority: data.priority ? String(data.priority) : "medium",
                due_date: data.due_date ? String(data.due_date) : null,
                context_type: data.context_type ? String(data.context_type) : "general",
                expected_cost: data.expected_cost ? Number(data.expected_cost) : undefined,
                finance_type: data.finance_type ? String(data.finance_type) : undefined,
                start_time: data.start_time ? String(data.start_time) : undefined,
                end_time: data.end_time ? String(data.end_time) : undefined,
                estimated_duration: data.estimated_duration ? Number(data.estimated_duration) : undefined,
            });
            break;

        case "UPDATE_TASK": {
            const taskToUpdate = hooks.tasks?.find(t =>
                t.title.toLowerCase().includes((data.title as string || "").toLowerCase())
            );
            if (taskToUpdate) {
                await hooks.updateTask.mutateAsync({
                    id: taskToUpdate.id,
                    title: data.new_title ? String(data.new_title) : undefined,
                    priority: data.priority ? String(data.priority) : undefined,
                    due_date: data.due_date ? String(data.due_date) : undefined,
                    context_type: data.context_type ? String(data.context_type) : undefined,
                    expected_cost: data.expected_cost ? Number(data.expected_cost) : undefined,
                    finance_type: data.finance_type ? String(data.finance_type) : undefined,
                });
            }
            break;
        }

        case "DELETE_TASK": {
            const taskToDelete = hooks.tasks?.find(t =>
                t.title.toLowerCase().includes((data.title as string || data.id as string || "").toLowerCase())
            );
            if (taskToDelete) await hooks.deleteTask.mutateAsync(taskToDelete.id);
            break;
        }

        case "COMPLETE_TASK": {
            const taskToComplete = hooks.tasks?.find(t =>
                t.title.toLowerCase().includes((data.title as string || data.id as string || "").toLowerCase())
            );
            if (taskToComplete) {
                // Use completeTask mutation which also creates finance entry if applicable
                await hooks.completeTask.mutateAsync(taskToComplete.id);
            }
            break;
        }
    }
}

export const tasksModule: AIModule = {
    name: "tasks",
    actions: TASK_ACTIONS,
    prompt: TASK_PROMPT,
    execute: executeTaskAction as AIModule['execute'],
};

