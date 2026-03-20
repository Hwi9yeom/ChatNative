import { NextRequest, NextResponse } from 'next/server';
import { reportRequestSchema } from '@/lib/langchain/schemas';
import { runReportPipeline } from '@/lib/langchain/reportPipeline';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = reportRequestSchema.safeParse(body);
    if (!parsed.success) {
      console.warn('Report API validation error:', parsed.error.format());
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    const { scenarioId, conversationHistory, corrections } = parsed.data;

    if (!process.env.OPENAI_API_KEY) {
      console.error('Report API error: OPENAI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    const result = await runReportPipeline(scenarioId, conversationHistory, corrections);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Report API error:', message);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
