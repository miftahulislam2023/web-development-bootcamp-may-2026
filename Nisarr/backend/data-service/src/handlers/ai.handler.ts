// ai.handler.ts — AI enhancement proxy (HuggingFace + Groq fallback)

export async function handleAIEnhance(req: any, res: any) {
    const { messages } = req.body;
    if (!messages) return res.status(400).json({ error: "Messages required" });

    const hfApiKey = process.env.VITE_HF_API_KEY;
    const groqApiKey = process.env.VITE_GROQ_API_KEY;
    const HF_MODEL = "Qwen/Qwen3.5-122B-A10B";

    if (hfApiKey) {
        try {
            const hfRes = await fetch("https://router.huggingface.co/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${hfApiKey}` },
                body: JSON.stringify({ model: HF_MODEL, messages, temperature: 0.5, max_tokens: 2048 }),
            });
            if (hfRes.ok) {
                const data = await hfRes.json();
                const content = data.choices?.[0]?.message?.content;
                if (content) return res.json({ success: true, provider: "1st ai model", content: content.trim() });
            }
        } catch (err: any) { console.error("HF Error:", err.message); }
    }

    // Groq fallback
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${groqApiKey}` },
            body: JSON.stringify({ model: "llama-3.1-8b-instant", messages, temperature: 0.5, max_tokens: 2048 }),
        });
        if (!response.ok) return res.status(500).json({ error: `AI Error: ${response.status}` });
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content) return res.status(500).json({ error: "Empty AI response" });
        return res.json({ success: true, provider: "2nd model", content: content.trim() });
    } catch (e: any) { return res.status(500).json({ error: e.message }); }
}
