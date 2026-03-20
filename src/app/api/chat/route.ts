import { NextRequest, NextResponse } from 'next/server';
import { chatRequestSchema } from '@/lib/langchain/schemas';
import { runChatPipeline } from '@/lib/langchain/chatPipeline';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      console.warn('Chat API validation error:', parsed.error.format());
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    const { scenarioId, userMessage, conversationHistory } = parsed.data;

    if (!process.env.OPENAI_API_KEY) {
      console.error('Chat API error: OPENAI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    const result = await runChatPipeline(scenarioId, userMessage, conversationHistory);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Chat API error:', message);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
