# AI Module Architecture

## Overview
The AI system is organized into modular files under `src/ai/` for maintainability and scalability. Nova operates as a **proactive life advisor** with omniscient access to all user data and time-aware reasoning.

## Structure

```
src/ai/
├── core/
│   ├── index.ts           # Main orchestrator - routes actions to modules
│   ├── groq-client.ts     # Groq API client & request handling
│   ├── types.ts           # Shared types (AIIntent, ChatMessage, hooks)
│   └── personality.ts     # Nova personality & base prompts
│
└── modules/
    ├── finance.ts         # Expense, income, budget, savings actions
    ├── tasks.ts           # Task add, update, delete, complete
    ├── notes.ts           # Notes add, update, delete
    ├── habits.ts          # Habits add, complete, delete
    ├── study.ts           # Study chapters, progress tracking
    └── inventory.ts       # Inventory item management
```

## How It Works

1. **User sends message** → `processUserMessage()` in `core/index.ts`
2. **Time-aware context injected** → Current time, habits status, task urgency, finance balance
3. **AI parses intent** → Returns `{ action, data, response_text }`
4. **Action routed** → `executeAction()` finds correct module
5. **Module executes** → Module's `execute()` function handles the action

## Available Actions

| Module | Actions |
|--------|---------|
| Tasks | ADD_TASK, UPDATE_TASK, DELETE_TASK, COMPLETE_TASK |
| Finance | ADD_EXPENSE, ADD_INCOME, ADD_BUDGET, ADD_SAVINGS, etc. |
| Notes | ADD_NOTE, UPDATE_NOTE, DELETE_NOTE |
| Habits | ADD_HABIT, COMPLETE_HABIT, DELETE_HABIT |
| Study | ADD_STUDY_CHAPTER, UPDATE_STUDY_PROGRESS, DELETE_STUDY_CHAPTER |
| Inventory | ADD_INVENTORY, UPDATE_INVENTORY, DELETE_INVENTORY |
| Navigation | NAVIGATE (page navigation from chat) |

## Proactive Advisor Mode

When asked open-ended questions ("what to do now?", "how's my week?"), Nova:

1. **Checks time** → Morning/Afternoon/Evening/Night behavior
2. **Checks habits** → Which are pending/completed today
3. **Checks tasks** → Overdue, due today, high priority
4. **Checks study** → Low-progress chapters
5. **Checks finance** → Budget alerts, spending trends
6. **Checks notes** → Uncompleted checklists

Outputs a prioritized, structured action list.

## Context Injection

`AIChatInterface.tsx` builds a rich context string including:
- Current time (hour:minute), day of week, time period classification
- Task urgency analysis (overdue, due today, urgent/high priority)
- Habit completion status with streak tracking
- Finance balance, today's spending, budget/savings data
- Note content previews with checklist completion stats
- Study chapter progress percentages
- Inventory items with categories and values

## Adding New Modules

1. Create `src/ai/modules/[name].ts`
2. Export: `ACTIONS`, `PROMPT`, `execute()`, and `[name]Module`
3. Import and register in `core/index.ts`

## Nova's Smart Defaults

| Missing Info | Smart Default |
|--------------|---------------|
| Priority | `medium` |
| Due date | Today |
| Category | Inferred from context |
| Time | Reasonable estimates |

**Philosophy**: If 70% confident, execute immediately. Only ask for clarification when truly ambiguous.

## Chat Formatting

Nova's responses render with proper formatting:
- `**bold**` → rendered as **bold**
- Line breaks (`\n`) → separate paragraphs
- Numbered lists → proper spacing
- Emojis → used sparingly for visual structure

## Key Exports

```typescript
import { 
  processUserMessage,  // Process user input
  executeAction,       // Execute parsed intent
  ChatMessage,         // Type for chat history
  AIIntent,           // Type for parsed actions
  AllHooks            // Type for all app hooks
} from '@/ai/core';
```
