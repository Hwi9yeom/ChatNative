import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { chatResponseSchema } from './schemas';
import { buildScenarioSystemPrompt, getScenarioById } from './prompts';
import type { z } from 'zod';

const model = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.7,
});

function sanitizeForPromptTemplate(text: string): string {
  return text.replace(/\{/g, '{{').replace(/\}/g, '}}').slice(0, 2000);
}

export async function runChatPipeline(
  scenarioId: string,
  userMessage: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<z.infer<typeof chatResponseSchema>> {
  const scenario = getScenarioById(scenarioId);
  if (!scenario) {
    throw new Error(`Unknown scenario: ${scenarioId}`);
  }

  const modelWithStructuredOutput = model.withStructuredOutput(chatResponseSchema);

  const systemPrompt = buildScenarioSystemPrompt(scenario);

  const historyTuples: ['human' | 'assistant', string][] = conversationHistory
    .slice(-40)
    .map((msg) => [
      msg.role === 'user' ? 'human' : 'assistant',
      sanitizeForPromptTemplate(msg.content),
    ]);

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', systemPrompt],
    ...historyTuples,
    ['human', '{userMessage}'],
  ]);

  const pipeline = prompt.pipe(modelWithStructuredOutput);

  const result = await pipeline.invoke({ userMessage });

  return chatResponseSchema.parse(result);
}
