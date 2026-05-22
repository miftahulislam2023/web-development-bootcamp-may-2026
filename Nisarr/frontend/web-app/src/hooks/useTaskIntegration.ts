import { useTasks, Task } from "./useTasks";
import { StudyChapter } from "./useStudy";
import { useBudget } from "./useBudget";

export interface CreateStudyTaskOptions {
    chapter: StudyChapter;
    dueDate?: string;
    startTime?: string;
    endTime?: string;
    estimatedDuration?: number;
}

export interface CreateFinanceTaskOptions {
    title: string;
    budgetId: string;
    expectedCost: number;
    dueDate?: string;
    category?: string;
}

export interface CreateHabitTaskOptions {
    habitId: string;
    habitName: string;
    dueDate?: string;
    startTime?: string;
}

export function useTaskIntegration() {
    const { addTask, getTasksByContext } = useTasks();
    const { budgets } = useBudget();

    // Create a study session task from a chapter
    const createStudyTask = async (options: CreateStudyTaskOptions) => {
        const { chapter, dueDate, startTime, endTime, estimatedDuration } = options;

        const today = new Date().toISOString().split("T")[0];

        return await addTask.mutateAsync({
            title: `Study: ${chapter.subject} - ${chapter.chapter_name}`,
            description: `Study session for ${chapter.chapter_name}`,
            context_type: "study",
            context_id: chapter.id,
            due_date: dueDate || today,
            start_time: startTime,
            end_time: endTime,
            estimated_duration: estimatedDuration || 60,
            priority: "medium",
        });
    };

    // Create a planned expense task
    const createFinanceTask = async (options: CreateFinanceTaskOptions) => {
        const { title, budgetId, expectedCost, dueDate, category } = options;

        const budget = budgets.find(b => b.id === budgetId);

        return await addTask.mutateAsync({
            title,
            description: category ? `Category: ${category}` : undefined,
            context_type: "finance",
            context_id: budgetId,
            budget_id: budgetId,
            expected_cost: expectedCost,
            due_date: dueDate,
            priority: "medium",
            labels: budget?.name || undefined,
        });
    };

    // Create a habit-linked daily task
    const createHabitTask = async (options: CreateHabitTaskOptions) => {
        const { habitId, habitName, dueDate, startTime } = options;

        const today = new Date().toISOString().split("T")[0];

        return await addTask.mutateAsync({
            title: habitName,
            context_type: "habit",
            context_id: habitId,
            due_date: dueDate || today,
            start_time: startTime,
            priority: "medium",
        });
    };

    // Get all tasks linked to a study chapter
    const getStudyTasksForChapter = async (chapterId: string) => {
        return await getTasksByContext("study", chapterId);
    };

    // Get all tasks linked to a budget
    const getFinanceTasksForBudget = async (budgetId: string) => {
        return await getTasksByContext("finance", budgetId);
    };

    // Get all tasks linked to a habit
    const getHabitTasks = async (habitId: string) => {
        return await getTasksByContext("habit", habitId);
    };

    // Check if a chapter has pending tasks
    const chapterHasPendingTasks = async (chapterId: string) => {
        const tasks = await getStudyTasksForChapter(chapterId);
        return tasks.some(t => t.status !== "done");
    };

    // Calculate total planned expenses from tasks
    const getTotalPlannedExpenses = async (budgetId: string) => {
        const tasks = await getFinanceTasksForBudget(budgetId);
        return tasks
            .filter(t => t.status !== "done")
            .reduce((sum, t) => sum + (t.expected_cost || 0), 0);
    };

    return {
        createStudyTask,
        createFinanceTask,
        createHabitTask,
        getStudyTasksForChapter,
        getFinanceTasksForBudget,
        getHabitTasks,
        chapterHasPendingTasks,
        getTotalPlannedExpenses,
    };
}
