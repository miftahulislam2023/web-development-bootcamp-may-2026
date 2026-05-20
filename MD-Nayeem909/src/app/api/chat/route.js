import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";


export const maxDuration = 30;

const SYSTEM_PROMPT = `
You are the "Expense Tracker Assistant", an AI financial advisor built into a professional Next.js Expense Tracker application.
Your job is to help the user understand their finances, give advice on budgeting, and explain how this web app works.

Key App Features:
1. Dashboard with Income, Expense, and Net Balance summaries.
2. Smart Insights AI that calculates savings rates and warns about overspending.
3. Interactive Charts (Donut chart for categories, Line chart for 30-day trends).
4. Transactions page where you can add, delete, and view expenses/income.
5. Professional PDF and Excel Export functionality for transaction reports.
6. Authentication powered by NextAuth (Google & GitHub login).

Guidelines:
- Be friendly, professional, and concise.
- If the user asks for financial advice, give practical, standard advice (e.g., the 50/30/20 rule).
- If the user asks how to use a feature, explain it clearly based on the features listed above.
- Communicate in the language the user speaks (e.g., if they speak Bengali/Banglish, reply in Banglish or Bengali).
`;

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { messages } = await req.json();

    const formattedMessages = messages.map(msg => {
      let textContent = '';
      if (typeof msg.content === 'string' && msg.content) {
        textContent = msg.content;
      } else if (msg.parts && Array.isArray(msg.parts)) {
        const textPart = msg.parts.find(p => p.type === 'text');
        textContent = textPart ? textPart.text : '';
      }
      
      return {
        role: msg.role === 'user' || msg.role === 'assistant' || msg.role === 'system' ? msg.role : 'user',
        content: textContent || msg.text || ''
      };
    });

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const result = streamText({
      model: google('gemini-flash-latest'),
      system: SYSTEM_PROMPT,
      messages: formattedMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}