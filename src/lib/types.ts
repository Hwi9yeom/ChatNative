export interface Scenario {
  id: string;
  title: string;
  titleKo: string;
  emoji: string;
  description: string;
  aiRole: string;
  location: string;
  situation: string;
  expectedFlow: string;
  difficulty: 'beginner' | 'intermediate';
  initialMessage: string;
}

export interface Correction {
  original: string;
  corrected: string;
  type: 'grammar' | 'expression' | 'vocabulary';
  explanation: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  corrections?: Correction[];
}

export interface ChatResponse {
  reply: string;
  corrections: Correction[];
  conversationComplete: boolean;
}

export interface Recommendation {
  userExpression: string;
  naturalExpression: string;
  context: string;
}

export interface ReportResponse {
  score: number;
  summary: string;
  errors: Correction[];
  recommendations: Recommendation[];
  strengths: string[];
}
