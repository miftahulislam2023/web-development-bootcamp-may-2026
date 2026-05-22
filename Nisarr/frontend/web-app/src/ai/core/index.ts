// AI Core - Main orchestrator for all AI modules

import { ChatMessage, AIIntent, AllHooks } from './types';
import { ORBIT_PERSONALITY, RESPONSE_EXAMPLES } from './personality';
import { callGroqAPI, parseAIResponse } from './groq-client';

// Import all modules
import { financeModule, FINANCE_ACTIONS } from '../modules/finance';
import { tasksModule, TASK_ACTIONS } from '../modules/tasks';
import { notesModule, NOTE_ACTIONS } from '../modules/notes';
import { habitsModule, HABIT_ACTIONS } from '../modules/habits';
import { studyModule, STUDY_ACTIONS } from '../modules/study';
import { inventoryModule, INVENTORY_ACTIONS } from '../modules/inventory';
// All available modules
const modules = [
    financeModule,
    tasksModule,
    notesModule,
    habitsModule,
    studyModule,
    inventoryModule,
];

// Build complete system prompt from all modules
function buildSystemPrompt(context?: string): string {
    const modulePrompts = modules.map(m => m.prompt).join('\n\n');

    const allActions = [
        `TASKS: ${TASK_ACTIONS.join(', ')}`,
        `FINANCE: ${FINANCE_ACTIONS.join(', ')}`,
        `NOTES: ${NOTE_ACTIONS.join(', ')}`,
        `HABITS: ${HABIT_ACTIONS.join(', ')}`,
        `STUDY: ${STUDY_ACTIONS.join(', ')}`,
        `INVENTORY: ${INVENTORY_ACTIONS.join(', ')}`,
        `NAVIGATION: NAVIGATE`,
    ].join('\n');

    let prompt = `${ORBIT_PERSONALITY}

Available actions:
${allActions}

${modulePrompts}

${RESPONSE_EXAMPLES}`;

    if (context) {
        prompt += `\n\nCURRENT APP CONTEXT:\n${context}`;
    }

    return prompt;
}

// Process user message through Groq and return intents (supports batch)
export async function processUserMessage(
    userMessage: string,
    history: ChatMessage[] = [],
    context?: string
): Promise<AIIntent[]> {
    const recentHistory = history.slice(-10);
    const systemPrompt = buildSystemPrompt(context);

    const messages: ChatMessage[] = [
        { role: "system", content: systemPrompt },
        ...recentHistory,
        { role: "user", content: userMessage },
    ];

    try {
        const content = await callGroqAPI(messages);
        return parseAIResponse(content);
    } catch (error) {
        console.error("AI processing error:", error);
        return [{
            action: "CHAT",
            data: {},
            response_text: "Oops! Something went wrong. Mind trying again? 🙏",
        }];
    }
}

// Execute action by routing to appropriate module
export async function executeAction(
    intent: AIIntent,
    hooks: AllHooks
): Promise<void> {
    const { action, data } = intent;

    // Find the module that handles this action
    for (const module of modules) {
        if (module.actions.includes(action)) {
            // Get the correct hooks for this module
            const moduleHooks = getModuleHooks(module.name, hooks);
            await module.execute(action, data, moduleHooks);
            return;
        }
    }

    // Action not found in any module - might be CHAT or CLARIFY
    console.log(`No module handler for action: ${action}`);
}

// Map module name to its hooks
function getModuleHooks(moduleName: string, hooks: AllHooks): unknown {
    switch (moduleName) {
        case "finance": return hooks.finance;
        case "tasks": return hooks.tasks;
        case "notes": return hooks.notes;
        case "habits": return hooks.habits;
        case "study": return hooks.study;
        case "inventory": return hooks.inventory;
        default: return {};
    }
}

// Re-export types and modules for convenience
export * from './types';
export { financeModule } from '../modules/finance';
export { tasksModule } from '../modules/tasks';
export { notesModule } from '../modules/notes';
export { habitsModule } from '../modules/habits';
export { studyModule } from '../modules/study';
export { inventoryModule } from '../modules/inventory';
