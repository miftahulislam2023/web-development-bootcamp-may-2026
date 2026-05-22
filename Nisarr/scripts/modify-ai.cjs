const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/components/ai/AIChatInterface.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add imports
if (!content.includes('useGym')) {
    content = content.replace(
        'import { useStudy } from "@/hooks/useStudy";\nimport { useAI } from "@/contexts/AIContext";',
        'import { useStudy } from "@/hooks/useStudy";\nimport { useGym } from "@/hooks/useGym";\nimport { useAI } from "@/contexts/AIContext";\nimport { useNavigate } from "react-router-dom";'
    );
}

// 2. Add Hooks
if (!content.includes('const { startWorkout')) {
    content = content.replace(
        'const { subjects, chapters, parts, addSubject, addChapter, addPart, togglePartStatus, deleteSubject, deleteChapter, deletePart, commonPresets, addPresetsToChapter } = useStudy();',
        'const { subjects, chapters, parts, addSubject, addChapter, addPart, togglePartStatus, deleteSubject, deleteChapter, deletePart, commonPresets, addPresetsToChapter } = useStudy();\n    const gymHooks = useGym();\n    const navigate = useNavigate();'
    );
}

// 3. Remove the giant executeIntent function
const executeIntentStart = content.indexOf('const executeIntent = async (intent: AIIntent) => {');
const executeIntentEnd = content.indexOf('const handleSend = async (e?: React.FormEvent) => {');

if (executeIntentStart !== -1 && executeIntentEnd !== -1) {
    // Preserve any space before handleSend
    content = content.substring(0, executeIntentStart) + '\n    ' + content.substring(executeIntentEnd);
}

// 4. Update the context string to include GYM DATA
const gymContextString = `
═══ GYM & FITNESS ═══
🏋️ Today's Plan: \${gymHooks.getTodaysPlan()?.name || "No Plan"}
💪 Active Workout: \${gymHooks.activeLog ? "Yes (id: "+gymHooks.activeLog.id+")" : "No"}
🏆 Personal Records: \${gymHooks.personalRecords?.slice(0, 5).map(pr => \`\${pr.exerciseName}: \${pr.weight}kg x \${pr.reps}\`).join(', ') || 'None'}
`;

if (!content.includes('═══ GYM & FITNESS ═══')) {
    content = content.replace(
        '═══ INVENTORY ═══',
        gymContextString.trim() + '\\n\\n═══ INVENTORY ═══'
    );
}

// 5. Update the execution loop in handleSend
const oldLoop = `            // Execute all detected actions (supports batch)
            let actionsExecuted = 0;
            for (const result of results) {
                if (!["CHAT", "UNKNOWN", "GET_SUMMARY", "ANALYZE_BUDGET", "CLARIFY"].includes(result.action)) {
                    await executeIntent(result);
                    actionsExecuted++;
                }
            }`;

const newLoop = `            // Package Hooks for modular execution
            const allHooks: AllHooks = {
                finance: { addEntry, deleteEntry, updateEntry, addBudget, updateBudget, deleteBudget, addToSavings, expenses: expenses || [], budgets: budgets || [], savingsGoals: savingsGoals || [], entries: expenses || [] },
                tasks: { addTask, updateTask, deleteTask, completeTask, tasks: tasks || [] },
                notes: { addNote, updateNote, deleteNote, togglePin, updateColor, archiveNote, trashNote, notes: notes || [] },
                habits: { addHabit, completeHabit, deleteHabit, habits: habits || [] },
                inventory: { addItem, updateItem, deleteItem, items: items || [] },
                study: { addSubject, deleteSubject, addChapter, deleteChapter, addPart, togglePartStatus, deletePart, addPresetsToChapter, applyPresetsToAllChapters: undefined, subjects: subjects || [], chapters: chapters || [], parts: parts || [], commonPresets: commonPresets || [] },
                gym: { startWorkout: gymHooks.startWorkout, finishWorkout: gymHooks.finishWorkout, logSet: gymHooks.logSet, addMetric: gymHooks.addMetric, todaysPlan: gymHooks.getTodaysPlan(), activeLog: gymHooks.activeLog, navigate: navigate, toast: toast.success }
            };

            // Execute all detected actions (supports batch)
            let actionsExecuted = 0;
            for (const result of results) {
                if (!["CHAT", "UNKNOWN", "GET_SUMMARY", "ANALYZE_BUDGET", "CLARIFY"].includes(result.action)) {
                    await executeAction(result, allHooks);
                    actionsExecuted++;
                }
            }`;

if (content.includes(oldLoop)) {
    content = content.replace(oldLoop, newLoop);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('AIChatInterface.tsx modified successfully');
