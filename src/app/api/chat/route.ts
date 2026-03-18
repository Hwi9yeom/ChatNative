import { NextRequest, NextResponse } from 'next/server';
import { chatRequestSchema } from '@/lib/langchain/schemas';
import { runChatPipeline } from '@/lib/langchain/chatPipeline';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { scenarioId, userMessage, conversationHistory } = parsed.data;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const result = await runChatPipeline(scenarioId, userMessage, conversationHistory);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response. Please try again.' },
      { status: 500 }
    );
  }
}
