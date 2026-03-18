import { HumanMessage, AIMessage } from '@langchain/core/messages';

export function toMessages(history: { role: 'user' | 'assistant'; content: string }[]) {
  return history.map((msg) =>
    msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content)
  );
}
