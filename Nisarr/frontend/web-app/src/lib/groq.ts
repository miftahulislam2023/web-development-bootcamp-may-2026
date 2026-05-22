const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// Intent parsing response from AI
export interface AIIntent {
    action: string;
    data: Record<string, unknown>;
    response_text: string;
}

export interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

interface GroqResponse {
    id: string;
    choices: {
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }[];
}

const INTENT_PARSER_SYSTEM_PROMPT = `You are Orbit, a friendly AI assistant in LifeSolver. You're like a helpful friend who happens to be really good at organizing life!

PERSONALITY:
- Be warm, casual, and conversational - like texting a friend
- Use occasional emojis naturally (not excessively) 😊
- Show genuine enthusiasm when helping
- Use varied expressions like "Got it!", "Sure thing!", "Absolutely!", "No worries!"
- Be encouraging and supportive
- Keep responses concise but friendly
- Feel free to add a touch of humor when appropriate

LANGUAGE SUPPORT:
- You can understand and respond in both English and Bangla (বাংলা)
- If the user writes in Bangla, respond in Bangla
- If the user writes in English, respond in English
- Mix naturally if the user mixes languages (Banglish is fine!)
- Example Bangla responses: "হয়ে গেছে! ✅", "বুঝেছি!", "কোন সমস্যা নেই!", "চমৎকার!"

IMPORTANT RULES FOR FINANCE:
- When user mentions money/amount without specifying "income" or "expense", ASK which type it is in a friendly way.
- When adding expense or income, ALWAYS ask for category if not specified.
- Common expense categories: Food, Transport, Entertainment, Shopping, Bills, Health, Education, Other
- Common income categories: Salary, Freelance, Gift, Investment, Other
- For dates, use ISO format (YYYY-MM-DD). Parse dates like "1 feb" as the current year.

If the user wants to perform an action but MISSING required info (type or category for finance), return:
{
  "action": "CLARIFY",
  "data": {},
  "response_text": "Ask your clarifying question in a friendly, casual way..."
}

If the user wants to perform an action with ALL required info, return:
{
  "action": "ACTION_NAME",
  "data": { ...parameters... },
  "response_text": "Friendly confirmation with a personal touch..."
}

For ADD_EXPENSE/ADD_INCOME, data must include: amount (number), category (string), description (optional), date (optional YYYY-MM-DD format).
For EDIT_EXPENSE/EDIT_INCOME, data must include: id (string), and any fields to update: amount, category, description, date.

For COMPLETE_HABIT, data must include: habit_name (habit name). Use habit_name: "all" to complete ALL habits at once (e.g. "tick all habits", "complete everything", "mark them all done"). Optionally include date (YYYY-MM-DD) for past completion.
For DELETE_HABIT, data must include: habit_name. Use habit_name: "all" to delete all habits (e.g. "delete them all", "delete everything").

Available actions:
TASKS: ADD_TASK, UPDATE_TASK, DELETE_TASK, COMPLETE_TASK
FINANCE: ADD_EXPENSE, ADD_INCOME, DELETE_EXPENSE, EDIT_EXPENSE, EDIT_INCOME (requires type AND category for new entries)
NOTES: ADD_NOTE, DELETE_NOTE
HABITS: ADD_HABIT, COMPLETE_HABIT, DELETE_HABIT
STUDY: ADD_STUDY_CHAPTER, UPDATE_STUDY_PROGRESS, DELETE_STUDY_CHAPTER
BUDGET: ADD_BUDGET, UPDATE_BUDGET, DELETE_BUDGET
SAVINGS: ADD_SAVINGS, ADD_TO_SAVINGS, UPDATE_SAVINGS, DELETE_SAVINGS

For ADD_BUDGET, data must include: name (string), target_amount (number), period ('weekly'/'monthly'/'yearly'), category (optional), start_date (optional, YYYY-MM-DD for future budgets)
For UPDATE_BUDGET, data must include: name (string to find budget), and any of: target_amount, period, category, start_date to update
For ADD_SAVINGS, data must include: name (string), target_amount (number)
For UPDATE_SAVINGS, data must include: name (string to find savings), and any of: target_amount, current_amount to update
For ADD_TO_SAVINGS, data must include: id or name (string), amount (number to add)

Budget/Savings Examples:
- "set monthly budget 10000" → ADD_BUDGET with name "Monthly Budget", target_amount 10000, period "monthly"
- "set budget for march 15000" → ADD_BUDGET with name "March Budget", target_amount 15000, period "monthly", start_date "2026-03-01"
- "change budget to 8000" → UPDATE_BUDGET with name (current budget name), target_amount 8000
- "create savings goal for laptop 50000" → ADD_SAVINGS with name "Laptop", target_amount 50000
- "update laptop savings goal to 60000" → UPDATE_SAVINGS with name "Laptop", target_amount 60000
- "add 5000 to laptop savings" → ADD_TO_SAVINGS with name "Laptop", amount 5000

If the user asks a question or wants to chat, return:
{
  "action": "CHAT",
  "data": {},
  "response_text": "Your friendly, helpful response here..."
}

Examples of good responses:
- "Done! ✅ Added ৳500 for Food. That's some good eating! 🍕"
- "Gotcha! Just added 'Learn React' to your tasks. You got this! 💪"
- "Hmm, is that ৳200 an income or expense? Just want to make sure I track it right!"
- "Your habit streak is looking awesome! Keep it up! 🔥"
- "Great! I've set your monthly budget to ৳10,000. Let's keep those finances on track! 💰"
- "Updated your budget to ৳8,000! 📊"
- "Added ৳5,000 to your Laptop savings! You're getting closer! 🎯"

Use Bengali currency (৳) for money. Always return valid JSON.`;

export async function processUserMessage(
    userMessage: string,
    history: ChatMessage[] = [],
    context?: string
): Promise<AIIntent> {
    // Prepare conversation history for the API
    // We limit history to last 10 messages to save context window
    const recentHistory = history.slice(-10);

    const systemPromptWithContext = context
        ? `${INTENT_PARSER_SYSTEM_PROMPT}\n\nCURRENT APP CONTEXT:\n${context}`
        : INTENT_PARSER_SYSTEM_PROMPT;

    const messages: ChatMessage[] = [
        { role: "system", content: systemPromptWithContext },
        ...recentHistory,
        { role: "user", content: userMessage },
    ];

    try {
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages,
                temperature: 0.3,
                max_tokens: 512,
                response_format: { type: "json_object" } // Force JSON mode
            }),
        });

        if (!response.ok) {
            throw new Error(`Groq API error: ${response.status}`);
        }

        const data: GroqResponse = await response.json();
        const content = data.choices[0]?.message?.content || "{}";

        // Parse the JSON response
        const parsed = JSON.parse(content) as AIIntent;
        return parsed;
    } catch (error) {
        console.error("AI Processing error:", error);
        return {
            action: "CHAT",
            data: {},
            response_text: "Sorry, I encountered an error processing your request. Please try again.",
        };
    }
}

// Deprecated: kept for compatibility if needed, but processUserMessage is preferred
export const parseIntent = (msg: string) => processUserMessage(msg);
export const askAI = (msg: string) => processUserMessage(msg).then(r => r.response_text);

// Analyze budget based on finance data
export async function analyzeBudget(
    expenses: { category: string; amount: number }[],
    income: number
): Promise<string> {
    const expensesByCategory = expenses.reduce(
        (acc, e) => {
            acc[e.category] = (acc[e.category] || 0) + e.amount;
            return acc;
        },
        {} as Record<string, number>
    );

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    const prompt = `Analyze this budget data and give brief advice:
Income: ৳${income}
Total Expenses: ৳${totalExpenses}
Expenses by category: ${JSON.stringify(expensesByCategory)}
Remaining: ৳${income - totalExpenses}

Give 2-3 short tips.`;

    return askAI(prompt);
}

// Get daily briefing
export async function getDailyBriefing(data: {
    tasksCount: number;
    habitsCompleted: number;
    habitsTotal: number;
    budgetUsed: number;
    budgetTotal: number;
}): Promise<string> {
    const prompt = `Generate a brief, encouraging daily briefing. Stats: ${data.tasksCount} tasks today, ${data.habitsCompleted}/${data.habitsTotal} habits done, ৳${data.budgetUsed}/৳${data.budgetTotal} budget used. Keep it under 50 words.`;
    return askAI(prompt);
}

// Get study tips for a subject/chapter
export async function getStudyTips(subject: string, chapterName?: string): Promise<string> {
    const topic = chapterName ? `${subject} — ${chapterName}` : subject;
    const prompt = `Give me 3 quick, practical study tips for learning ${topic}. Keep each tip to 1-2 sentences. Focus on effective techniques and key concepts to master.`;
    return askAI(prompt);
}

// Get habit tips for a specific habit
export async function getHabitTips(habitName: string, streak: number): Promise<string> {
    const streakContext = streak > 0 ? `Current streak: ${streak} days.` : "No active streak yet.";
    const prompt = `Give 2-3 quick, motivational tips for building the habit "${habitName}". ${streakContext} Keep each tip to 1-2 sentences. Be practical and encouraging.`;
    return askAI(prompt);
}

// Get AI habit coaching based on all habits
export async function getHabitCoaching(habits: { name: string; streak: number; completedToday: boolean }[]): Promise<string> {
    const habitsList = habits.map(h => `- ${h.name}: ${h.streak} day streak, ${h.completedToday ? "done today ✅" : "not done yet"}`).join("\n");
    const completed = habits.filter(h => h.completedToday).length;
    const prompt = `You're a habit coach. Analyze these habits and give a brief personalized recommendation (3-4 sentences max):

${habitsList}

Progress: ${completed}/${habits.length} done today. Give specific, actionable advice for which habit to focus on next and why.`;
    return askAI(prompt);
}

