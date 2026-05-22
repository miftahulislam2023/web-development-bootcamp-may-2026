// AI Note Enhancement Service
// Uses Groq API to enhance, rewrite, or generate notes with markdown formatting

const BASE_URL = import.meta.env.VITE_BACKEND_URL ? import.meta.env.VITE_BACKEND_URL.replace('/api/auth', '/api/ai/enhance') : "/api/ai/enhance";

interface NoteContext {
    title: string;
    content?: string;
    tags?: string;
}

const SYSTEM_PROMPT = `You are an expert note-writing assistant in LifeSolver. Your role is to enhance, rewrite, or generate notes based on user instructions.

FORMATTING RULES — you MUST use markdown formatting:
- Use **bold** for important terms and headings
- Use *italic* for emphasis
- Use - [ ] for unchecked checklist items  
- Use - [x] for checked/completed items
- Use - for bullet points (without checkboxes)
- Use ## for section headings
- Use numbered lists (1. 2. 3.) when order matters
- Use \`code\` for technical terms
- Use --- for horizontal rules between sections

WRITING STYLE:
- Be concise but comprehensive
- Use clear, well-structured sections
- Make checklists actionable — each item should be a specific task
- Add relevant sub-points under main items
- Keep a professional yet warm tone

IMPORTANT:
- Return ONLY the note content (no meta-commentary, no "here's your note", no markdown code fences around the entire response)
- ONLY consider and modify the CURRENT NOTE provided. Do NOT analyze or include information from "ALL USER'S NOTES FOR CONTEXT" UNLESS the user explicitly asks you to (e.g., "Summarize all my notes on this topic").
- If the user asks to analyze data from their notes, synthesize insights and present them clearly
- If the user asks to enhance existing content, improve it while keeping the user's intent
- If the user asks to generate new content, create comprehensive, well-organized notes`;

export async function enhanceNoteWithAI(
    prompt: string,
    currentNote: NoteContext,
    allNotes: NoteContext[],
    includeOtherNotes: boolean = false
): Promise<string> {
    // Build context from all notes only if explicitly requested
    const notesContext = includeOtherNotes ? allNotes
        .slice(0, 20) // Limit to 20 most recent notes for context window
        .map((n, i) => `[Note ${i + 1}] Title: ${n.title}\nTags: ${n.tags || "none"}\n${n.content || "(empty)"}\n`)
        .join("\n---\n") : "";

    const userMessage = `CURRENT NOTE:
Title: ${currentNote.title || "(untitled)"}
Content: ${currentNote.content || "(empty)"}

${includeOtherNotes ? `ALL USER'S NOTES FOR CONTEXT:\n${notesContext}\n\n` : ''}USER'S REQUEST: ${prompt}`;

    // Common Messages Array
    const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
    ];

    console.log("Sending AI enhancement request to backend...");
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Backend AI Error:", errorBody);
        throw new Error(`AI enhancement failed entirely: ${response.status}`);
    }

    const data = await response.json();

    if (data.provider === "1st ai model") {
        console.log("accurately, received reply from 1st ai model");
    } else if (data.provider === "2nd model") {
        console.log("Received reply from 2nd model");
        if (data.debug) {
            console.warn("⚠️ HF Fallback Reason:", data.debug);
        }
    }

    if (!data.success || !data.content) {
        throw new Error(data.error || "AI returned empty response");
    }

    return data.content;
}
