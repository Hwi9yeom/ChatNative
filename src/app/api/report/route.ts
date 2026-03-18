import { NextRequest, NextResponse } from 'next/server';
import { reportRequestSchema } from '@/lib/langchain/schemas';
import { runReportPipeline } from '@/lib/langchain/reportPipeline';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = reportRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { scenarioId, conversationHistory, corrections } = parsed.data;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const result = await runReportPipeline(scenarioId, conversationHistory, corrections);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Report API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report. Please try again.' },
      { status: 500 }
    );
  }
}
