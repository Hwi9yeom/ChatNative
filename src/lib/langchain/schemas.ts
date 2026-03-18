import { z } from 'zod';

// Correction schema (shared)
export const correctionSchema = z.object({
  original: z.string().describe("The exact text the user said that contains an error"),
  corrected: z.string().describe("The grammatically correct or more natural version"),
  type: z.enum(["grammar", "expression", "vocabulary"]).describe("The type of error"),
  explanation: z.string().describe("A brief explanation of why this is incorrect and how to fix it"),
});

// Chat response schema (for withStructuredOutput)
export const chatResponseSchema = z.object({
  reply: z.string().describe("Your in-character roleplay response to the user (2-3 sentences max)"),
  corrections: z.array(correctionSchema).describe("List of grammar, expression, or vocabulary errors found in the user's message. Empty array if no errors."),
  conversationComplete: z.boolean().describe("Set to true when the conversation has reached a natural ending point"),
});

// Report response schema (for withStructuredOutput)
export const reportResponseSchema = z.object({
  score: z.number().min(0).max(100).describe("Overall conversation score from 0-100"),
  summary: z.string().describe("2-3 sentence overall assessment of the conversation"),
  errors: z.array(correctionSchema).describe("Complete list of all errors found throughout the conversation"),
  recommendations: z.array(z.object({
    userExpression: z.string().describe("What the user said (may be grammatically correct but unnatural)"),
    naturalExpression: z.string().describe("How a native speaker would say it"),
    context: z.string().describe("When and why to use the more natural version"),
  })).describe("Suggestions for more natural English expressions"),
  strengths: z.array(z.string()).describe("2-3 things the user did well in the conversation"),
});

// API request validation schemas
export const chatRequestSchema = z.object({
  scenarioId: z.string(),
  userMessage: z.string(),
  conversationHistory: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })),
});

export const reportRequestSchema = z.object({
  scenarioId: z.string(),
  conversationHistory: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })),
  corrections: z.array(correctionSchema),
});
