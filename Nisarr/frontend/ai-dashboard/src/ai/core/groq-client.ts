// Groq API Client

import { ChatMessage, AIIntent } from './types';

const BASE_URL = import.meta.env.VITE_BACKEND_URL ? import.meta.env.VITE_BACKEND_URL.replace('/api/auth', '/api/ai/enhance') : "/api/ai/enhance";

export async function callGroqAPI(
    messages: ChatMessage[],
    options: {
        temperature?: number;
        maxTokens?: number;
    } = {}
): Promise<string> {
    console.log("Sending chat request to AI proxy...");

    // Ensure the system prompt strongly enforces raw JSON without markdown formatting
    // We inject a strong reminder to the last system message just in case
    const enhancedMessages = messages.map(m => {
        if (m.role === 'system') {
            return {
                ...m,
                content: m.content + "\n\nCRITICAL: Output ONLY raw JSON payload. Do NOT wrap in ```json or any other markdown fences. Start the response with { and end with }."
            };
        }
        return m;
    });

    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: enhancedMessages }), // using our backend endpoint format
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("AI Proxy Error Body:", errorBody);
        throw new Error(`AI proxy error: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();

    if (data.provider === "1st ai model") {
        console.log("accurately, received reply from 1st ai model (Qwen 3.5)");
    } else if (data.provider === "2nd model") {
        console.log("Received reply from 2nd model (Groq)");
        if (data.debug) {
            console.warn("⚠️ HF Fallback Reason:", data.debug);
        }
    }

    if (!data.success || !data.content) {
        throw new Error(data.error || "AI returned empty response");
    }

    // Clean any markdown code blocks if the AI disobeyed
    let content = data.content;
    if (content.startsWith("```json")) {
        content = content.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (content.startsWith("```")) {
        content = content.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    return content.trim();
}

// Parse AI response — supports both single and batch formats
export function parseAIResponse(content: string): AIIntent[] {
    try {
        const parsed = JSON.parse(content);
        console.log("Raw AI Response parsed:", parsed);

        // Batch format: { actions: [...], response_text: "..." }
        if (parsed.actions && Array.isArray(parsed.actions)) {
            const topLevelResponse = parsed.response_text;

            // If there are no actions, but there is a response, return it! 
            // (e.g. Chat queries that don't modify tasks/notes)
            if (parsed.actions.length === 0) {
                return [{
                    action: "CHAT",
                    data: {},
                    response_text: topLevelResponse || "I couldn't find any actions to take.",
                }];
            }

            return parsed.actions.map((a: any, i: number) => {
                // Determine the best response text for this action
                let rText = "";
                if (i === 0) {
                    rText = topLevelResponse || a.response_text || "Done!";
                } else {
                    rText = a.response_text || "";
                }

                return {
                    action: a.action || "CHAT",
                    data: a.data || {},
                    response_text: rText,
                };
            });
        }

        // Single format: { action: "...", data: {...}, response_text: "..." }
        return [{
            action: parsed.action || "CHAT",
            data: parsed.data || {},
            response_text: parsed.response_text || "I'm not sure how to help with that.",
        }];
    } catch {
        return [{
            action: "CHAT",
            data: {},
            response_text: "Sorry, I had trouble understanding that. Could you try again?",
        }];
    }
}
