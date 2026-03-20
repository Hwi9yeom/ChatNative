import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import type { z } from 'zod';
import { reportResponseSchema } from './schemas';
import { buildReportSystemPrompt, getScenarioById } from './prompts';
import type { Correction } from '@/lib/types';

const model = new ChatOpenAI({
  model: 'gpt-4o',
  temperature: 0.3,
});

function sanitizeForPromptTemplate(text: string): string {
  return text.replace(/\{/g, '{{').replace(/\}/g, '}}').slice(0, 2000);
}

export async function runReportPipeline(
  scenarioId: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[],
  corrections: Correction[]
): Promise<z.infer<typeof reportResponseSchema>> {
  const scenario = getScenarioById(scenarioId);
  if (!scenario) {
    throw new Error(`Unknown scenario: ${scenarioId}`);
  }

  const modelWithStructuredOutput = model.withStructuredOutput(reportResponseSchema);

  const systemPrompt = buildReportSystemPrompt();

  const transcript = conversationHistory
    .map((msg) => `${msg.role === 'user' ? 'Student' : 'AI Tutor'}: ${sanitizeForPromptTemplate(msg.content)}`)
    .join('\n');

  const correctionsText = corrections.length > 0
    ? corrections
        .map((c) => `- "${c.original}" → "${c.corrected}" (${c.type}: ${c.explanation})`)
        .join('\n')
    : 'No corrections were flagged during the conversation.';

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', systemPrompt],
    ['human', `Scenario: ${scenario.title} (${scenario.situation})

CONVERSATION TRANSCRIPT:
${transcript}

CORRECTIONS FLAGGED DURING CHAT:
${correctionsText}

Please analyze this conversation and provide a comprehensive report.`],
  ]);

  const pipeline = prompt.pipe(modelWithStructuredOutput);

  const result = await pipeline.invoke({});

  return reportResponseSchema.parse(result);
}
